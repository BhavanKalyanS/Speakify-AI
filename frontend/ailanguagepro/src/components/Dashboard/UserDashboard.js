import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  AppBar,
  Toolbar,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
  Fab,
  Paper,
} from '@mui/material';
import {
  Home,
  GraphicEq,
  Mic,
  PlayArrow,
  ExitToApp,
  Assessment,
  Quiz,
  Menu as MenuIcon,
  BarChart,
  TrackChanges,
  Lightbulb
} from '@mui/icons-material';
import AudioRecorder from '../AudioRecorder';
import FeedbackDisplay from '../FeedbackDisplay';
import ProgressChart from '../ProgressChart';
import TestComponent from '../TestComponent';
import Chatbot from '../Chatbot';
import WaveformScoreRing from '../WaveformScoreRing';
import DurationChart from '../DurationChart';

import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';



const sampleTexts = [
  "Hello, how are you today?",
  "The weather is beautiful outside.",
  "I would like to practice my pronunciation.",
  "Technology is advancing rapidly.",
  "Learning languages opens new opportunities.",
];

const UserDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = 280;
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [targetText, setTargetText] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [recordHistory, setRecordHistory] = useState([]);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchRecordHistory();
    
    // Listen for tab change events from results page
    const handleSetTab = (event) => {
      setCurrentTab(event.detail);
    };
    
    window.addEventListener('setTab', handleSetTab);
    
    return () => {
      window.removeEventListener('setTab', handleSetTab);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(`/user/dashboard?t=${Date.now()}`);
      setDashboardData(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setDashboardData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchRecordHistory = async () => {
    try {
      const response = await axiosInstance.get(`/user/submissions?t=${Date.now()}`);
      const submissions = response.data.submissions || [];
      setRecordHistory(submissions);
      return submissions;
    } catch (err) {
      console.error('Failed to load record history:', err);
      setRecordHistory([]);
      return [];
    }
  };

  const handlePracticeSubmit = async () => {
    console.log('handlePracticeSubmit called');
    console.log('targetText:', targetText);
    console.log('audioFile:', audioFile);
    
    if (!targetText.trim() || !audioFile) {
      console.log('Validation failed - missing text or audio');
      setError('Please enter text and record audio.');
      return;
    }

    console.log('Starting submission...');
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('target_text', targetText.trim());
      formData.append('audio', audioFile);
      
      console.log('FormData created, sending request...');

      const response = await axiosInstance.post('/user/pronounce', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log('Response received:', response.data);
      
      // Refresh data immediately
      await fetchDashboardData();
      await fetchRecordHistory();
      
      // Redirect to results page
      navigate('/results', { 
        state: { 
          result: response.data, 
          targetText: targetText.trim() 
        } 
      });
      
      setTargetText('');
      setAudioFile(null);
      console.log('Submission completed successfully');
    } catch (err) {
      console.error('Submission error:', err);
      console.error('Error response:', err.response?.data);
      setError(`Failed to analyze pronunciation: ${err.response?.data?.error || err.message}`);
    } finally {
      setSubmitting(false);
      console.log('Submission process finished');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    // Clear practice tab data when switching away from it
    if (currentTab === 1 && newValue !== 1) {
      setAudioFile(null);
      setTargetText('');
      setError(null);
    }
    setCurrentTab(newValue);
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getScoreColor = (score) => {
    return '#CC785C';
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#F7F3EA',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress sx={{ color: '#CC785C' }} />
      </Box>
    );
  }

  const avgScore = recordHistory.length > 0 ? Math.round(recordHistory.reduce((acc, r) => acc + r.score, 0) / recordHistory.length) : 0;
  const bestScore = recordHistory.length > 0 ? Math.max(...recordHistory.map(r => r.score)) : 0;
  const streak = recordHistory.length > 0 ? (recordHistory.length % 5) + 3 : 0;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#F7F3EA',
      display: 'flex', 
      flexDirection: 'column',
      pl: { md: `${drawerWidth}px` },
      pb: { xs: '70px', md: 0 }
    }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#EDE6D6', boxShadow: 'none', borderBottom: '1px solid rgba(27,27,24,0.05)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ color: '#1B1B18' }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {currentTab === 0 && (
        <Box>
          {/* Welcome Greeting */}
          <Box sx={{ mb: 4, mt: 2 }}>
            <Typography variant="h3" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18', mb: 1 }}>
              Good morning, {dashboardData?.user?.username || 'User'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif' }}>
              Your editorial pronunciation coach is ready for your practice today.
            </Typography>
          </Box>

          {/* Three cards in a row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                bgcolor: '#EDE6D6',
                borderRadius: '12px',
                boxShadow: 'none',
                border: '1px solid rgba(27,27,24,0.03)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                height: '100%'
              }}>
                <WaveformScoreRing score={avgScore} size={155} label="Average Score" />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                bgcolor: '#EDE6D6',
                borderRadius: '12px',
                boxShadow: 'none',
                border: '1px solid rgba(27,27,24,0.03)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                height: '100%'
              }}>
                <WaveformScoreRing score={bestScore} size={155} label="Best Score" />
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                bgcolor: '#EDE6D6',
                borderRadius: '12px',
                boxShadow: 'none',
                border: '1px solid rgba(27,27,24,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                height: '100%'
              }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 600, color: '#1B1B18', mb: 2, textAlign: 'center' }}>
                    Practice Details
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: 'rgba(27,27,24,0.06)' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif' }}>Total Sessions</Typography>
                    <Typography variant="body2" sx={{ color: '#1B1B18', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>{recordHistory.length}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif' }}>Total Time</Typography>
                    <Typography variant="body2" sx={{ color: '#1B1B18', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>{Math.round(recordHistory.reduce((acc, r) => acc + (r.duration || 0), 0) / 60)} mins</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif' }}>Last Session</Typography>
                    <Typography variant="body2" sx={{ color: '#1B1B18', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>
                      {recordHistory.length > 0 ? new Date(recordHistory[0].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Progress Chart */}
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                height: 400,
                bgcolor: '#EDE6D6',
                borderRadius: '12px',
                boxShadow: 'none',
                border: '1px solid rgba(27,27,24,0.03)'
              }}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif', fontWeight: 600, color: '#1B1B18', mb: 3 }}>
                    Progress Trend
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <ProgressChart recordHistory={recordHistory} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Sessions */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: 400,
                bgcolor: '#EDE6D6',
                borderRadius: '12px',
                boxShadow: 'none',
                border: '1px solid rgba(27,27,24,0.03)'
              }}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif', fontWeight: 600, color: '#1B1B18', mb: 3 }}>
                    Recent Sessions
                  </Typography>
                  <Box sx={{ flex: 1, overflowY: 'auto' }}>
                    {recordHistory.length > 0 ? recordHistory.slice(0, 6).map((record, index) => (
                      <Box key={record.id} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 2,
                        px: 2,
                        mb: 1,
                        borderRadius: '8px',
                        bgcolor: '#F7F3EA',
                        border: '1px solid rgba(27,27,24,0.05)'
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>
                            Session {recordHistory.length - index}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6B6B63', fontFamily: '"IBM Plex Mono", monospace' }}>
                            {formatDate(record.timestamp)}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 700, color: '#CC785C' }}>
                          {record.score}%
                        </Typography>
                      </Box>
                    )) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" sx={{ color: '#6B6B63', mb: 2 }}>
                          No practice sessions yet
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => setCurrentTab(1)}
                          sx={{ color: '#CC785C', borderColor: '#CC785C', borderRadius: '8px' }}
                        >
                          Start First Session
                        </Button>
                      </Box>
                    )}
                  </Box>
                  {recordHistory.length > 0 && (
                    <Button 
                      variant="text" 
                      onClick={() => setCurrentTab(3)}
                      sx={{ mt: 2, color: '#CC785C', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}
                      fullWidth
                    >
                      View All History →
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Practice Duration Chart */}
            <Grid item xs={12}>
              <Card sx={{ 
                height: 400,
                bgcolor: '#EDE6D6',
                borderRadius: '12px',
                boxShadow: 'none',
                border: '1px solid rgba(27,27,24,0.03)'
              }}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif', fontWeight: 600, color: '#1B1B18', mb: 3 }}>
                    Practice Duration Trend
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <DurationChart recordHistory={recordHistory} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        )}

        {/* Practice Tab */}
        {currentTab === 1 && (
          <Box>
            <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18', mb: 4 }}>
              Practice Pronunciation
            </Typography>
            
            <Card sx={{ mb: 4, bgcolor: '#EDE6D6', borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.03)' }}>
              <CardContent sx={{ p: 4 }}>
                <TextField
                  multiline
                  minRows={3}
                  fullWidth
                  value={targetText}
                  onChange={e => setTargetText(e.target.value)}
                  placeholder="Enter text to practice or select from suggestions below..."
                  sx={{ 
                    mb: 3.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      bgcolor: '#F7F3EA',
                      '& fieldset': { borderColor: 'rgba(27,27,24,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(27,27,24,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#CC785C' },
                    },
                  }}
                  label="Practice Sentence"
                />

                <Typography variant="subtitle2" sx={{ color: '#6B6B63', mb: 2, fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
                  Suggested Sentences:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4.5 }}>
                  {sampleTexts.map((text, idx) => (
                    <Chip
                      key={idx}
                      label={text}
                      onClick={() => setTargetText(text)}
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: targetText === text ? '#CC785C' : '#F7F3EA',
                        color: targetText === text ? 'white' : '#1B1B18',
                        borderColor: targetText === text ? '#CC785C' : 'rgba(27,27,24,0.1)',
                        '&:hover': { bgcolor: targetText === text ? '#b8674d' : 'rgba(27,27,24,0.05)' },
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        borderRadius: '8px'
                      }}
                      variant={targetText === text ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>

                <AudioRecorder 
                  key={result ? 'with-result' : 'no-result'} 
                  targetText={targetText}
                  onAudioReady={(file) => {
                    console.log('Audio file received:', file);
                    setAudioFile(file);
                  }} 
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    disabled={!targetText.trim() || !audioFile || submitting}
                    onClick={handlePracticeSubmit}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                    sx={{ 
                      bgcolor: '#CC785C',
                      color: 'white',
                      px: 5,
                      py: 1.6,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '8px',
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#b8674d' }
                    }}
                  >
                    {submitting ? 'Analyzing...' : 'Submit Practice'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Test Tab */}
        {currentTab === 2 && (
          <TestComponent />
        )}

        {/* Record History Tab */}
        {currentTab === 3 && (
          <Box>
            <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18', mb: 4 }}>
              Record History
            </Typography>
            
            <Card sx={{ bgcolor: '#EDE6D6', borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.03)' }}>
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F7F3EA' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>Session</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>Score</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>Duration</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recordHistory.map((record, index) => (
                        <TableRow key={record.id} hover sx={{ '&:hover': { bgcolor: 'rgba(27,27,24,0.02)' } }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>
                              Session {recordHistory.length - index}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 700, color: '#CC785C' }}>
                              {record.score}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: '"IBM Plex Mono", monospace', color: '#1B1B18' }}>
                              {record.duration}s
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"IBM Plex Mono", monospace' }}>
                              {formatDate(record.timestamp)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {recordHistory.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <GraphicEq sx={{ fontSize: 64, color: '#6B6B63', mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B1B18', mb: 1 }}>
                      No recordings yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B63', mb: 3 }}>
                      Start practicing to see your recording history here
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setCurrentTab(1)}
                      sx={{ bgcolor: '#CC785C', color: 'white', '&:hover': { bgcolor: '#b8674d' }, borderRadius: '8px' }}
                    >
                      Start Recording
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Overall Analysis Tab */}
        {currentTab === 4 && (
          <Box>
            <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18', mb: 4 }}>
              Performance Analysis
            </Typography>
            
            {recordHistory.length > 0 ? (
              <Grid container spacing={4}>
                {/* Overall Stats */}
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: '#EDE6D6', borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.03)' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18', mb: 3 }}>
                        Performance Overview
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            bgcolor: '#F7F3EA',
                            borderRadius: '8px',
                            border: '1px solid rgba(27,27,24,0.05)',
                            boxShadow: 'none'
                          }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#CC785C', mb: 1, fontFamily: '"IBM Plex Mono", monospace' }}>
                              {recordHistory.length}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                              Total Sessions
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            bgcolor: '#F7F3EA',
                            borderRadius: '8px',
                            border: '1px solid rgba(27,27,24,0.05)',
                            boxShadow: 'none'
                          }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#CC785C', mb: 1, fontFamily: '"IBM Plex Mono", monospace' }}>
                              {Math.round(recordHistory.reduce((acc, r) => acc + r.score, 0) / recordHistory.length)}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                              Average Score
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            bgcolor: '#F7F3EA',
                            borderRadius: '8px',
                            border: '1px solid rgba(27,27,24,0.05)',
                            boxShadow: 'none'
                          }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#CC785C', mb: 1, fontFamily: '"IBM Plex Mono", monospace' }}>
                              {Math.max(...recordHistory.map(r => r.score))}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                              Best Score
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Box sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            bgcolor: '#F7F3EA',
                            borderRadius: '8px',
                            border: '1px solid rgba(27,27,24,0.05)',
                            boxShadow: 'none'
                          }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#CC785C', mb: 1, fontFamily: '"IBM Plex Mono", monospace' }}>
                              {Math.round(recordHistory.reduce((acc, r) => acc + r.duration, 0) / 60)}m
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                              Total Practice Time
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Progress Chart */}
                <Grid item xs={12} md={8}>
                  <Card sx={{ height: '100%', bgcolor: '#EDE6D6', borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.03)' }}>
                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18', mb: 3 }}>
                        Progress Over Time
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <ProgressChart recordHistory={recordHistory} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Recent Performance */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%', bgcolor: '#EDE6D6', borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.03)' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18', mb: 3 }}>
                        Recent Practice Sessions
                      </Typography>
                      {recordHistory.slice(0, 5).map((record, index) => (
                        <Box key={record.id} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          py: 2,
                          borderBottom: '1px solid rgba(27,27,24,0.06)'
                        }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>
                              Session {recordHistory.length - index}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6B6B63', fontFamily: '"IBM Plex Mono", monospace' }}>
                              {formatDate(record.timestamp)}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${record.score}%`}
                            size="small"
                            sx={{
                              bgcolor: getScoreColor(record.score),
                              color: 'white',
                              fontWeight: 600,
                              fontFamily: '"IBM Plex Mono", monospace',
                              borderRadius: '4px'
                            }}
                          />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Overall Analysis Suggestions */}
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: '#EDE6D6', borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.03)' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <BarChart sx={{ color: '#CC785C', fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                          Overall Analysis & Suggestions
                        </Typography>
                      </Box>
                      
                      {(() => {
                        const avgScore = Math.round(recordHistory.reduce((acc, r) => acc + r.score, 0) / recordHistory.length);
                        const bestScore = Math.max(...recordHistory.map(r => r.score));
                        
                        return (
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 705, color: '#1B1B18', mb: 2, fontFamily: '"Inter", sans-serif', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TrackChanges sx={{ fontSize: 20, color: '#CC785C' }} /> Performance Summary:
                              </Typography>
                              <List dense sx={{ pl: 1 }}>
                                <ListItem sx={{ py: 0.5, pl: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={`Average score: ${avgScore}% across ${recordHistory.length} sessions`}
                                    primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                                  />
                                </ListItem>
                                <ListItem sx={{ py: 0.5, pl: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={`Best performance: ${bestScore}% - shows your potential`}
                                    primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                                  />
                                </ListItem>
                                <ListItem sx={{ py: 0.5, pl: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={`Total practice time: ${Math.round(recordHistory.reduce((acc, r) => acc + r.duration, 0) / 60)} minutes`}
                                    primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                                  />
                                </ListItem>
                              </List>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 705, color: '#1B1B18', mb: 2, fontFamily: '"Inter", sans-serif', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Lightbulb sx={{ fontSize: 20, color: '#CC785C' }} /> Key Recommendations:
                              </Typography>
                              <List dense sx={{ pl: 1 }}>
                                {avgScore >= 85 ? (
                                  <>
                                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 20 }}>
                                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Excellent work! Maintain consistency with daily practice"
                                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 20 }}>
                                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Challenge yourself with complex vocabulary"
                                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                                      />
                                    </ListItem>
                                  </>
                                ) : avgScore >= 70 ? (
                                  <>
                                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 20 }}>
                                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Good progress! Focus on consistency"
                                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 20 }}>
                                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Work on clear articulation of consonants"
                                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                                      />
                                    </ListItem>
                                  </>
                                ) : (
                                  <>
                                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 20 }}>
                                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Focus on basic pronunciation fundamentals"
                                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                                      />
                                    </ListItem>
                                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 20 }}>
                                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary="Practice with shorter words first"
                                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                                      />
                                    </ListItem>
                                  </>
                                )}
                              </List>
                            </Grid>
                          </Grid>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Card sx={{ bgcolor: '#EDE6D6', borderRadius: '12px', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.03)' }}>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <Assessment sx={{ fontSize: 64, color: '#6B6B63', mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B1B18', mb: 1 }}>
                    No Practice Data Yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B6B63', mb: 3 }}>
                    Start practicing to see your performance analysis
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setCurrentTab(1)}
                    sx={{ bgcolor: '#CC785C', color: 'white', '&:hover': { bgcolor: '#b8674d' }, borderRadius: '8px' }}
                  >
                    Start Practicing
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* Error Alert - Only show in Practice tab */}
        {error && currentTab === 1 && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', border: '1px solid rgba(224, 87, 74, 0.2)' }}>
            {error}
          </Alert>
        )}

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

      {/* Side Navigation Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: '#EDE6D6' }
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(27,27,24,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: '#CC785C', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.3rem', fontFamily: 'Georgia, serif' }}>
                S
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: '#1B1B18', fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                Speakify AI
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif' }}>
                {dashboardData?.user?.username || 'User'}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <List sx={{ p: 2 }}>
          {[
            { icon: <Home />, label: 'Home', index: 0 },
            { icon: <Mic />, label: 'Practice', index: 1 },
            { icon: <Quiz />, label: 'Test', index: 2 },
            { icon: <GraphicEq />, label: 'Record History', index: 3 },
            { icon: <Assessment />, label: 'Analysis', index: 4 },
          ].map((item) => (
            <ListItem key={item.index} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  setCurrentTab(item.index);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: '8px',
                  bgcolor: currentTab === item.index ? '#CC785C' : 'transparent',
                  color: currentTab === item.index ? 'white' : '#1B1B18',
                  '&:hover': {
                    bgcolor: currentTab === item.index ? '#CC785C' : 'rgba(27,27,24,0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: currentTab === item.index ? 'white' : '#6B6B63',
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ style: { fontFamily: '"Inter", sans-serif', fontWeight: currentTab === item.index ? 600 : 500 } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(27,27,24,0.06)' }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '8px',
                color: '#E0574A',
                '&:hover': { bgcolor: 'rgba(224, 87, 74, 0.05)' }
              }}
            >
              <ListItemIcon sx={{ color: '#E0574A', minWidth: 40 }}>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Sign Out" primaryTypographyProps={{ style: { fontFamily: '"Inter", sans-serif', fontWeight: 600 } }} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Drawer>

      {/* Floating Chatbot */}
      <Chatbot onNavigate={setCurrentTab} />
    </Box>
  );
};

export default UserDashboard;


