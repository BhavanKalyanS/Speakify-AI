import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Stack,
  Paper,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  Mic,
  Assessment,
  Star,
  CheckCircle,
  Speed,
  VolumeUp,
  Timeline,
  Timer,
  FlashOn,
  TrackChanges,
  GraphicEq,
  Psychology,
  Biotech,
  Assignment,
  Lightbulb,
  BarChart,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, targetText } = location.state || {};

  if (!result) {
    navigate('/dashboard');
    return null;
  }

  const score = result.score <= 1 ? result.score * 100 : result.score;
  const details = result.details || {};
  const metrics = details.metrics || {};

  const getQualityLevel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const clarity = Math.round((metrics.clarity_score || score/100) * 100);
  const fluency = Math.round((metrics.fluency_score || score/100) * 100);
  const pace = Math.round((metrics.pace_score || 0.7) * 100);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F7F3EA', fontFamily: '"Inter", sans-serif' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#EDE6D6',
        color: '#1B1B18',
        py: 2.5,
        borderBottom: '1px solid rgba(27,27,24,0.05)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/dashboard')}
              sx={{ 
                color: '#6B6B63',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: 'rgba(27,27,24,0.04)' }
              }}
            >
              Back to Dashboard
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 700, flex: 1, fontFamily: 'Georgia, serif' }}>
              Pronunciation Analysis Results
            </Typography>
            <Chip
              icon={<Star sx={{ color: '#CC785C !important' }} />}
              label="AI Powered"
              sx={{
                bgcolor: '#F7F3EA',
                color: '#CC785C',
                fontWeight: 600,
                border: '1px solid rgba(204,120,92,0.15)'
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Score Hero Section */}
        <Paper sx={{ 
          mb: 4, 
          borderRadius: '12px', 
          overflow: 'hidden',
          bgcolor: '#EDE6D6',
          boxShadow: 'none',
          border: '1px solid rgba(27,27,24,0.03)',
          p: 4,
          textAlign: 'center'
        }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'rgba(204,120,92,0.08)',
            border: '1px solid rgba(204,120,92,0.15)',
            mx: 'auto',
            mb: 2
          }}>
            <TrackChanges sx={{ fontSize: 40, color: '#CC785C' }} />
          </Avatar>
          
          <Typography variant="h1" sx={{ 
            fontFamily: 'Georgia, serif',
            fontWeight: 700, 
            fontSize: '5rem',
            color: '#1B1B18',
            mb: 1,
            lineHeight: 1
          }}>
            {Math.round(score)}%
          </Typography>
          
          <Typography variant="h4" sx={{ 
            fontFamily: 'Georgia, serif',
            fontWeight: 600, 
            color: '#CC785C',
            mb: 2
          }}>
            {getQualityLevel(score)}
          </Typography>
          
          <Chip
            icon={<CheckCircle sx={{ color: '#CC785C !important' }} />}
            label={`${details.confidence || 'High'} Confidence`}
            sx={{
              bgcolor: '#F7F3EA',
              color: '#1B1B18',
              fontWeight: 600,
              px: 3,
              py: 0.5
            }}
          />

          {targetText && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ color: '#6B6B63', mb: 1.5, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Practice Text
              </Typography>
              <Paper sx={{ 
                p: 3, 
                bgcolor: '#F7F3EA',
                borderRadius: '8px',
                boxShadow: 'none',
                border: '1px dashed rgba(27,27,24,0.12)',
                textAlign: 'center'
              }}>
                <Typography variant="h5" sx={{ 
                  color: '#1B1B18', 
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  lineHeight: 1.5
                }}>
                  "{targetText}"
                </Typography>
              </Paper>
            </Box>
          )}
        </Paper>

        <Grid container spacing={4}>
          {/* Performance Metrics & Quick Stats */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Performance Metrics Card */}
              <Card sx={{ bgcolor: '#EDE6D6', borderRadius: '12px', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'rgba(204,120,92,0.08)', width: 48, height: 48 }}>
                      <Assessment sx={{ color: '#CC785C' }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                      Performance
                    </Typography>
                  </Box>
                  
                  <Stack spacing={4}>
                    {[
                      {
                        label: 'Clarity',
                        value: clarity,
                        color: '#CC785C',
                        icon: <VolumeUp sx={{ color: '#CC785C' }} />,
                        description: 'How clear your speech sounds'
                      },
                      {
                        label: 'Fluency',
                        value: fluency,
                        color: '#CC785C',
                        icon: <Timeline sx={{ color: '#CC785C' }} />,
                        description: 'Smoothness of speech flow'
                      },
                      {
                        label: 'Pace',
                        value: pace,
                        color: '#CC785C',
                        icon: <Speed sx={{ color: '#CC785C' }} />,
                        description: 'Speaking speed and rhythm'
                      }
                    ].map((metric, index) => (
                      <Paper key={index} sx={{ p: 3, bgcolor: '#F7F3EA', borderRadius: '8px', border: '1px solid rgba(27,27,24,0.06)', boxShadow: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(204,120,92,0.05)', border: '1px solid rgba(204,120,92,0.1)' }}>
                            {metric.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>
                              {metric.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif' }}>
                              {metric.description}
                            </Typography>
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace' }}>
                            {metric.value}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={metric.value}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(27,27,24,0.06)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#CC785C',
                              borderRadius: 3
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="caption" sx={{ color: '#6B6B63', fontSize: '0.7rem' }}>Poor</Typography>
                          <Typography variant="caption" sx={{ color: '#6B6B63', fontSize: '0.7rem' }}>Excellent</Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Quick Stats Card */}
              <Card sx={{ bgcolor: '#EDE6D6', borderRadius: '12px', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18', mb: 2 }}>
                    Quick Stats
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6B6B63' }}>Recording Quality</Typography>
                      <Chip 
                        label={details.confidence || 'High'} 
                        size="small" 
                        sx={{ bgcolor: '#F7F3EA', color: '#CC785C', fontWeight: 600, border: '1px solid rgba(204,120,92,0.1)' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6B6B63' }}>Speech Duration</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace' }}>
                        {result.audio_info?.duration || 0}s
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6B6B63' }}>Analysis Time</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"IBM Plex Mono", monospace' }}>
                        {result.processing_time || 0}s
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* AI Feedback & Strategy Details */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              height: '100%', 
              bgcolor: '#EDE6D6',
              borderRadius: '12px',
              border: '1px solid rgba(27,27,24,0.03)',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'rgba(204,120,92,0.08)', width: 48, height: 48 }}>
                    <Psychology sx={{ color: '#CC785C' }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                    AI Analysis
                  </Typography>
                </Box>
                
                {/* Main Feedback */}
                <Paper sx={{ p: 3, mb: 3, bgcolor: '#F7F3EA', borderRadius: '8px', border: '1px solid rgba(27,27,24,0.05)', boxShadow: 'none' }}>
                  <Typography variant="body1" sx={{ 
                    color: '#1B1B18', 
                    lineHeight: 1.7,
                    fontSize: '1rem',
                    whiteSpace: 'pre-line'
                  }}>
                    {result.feedback}
                  </Typography>
                </Paper>

                {/* Phonetic Analysis */}
                {details.phonetic_analysis && (
                  <Paper sx={{ 
                    p: 3, 
                    mb: 3, 
                    bgcolor: '#F7F3EA',
                    borderRadius: '8px',
                    border: '1px solid rgba(27,27,24,0.05)',
                    boxShadow: 'none'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(204,120,92,0.08)' }}>
                        <Biotech sx={{ fontSize: 18, color: '#CC785C' }} />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 705, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>
                        Phonetic Analysis
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: '#1B1B18', mb: 2, lineHeight: 1.6 }}>
                      {details.phonetic_analysis.analysis}
                    </Typography>
                    
                    {details.phonetic_analysis.phonetic_issues && details.phonetic_analysis.phonetic_issues.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#CC785C', fontWeight: 700, mb: 1 }}>
                          Areas for Improvement:
                        </Typography>
                        <Stack spacing={0.5}>
                          {details.phonetic_analysis.phonetic_issues.map((issue, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#E0574A' }} />
                              <Typography variant="body2" sx={{ color: '#1B1B18' }}>
                                {issue}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Paper>
                )}

                {/* Practice Plan */}
                {details.correction_strategies && (
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: '#F7F3EA',
                    borderRadius: '8px',
                    border: '1px solid rgba(27,27,24,0.05)',
                    boxShadow: 'none'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(204,120,92,0.08)' }}>
                        <Assignment sx={{ fontSize: 18, color: '#CC785C' }} />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 705, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>
                        Personalized Practice Plan
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={3}>
                      {details.correction_strategies.immediate_focus && details.correction_strategies.immediate_focus.length > 0 && (
                        <Grid item xs={12} md={6}>
                           <Typography variant="subtitle2" sx={{ color: '#CC785C', fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                             <TrackChanges sx={{ fontSize: 16 }} /> Focus Now:
                           </Typography>
                          <Stack spacing={0.5}>
                            {details.correction_strategies.immediate_focus.slice(0, 3).map((focus, idx) => (
                              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#CC785C', mt: 0.7, flexShrink: 0 }} />
                                <Typography variant="body2" sx={{ color: '#1B1B18', lineHeight: 1.5 }}>
                                  {focus}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Grid>
                      )}
                      
                      {details.correction_strategies.practice_exercises && details.correction_strategies.practice_exercises.length > 0 && (
                        <Grid item xs={12} md={6}>
                           <Typography variant="subtitle2" sx={{ color: '#CC785C', fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                             <Mic sx={{ fontSize: 16 }} /> Practice Exercises:
                           </Typography>
                          <Stack spacing={0.5}>
                            {details.correction_strategies.practice_exercises.slice(0, 3).map((exercise, idx) => (
                              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#CC785C', mt: 0.7, flexShrink: 0 }} />
                                <Typography variant="body2" sx={{ color: '#1B1B18', lineHeight: 1.5 }}>
                                  {exercise}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                )}

                {/* Improvement Suggestions */}
                {details.suggestions && details.suggestions.length > 0 && (
                  <Paper sx={{ 
                    p: 3, 
                    mt: 3,
                    bgcolor: '#F7F3EA',
                    borderRadius: '8px',
                    border: '1px solid rgba(27,27,24,0.05)',
                    boxShadow: 'none'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(204,120,92,0.08)' }}>
                        <Lightbulb sx={{ fontSize: 18, color: '#CC785C' }} />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 705, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>
                        Quick Tips
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      {details.suggestions.slice(0, 4).map((suggestion, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <Box sx={{ 
                              width: 20, 
                              height: 20, 
                              borderRadius: '50%', 
                              bgcolor: '#CC785C',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              flexShrink: 0,
                              mt: 0.2
                            }}>
                              {index + 1}
                            </Box>
                            <Typography variant="body2" sx={{ color: '#1B1B18', lineHeight: 1.5 }}>
                              {suggestion}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recording Stats */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: '#EDE6D6', borderRadius: '12px', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <BarChart sx={{ color: '#CC785C', fontSize: 28 }} />
                  <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                    Recording Statistics
                  </Typography>
                </Box>
                
                <Grid container spacing={4}>
                  {[
                    {
                      label: 'Duration',
                      value: `${result.audio_info?.duration || 0}s`,
                      color: '#CC785C',
                      icon: <Timer sx={{ fontSize: 40, color: '#CC785C' }} />
                    },
                    {
                      label: 'Processing Time',
                      value: `${result.processing_time || 0}s`,
                      color: '#CC785C',
                      icon: <FlashOn sx={{ fontSize: 40, color: '#CC785C' }} />
                    },
                    {
                      label: 'Confidence Level',
                      value: details.confidence || 'High',
                      color: '#CC785C',
                      icon: <TrackChanges sx={{ fontSize: 40, color: '#CC785C' }} />
                    },
                    {
                      label: 'Sample Rate',
                      value: `${result.audio_info?.sample_rate || 22050} Hz`,
                      color: '#CC785C',
                      icon: <GraphicEq sx={{ fontSize: 40, color: '#CC785C' }} />
                    }
                  ].map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        bgcolor: '#F7F3EA',
                        borderRadius: '8px',
                        border: '1px solid rgba(27,27,24,0.05)',
                        boxShadow: 'none'
                      }}>
                        <Box sx={{ mb: 1 }}>
                          {stat.icon}
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color, mb: 1, fontFamily: '"IBM Plex Mono", monospace' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B6B63', fontWeight: 600 }}>
                          {stat.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 3, 
          mt: 6,
          pb: 4
        }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Mic />}
            onClick={() => {
              navigate('/dashboard');
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('setTab', { detail: 1 }));
              }, 100);
            }}
            sx={{ 
              color: '#1B1B18', 
              borderColor: 'rgba(27,27,24,0.15)',
              px: 6,
              py: 2,
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#CC785C',
                bgcolor: 'rgba(204,120,92,0.05)'
              }
            }}
          >
            Practice Again
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<Assessment />}
            onClick={() => {
              navigate('/dashboard');
              setTimeout(() => {
                window.dispatchEvent(new CustomEvent('setTab', { detail: 4 }));
              }, 100);
            }}
            sx={{ 
              bgcolor: '#CC785C',
              color: 'white',
              px: 6,
              py: 2,
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#b8674d'
              }
            }}
          >
            View Full Analysis
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ResultsPage;
