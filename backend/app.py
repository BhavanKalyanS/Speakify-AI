import os
import ssl
from flask import Flask, request
from flask_cors import CORS
from config import Config
from extensions import mongo, bcrypt, jwt
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import logging
import certifi
# Use certifi CA bundle for TLS verification. Do NOT disable verification.
os.environ['SSL_CERT_FILE'] = certifi.where()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    mongo_uri = app.config.get('MONGO_URI')
    if mongo_uri:
        masked_uri = mongo_uri
        if '@' in mongo_uri:
            parts = mongo_uri.split('@')
            masked_uri = "mongodb+srv://*****@" + parts[-1]
        print(f"[DEBUG] MONGO_URI loaded: {masked_uri}")
    else:
        print("[DEBUG] MONGO_URI loaded: False")
    
    if not mongo_uri:
        raise RuntimeError("MONGO_URI not set in configuration")
    
    # Validate MongoDB URI format
    if not mongo_uri.startswith(('mongodb://', 'mongodb+srv://')):
        raise RuntimeError("Invalid MONGO_URI format")
    

    
    # Ensure upload folder is set
    app.config['UPLOAD_FOLDER'] = Config.UPLOAD_FOLDER
    app.config['MAX_CONTENT_LENGTH'] = Config.MAX_CONTENT_LENGTH

    mongo.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:3001", "https://speakify-ai-five.vercel.app"], "supports_credentials": True, "allow_headers": ["Content-Type", "Authorization"], "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})
    
    @app.before_request
    def log_request():
        print(f"[REQUEST] {request.method} {request.path} from {request.remote_addr}")

    # Register blueprints after initializing extensions
    from routes.auth import auth_bp
    from routes.user import user_bp
    from routes.admin import admin_bp
    from routes.chatbot import chatbot_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(chatbot_bp, url_prefix='/chatbot')

    @app.route('/_test_db')
    def test_db():
        try:
            # Test connection with ping
            mongo.cx.admin.command('ping')
            db_name = mongo.db.name
            collections = mongo.db.list_collection_names()
            return {
                "connected": True,
                "database_name": db_name,
                "collections": collections
            }, 200
        except ConnectionFailure as e:
            logger.error(f"Database connection test failed: {e}")
            return {
                "connected": False,
                "error": "Database connection failed"
            }, 503
        except Exception as e:
            logger.error(f"Database test error: {e}")
            return {
                "connected": False,
                "error": str(e)
            }, 500

    @app.route('/health')
    def health():
        return {"status": "healthy", "message": "AI Language Pro backend running"}, 200

    return app

app = create_app()

if __name__ == "__main__":
    print("[INFO] Starting AI Language Pro Backend...")
    
    # Test MongoDB connection with detailed error handling
    try:
        with app.app_context():
            # Test connection with timeout
            mongo.cx.admin.command('ping')
            db_name = mongo.db.name
            collections = mongo.db.list_collection_names()
            print(f"[SUCCESS] MongoDB connected: {db_name}")
            print(f"[INFO] Collections: {collections}")
    except Exception as e:
        print(f"[ERROR] MongoDB connection failed: {e}")
        print("[INFO] For exam: Using mock database mode")
        os.environ['MOCK_DB'] = 'true'
    
    # Create directories
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(os.path.join(app.config["UPLOAD_FOLDER"], "audio"), exist_ok=True)
    os.makedirs(app.config["ML_MODEL_PATH"], exist_ok=True)
    
    print("[INFO] Server starting on http://localhost:5000")
    print("[INFO] Backend is ready for connections!")
    app.run(host='0.0.0.0', port=5001, debug=True)
