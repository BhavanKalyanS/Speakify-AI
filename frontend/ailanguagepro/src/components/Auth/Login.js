import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Container,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email: formData.email });
      const response = await axiosInstance.post('/auth/login', formData);
      
      console.log('Login response:', response.data);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F3EA', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#EDE6D6', boxShadow: 'none', borderBottom: '1px solid rgba(27,27,24,0.05)' }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ color: '#6B6B63', textTransform: 'none', fontWeight: 600 }}
          >
            Back to Home
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
            <Box sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: '#CC785C', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'Georgia, serif' }}>
                S
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: '#1B1B18', fontWeight: 700, fontFamily: 'Georgia, serif' }}>
              Speakify AI
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login Form */}
      <Container maxWidth="sm" sx={{ py: 10, flex: 1, display: 'flex', alignItems: 'center' }}>
        <Paper sx={{ 
          p: 6, 
          bgcolor: '#EDE6D6',
          borderRadius: '12px',
          boxShadow: 'none',
          border: '1px solid rgba(27,27,24,0.03)',
          width: '100%'
        }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" sx={{ 
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              color: '#1B1B18',
              mb: 1.5
            }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#6B6B63',
              fontFamily: '"Inter", sans-serif'
            }}>
              Sign in to continue your pronunciation journey
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3.5, borderRadius: '8px', bgcolor: '#F7F3EA', color: '#E0574A', border: '1px solid rgba(224, 87, 74, 0.2)' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3.5 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: '#1B1B18',
                mb: 1,
                fontFamily: '"Inter", sans-serif'
              }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#F7F3EA',
                    '& fieldset': { borderColor: 'rgba(27,27,24,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(27,27,24,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#CC785C' },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4.5 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: '#1B1B18',
                mb: 1,
                fontFamily: '"Inter", sans-serif'
              }}>
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#F7F3EA',
                    '& fieldset': { borderColor: 'rgba(27,27,24,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(27,27,24,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#CC785C' },
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#CC785C',
                color: 'white',
                py: 1.6,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                mb: 4,
                '&:hover': { bgcolor: '#b8674d' },
                '&:disabled': { bgcolor: '#EDE6D6', color: '#6B6B63' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6B6B63', mb: 2, fontFamily: '"Inter", sans-serif' }}>
              Don't have an account yet?
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/register')}
              sx={{
                borderColor: 'rgba(27,27,24,0.15)',
                color: '#1B1B18',
                py: 1.6,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#CC785C',
                  bgcolor: 'rgba(204,120,92,0.05)',
                }
              }}
            >
              Create New Account
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1B1B18', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#EDE6D6', opacity: 0.6 }}>
              © 2026 Speakify AI. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
