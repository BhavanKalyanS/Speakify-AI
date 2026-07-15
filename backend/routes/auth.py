from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re
from models.user import User

auth_bp = Blueprint("auth", __name__)

def validate_email(email):
    return re.match(r'^[\w\.\-]+@[\w\.\-]+\.\w+$', email)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    
    username = data.get('username','').strip()
    email    = data.get('email','').strip().lower()
    password = data.get('password','')
    role     = data.get('role','user')

    if not username or not email or not password:
        return jsonify({'error':'Fields required'}),400
    if not validate_email(email):
        return jsonify({'error':'Invalid email'}),400
    if len(password)<6 or len(username)<3:
        return jsonify({'error':'Validation failed'}),400
    if User.find_by_email(email):
        return jsonify({'error':'Email exists'}),409
    if User.find_by_username(username):
        return jsonify({'error':'Username taken'}),409

    user = User(username,email,password,role)
    res  = user.save()
    return jsonify({'message':'Registered','user_id':str(res.inserted_id)}),201

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        email = data.get('email','').strip().lower()
        pwd   = data.get('password','')
        
        print(f"[DEBUG] Login attempt for email: {email}")
        
        # Return specific error for missing fields in development
        if not email or not pwd:
            print("[DEBUG] Missing email or password")
            return jsonify({'error':'Email and password are required'}),400
            
        user = User.authenticate(email,pwd)
        print(f"[DEBUG] Authentication result: {'success' if user else 'failed'}")
        
        # Return specific error for invalid credentials in development
        if not user:
            print("[DEBUG] User not found or invalid password")
            return jsonify({'error':'Invalid email or password'}),401
            
        # Return specific error for inactive account in development
        if not user.get('is_active',True):
            print(f"[DEBUG] Inactive account: {email}")
            return jsonify({'error':'Account is inactive'}),401

        token = create_access_token(identity=str(user['_id']))
        print(f"[DEBUG] Login successful for user: {user['username']}")
        
        return jsonify({'access_token':token,'user':{
            'id':str(user['_id']),
            'username':user['username'],
            'email':user['email'],
            'role':user['role']
        }}),200
        
    except Exception as e:
        # Log the actual error for debugging but return generic message
        print(f"[DEBUG] Login error: {str(e)}")
        return jsonify({'error':'Login failed'}),401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    uid  = get_jwt_identity()
    user = User.find_by_id(uid)
    if not user:
        return jsonify({'error':'Not found'}),404
    return jsonify({'user':{
        'id':str(user['_id']),
        'username':user['username'],
        'email':user['email'],
        'role':user['role'],
        'profile':user.get('profile',{}),
        'created_at':user['created_at'].isoformat()
    }}),200
