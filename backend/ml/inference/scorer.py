import os
import joblib
import numpy as np
import librosa
from config import Config

class PronunciationScorer:
    """Advanced pronunciation scoring using trained models"""
    
    def __init__(self, model_path=None):
        if model_path is None:
            model_path = os.path.join(Config.ML_MODEL_PATH, 'pronunciation_model.pkl')
        
        self.model_path = model_path
        self.model = None
        self.scaler = None
        self.load_models()
    
    def load_models(self):
        """Load the trained model and scaler"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                print(f"✅ Model loaded from {self.model_path}")
                
                # Try to load scaler if it exists
                scaler_path = self.model_path.replace('pronunciation_model.pkl', 'scaler.pkl')
                if os.path.exists(scaler_path):
                    self.scaler = joblib.load(scaler_path)
                    print("✅ Feature scaler loaded")
            else:
                print(f"⚠️  Model file not found: {self.model_path}")
        
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            self.model = None
            self.scaler = None
    
    def extract_advanced_features(self, audio_path):
        """Extract comprehensive audio features for pronunciation scoring"""
        try:
            # Load audio
            y, sr = librosa.load(audio_path, sr=22050)
            
            # Ensure minimum length
            if len(y) < sr * 0.1:  # Less than 0.1 seconds
                return None
            
            # Extract multiple feature types
            features = {}
            
            # 1. MFCC features (most important for speech)
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            features['mfcc_mean'] = np.mean(mfcc, axis=1)
            features['mfcc_std'] = np.std(mfcc, axis=1)
            features['mfcc_delta'] = np.mean(librosa.feature.delta(mfcc), axis=1)
            
            # 2. Spectral features
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
            spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
            spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
            
            features['spectral_centroid_mean'] = np.mean(spectral_centroids)
            features['spectral_centroid_std'] = np.std(spectral_centroids)
            features['spectral_rolloff_mean'] = np.mean(spectral_rolloff)
            features['spectral_rolloff_std'] = np.std(spectral_rolloff)
            features['spectral_bandwidth_mean'] = np.mean(spectral_bandwidth)
            features['spectral_bandwidth_std'] = np.std(spectral_bandwidth)
            features['spectral_contrast_mean'] = np.mean(spectral_contrast, axis=1)
            features['spectral_contrast_std'] = np.std(spectral_contrast, axis=1)
            
            # 3. Temporal features
            zero_crossing_rate = librosa.feature.zero_crossing_rate(y)
            features['zcr_mean'] = np.mean(zero_crossing_rate)
            features['zcr_std'] = np.std(zero_crossing_rate)
            
            # 4. Energy features
            rms = librosa.feature.rms(y=y)
            features['rms_mean'] = np.mean(rms)
            features['rms_std'] = np.std(rms)
            
            # 5. Pitch features
            try:
                pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
                pitch_values = []
                for t in range(pitches.shape[1]):
                    index = magnitudes[:, t].argmax()
                    pitch = pitches[index, t]
                    if pitch > 0:
                        pitch_values.append(pitch)
                
                if pitch_values:
                    features['pitch_mean'] = np.mean(pitch_values)
                    features['pitch_std'] = np.std(pitch_values)
                    features['pitch_range'] = np.max(pitch_values) - np.min(pitch_values)
                else:
                    features['pitch_mean'] = 0
                    features['pitch_std'] = 0
                    features['pitch_range'] = 0
            except:
                features['pitch_mean'] = 0
                features['pitch_std'] = 0
                features['pitch_range'] = 0
            
            # 6. Rhythm and timing features
            tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
            features['tempo'] = tempo
            features['beat_count'] = len(beats)
            
            # 7. Audio quality features
            features['duration'] = len(y) / sr
            features['silence_ratio'] = np.sum(np.abs(y) < 0.01) / len(y)
            
            # Flatten all features into a single vector
            feature_vector = []
            for key in sorted(features.keys()):
                value = features[key]
                if isinstance(value, np.ndarray):
                    feature_vector.extend(value.flatten())
                else:
                    feature_vector.append(value)
            
            return np.array(feature_vector).reshape(1, -1)
            
        except Exception as e:
            print(f"❌ Feature extraction failed: {e}")
            return None
    
    def score_pronunciation(self, audio_path, target_text=None):
        """Score pronunciation using the trained model"""
        if self.model is None:
            return {
                'score': 0.5,
                'confidence': 0.0,
                'feedback': 'Model not available',
                'details': {}
            }
        
        # Extract features
        features = self.extract_advanced_features(audio_path)
        if features is None:
            return {
                'score': 0.0,
                'confidence': 0.0,
                'feedback': 'Could not process audio',
                'details': {}
            }
        
        try:
            # Scale features if scaler is available
            if self.scaler is not None:
                features = self.scaler.transform(features)
            
            # Get prediction
            if hasattr(self.model, 'predict_proba'):
                # For classifiers, get probability scores
                probabilities = self.model.predict_proba(features)[0]
                score = np.max(probabilities)
                confidence = score
            else:
                # For regressors
                score = self.model.predict(features)[0]
                confidence = min(abs(score - 0.5) * 2, 1.0)  # Higher confidence for extreme scores
            
            # Ensure score is in valid range
            score = max(0.0, min(1.0, score))
            
            return {
                'score': round(score, 3),
                'confidence': round(confidence, 3),
                'feedback': self._generate_feedback(score, confidence),
                'details': self._generate_detailed_analysis(score, confidence, features)
            }
            
        except Exception as e:
            print(f"❌ Scoring failed: {e}")
            return {
                'score': 0.0,
                'confidence': 0.0,
                'feedback': f'Scoring error: {str(e)}',
                'details': {}
            }
    
    def _generate_feedback(self, score, confidence):
        """Generate human-readable feedback"""
        confidence_text = ""
        if confidence < 0.5:
            confidence_text = " (Low confidence - consider recording again in better conditions)"
        elif confidence > 0.8:
            confidence_text = " (High confidence assessment)"
        
        if score >= 0.9:
            return f"Excellent pronunciation! Very clear and natural speech.{confidence_text}"
        elif score >= 0.8:
            return f"Very good pronunciation with minor areas for improvement.{confidence_text}"
        elif score >= 0.7:
            return f"Good pronunciation overall, some refinement needed.{confidence_text}"
        elif score >= 0.6:
            return f"Fair pronunciation, focus on clarity and pacing.{confidence_text}"
        elif score >= 0.4:
            return f"Needs improvement in pronunciation and clarity.{confidence_text}"
        else:
            return f"Significant improvement needed. Practice slowly and clearly.{confidence_text}"
    
    def _generate_detailed_analysis(self, score, confidence, features):
        """Generate detailed analysis breakdown"""
        return {
            'overall_quality': 'Excellent' if score >= 0.8 else 'Good' if score >= 0.6 else 'Fair' if score >= 0.4 else 'Poor',
            'confidence_level': 'High' if confidence >= 0.7 else 'Medium' if confidence >= 0.4 else 'Low',
            'feature_count': features.shape[1] if features is not None else 0,
            'recommendations': self._get_recommendations(score, confidence)
        }
    
    def _get_recommendations(self, score, confidence):
        """Get specific recommendations based on score and confidence"""
        recommendations = []
        
        if confidence < 0.5:
            recommendations.append("Try recording in a quieter environment")
            recommendations.append("Speak closer to the microphone")
        
        if score < 0.8:
            recommendations.append("Practice speaking more slowly and clearly")
            recommendations.append("Focus on proper articulation of each syllable")
        
        if score < 0.6:
            recommendations.append("Read the text several times before recording")
            recommendations.append("Break down difficult words and practice them separately")
        
        if score < 0.4:
            recommendations.append("Consider working with a pronunciation coach")
            recommendations.append("Use phonetic transcriptions to understand correct pronunciation")
        
        return recommendations

# Global instance
pronunciation_scorer = PronunciationScorer()
