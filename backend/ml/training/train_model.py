import os
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from data_preprocessor import CommonVoicePreprocessor

class PronunciationModel:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            max_depth=10
        )
        self.model_path = os.path.join('..', 'models', 'pronunciation_model.pkl')
    
    def train(self, X, y):
        """Train the pronunciation scoring model"""
        print("Starting model training...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"Model trained successfully!")
        print(f"Test MSE: {mse:.4f}")
        print(f"Test R²: {r2:.4f}")
        
        # Save model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        print(f"Model saved to {self.model_path}")
        
        return self.model
    
    def load_model(self):
        """Load trained model"""
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            print("Model loaded successfully!")
        else:
            print("No trained model found!")
    
    def predict(self, X):
        """Make predictions"""
        return self.model.predict(X)

def main():
    # Prepare dataset
    print("Preparing dataset...")
    preprocessor = CommonVoicePreprocessor()
    X, y, sentences = preprocessor.prepare_dataset(limit=1000)
    
    # Train model
    print("\nTraining model...")
    model = PronunciationModel()
    trained_model = model.train(X, y)
    
    print("\nTraining complete!")

if __name__ == "__main__":
    main()
