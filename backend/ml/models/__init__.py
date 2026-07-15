"""
ML Models Package - AI Language Pro
This directory contains trained machine learning models.
"""

import os
import joblib
import glob
from pathlib import Path

# Get the directory where this __init__.py file is located
MODELS_DIR = Path(__file__).parent

def list_models():
    """
    List all available model files
    
    Returns:
        list: List of model filenames
    """
    model_files = []
    for ext in ['*.pkl', '*.joblib']:
        model_files.extend(glob.glob(str(MODELS_DIR / ext)))
    
    return [os.path.basename(f) for f in model_files]

def load_model(model_filename):
    """
    Load a model file
    
    Args:
        model_filename (str): Name of model file (e.g., 'pronunciation_model.pkl')
        
    Returns:
        object: Loaded model or None if failed
    """
    model_path = MODELS_DIR / model_filename
    
    if not model_path.exists():
        print(f"❌ Model not found: {model_filename}")
        return None
    
    try:
        model = joblib.load(model_path)
        print(f"✅ Loaded: {model_filename}")
        return model
    except Exception as e:
        print(f"❌ Error loading {model_filename}: {e}")
        return None

def save_model(model, model_filename):
    """
    Save a model to the models directory
    
    Args:
        model: The trained model object
        model_filename (str): Filename to save (e.g., 'pronunciation_model.pkl')
        
    Returns:
        bool: True if saved successfully
    """
    try:
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        model_path = MODELS_DIR / model_filename
        joblib.dump(model, model_path)
        print(f"✅ Saved: {model_filename}")
        return True
    except Exception as e:
        print(f"❌ Error saving {model_filename}: {e}")
        return False

def model_exists(model_filename):
    """
    Check if a model file exists
    
    Args:
        model_filename (str): Name of model file
        
    Returns:
        bool: True if exists
    """
    return (MODELS_DIR / model_filename).exists()

def get_model_path(model_filename):
    """
    Get full path to a model file
    
    Args:
        model_filename (str): Name of model file
        
    Returns:
        str: Full path to model
    """
    return str(MODELS_DIR / model_filename)

# Default model names
DEFAULT_PRONUNCIATION_MODEL = 'pronunciation_model.pkl'
DEFAULT_SCALER = 'scaler.pkl'

# Create models directory
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Show available models when imported
available = list_models()
if available:
    print(f"📁 ML Models found: {available}")
else:
    print("📁 No trained models found yet")
