from flask import Blueprint, jsonify, request
from middleware.auth import admin_required
from models.user import User
from models.submission import Submission
from datetime import datetime, timedelta
from bson import ObjectId
from extensions import bcrypt
import os

admin_bp = Blueprint("admin", __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def dashboard(current_user):
    try:
        # Basic stats (exclude admin users)
        all_users = User.get_all_users() or []
        non_admin_users = [u for u in all_users if u.get('role', 'user') != 'admin']
        total_users = len(non_admin_users)
        active_users = len([u for u in non_admin_users if u.get('is_active', True)])
        total_subs = Submission.get_submission_count() or 0
        avg_score = Submission.get_average_score() or 0
        
        # Recent activity (last 30 days) - exclude admin submissions
        all_submissions = Submission.get_all_submissions() or []
        admin_user_ids = {str(u['_id']) for u in all_users if u.get('role', 'user') == 'admin'}
        recent_subs = []
        
        for s in all_submissions:
            if s.get('timestamp') and str(s['user_id']) not in admin_user_ids:
                recent_subs.append(s)
        
        # Daily activity data for chart (last 7 days)
        daily_activity = []
        for i in range(7):
            day = datetime.now() - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            
            day_subs = []
            for s in recent_subs:
                if s.get('timestamp') and day_start <= s['timestamp'] < day_end:
                    day_subs.append(s)
            
            unique_users = len(set(str(s['user_id']) for s in day_subs))
            
            daily_activity.append({
                '_id': {'date': day_start.isoformat()},
                'submissions': len(day_subs),
                'unique_users_count': unique_users
            })
        
        daily_activity.reverse()  # Show oldest to newest
        
        # Popular words analysis
        popular_words = {}
        for sub in recent_subs:
            text = sub.get('target_text', '').lower()
            words = text.split()[:3]  # First 3 words
            for word in words:
                if len(word) > 3:  # Skip short words
                    popular_words[word] = popular_words.get(word, 0) + 1
        
        popular_words_list = [
            {'_id': word, 'count': count} 
            for word, count in sorted(popular_words.items(), key=lambda x: x[1], reverse=True)[:10]
        ]
        
        # Format recent submissions
        for s in recent_subs[:10]:
            s['_id'] = str(s['_id'])
            s['user_id'] = str(s['user_id'])
            s['timestamp'] = s['timestamp'].isoformat()
        
        # Convert average score to percentage format
        avg_score_percent = avg_score * 100 if avg_score <= 1.0 else avg_score
        
        return jsonify({
            'overview': {
                'total_users': total_users,
                'active_users': active_users,
                'total_submissions': total_subs,
                'average_score': f"{round(avg_score_percent)}%",
                'popular_words': popular_words_list
            },
            'daily_activity': daily_activity,
            'recent_submissions': recent_subs[:10]
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Admin dashboard error: {str(e)}")
        # Return fallback data instead of error
        return jsonify({
            'overview': {
                'total_users': 0,
                'active_users': 0,
                'total_submissions': 0,
                'average_score': '0%',
                'popular_words': []
            },
            'daily_activity': [],
            'recent_submissions': []
        }), 200

@admin_bp.route('/users', methods=['GET'])
@admin_required
def list_users(current_user):
    try:
        page = request.args.get('page', 1, int)
        limit = min(request.args.get('limit', 10, int), 50)
        search = request.args.get('search', '').strip()
        skip = (page - 1) * limit
        
        # Get all users for filtering (exclude admin users)
        all_users = User.get_all_users()
        non_admin_users = [u for u in all_users if u.get('role', 'user') != 'admin']
        
        # Filter by search if provided
        if search:
            filtered_users = [
                u for u in non_admin_users 
                if search.lower() in u.get('username', '').lower() or 
                   search.lower() in u.get('email', '').lower()
            ]
        else:
            filtered_users = non_admin_users
        
        # Pagination
        total = len(filtered_users)
        users = filtered_users[skip:skip + limit]
        
        # Add user stats and clean data
        for u in users:
            user_id_str = str(u['_id'])
            u['_id'] = user_id_str
            try:
                u['stats'] = {
                    'total_submissions': Submission.get_user_submission_count(user_id_str),
                    'average_score': round(Submission.get_average_score(user_id_str), 1)
                }
            except:
                u['stats'] = {'total_submissions': 0, 'average_score': 0.0}
            
            u['created_at'] = u['created_at'].isoformat() if u.get('created_at') else datetime.now().isoformat()
            if 'password' in u:
                del u['password']
        
        return jsonify({
            'users': users,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to load users: {str(e)}'}), 500

@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user(current_user):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not email or not password:
            return jsonify({'error': 'Username, email, and password are required'}), 400
        
        # Check if user already exists
        if User.find_by_email(email):
            return jsonify({'error': 'Email already exists'}), 400
        
        if User.find_by_username(username):
            return jsonify({'error': 'Username already exists'}), 400
        
        # Create user document
        user_doc = {
            'username': username,
            'email': email,
            'password': bcrypt.generate_password_hash(password).decode('utf-8'),
            'role': data.get('role', 'user'),
            'is_active': data.get('is_active', True),
            'created_at': datetime.now(),
            'profile': {
                'first_name': data.get('first_name', ''),
                'last_name': data.get('last_name', ''),
                'native_language': data.get('native_language', ''),
                'target_languages': [],
                'skill_level': 'beginner'
            }
        }
        
        result = User.create_user(user_doc)
        
        if result and result.inserted_id:
            return jsonify({
                'message': 'User created successfully', 
                'user_id': str(result.inserted_id)
            }), 201
        else:
            return jsonify({'error': 'Failed to create user'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Failed to create user: {str(e)}'}), 500

@admin_bp.route('/users/<user_id>', methods=['PUT'])
@admin_required
def update_user(current_user, user_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate ObjectId
        try:
            ObjectId(user_id)
        except:
            return jsonify({'error': 'Invalid user ID'}), 400
        
        # Find user
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Validate required fields
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        
        if not username or not email:
            return jsonify({'error': 'Username and email are required'}), 400
        
        # Check for duplicates (excluding current user)
        existing_email = User.find_by_email(email)
        if existing_email and str(existing_email['_id']) != user_id:
            return jsonify({'error': 'Email already exists'}), 400
        
        existing_username = User.find_by_username(username)
        if existing_username and str(existing_username['_id']) != user_id:
            return jsonify({'error': 'Username already exists'}), 400
        
        # Prepare update data
        update_data = {
            'username': username,
            'email': email,
            'role': data.get('role', user.get('role', 'user')),
            'is_active': data.get('is_active', user.get('is_active', True))
        }
        
        # Update password if provided
        password = data.get('password', '').strip()
        if password:
            update_data['password'] = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Update profile fields
        current_profile = user.get('profile', {})
        update_data['profile'] = {
            'first_name': data.get('first_name', current_profile.get('first_name', '')),
            'last_name': data.get('last_name', current_profile.get('last_name', '')),
            'native_language': data.get('native_language', current_profile.get('native_language', '')),
            'target_languages': current_profile.get('target_languages', []),
            'skill_level': current_profile.get('skill_level', 'beginner')
        }
        
        result = User.update_user(user_id, update_data)
        if result and (result.modified_count > 0 or result.matched_count > 0):
            return jsonify({'message': 'User updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update user'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Failed to update user: {str(e)}'}), 500

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, user_id):
    try:
        # Validate ObjectId
        try:
            ObjectId(user_id)
        except:
            return jsonify({'error': 'Invalid user ID format'}), 400
        
        # Don't allow deleting self
        if str(current_user['_id']) == user_id:
            return jsonify({'error': 'Cannot delete your own account'}), 400
        
        # Find user
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        username = user.get('username', 'Unknown')
        
        # Deactivate instead of delete to preserve data integrity
        result = User.deactivate_user(user_id)
        
        if result and result.modified_count > 0:
            return jsonify({'message': f'User "{username}" deactivated successfully'}), 200
        elif result and result.matched_count > 0:
            return jsonify({'message': f'User "{username}" was already deactivated'}), 200
        else:
            return jsonify({'error': 'Failed to deactivate user'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Failed to delete user: {str(e)}'}), 500

@admin_bp.route('/submissions', methods=['GET'])
@admin_required
def get_all_submissions(current_user):
    """Get all submissions with user profiles for admin"""
    try:
        page = request.args.get('page', 1, int)
        limit = min(request.args.get('limit', 20, int), 100)
        skip = (page - 1) * limit
        
        submissions = Submission.get_all_submissions(limit=limit, skip=skip)
        total = Submission.get_submission_count()
        
        # Format submissions with user profiles
        formatted_submissions = []
        for sub in submissions:
            # Convert score to percentage if it's a decimal
            score = sub.get('score', 0)
            if isinstance(score, (int, float)) and score <= 1.0:
                score = round(score * 100)
            
            formatted_submissions.append({
                'id': str(sub['_id']),
                'user_id': str(sub['user_id']),
                'target_text': sub.get('target_text', ''),
                'score': score,
                'feedback': sub.get('feedback', ''),
                'duration': sub.get('duration', 0),
                'timestamp': sub['timestamp'].isoformat() if sub.get('timestamp') else '',
                'audio_filename': sub.get('audio_filename', ''),
                'user_profile': sub.get('user_profile', {}),
                'metadata': sub.get('metadata', {})
            })
        
        return jsonify({
            'submissions': formatted_submissions,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit if total > 0 else 1
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch submissions: {str(e)}'}), 500

@admin_bp.route('/system-info', methods=['GET'])
@admin_required
def system_info(current_user):
    try:
        # System information
        import psutil
        import platform
        
        return jsonify({
            'system': {
                'platform': platform.system(),
                'python_version': platform.python_version(),
                'cpu_percent': psutil.cpu_percent(),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_usage': psutil.disk_usage('/').percent if platform.system() != 'Windows' else psutil.disk_usage('C:').percent
            },
            'database': {
                'connected': True,
                'collections': ['users', 'submissions']
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'system': {
                'platform': 'Unknown',
                'python_version': 'Unknown',
                'cpu_percent': 0,
                'memory_percent': 0,
                'disk_usage': 0
            },
            'database': {
                'connected': False,
                'error': str(e)
            }
        }), 200

@admin_bp.route('/analytics/performance', methods=['GET'])
@admin_required
def performance_metrics(current_user):
    try:
        import psutil
        import platform
        
        # Get system metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('C:' if platform.system() == 'Windows' else '/')
        
        return jsonify({
            'cpu': {
                'usage_percent': cpu_percent,
                'count': psutil.cpu_count()
            },
            'memory': {
                'total': memory.total,
                'available': memory.available,
                'percent': memory.percent,
                'used': memory.used
            },
            'disk': {
                'total': disk.total,
                'used': disk.used,
                'free': disk.free,
                'percent': (disk.used / disk.total) * 100
            },
            'timestamp': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get performance metrics: {str(e)}'}), 500

@admin_bp.route('/analytics/reports/export', methods=['POST'])
@admin_required
def export_reports(current_user):
    try:
        data = request.get_json()
        report_type = data.get('type', 'users')
        format_type = data.get('format', 'csv')
        
        if report_type == 'users':
            users = User.get_all_users() or []
            export_data = []
            for user in users:
                if user.get('role') != 'admin':
                    user_id = str(user['_id'])
                    try:
                        total_subs = Submission.get_user_submission_count(user_id) or 0
                        avg_score = Submission.get_average_score(user_id) or 0
                        avg_score = avg_score * 100 if avg_score <= 1.0 else avg_score
                    except:
                        total_subs = 0
                        avg_score = 0
                    
                    export_data.append({
                        'Username': user.get('username', ''),
                        'Email': user.get('email', ''),
                        'Total Submissions': total_subs,
                        'Average Score': f"{round(avg_score)}%",
                        'Status': 'Active' if user.get('is_active', True) else 'Inactive'
                    })
            
            return generate_csv(export_data, f'users_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}')
            
        elif report_type == 'submissions':
            submissions = Submission.get_all_submissions(limit=1000) or []
            export_data = []
            
            for sub in submissions:
                try:
                    score = sub.get('score', 0)
                    if isinstance(score, (int, float)) and score <= 1.0:
                        score = score * 100
                    
                    username = 'Unknown'
                    if sub.get('user_id'):
                        user = User.find_by_id(str(sub['user_id']))
                        username = user.get('username', 'Unknown') if user else 'Unknown'
                    
                    date_str = sub['timestamp'].strftime('%Y-%m-%d %H:%M') if sub.get('timestamp') else 'Unknown'
                        
                    export_data.append({
                        'Username': username,
                        'Target Text': sub.get('target_text', '')[:80],
                        'Score': f"{round(float(score))}%" if score else '0%',
                        'Duration': f"{sub.get('duration', 0):.1f}s",
                        'Date': date_str
                    })
                except Exception as e:
                    print(f"Error processing submission: {e}")
                    continue
            
            return generate_csv(export_data, f'submissions_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}')
                
        elif report_type == 'analytics':
            all_users = User.get_all_users() or []
            non_admin_users = [u for u in all_users if u.get('role', 'user') != 'admin']
            total_users = len(non_admin_users)
            active_users = len([u for u in non_admin_users if u.get('is_active', True)])
            total_subs = Submission.get_submission_count() or 0
            avg_score = Submission.get_average_score() or 0
            avg_score = avg_score * 100 if avg_score <= 1.0 else avg_score
            
            export_data = [
                {'Metric': 'Total Users', 'Value': str(total_users)},
                {'Metric': 'Active Users', 'Value': str(active_users)},
                {'Metric': 'Total Submissions', 'Value': str(total_subs)},
                {'Metric': 'Average Score', 'Value': f'{round(avg_score)}%'},
                {'Metric': 'Activity Rate', 'Value': f'{round((active_users/total_users)*100, 1)}%' if total_users > 0 else '0%'}
            ]
            
            return generate_csv(export_data, f'analytics_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}')
            
    except Exception as e:
        print(f"Export error: {str(e)}")
        return jsonify({'error': f'Failed to export report: {str(e)}'}), 500

def generate_csv(data, filename):
    import csv
    import io
    from flask import make_response
    
    output = io.StringIO()
    if data and len(data) > 0:
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
    else:
        output.write('No data available\n')
    
    response = make_response(output.getvalue())
    response.headers['Content-Type'] = 'text/csv; charset=utf-8'
    response.headers['Content-Disposition'] = f'attachment; filename="{filename}.csv"'
    response.headers['Cache-Control'] = 'no-cache'
    return response



@admin_bp.route('/analytics/trends', methods=['GET'])
@admin_required
def time_trends(current_user):
    try:
        period = request.args.get('period', 'weekly')  # weekly, monthly
        days = 7 if period == 'weekly' else 30
        
        # Get submissions for the period
        start_date = datetime.now() - timedelta(days=days)
        all_submissions = Submission.get_all_submissions()
        period_submissions = [s for s in all_submissions if s['timestamp'] > start_date]
        
        # Group by time periods
        trends = []
        for i in range(days):
            day = datetime.now() - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            
            day_subs = [s for s in period_submissions if day_start <= s['timestamp'] < day_end]
            
            # Calculate hourly distribution for peak hours
            hourly_counts = {}
            for sub in day_subs:
                hour = sub['timestamp'].hour
                hourly_counts[hour] = hourly_counts.get(hour, 0) + 1
            
            trends.append({
                'date': day_start.isoformat(),
                'submissions': len(day_subs),
                'unique_users': len(set(str(s['user_id']) for s in day_subs)),
                'avg_score': sum(s.get('score', 0) for s in day_subs) / len(day_subs) if day_subs else 0,
                'hourly_distribution': hourly_counts
            })
        
        trends.reverse()
        
        # Calculate peak hours across all days
        all_hourly = {}
        for trend in trends:
            for hour, count in trend['hourly_distribution'].items():
                all_hourly[hour] = all_hourly.get(hour, 0) + count
        
        peak_hours = sorted(all_hourly.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return jsonify({
            'trends': trends,
            'peak_hours': [{'hour': h, 'count': c} for h, c in peak_hours],
            'period': period
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get trends: {str(e)}'}), 500

@admin_bp.route('/analytics/score-distribution', methods=['GET'])
@admin_required
def score_distribution(current_user):
    try:
        all_submissions = Submission.get_all_submissions()
        
        # Convert scores to percentages and create distribution
        scores = []
        for sub in all_submissions:
            score = sub.get('score', 0)
            if score <= 1.0:
                score = score * 100
            scores.append(score)
        
        # Create histogram bins
        bins = [0, 20, 40, 60, 80, 100]
        distribution = {f'{bins[i]}-{bins[i+1]}': 0 for i in range(len(bins)-1)}
        
        for score in scores:
            for i in range(len(bins)-1):
                if bins[i] <= score < bins[i+1] or (i == len(bins)-2 and score == 100):
                    distribution[f'{bins[i]}-{bins[i+1]}'] += 1
                    break
        
        return jsonify({
            'distribution': distribution,
            'total_submissions': len(scores),
            'average_score': sum(scores) / len(scores) if scores else 0,
            'median_score': sorted(scores)[len(scores)//2] if scores else 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get score distribution: {str(e)}'}), 500

@admin_bp.route('/analytics/language-performance', methods=['GET'])
@admin_required
def language_analytics(current_user):
    try:
        all_submissions = Submission.get_all_submissions()
        
        # Group by native language
        language_stats = {}
        for sub in all_submissions:
            native_lang = sub.get('user_profile', {}).get('native_language', 'Unknown')
            if not native_lang:
                native_lang = 'Unknown'
            
            if native_lang not in language_stats:
                language_stats[native_lang] = {
                    'submissions': 0,
                    'total_score': 0,
                    'users': set()
                }
            
            score = sub.get('score', 0)
            if score <= 1.0:
                score = score * 100
            
            language_stats[native_lang]['submissions'] += 1
            language_stats[native_lang]['total_score'] += score
            language_stats[native_lang]['users'].add(str(sub['user_id']))
        
        # Calculate averages
        result = []
        for lang, stats in language_stats.items():
            result.append({
                'language': lang,
                'user_count': len(stats['users']),
                'submission_count': stats['submissions'],
                'average_score': round(stats['total_score'] / stats['submissions'], 2) if stats['submissions'] > 0 else 0,
                'submissions_per_user': round(stats['submissions'] / len(stats['users']), 2) if stats['users'] else 0
            })
        
        # Sort by user count
        result.sort(key=lambda x: x['user_count'], reverse=True)
        
        return jsonify({'language_performance': result}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get language analytics: {str(e)}'}), 500

@admin_bp.route('/analytics/retention', methods=['GET'])
@admin_required
def retention_metrics(current_user):
    try:
        all_users = User.get_all_users()
        all_submissions = Submission.get_all_submissions()
        
        # Calculate retention metrics
        now = datetime.now()
        retention_data = {
            'total_users': 0,
            'active_last_7_days': 0,
            'active_last_30_days': 0,
            'returning_users': 0,
            'user_engagement': []
        }
        
        for user in all_users:
            if user.get('role') == 'admin':
                continue
                
            retention_data['total_users'] += 1
            user_id = str(user['_id'])
            
            # Get user submissions
            user_subs = [s for s in all_submissions if str(s['user_id']) == user_id]
            
            if not user_subs:
                continue
            
            # Sort by timestamp
            user_subs.sort(key=lambda x: x['timestamp'])
            last_activity = user_subs[-1]['timestamp']
            
            # Check activity periods
            days_since_last = (now - last_activity).days
            
            if days_since_last <= 7:
                retention_data['active_last_7_days'] += 1
            if days_since_last <= 30:
                retention_data['active_last_30_days'] += 1
            
            # Check if returning user (more than 1 session)
            if len(user_subs) > 1:
                retention_data['returning_users'] += 1
            
            # User engagement data
            retention_data['user_engagement'].append({
                'user_id': user_id,
                'username': user.get('username', ''),
                'total_sessions': len(user_subs),
                'days_since_last_activity': days_since_last,
                'avg_score': sum(s.get('score', 0) for s in user_subs) / len(user_subs) if user_subs else 0,
                'first_session': user_subs[0]['timestamp'].isoformat(),
                'last_session': last_activity.isoformat()
            })
        
        # Calculate percentages
        total = retention_data['total_users']
        if total > 0:
            retention_data['retention_rate_7d'] = round((retention_data['active_last_7_days'] / total) * 100, 2)
            retention_data['retention_rate_30d'] = round((retention_data['active_last_30_days'] / total) * 100, 2)
            retention_data['return_rate'] = round((retention_data['returning_users'] / total) * 100, 2)
        
        # Sort engagement by sessions
        retention_data['user_engagement'].sort(key=lambda x: x['total_sessions'], reverse=True)
        retention_data['user_engagement'] = retention_data['user_engagement'][:20]  # Top 20
        
        return jsonify(retention_data), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get retention metrics: {str(e)}'}), 500