import time
import random

class MockAIProcessor:
    def __init__(self):
        self.model = None
    
    def score_pronunciation(self, audio_path, target_text=None):
        """Fast mock pronunciation scoring"""
        try:
            # Simulate processing time
            time.sleep(0.5)
            
            # Generate random but realistic score
            score = round(random.uniform(0.65, 0.95), 2)
            
            # Generate feedback based on score
            if score >= 0.9:
                feedback = "Excellent pronunciation! Your speech is very clear and natural."
            elif score >= 0.8:
                feedback = "Very good pronunciation! Minor refinements could make it perfect."
            elif score >= 0.7:
                feedback = "Good pronunciation! You're on the right track with room for improvement."
            else:
                feedback = "Fair pronunciation. Focus on clarity and pacing."
            
            return {
                'score': score,
                'feedback': feedback,
                'details': {
                    'pronunciation_quality': 'Good' if score >= 0.7 else 'Fair',
                    'confidence': 'High',
                    'suggestions': [
                        'Practice speaking more clearly',
                        'Focus on proper articulation'
                    ],
                    'metrics': {
                        'clarity_score': round(score * 1.1, 2),
                        'fluency_score': score,
                        'pace_score': round(score * 0.9, 2)
                    }
                },
                'processing_time': 0.5,
                'audio_info': {
                    'duration': 2.5,
                    'sample_rate': 22050
                }
            }
            
        except Exception as e:
            return {
                'score': 0.0,
                'feedback': f'Error processing audio: {str(e)}',
                'details': {},
                'processing_time': 0.1
            }
    
    def health_check(self):
        return {
            'model_loaded': True,
            'model_path': 'mock_model',
            'model_exists': True,
            'smart_feedback_agent': True
        }

# Create mock instance
mock_ai_processor = MockAIProcessor()