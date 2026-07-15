import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post('/auth/register', {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: 'user',
      });

      const loginRes = await axiosInstance.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const { access_token, user } = loginRes.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'rgba(247, 243, 234, 0.4)', backdropFilter: 'blur(20px)', boxShadow: 'none', borderBottom: '1px solid rgba(27,27,24,0.05)' }}>
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

      {/* Register Form */}
      <Container maxWidth="sm" sx={{ py: 6, flex: 1, display: 'flex', alignItems: 'center' }}>
        <Paper sx={{ 
          p: 6, 
          bgcolor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(27,27,24,0.04)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          width: '100%'
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ 
              fontFamily: 'Georgia, serif',
              fontWeight: 700,
              color: '#1B1B18',
              mb: 1.5
            }}>
              Create Your Account
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#6B6B63',
              fontFamily: '"Inter", sans-serif'
            }}>
              Start your pronunciation improvement journey
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3.5, borderRadius: '8px', bgcolor: '#F7F3EA', color: '#E0574A', border: '1px solid rgba(224, 87, 74, 0.2)' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: '#1B1B18',
                mb: 1,
                fontFamily: '"Inter", sans-serif'
              }}>
                Username
              </Typography>
              <TextField
                fullWidth
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: 'rgba(255, 255, 255, 0.4)',
                    '& fieldset': { borderColor: 'rgba(27,27,24,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(27,27,24,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#CC785C' },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2.5 }}>
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
                    bgcolor: 'rgba(255, 255, 255, 0.4)',
                    '& fieldset': { borderColor: 'rgba(27,27,24,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(27,27,24,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#CC785C' },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2.5 }}>
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
                placeholder="Create a password (min. 6 characters)"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: 'rgba(255, 255, 255, 0.4)',
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
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: 'rgba(255, 255, 255, 0.4)',
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6B6B63', mb: 2, fontFamily: '"Inter", sans-serif' }}>
              Already have an account?
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/login')}
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
              Sign In Instead
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

export default Register;
