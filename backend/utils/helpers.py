import os
import uuid
from werkzeug.utils import secure_filename
from datetime import datetime

def allowed_file(filename, allowed_extensions=None):
    """Check if file extension is allowed"""
    if allowed_extensions is None:
        allowed_extensions = {'wav', 'mp3', 'ogg', 'flac', 'mp4', 'm4a', 'webm'}
    
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def generate_filename(original_filename, prefix=""):
    """Generate a unique filename while preserving extension"""
    if not original_filename:
        return f"{prefix}{str(uuid.uuid4())}"
    
    # Get file extension
    if '.' in original_filename:
        name, ext = original_filename.rsplit('.', 1)
        ext = ext.lower()
    else:
        name = original_filename
        ext = ""
    
    # Generate unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    
    if prefix:
        filename = f"{prefix}_{timestamp}_{unique_id}"
    else:
        filename = f"{timestamp}_{unique_id}"
    
    if ext:
        filename = f"{filename}.{ext}"
    
    return secure_filename(filename)

def get_file_extension(filename):
    """Get file extension from filename"""
    if '.' in filename:
        return filename.rsplit('.', 1)[1].lower()
    return ""

def format_file_size(size_bytes):
    """Format file size in human readable format"""
    if size_bytes == 0:
        return "0B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    import math
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {size_names[i]}"

def validate_audio_file(file_path):
    """Validate audio file format and basic properties"""
    try:
        import librosa
        
        # Try to load the audio file
        signal, sr = librosa.load(file_path, duration=1.0)  # Load only first second for validation
        
        if len(signal) == 0:
            return False, "Audio file is empty"
        
        if sr <= 0:
            return False, "Invalid sample rate"
        
        return True, "Audio file is valid"
        
    except Exception as e:
        return False, f"Audio validation failed: {str(e)}"

def clean_text(text):
    """Clean and normalize text"""
    if not text:
        return ""
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    # Remove special characters but keep punctuation
    import re
    text = re.sub(r'[^\w\s\.,!?;:\'"-]', '', text)
    
    return text.strip()

def get_audio_duration(file_path):
    """Get audio file duration in seconds"""
    try:
        import librosa
        signal, sr = librosa.load(file_path)
        duration = len(signal) / sr
        return round(duration, 2)
    except Exception:
        return 0

def create_directory(path):
    """Create directory if it doesn't exist"""
    try:
        os.makedirs(path, exist_ok=True)
        return True
    except Exception:
        return False
