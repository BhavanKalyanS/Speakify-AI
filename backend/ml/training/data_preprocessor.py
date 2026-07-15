import os
import csv
import librosa
import numpy as np
import pandas as pd
from pathlib import Path

class CommonVoicePreprocessor:
    def __init__(self):
        # Get backend directory (2 levels up from this file)
        backend_dir = Path(__file__).parent.parent.parent
        self.data_dir = backend_dir / 'data' / 'commonvoice'
        self.clips_dir = self.data_dir / 'clips'
        self.validated_tsv = self.data_dir / 'validated.tsv'
        
        print(f"📁 Data directory: {self.data_dir}")
        print(f"🎵 Clips directory: {self.clips_dir}")
        print(f"📋 Metadata file: {self.validated_tsv}")
        
    def load_metadata(self, limit=None):
        """Load validated.tsv metadata file"""
        if not self.validated_tsv.exists():
            print(f"❌ Metadata file not found: {self.validated_tsv}")
            return pd.DataFrame()
        
        try:
            df = pd.read_csv(self.validated_tsv, sep='\t')
            if limit:
                df = df.head(limit)
            print(f"✅ Loaded {len(df)} records from metadata")
            return df
        except Exception as e:
            print(f"❌ Error loading metadata: {e}")
            return pd.DataFrame()
    
    def extract_audio_features(self, audio_path, n_mfcc=13):
        """Extract MFCC features from audio file"""
        try:
            # Load audio file
            signal, sr = librosa.load(audio_path, sr=22050)
            
            # Skip if audio is too short
            if len(signal) < sr * 0.1:  # Less than 0.1 seconds
                return None
            
            # Extract MFCC features
            mfcc = librosa.feature.mfcc(y=signal, sr=sr, n_mfcc=n_mfcc)
            mfcc_mean = np.mean(mfcc, axis=1)
            
            # Extract additional features
            spectral_centroids = librosa.feature.spectral_centroid(y=signal, sr=sr)
            spectral_rolloff = librosa.feature.spectral_rolloff(y=signal, sr=sr)
            zero_crossing_rate = librosa.feature.zero_crossing_rate(signal)
            
            # Combine features
            features = np.concatenate([
                mfcc_mean,
                [np.mean(spectral_centroids)],
                [np.mean(spectral_rolloff)],
                [np.mean(zero_crossing_rate)]
            ])
            
            return features
            
        except Exception as e:
            print(f"⚠️  Error processing {audio_path}: {e}")
            return None
    
    def prepare_dataset(self, limit=1000, output_dir=None):
        """Prepare dataset for training"""
        if output_dir is None:
            output_dir = Path(__file__).parent
            
        print(f"🔄 Preparing dataset with limit: {limit}")
        
        # Load metadata
        df = self.load_metadata(limit)
        if df.empty:
            print("❌ No metadata loaded!")
            return np.array([]), np.array([]), []
        
        X = []
        y = []
        sentences = []
        processed_count = 0
        
        print(f"🎵 Processing {len(df)} audio files...")
        
        for idx, row in df.iterrows():
            audio_filename = row['path']
            audio_path = self.clips_dir / audio_filename
            
            if not audio_path.exists():
                continue
                
            features = self.extract_audio_features(str(audio_path))
            if features is not None:
                X.append(features)
                sentences.append(row['sentence'])
                
                # Create simple quality score based on votes
                up_votes = row.get('up_votes', 0)
                down_votes = row.get('down_votes', 0)
                total_votes = up_votes + down_votes
                
                if total_votes > 0:
                    quality_score = up_votes / total_votes
                else:
                    quality_score = 0.5  # Default middle score
                
                y.append(quality_score)
                processed_count += 1
            
            # Progress update
            if (idx + 1) % 100 == 0:
                print(f"📊 Processed {idx + 1}/{len(df)} files, {processed_count} successful")
        
        if processed_count == 0:
            print("❌ No audio files processed successfully!")
            return np.array([]), np.array([]), []
        
        X = np.array(X)
        y = np.array(y)
        
        # Save processed data
        try:
            np.save(output_dir / 'X_train.npy', X)
            np.save(output_dir / 'y_train.npy', y)
            
            # Save sentences for reference
            with open(output_dir / 'sentences.txt', 'w', encoding='utf-8') as f:
                for sentence in sentences:
                    f.write(sentence + '\n')
            
            print(f"✅ Dataset prepared successfully!")
            print(f"📊 Final dataset: {X.shape[0]} samples, {X.shape[1]} features")
            print(f"💾 Saved to {output_dir}")
            
        except Exception as e:
            print(f"❌ Error saving dataset: {e}")
        
        return X, y, sentences

if __name__ == "__main__":
    print("=== Common Voice Data Preprocessor ===\n")
    
    preprocessor = CommonVoicePreprocessor()
    X, y, sentences = preprocessor.prepare_dataset(limit=500)
    
    if len(X) > 0:
        print(f"\n🎉 Success! Ready for training with {len(X)} samples")
    else:
        print(f"\n❌ No data processed. Check your dataset files.")
