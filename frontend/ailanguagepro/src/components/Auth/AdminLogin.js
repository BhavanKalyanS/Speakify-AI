import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Container,
} from '@mui/material';
import { AdminPanelSettings, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const AdminLogin = () => {
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
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', formData);

      if (response.data.user.role !== 'admin') {
        setError('Unauthorized access - Administrator privileges required');
        setLoading(false);
        return;
      }

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/admin');
    } catch (err) {
      setError('Authentication failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F3EA', display: 'flex', flexDirection: 'column', fontFamily: '"Inter", sans-serif' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#EDE6D6', 
        borderBottom: '1px solid rgba(27,27,24,0.05)',
        py: 2
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{ 
                color: '#6B6B63',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                '&:hover': { bgcolor: 'rgba(27,27,24,0.04)', color: '#CC785C' }
              }}
            >
              Back to Home
            </Button>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: '#1B1B18',
              ml: 'auto',
              fontFamily: 'Georgia, serif'
            }}>
              Speakify AI Admin
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Admin Login Form */}
      <Container maxWidth="sm" sx={{ py: 10, flex: 1, display: 'flex', alignItems: 'center' }}>
        <Paper sx={{ 
          p: 5, 
          bgcolor: '#EDE6D6',
          borderRadius: '12px',
          boxShadow: 'none',
          border: '1px solid rgba(27,27,24,0.03)',
          position: 'relative',
          width: '100%'
        }}>
          {/* Admin Badge */}
          <Box sx={{ 
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: '#CC785C',
            color: 'white',
            px: 2.5,
            py: 0.5,
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Secure Console
          </Box>

          <Box sx={{ textAlign: 'center', mb: 4, mt: 1 }}>
            <Box sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: '50%',
              bgcolor: 'rgba(204,120,92,0.08)',
              mb: 2
            }}>
              <AdminPanelSettings sx={{ fontSize: 36, color: '#CC785C' }} />
            </Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 700,
              color: '#1B1B18',
              fontFamily: 'Georgia, serif',
              mb: 1
            }}>
              System Administrator Login
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#6B6B63',
              fontFamily: '"Inter", sans-serif',
              opacity: 0.8
            }}>
              Authorized personnel only • Secure credentials required
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ 
              mb: 3, 
              borderRadius: '8px',
              bgcolor: '#F7F3EA',
              color: '#E0574A',
              border: '1px solid rgba(224, 87, 74, 0.2)',
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.85rem',
              '& .MuiAlert-icon': { color: '#E0574A' }
            }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: '#1B1B18',
                mb: 1,
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem'
              }}>
                Administrator Email
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@speakify.ai"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#F7F3EA',
                    color: '#1B1B18',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.9rem',
                    '& fieldset': { 
                      borderColor: 'rgba(27,27,24,0.1)',
                      borderWidth: 1
                    },
                    '&:hover fieldset': { 
                      borderColor: '#CC785C'
                    },
                    '&.Mui-focused fieldset': { 
                      borderColor: '#CC785C',
                      borderWidth: 1.5
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 4.5 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600, 
                color: '#1B1B18',
                mb: 1,
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem'
              }}>
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#F7F3EA',
                    color: '#1B1B18',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.9rem',
                    '& fieldset': { 
                      borderColor: 'rgba(27,27,24,0.1)',
                      borderWidth: 1
                    },
                    '&:hover fieldset': { 
                      borderColor: '#CC785C'
                    },
                    '&.Mui-focused fieldset': { 
                      borderColor: '#CC785C',
                      borderWidth: 1.5
                    },
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#CC785C',
                color: 'white',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                fontFamily: '"Inter", sans-serif',
                '&:hover': { 
                  bgcolor: '#b8674d',
                },
                '&:disabled': { 
                  bgcolor: 'rgba(27,27,24,0.1)',
                  color: '#6B6B63'
                },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In to Admin Panel'}
            </Button>
          </form>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#EDE6D6', py: 4, borderTop: '1px solid rgba(27,27,24,0.05)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6B6B63', opacity: 0.8, fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>
              Speakify AI Administrator Interface • Secure Session Active
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLogin;
