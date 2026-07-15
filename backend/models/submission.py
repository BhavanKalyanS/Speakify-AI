import os
from extensions import mongo
from bson import ObjectId
from datetime import datetime, timezone
import pytz

class Submission:
    def __init__(self, user_id, target_text, audio_filename, score, feedback, duration=0, user_profile=None):
        self.user_id        = ObjectId(user_id) if isinstance(user_id, str) else user_id
        self.target_text    = target_text
        self.audio_filename = audio_filename
        self.score          = score
        self.feedback       = feedback
        self.duration       = duration
        # Set timestamp to India timezone
        india_tz = pytz.timezone('Asia/Kolkata')
        self.timestamp = datetime.now(india_tz)
        self.user_profile   = user_profile or {}
        self.metadata       = {'file_size': 0, 'audio_format': audio_filename.split('.')[-1], 'processing_time': 0}

    def save(self):
        return mongo.db.submissions.insert_one({
            'user_id':        self.user_id,
            'target_text':    self.target_text,
            'audio_filename': self.audio_filename,
            'score':          self.score,
            'feedback':       self.feedback,
            'duration':       self.duration,
            'timestamp':      self.timestamp,
            'user_profile':   self.user_profile,
            'metadata':       self.metadata
        })

    @staticmethod
    def get_user_submission_count(user_id):
        return mongo.db.submissions.count_documents({'user_id': ObjectId(user_id)})

    @staticmethod
    def get_submission_count():
        return mongo.db.submissions.count_documents({})

    @staticmethod
    def get_average_score(user_id=None):
        pipeline = []
        if user_id:
            pipeline.append({'$match': {'user_id': ObjectId(user_id)}})
        pipeline.append({'$group': {'_id': None, 'avg_score': {'$avg': '$score'}}})
        result = list(mongo.db.submissions.aggregate(pipeline))
        return result[0]['avg_score'] if result else 0.0

    @staticmethod
    def get_all_submissions(limit=None, skip=0):
        try:
            query = mongo.db.submissions.find({}).sort('timestamp', -1)
            if skip: query = query.skip(skip)
            if limit: query = query.limit(limit)
            return list(query)
        except Exception as e:
            print(f"[ERROR] get_all_submissions failed: {e}")
            return []
    
    @staticmethod
    def get_user_submissions(user_id, limit=None, skip=0):
        query = mongo.db.submissions.find({'user_id': ObjectId(user_id)}).sort('timestamp', -1)
        if skip: query = query.skip(skip)
        if limit: query = query.limit(limit)
        return list(query)