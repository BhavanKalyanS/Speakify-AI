import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  TrendingDown,
  Remove,
  PlayArrow,
  School,
  EmojiEvents,
  Lightbulb
} from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';

const PronunciationCoach = ({ onExerciseSelect }) => {
  const [coachData, setCoachData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoachData();
  }, []);

  const fetchCoachData = async () => {
    try {
      const response = await axiosInstance.get('/coach/analysis');
      setCoachData(response.data);
    } catch (err) {
      setError('Failed to load coaching data');
    } finally {
      setLoading(false);
    }
  };

  const getSkillColor = (level) => {
    switch (level) {
      case 'advanced': return '#10B981';
      case 'intermediate': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUp sx={{ color: '#10B981' }} />;
      case 'declining': return <TrendingDown sx={{ color: '#EF4444' }} />;
      default: return <Remove sx={{ color: '#6B7280' }} />;
    }
  };

  if (loading) return <LinearProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!coachData) return null;

  return (
    <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{
          bgcolor: 'linear-gradient(135deg, #10A37F 0%, #0F766E 100%)',
          background: 'linear-gradient(135deg, #10A37F 0%, #0F766E 100%)',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Psychology sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              🎯 Your Pronunciation Coach
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Personalized coaching based on your practice patterns
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Skill Level & Progress */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: '#F0F8FF', border: '1px solid #BEE3F8', textAlign: 'center' }}>
                <CardContent sx={{ p: 2 }}>
                  <EmojiEvents sx={{ fontSize: 32, color: getSkillColor(coachData.skill_level), mb: 1 }} />
                  <Typography variant="h6" sx={{ color: getSkillColor(coachData.skill_level), textTransform: 'capitalize' }}>
                    {coachData.skill_level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Level
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: '#F0FFF4', border: '1px solid #C6F6D5', textAlign: 'center' }}>
                <CardContent sx={{ p: 2 }}>
                  {getTrendIcon(coachData.progress_trend)}
                  <Typography variant="h6" sx={{ color: '#2D3748', textTransform: 'capitalize', mt: 1 }}>
                    {coachData.progress_trend}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Progress Trend
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Coaching Tips */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2D3748' }}>
              💡 Coaching Tips
            </Typography>
            <List dense>
              {coachData.tips.map((tip, index) => (
                <ListItem key={index} sx={{ bgcolor: '#F7FAFC', borderRadius: 2, mb: 1 }}>
                  <ListItemIcon>
                    <Lightbulb sx={{ color: '#10A37F' }} />
                  </ListItemIcon>
                  <ListItemText primary={tip} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Personalized Exercises */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#2D3748' }}>
              📚 Recommended Exercises
            </Typography>
            <Grid container spacing={2}>
              {coachData.exercises.map((exercise, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card sx={{ 
                    border: '1px solid #E2E8F0',
                    '&:hover': { boxShadow: 2, cursor: 'pointer' }
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label={exercise.focus} 
                          size="small" 
                          sx={{ bgcolor: '#10A37F', color: 'white' }}
                        />
                        <Chip 
                          label={exercise.difficulty} 
                          size="small" 
                          color={exercise.difficulty === 'easy' ? 'success' : 'warning'}
                        />
                      </Box>
                      <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                        "{exercise.text}"
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => onExerciseSelect && onExerciseSelect(exercise.text)}
                        sx={{ color: '#10A37F' }}
                      >
                        Practice This
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Difficulty Areas */}
          {coachData.patterns.difficulty_areas.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2D3748' }}>
                🎯 Focus Areas
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {coachData.patterns.difficulty_areas.map((area, index) => (
                  <Chip
                    key={index}
                    label={area.replace('_', ' ').toUpperCase()}
                    sx={{ 
                      bgcolor: 'rgba(239, 68, 68, 0.08)', 
                      color: '#E53E3E',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PronunciationCoach;


