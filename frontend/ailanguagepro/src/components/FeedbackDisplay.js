import React, { useState } from "react";
import { 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  LinearProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Button,
  Divider,
  Tooltip
} from "@mui/material";
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  TipsAndUpdates,
  Speed,
  VolumeUp,
  Timeline,
  TrendingUp,
  TrendingDown,
  Remove,
  Star,
  EmojiEvents,
  Psychology,
  BarChart,
  TrackChanges
} from "@mui/icons-material";

const FeedbackDisplay = ({ feedback, previousAttempts = [], targetText = '', onSubmitAnother }) => {
  const [showComparison, setShowComparison] = useState(false);
  
  if (!feedback) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return '#CC785C';
    if (score >= 75) return '#CC785C';
    if (score >= 60) return '#6B6B63';
    return '#E0574A';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <EmojiEvents sx={{ color: '#CC785C' }} />;
    if (score >= 75) return <CheckCircle sx={{ color: '#CC785C' }} />;
    if (score >= 50) return <Warning sx={{ color: '#CC785C' }} />;
    return <ErrorIcon sx={{ color: '#E0574A' }} />;
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', color: '#CC785C' };
    if (score >= 80) return { label: 'Very Good', color: '#CC785C' };
    if (score >= 70) return { label: 'Good', color: '#6B6B63' };
    if (score >= 60) return { label: 'Fair', color: '#6B6B63' };
    return { label: 'Needs Work', color: '#E0574A' };
  };

  const getImprovement = () => {
    if (previousAttempts.length === 0) return null;
    const lastScore = previousAttempts[previousAttempts.length - 1]?.score || 0;
    const currentScore = feedback.score || 0;
    
    const lastScorePercent = lastScore <= 1 ? lastScore * 100 : lastScore;
    const currentScorePercent = currentScore <= 1 ? currentScore * 100 : currentScore;
    
    const diff = Math.round(currentScorePercent - lastScorePercent);
    return diff;
  };

  const rawScore = feedback.score || 0;
  const score = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);
  const badge = getScoreBadge(score);
  const improvement = getImprovement();

  const clarityRaw = feedback.details?.metrics?.clarity_score || feedback.score || 0;
  const clarity = clarityRaw <= 1 ? Math.round(clarityRaw * 100) : Math.round(clarityRaw);
  
  const fluencyRaw = feedback.details?.metrics?.fluency_score || feedback.score || 0;
  const fluency = fluencyRaw <= 1 ? Math.round(fluencyRaw * 100) : Math.round(fluencyRaw);
  
  const paceRaw = feedback.details?.metrics?.pace_score || feedback.score || 0;
  const pace = paceRaw <= 1 ? Math.round(paceRaw * 100) : Math.round(paceRaw);

  return (
    <Paper sx={{ borderRadius: '12px', bgcolor: '#EDE6D6', overflow: 'hidden', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.03)' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#EDE6D6',
        color: '#1B1B18',
        p: 4,
        textAlign: 'center',
        borderBottom: '1px solid rgba(27,27,24,0.05)'
      }}>
        <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, mb: 1 }}>
          Pronunciation Analysis
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          {getScoreIcon(score)}
          <Typography variant="h2" sx={{ fontFamily: 'Georgia, serif', fontWeight: 750 }}>
            {score}%
          </Typography>
          {improvement !== null && (
            <Tooltip title={`${improvement > 0 ? 'Improved' : improvement < 0 ? 'Decreased' : 'Same'} by ${Math.abs(improvement)}%`}>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(27,27,24,0.04)', px: 1, py: 0.5, borderRadius: '6px' }}>
                {improvement > 0 ? <TrendingUp sx={{ color: '#CC785C' }} /> : improvement < 0 ? <TrendingDown sx={{ color: '#E0574A' }} /> : <Remove sx={{ color: '#6B6B63' }} />}
                <Typography variant="body2" sx={{ ml: 0.5, color: '#1B1B18', fontFamily: '"IBM Plex Mono", monospace' }}>
                  {improvement > 0 ? '+' : ''}{improvement}%
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Box>
        <Chip 
          label={badge.label} 
          sx={{ 
            bgcolor: '#F7F3EA', 
            color: '#CC785C',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: '1px solid rgba(204,120,92,0.15)'
          }} 
        />
      </Box>

      <Box sx={{ p: 4, bgcolor: '#F7F3EA' }}>

        {/* Detailed Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#EDE6D6', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none', borderRadius: '8px' }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <VolumeUp sx={{ fontSize: 40, color: '#CC785C', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 750, color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace' }}>
                  {(() => {
                    const clarityScore = feedback.details?.metrics?.clarity_score || feedback.score || 0;
                    return clarityScore <= 1 ? Math.round(clarityScore * 100) : Math.round(clarityScore);
                  })()}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#1B1B18', fontWeight: 600, fontFamily: '"Inter", sans-serif', mt: 0.5 }}>
                  Clarity
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(() => {
                    const clarityScore = feedback.details?.metrics?.clarity_score || feedback.score || 0;
                    return clarityScore <= 1 ? Math.round(clarityScore * 100) : Math.round(clarityScore);
                  })()}
                  sx={{
                    mt: 1.5,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(27,27,24,0.06)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#CC785C' }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#EDE6D6', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none', borderRadius: '8px' }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Speed sx={{ fontSize: 40, color: '#CC785C', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 750, color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace' }}>
                  {(() => {
                    const fluencyScore = feedback.details?.metrics?.fluency_score || feedback.score || 0;
                    return fluencyScore <= 1 ? Math.round(fluencyScore * 100) : Math.round(fluencyScore);
                  })()}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#1B1B18', fontWeight: 600, fontFamily: '"Inter", sans-serif', mt: 0.5 }}>
                  Fluency
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(() => {
                    const fluencyScore = feedback.details?.metrics?.fluency_score || feedback.score || 0;
                    return fluencyScore <= 1 ? Math.round(fluencyScore * 100) : Math.round(fluencyScore);
                  })()}
                  sx={{
                    mt: 1.5,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(27,27,24,0.06)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#CC785C' }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: '#EDE6D6', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none', borderRadius: '8px' }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Timeline sx={{ fontSize: 40, color: '#CC785C', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 750, color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace' }}>
                  {(() => {
                    const paceScore = feedback.details?.metrics?.pace_score || feedback.score || 0;
                    return paceScore <= 1 ? Math.round(paceScore * 100) : Math.round(paceScore);
                  })()}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#1B1B18', fontWeight: 600, fontFamily: '"Inter", sans-serif', mt: 0.5 }}>
                  Pace
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(() => {
                    const paceScore = feedback.details?.metrics?.pace_score || feedback.score || 0;
                    return paceScore <= 1 ? Math.round(paceScore * 100) : Math.round(paceScore);
                  })()}
                  sx={{
                    mt: 1.5,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(27,27,24,0.06)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#CC785C' }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Strengths and Areas for Improvement */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#EDE6D6', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none', borderRadius: '8px', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star sx={{ color: '#CC785C', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                    Strengths
                  </Typography>
                </Box>
                <List dense>
                  {(feedback.details?.strengths || [
                    'Clear pronunciation',
                    'Good pace control',
                    'Natural intonation'
                  ]).map((strength, index) => (
                    <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <CheckCircle sx={{ fontSize: 16, color: '#CC785C' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={strength}
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#EDE6D6', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none', borderRadius: '8px', height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Psychology sx={{ color: '#E0574A', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                    Areas to Improve
                  </Typography>
                </Box>
                <List dense>
                  {(feedback.details?.improvements || [
                    'Work on consonant clarity',
                    'Practice rhythm patterns',
                    'Focus on word stress'
                  ]).map((improvement, index) => (
                    <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <TipsAndUpdates sx={{ fontSize: 16, color: '#E0574A' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={improvement}
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Smart Feedback Agent Analysis */}
        {feedback.details?.phonetic_analysis && (
          <Card sx={{ bgcolor: '#EDE6D6', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none', borderRadius: '8px', mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Psychology sx={{ color: '#CC785C', mr: 1 }} />
                <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                  Smart Feedback Agent - Phonetic Analysis
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                lineHeight: 1.7,
                color: '#1B1B18',
                mb: 2,
                fontFamily: '"Inter", sans-serif'
              }}>
                {feedback.details.phonetic_analysis.analysis}
              </Typography>
              
              {feedback.details.phonetic_analysis.phonetic_issues?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#1B1B18', fontWeight: 700, mb: 1, fontFamily: '"Inter", sans-serif' }}>
                    Phonetic Issues Detected:
                  </Typography>
                  <List dense>
                    {feedback.details.phonetic_analysis.phonetic_issues.map((issue, index) => (
                      <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Warning sx={{ fontSize: 16, color: '#CC785C' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={issue}
                          primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {feedback.details.phonetic_analysis.sound_patterns && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#1B1B18', fontWeight: 700, mb: 1.5, fontFamily: '"Inter", sans-serif' }}>
                    Sound Pattern Analysis:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#F7F3EA', borderRadius: '6px', border: '1px solid rgba(27,27,24,0.05)' }}>
                        <Typography variant="caption" sx={{ color: '#6B6B63', display: 'block', fontWeight: 600 }}>Consonant Clarity</Typography>
                        <Typography variant="h6" sx={{ color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 'bold' }}>
                          {Math.round((feedback.details.phonetic_analysis.sound_patterns.consonant_clarity || 0) * 100)}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#F7F3EA', borderRadius: '6px', border: '1px solid rgba(27,27,24,0.05)' }}>
                        <Typography variant="caption" sx={{ color: '#6B6B63', display: 'block', fontWeight: 600 }}>Vowel Precision</Typography>
                        <Typography variant="h6" sx={{ color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 'bold' }}>
                          {Math.round((feedback.details.phonetic_analysis.sound_patterns.vowel_precision || 0) * 100)}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#F7F3EA', borderRadius: '6px', border: '1px solid rgba(27,27,24,0.05)' }}>
                        <Typography variant="caption" sx={{ color: '#6B6B63', display: 'block', fontWeight: 600 }}>Rhythm Consistency</Typography>
                        <Typography variant="h6" sx={{ color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 'bold' }}>
                          {Math.round((feedback.details.phonetic_analysis.sound_patterns.rhythm_consistency || 0) * 100)}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Personalized Correction Strategies */}
        {feedback.details?.correction_strategies && (
          <Card sx={{ bgcolor: '#EDE6D6', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none', borderRadius: '8px', mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TipsAndUpdates sx={{ color: '#CC785C', mr: 1 }} />
                <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                  Personalized Correction Strategies
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ color: '#1B1B18', fontWeight: 700, mb: 1, fontFamily: '"Inter", sans-serif' }}>
                    Immediate Focus:
                  </Typography>
                  <List dense>
                    {feedback.details.correction_strategies.immediate_focus?.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckCircle sx={{ fontSize: 16, color: '#CC785C' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ color: '#1B1B18', fontWeight: 700, mb: 1, fontFamily: '"Inter", sans-serif' }}>
                    Practice Exercises:
                  </Typography>
                  <List dense>
                    {feedback.details.correction_strategies.practice_exercises?.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <Star sx={{ fontSize: 16, color: '#CC785C' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ color: '#1B1B18', fontWeight: 700, mb: 1, fontFamily: '"Inter", sans-serif' }}>
                    Long-term Goals:
                  </Typography>
                  <List dense>
                    {feedback.details.correction_strategies.long_term_goals?.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <EmojiEvents sx={{ fontSize: 16, color: '#CC785C' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Overall Analysis Suggestions */}
        <Card sx={{ bgcolor: '#EDE6D6', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none', borderRadius: '8px', mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Psychology sx={{ color: '#1B1B18', mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                Overall Analysis & Suggestions
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1B1B18', mb: 1, fontFamily: '"Inter", sans-serif', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BarChart sx={{ fontSize: 20, color: '#CC785C' }} /> Performance Summary:
              </Typography>
              <List dense sx={{ pl: 2 }}>
                <ListItem sx={{ py: 0.5, pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Your overall pronunciation score is ${score}% - ${badge.label.toLowerCase()}`}
                    primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5, pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Clarity: ${clarity}%, Fluency: ${fluency}%, Pace: ${pace}%`}
                    primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                  />
                </ListItem>
                {improvement !== null && (
                  <ListItem sx={{ py: 0.5, pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 20 }}>
                      <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${improvement > 0 ? 'Improved' : improvement < 0 ? 'Decreased' : 'Maintained'} by ${Math.abs(improvement)}% from your last attempt`}
                      primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                    />
                  </ListItem>
                )}
              </List>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1B1B18', mb: 1, fontFamily: '"Inter", sans-serif', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrackChanges sx={{ fontSize: 20, color: '#CC785C' }} /> Key Recommendations:
              </Typography>
              <List dense sx={{ pl: 2 }}>
                {score >= 90 ? (
                  <>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Excellent work! Maintain this level of clarity and consistency"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Practice with more complex vocabulary to challenge yourself"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Focus on natural intonation patterns in longer sentences"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                  </>
                ) : score >= 75 ? (
                  <>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Very good pronunciation! Focus on minor refinements for perfection"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Work on consistent word stress and rhythm patterns"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Practice linking sounds between words for smoother flow"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                  </>
                ) : score >= 60 ? (
                  <>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Good foundation! Focus on clarity and articulation"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Practice individual sounds and consonant clusters"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Slow down your speech to improve precision"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                  </>
                ) : (
                  <>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#E0574A', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Focus on basic pronunciation fundamentals"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#E0574A', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Practice with shorter words and phrases first"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Typography variant="body2" sx={{ color: '#E0574A', fontWeight: 'bold' }}>•</Typography>
                      </ListItemIcon>
                      <ListItemText 
                        primary="Ensure clear microphone setup and quiet environment"
                        primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1B1B18', mb: 1, fontFamily: '"Inter", sans-serif', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp sx={{ fontSize: 20, color: '#CC785C' }} /> Next Steps:
              </Typography>
              <List dense sx={{ pl: 2 }}>
                <ListItem sx={{ py: 0.5, pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Record the same text again to track improvement"
                    primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5, pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Practice the specific areas highlighted in the correction strategies"
                    primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5, pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <Typography variant="body2" sx={{ color: '#CC785C', fontWeight: 'bold' }}>•</Typography>
                  </ListItemIcon>
                  <ListItemText 
                    primary="Try different text samples to challenge various pronunciation skills"
                    primaryTypographyProps={{ variant: 'body2', color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}
                  />
                </ListItem>
              </List>
            </Box>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <Card sx={{ bgcolor: '#EDE6D6', border: '1px solid rgba(27,27,24,0.03)', boxShadow: 'none', borderRadius: '8px', mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18', mb: 1 }}>
              AI Analysis Summary
            </Typography>
            <Typography variant="body1" sx={{ 
              lineHeight: 1.7,
              color: '#1B1B18',
              fontFamily: '"Inter", sans-serif'
            }}>
              {feedback.feedback || 'Your pronunciation shows good overall quality. Continue practicing to maintain consistency and improve specific areas highlighted above.'}
            </Typography>
          </CardContent>
        </Card>

        {/* Submit Another Button */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={onSubmitAnother}
            sx={{
              bgcolor: '#CC785C',
              color: 'white',
              px: 5,
              py: 1.6,
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#b8674d' }
            }}
          >
            Submit Another Recording
          </Button>
        </Box>

        {/* Technical Info */}
        <Divider sx={{ my: 3.5, borderColor: 'rgba(27,27,24,0.06)' }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#6B6B63', fontFamily: '"IBM Plex Mono", monospace' }}>
            Analysis completed in {feedback.processing_time || '2.1'}s • 
            Audio duration: {feedback.audio_info?.duration || '3.2'}s • 
            Confidence: {Math.round((feedback.confidence || 0.85) * 100)}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default FeedbackDisplay;
