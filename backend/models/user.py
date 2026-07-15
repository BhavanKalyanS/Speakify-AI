import os
from extensions import mongo, bcrypt
from bson import ObjectId
from datetime import datetime, timezone

class User:
    def __init__(self, username, email, password, role='user'):
        self.username   = username
        self.email      = email
        # Use Flask-Bcrypt for consistent hashing
        self.password   = bcrypt.generate_password_hash(password).decode('utf-8')
        self.role       = role
        self.is_active  = True
        self.created_at = datetime.now(timezone.utc)
        self.profile    = {
            'first_name': '',
            'last_name': '',
            'native_language': '',
            'target_languages': [],
            'skill_level': 'beginner'
        }

    def save(self):
        return mongo.db.users.insert_one({
            'username':    self.username,
            'email':       self.email,
            'password':    self.password,
            'role':        self.role,
            'is_active':   self.is_active,
            'created_at':  self.created_at,
            'profile':     self.profile
        })

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({'email': email})

    @staticmethod
    def find_by_username(username):
        return mongo.db.users.find_one({'username': username})

    @staticmethod
    def find_by_id(user_id):
        try:
            return mongo.db.users.find_one({'_id': ObjectId(user_id)})
        except:
            return None

    @staticmethod
    def verify_password(stored, provided):
        try:
            # Use Flask-Bcrypt consistently for verification
            return bcrypt.check_password_hash(stored, provided)
        except Exception as e:
            print(f"[ERROR] Password verification failed: {e}")
            return False

    @staticmethod
    def authenticate(email, password):
        user = User.find_by_email(email)
        
        if user and User.verify_password(user['password'], password):
            return user
        
        return None

    @staticmethod
    def get_all_users(limit=None, skip=0):
        query = mongo.db.users.find({})
        if skip: query = query.skip(skip)
        if limit: query = query.limit(limit)
        return list(query)

    @staticmethod
    def get_user_count():
        return mongo.db.users.count_documents({})
    
    @staticmethod
    def create_user(user_doc):
        try:
            return mongo.db.users.insert_one(user_doc)
        except Exception as e:
            print(f"[ERROR] Create user failed: {e}")
            return None

    @staticmethod
    def update_user(user_id, update_data):
        try:
            return mongo.db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': update_data}
            )
        except:
            return None
    
    @staticmethod
    def deactivate_user(user_id):
        try:
            return mongo.db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'is_active': False}}
            )
        except Exception as e:
            print(f"[ERROR] Deactivate user failed: {e}")
            return None
