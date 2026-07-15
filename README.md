# Speakify AI

A professional pronunciation assessment platform with AI-powered feedback, built with Flask backend and React frontend.

## 🚀 Features

### User Features
- **Professional UI**: Amazon-style interface with modern design
- **Audio Recording**: Record pronunciation directly in browser
- **File Upload**: Upload audio files for assessment
- **AI Feedback**: Detailed pronunciation analysis with scores
- **Progress Tracking**: View practice history and improvement metrics
- **Real-time Dashboard**: Track sessions, scores, and progress

### Admin Features
- **Comprehensive Dashboard**: User analytics and system metrics
- **User Management**: View, search, and manage user accounts
- **Activity Analytics**: Daily activity charts and popular words analysis
- **System Monitoring**: Performance and database status

### Technical Features
- **JWT Authentication**: Secure user sessions
- **MongoDB Integration**: Scalable data storage
- **Audio Processing**: Advanced ML-based pronunciation scoring
- **Responsive Design**: Works on desktop and mobile
- **Professional UI**: Amazon-inspired design system

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework
- **MongoDB**: NoSQL database with PyMongo
- **JWT**: Authentication and authorization
- **Librosa**: Audio processing and feature extraction
- **Scikit-learn**: Machine learning for pronunciation scoring
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Modern React with hooks
- **Material-UI**: Professional component library
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing
- **Chart.js**: Data visualization
- **Web Audio API**: Browser audio recording

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **MongoDB** (local or cloud)
- **Modern web browser** with microphone support

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)
```bash
# Run the startup script
start.bat
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Copy .env.example to .env and configure:
# - MONGO_URI: Your MongoDB connection string
# - SECRET_KEY: Flask secret key
# - JWT_SECRET_KEY: JWT signing key

# Start the server
python app.py
```

#### Frontend Setup
```bash
cd frontend/ailanguagepro

# Install dependencies
npm install

# Start development server
npm start
```

## 🔧 Configuration

### Environment Variables (.env)
```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key
MONGO_URI=mongodb://localhost:27017/ailanguagepro
FLASK_ENV=development
```

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `ailanguagepro`
3. Update the `MONGO_URI` in your `.env` file

## 📱 Usage

### For Users
1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Practice**: Use the dashboard to start pronunciation practice
4. **Record**: Record audio or upload files
5. **Review**: Get detailed AI feedback and track progress

### For Administrators
1. **Admin Login**: Access admin panel at `/admin-login`
2. **Dashboard**: View system analytics and user metrics
3. **User Management**: Search, view, and manage user accounts
4. **Monitoring**: Track system performance and usage

## 🎯 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### User Operations
- `GET /user/dashboard` - User dashboard data
- `POST /user/pronounce` - Submit pronunciation for scoring

### Admin Operations
- `GET /admin/dashboard` - Admin analytics dashboard
- `GET /admin/users` - List and search users
- `DELETE /admin/users/:id` - Deactivate user account

## 🧠 AI Pronunciation Scoring

The system uses advanced audio processing to evaluate pronunciation:

1. **Feature Extraction**: MFCC, spectral features, temporal analysis
2. **ML Scoring**: Trained model or heuristic-based fallback
3. **Detailed Feedback**: Clarity, fluency, pace metrics
4. **Improvement Suggestions**: Personalized recommendations

## 🎨 UI Design

The interface follows Amazon's design principles:
- **Clean Layout**: Minimal, professional appearance
- **Consistent Colors**: Orange primary (#FF8C00) with neutral grays
- **Typography**: Poppins font family for modern look
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: High contrast and keyboard navigation

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String (user/admin),
  is_active: Boolean,
  created_at: Date,
  profile: {
    first_name: String,
    last_name: String,
    native_language: String,
    target_languages: Array,
    skill_level: String
  }
}
```

### Submissions Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  target_text: String,
  audio_filename: String,
  score: Number,
  feedback: String,
  duration: Number,
  timestamp: Date,
  metadata: Object
}
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **File Upload Security**: Validated file types and sizes

## 🚀 Deployment

### Production Setup
1. **Environment**: Set `FLASK_ENV=production`
2. **Database**: Use MongoDB Atlas or dedicated server
3. **Secrets**: Generate strong secret keys
4. **HTTPS**: Enable SSL/TLS certificates
5. **Process Manager**: Use PM2 or similar for Node.js
6. **Reverse Proxy**: Configure Nginx for production

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend/ailanguagepro
npm test
```

## 📈 Performance Optimization

- **Audio Processing**: Optimized librosa usage
- **Database Queries**: Indexed fields for faster searches
- **Frontend**: Code splitting and lazy loading
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression for API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

## 🔄 Version History

- **v1.0.0**: Initial release with core features
- **v1.1.0**: Enhanced UI and admin dashboard
- **v1.2.0**: Improved AI scoring and feedback

---

**Speakify AI** - Professional pronunciation assessment platform