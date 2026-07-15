from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

def auth_required(f):
    """Decorator to require authentication"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        try:
            current_user_id = get_jwt_identity()
            current_user = User.find_by_id(current_user_id)
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 404
                
            if not current_user.get('is_active', True):
                return jsonify({'error': 'Account is deactivated'}), 403
                
            return f(current_user, *args, **kwargs)
            
        except Exception as e:
            return jsonify({'error': f'Authentication failed: {str(e)}'}), 401
            
    return decorated_function

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        try:
            current_user_id = get_jwt_identity()
            current_user = User.find_by_id(current_user_id)
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 404
                
            if not current_user.get('is_active', True):
                return jsonify({'error': 'Account is deactivated'}), 403
                
            if current_user.get('role') != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
                
            return f(current_user, *args, **kwargs)
            
        except Exception as e:
            return jsonify({'error': f'Authentication failed: {str(e)}'}), 401
            
    return decorated_function

def optional_auth(f):
    """Decorator for optional authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Try to get current user but don't fail if not authenticated
            from flask_jwt_extended import verify_jwt_in_request
            verify_jwt_in_request(optional=True)
            current_user_id = get_jwt_identity()
            
            current_user = None
            if current_user_id:
                current_user = User.find_by_id(current_user_id)
                
            return f(current_user, *args, **kwargs)
            
        except Exception:
            # If authentication fails, proceed without user
            return f(None, *args, **kwargs)
            
    return decorated_function
