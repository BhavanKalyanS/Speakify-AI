import os, uuid
from flask import Blueprint, request, jsonify, current_app
from middleware.auth import auth_required
from models.submission import Submission
from utils.ai_processor import ai_processor
from config import Config
from datetime import datetime
import pytz
from bson import ObjectId
from extensions import mongo

user_bp = Blueprint("user", __name__)

def allowed_file(fn):
    return '.' in fn and fn.rsplit('.',1)[1].lower() in Config.ALLOWED_EXTENSIONS

@user_bp.route('/dashboard', methods=['GET'])
@auth_required
def dashboard(current_user):
    try:
        uid = str(current_user['_id'])
        total = Submission.get_user_submission_count(uid)
        avg = Submission.get_average_score(uid) if total > 0 else 0
        all_subs = Submission.get_user_submissions(uid)
        best_score = max([s.get('score', 0) for s in all_subs]) if all_subs else 0
        subs = all_subs[:10]  # Only show 10 recent for display
        
        print(f"[DEBUG] User {uid} has {total} total submissions, showing {len(subs)} recent ones")
        
        # Convert scores to percentages if they're decimals
        if avg <= 1.0:
            avg = avg * 100
        if best_score <= 1.0:
            best_score = best_score * 100
        
        for s in subs:
            s['_id'] = str(s['_id'])
            s['user_id'] = str(s['user_id'])
            # Convert timestamp to India timezone for display
            if s.get('timestamp'):
                india_tz = pytz.timezone('Asia/Kolkata')
                if s['timestamp'].tzinfo is None:
                    s['timestamp'] = pytz.utc.localize(s['timestamp'])
                s['timestamp'] = s['timestamp'].astimezone(india_tz).isoformat()
            # Convert score to percentage
            if s.get('score', 0) <= 1.0:
                s['score'] = round(s['score'] * 100)
        
        return jsonify({
            'user': {
                'id': uid,
                'username': current_user['username'],
                'email': current_user['email'],
                'stats': {
                    'total_submissions': total,
                    'average_score': round(avg, 2),
                    'best_score': round(best_score, 2)
                }
            },
            'recent_submissions': subs,
            'total_practice_time': total * 2,
            'improvement_rate': 15 if total > 5 else 5,
            'daily_stats': list(range(min(7, total)))
        }), 200
    except Exception as e:
        print(f"[ERROR] Dashboard error: {str(e)}")
        return jsonify({
            'user': {
                'id': str(current_user['_id']),
                'username': current_user.get('username', ''),
                'email': current_user.get('email', ''),
                'stats': {
                    'total_submissions': 0,
                    'average_score': 0,
                    'best_score': 0
                }
            },
            'recent_submissions': [],
            'total_practice_time': 0,
            'improvement_rate': 5,
            'daily_stats': []
        }), 200

def _format_timestamp_india(timestamp):
    """Helper function to format timestamp to India timezone"""
    if not timestamp:
        return ''
    
    india_tz = pytz.timezone('Asia/Kolkata')
    if timestamp.tzinfo is None:
        timestamp = pytz.utc.localize(timestamp)
    return timestamp.astimezone(india_tz).isoformat()

@user_bp.route('/submissions', methods=['GET'])
@auth_required
def get_user_submissions(current_user):
    """Get user's submission history"""
    try:
        user_id = str(current_user['_id'])
        
        # Get all submissions without pagination
        submissions = Submission.get_user_submissions(user_id)
        total = len(submissions)
        
        # Format submissions for frontend
        formatted_submissions = []
        for sub in submissions:
            # Convert score to percentage if it's a decimal
            score = sub.get('score', 0)
            if isinstance(score, (int, float)) and score <= 1.0:
                score = round(score * 100)
            
            formatted_submissions.append({
                'id': str(sub['_id']),
                'target_text': sub.get('target_text', ''),
                'score': score,
                'feedback': sub.get('feedback', ''),
                'duration': sub.get('duration', 0),
                'timestamp': _format_timestamp_india(sub.get('timestamp')),
                'audio_filename': sub.get('audio_filename', ''),
                'user_profile': sub.get('user_profile', {}),
                'metadata': sub.get('metadata', {})
            })
        
        return jsonify({
            'submissions': formatted_submissions,
            'total': total
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch submissions: {str(e)}'}), 500

@user_bp.route('/pronounce', methods=['POST'])
@auth_required
def pronounce(current_user):
    try:
        print(f"[DEBUG] Starting pronunciation analysis for user {current_user.get('username')}")
        
        if 'audio' not in request.files:
            print("[ERROR] No audio file in request")
            return jsonify({'error':'No audio file provided'}), 400
        
        f = request.files['audio']
        print(f"[DEBUG] Audio file: {f.filename}, size: {f.content_length if hasattr(f, 'content_length') else 'unknown'}")
        
        if f.filename == '' or not allowed_file(f.filename):
            print(f"[ERROR] Invalid file: {f.filename}")
            return jsonify({'error':'Invalid file format'}), 400
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'audio')
        os.makedirs(upload_dir, exist_ok=True)
        print(f"[DEBUG] Upload directory: {upload_dir}")
        
        # Create unique filename with timestamp (India timezone)
        user_id = str(current_user['_id'])
        india_tz = pytz.timezone('Asia/Kolkata')
        timestamp = datetime.now(india_tz).strftime('%Y%m%d_%H%M%S_%f')
        
        filename = f"user_{user_id}_{timestamp}.webm"
        path = os.path.join(upload_dir, filename)
        print(f"[DEBUG] Saving file to: {path}")
        
        f.save(path)
        
        # Verify file was saved
        if not os.path.exists(path):
            print(f"[ERROR] File not saved: {path}")
            return jsonify({'error': 'Failed to save audio file'}), 500
        
        file_size = os.path.getsize(path)
        print(f"[DEBUG] File saved successfully, size: {file_size} bytes")
        
        # Process pronunciation
        target_text = request.form.get('target_text', '')
        print(f"[DEBUG] Target text: {target_text}")
        print(f"[DEBUG] Starting AI processing...")
        
        # Check AI processor health
        health = ai_processor.health_check()
        print(f"[DEBUG] AI processor health: {health}")
        
        res = ai_processor.score_pronunciation(path, target_text)
        print(f"[DEBUG] AI processing completed: {res}")
        
        # Prepare user profile data
        user_profile = {
            'username': current_user.get('username', ''),
            'email': current_user.get('email', ''),
            'role': current_user.get('role', 'user'),
            'first_name': current_user.get('profile', {}).get('first_name', ''),
            'last_name': current_user.get('profile', {}).get('last_name', ''),
            'native_language': current_user.get('profile', {}).get('native_language', ''),
            'skill_level': current_user.get('profile', {}).get('skill_level', 'beginner'),
            'created_at': current_user.get('created_at', '').isoformat() if current_user.get('created_at') else ''
        }
        
        # Save submission with session filename
        print(f"[DEBUG] Saving submission to database...")
        # Use actual audio duration instead of processing time
        audio_duration = res.get('audio_info', {}).get('duration', 0)
        sub = Submission(
            user_id,
            target_text,
            filename,
            res['score'],
            res['feedback'],
            audio_duration,
            user_profile
        )
        sub.save()
        print(f"[DEBUG] Submission saved successfully")
        
        return jsonify(res), 200
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[ERROR] Pronunciation analysis failed: {str(e)}")
        print(f"[ERROR] Full traceback: {error_trace}")
        
        # Clean up file if it exists
        try:
            if 'path' in locals() and os.path.exists(path):
                os.remove(path)
                print(f"[DEBUG] Cleaned up file: {path}")
        except:
            pass
            
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@user_bp.route('/debug/submissions', methods=['GET'])
@auth_required
def debug_submissions(current_user):
    """Debug route to check submission count"""
    user_id = str(current_user['_id'])
    all_subs = list(mongo.db.submissions.find({'user_id': ObjectId(user_id)}).sort('timestamp', 1))
    
    return jsonify({
        'total_count': len(all_subs),
        'submissions': [{
            'id': str(sub['_id']),
            'timestamp': _format_timestamp_india(sub.get('timestamp')),
            'target_text': sub.get('target_text', '')[:50],
            'score': sub.get('score', 0)
        } for sub in all_subs]
    }), 200

@user_bp.route('/chatbot', methods=['POST'])
@auth_required
def chatbot(current_user):
    """Chatbot endpoint with local responses"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get user context
        user_id = str(current_user['_id'])
        recent_subs = Submission.get_user_submissions(user_id, limit=5)
        
        # Generate local response
        ai_response = generate_local_response(message, current_user, recent_subs)
        
        return jsonify({
            'response': ai_response
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Chatbot error: {str(e)}")
        return jsonify({
            'response': generate_local_response(message, current_user, [])
        }), 200

def generate_local_response(message, current_user, recent_subs):
    """Generate intelligent local responses"""
    msg = message.lower().strip()
    username = current_user.get('username', '')
    greeting = f"{username}, " if username else ""
    
    # Project information
    if any(word in msg for word in ['what is speakify', 'about speakify', 'what does this app do']):
        return f"🌟 {greeting}Speakify AI is a professional pronunciation assessment platform! It offers AI-powered feedback, real-time recording, progress tracking, and detailed analytics to help improve your English pronunciation!"
    
    if any(word in msg for word in ['features', 'what can i do', 'capabilities']):
        return f"🚀 {greeting}Key features: Audio recording & analysis, AI scoring system, progress tracking, personalized feedback, practice sessions, and performance analytics!"
    
    if any(word in msg for word in ['how to use', 'getting started', 'tutorial']):
        return f"📚 {greeting}Quick start: Go to Practice tab → Choose/type sentence → Record audio → Get AI feedback → Check progress in Records tab!"
    
    if any(word in msg for word in ['technology', 'tech stack', 'built with']):
        return f"⚙️ {greeting}Built with Flask (Python), React frontend, MongoDB database, Librosa audio processing, and ML-based scoring!"
    
    # Navigation
    if any(word in msg for word in ['go to practice', 'take me to practice', 'practice tab']):
        return f"🎤 {greeting}taking you to the Practice tab now!"
    
    if any(word in msg for word in ['go to home', 'dashboard', 'home tab']):
        return f"🏠 {greeting}taking you to the Home dashboard!"
    
    # Help topics
    if any(word in msg for word in ['how to record', 'recording help', 'microphone']):
        return f"🎤 {greeting}Recording tips: Allow mic access, use quiet environment, speak clearly at normal pace, use headphones if possible!"
    
    if any(word in msg for word in ['improve score', 'better score', 'low score']):
        return f"📈 {greeting}To improve scores: Speak clearly, practice regularly, use quiet environment, focus on difficult sounds, and record multiple times!"
    
    if any(word in msg for word in ['score meaning', 'what do scores mean']):
        return f"📊 {greeting}Score ranges: 90-100%=Excellent, 80-89%=Very Good, 70-79%=Good, 60-69%=Fair, <60%=Needs Improvement!"
    
    if any(word in msg for word in ['not working', 'problem', 'error', 'issue']):
        return f"🔧 {greeting}Try these solutions: Refresh page, check microphone permissions, use Chrome browser, test internet connection!"
    
    # Default response with context
    if recent_subs:
        avg_score = sum(s.get('score', 0) for s in recent_subs) / len(recent_subs) * 100
        context = f"I see you've completed {len(recent_subs)} sessions with {avg_score:.1f}% average. "
    else:
        context = "Ready to start your pronunciation journey? "
    
    return f"🤖 {greeting}{context}I can help with: app features, recording tips, score improvement, navigation, and troubleshooting. What do you need help with?"