import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv(override=True)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    MONGO_URI = os.environ.get('MONGO_URI') 
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') 
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # MongoDB connection settings
    MONGO_CONNECT_TIMEOUT_MS = 30000
    MONGO_SERVER_SELECTION_TIMEOUT_MS = 30000
    
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg', 'flac', 'mp4', 'm4a', 'webm'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    ML_MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ml', 'models')
