import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  ExpandMore,
  Psychology,
  VolumeUp,
  Visibility,
  Close,
  PlayArrow,
  RecordVoiceOver,
  School,
  Lightbulb,
  GraphicEq,
  TipsAndUpdates
} from '@mui/icons-material';

const SmartFeedbackAgent = ({ feedback, targetText }) => {
  const [selectedPhoneme, setSelectedPhoneme] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showVisualAid, setShowVisualAid] = useState(false);

  // Mock phonetic analysis data
  const phoneticAnalysis = {
    phonemes: [
      { symbol: '/θ/', word: 'think', difficulty: 'high', score: 65, position: 'initial' },
      { symbol: '/ð/', word: 'the', difficulty: 'medium', score: 78, position: 'initial' },
      { symbol: '/r/', word: 'pronunciation', difficulty: 'high', score: 72, position: 'medial' }
    ],
    commonErrors: [
      { error: 'th-sound substitution', frequency: 'high', impact: 'clarity' },
      { error: 'r-sound approximation', frequency: 'medium', impact: 'accent' }
    ]
  };

  const correctionStrategies = {
    '/θ/': {
      techniques: [
        'Place tongue tip between teeth',
        'Blow air gently through tongue and teeth',
        'Practice with mirror for visual feedback'
      ],
      exercises: [
        'Repeat: think, thank, three, through',
        'Tongue twisters: "Thirty-three thick trees"',
        'Minimal pairs: think/sink, thank/tank'
      ],
      difficulty: 'The /θ/ sound is challenging because it doesn\'t exist in many languages'
    },
    '/r/': {
      techniques: [
        'Curl tongue tip slightly back',
        'Keep tongue sides touching upper molars',
        'Voice the sound with throat vibration'
      ],
      exercises: [
        'Practice: red, right, around, pronunciation',
        'R-blends: brown, green, practice, problem',
        'Sentence: "The red car runs around the corner"'
      ],
      difficulty: 'English /r/ requires specific tongue positioning not found in many languages'
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'high': return '#E0574A';
      case 'medium': return '#CC785C';
      case 'low': return '#4CAF50';
      default: return '#6B6B63';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#CC785C';
    if (score >= 60) return '#6B6B63';
    return '#E0574A';
  };

  const PhoneticVisualAid = ({ phoneme }) => (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h3" sx={{ mb: 2, color: '#CC785C', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
        {phoneme}
      </Typography>
      <Box sx={{ 
        width: 200, 
        height: 150, 
        bgcolor: '#F7F3EA', 
        borderRadius: '8px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mx: 'auto',
        mb: 2,
        border: '1px solid rgba(27,27,24,0.06)'
      }}>
        <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif' }}>
          Mouth Position Diagram
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: '#6B6B63', fontFamily: '"Inter", sans-serif' }}>
        Visual representation of tongue and lip position
      </Typography>
    </Box>
  );

  return (
    <Card sx={{ mt: 3, borderRadius: '12px', bgcolor: '#EDE6D6', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.03)', overflow: 'hidden' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Agent Header */}
        <Box sx={{ 
          bgcolor: '#CC785C',
          color: 'white',
          p: 3.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
            <Psychology sx={{ fontSize: 28, color: 'white' }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}>
              Smart Feedback Agent
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: '"Inter", sans-serif' }}>
              Advanced phonetic analysis and personalized correction strategies
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Tabs */}
          <Tabs 
            value={activeTab} 
            onChange={(e, v) => setActiveTab(v)} 
            sx={{ 
              mb: 3,
              '& .MuiTabs-indicator': {
                bgcolor: '#CC785C',
              },
              '& .MuiTab-root': {
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                color: '#6B6B63',
                '&.Mui-selected': {
                  color: '#CC785C',
                }
              }
            }}
          >
            <Tab icon={<GraphicEq />} label="Phonetic Analysis" />
            <Tab icon={<TipsAndUpdates />} label="Correction Strategies" />
            <Tab icon={<School />} label="Practice Exercises" />
          </Tabs>

          {/* Phonetic Analysis Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#1B1B18', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
                Detailed Phonetic Breakdown
              </Typography>
              
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {phoneticAnalysis.phonemes.map((phoneme, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: '#F7F3EA',
                        boxShadow: 'none',
                        borderRadius: '8px',
                        border: selectedPhoneme === phoneme.symbol ? '2px solid #CC785C' : '1px solid rgba(27,27,24,0.06)',
                        '&:hover': { bgcolor: '#f4efe4' }
                      }}
                      onClick={() => setSelectedPhoneme(phoneme.symbol)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h5" sx={{ color: '#CC785C', mb: 1, fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
                          {phoneme.symbol}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1.5, color: '#1B1B18', fontFamily: '"Inter", sans-serif' }}>
                          in "{phoneme.word}"
                        </Typography>
                        <Chip 
                          label={phoneme.difficulty} 
                          size="small"
                          sx={{ 
                            bgcolor: getDifficultyColor(phoneme.difficulty),
                            color: 'white',
                            mb: 2,
                            fontWeight: 600,
                            fontFamily: '"Inter", sans-serif',
                            textTransform: 'uppercase',
                            fontSize: '0.65rem'
                          }}
                        />
                        <LinearProgress
                          variant="determinate"
                          value={phoneme.score}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(27,27,24,0.06)',
                            '& .MuiLinearProgress-bar': { 
                              bgcolor: getScoreColor(phoneme.score) 
                            }
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#6B6B63', display: 'block', mt: 1, fontFamily: '"IBM Plex Mono", monospace' }}>
                          {phoneme.score}% accuracy
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Common Errors */}
              <Accordion sx={{ bgcolor: '#F7F3EA', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.06)', borderRadius: '8px !important' }}>
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#1B1B18' }} />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Georgia, serif', color: '#1B1B18' }}>
                    Common Error Patterns Detected
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <List>
                    {phoneticAnalysis.commonErrors.map((error, index) => (
                      <ListItem key={index} sx={{ borderBottom: index < phoneticAnalysis.commonErrors.length - 1 ? '1px solid rgba(27,27,24,0.04)' : 'none' }}>
                        <ListItemIcon>
                          <Chip 
                            label={error.frequency} 
                            size="small"
                            sx={{ 
                              bgcolor: error.frequency === 'high' ? '#E0574A' : '#CC785C',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.7rem'
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={error.error}
                          secondary={`Impact on ${error.impact}`}
                          primaryTypographyProps={{ style: { fontFamily: '"Inter", sans-serif', fontWeight: 600, color: '#1B1B18' } }}
                          secondaryTypographyProps={{ style: { fontFamily: '"Inter", sans-serif', color: '#6B6B63' } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

          {/* Correction Strategies Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#1B1B18', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
                Personalized Correction Strategies
              </Typography>
              
              {Object.entries(correctionStrategies).map(([phoneme, strategy]) => (
                <Accordion key={phoneme} sx={{ mb: 2, bgcolor: '#F7F3EA', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.06)', borderRadius: '8px !important' }}>
                  <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#1B1B18' }} />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h5" sx={{ color: '#CC785C', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
                        {phoneme}
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhoneme(phoneme);
                          setShowVisualAid(true);
                        }}
                        sx={{ color: '#CC785C', textTransform: 'none', fontWeight: 600 }}
                      >
                        Visual Aid
                      </Button>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#1B1B18', fontFamily: '"Inter", sans-serif', fontWeight: 700 }}>
                          Why This Sound Is Difficult:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: '#6B6B63', fontFamily: '"Inter", sans-serif', lineHeight: 1.6 }}>
                          {strategy.difficulty}
                        </Typography>
                        
                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#1B1B18', fontFamily: '"Inter", sans-serif', fontWeight: 700 }}>
                          Correction Techniques:
                        </Typography>
                        <List dense>
                          {strategy.techniques.map((technique, index) => (
                            <ListItem key={index} sx={{ pl: 0 }}>
                              <ListItemIcon sx={{ minWidth: 28 }}>
                                <Lightbulb sx={{ fontSize: 16, color: '#CC785C' }} />
                              </ListItemIcon>
                              <ListItemText primary={technique} primaryTypographyProps={{ style: { fontFamily: '"Inter", sans-serif', color: '#1B1B18' } }} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#1B1B18', fontFamily: '"Inter", sans-serif', fontWeight: 700 }}>
                          Practice Exercises:
                        </Typography>
                        <List dense>
                          {strategy.exercises.map((exercise, index) => (
                            <ListItem key={index} sx={{ pl: 0 }}>
                              <ListItemIcon sx={{ minWidth: 28 }}>
                                <RecordVoiceOver sx={{ fontSize: 16, color: '#CC785C' }} />
                              </ListItemIcon>
                              <ListItemText primary={exercise} primaryTypographyProps={{ style: { fontFamily: '"Inter", sans-serif', color: '#1B1B18' } }} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {/* Practice Exercises Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#1B1B18', fontFamily: 'Georgia, serif', fontWeight: 700 }}>
                Targeted Practice Exercises
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: '#F7F3EA', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.06)', borderRadius: '8px' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                        🎯 Focus Areas for Today
                      </Typography>
                      <List dense>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <PlayArrow sx={{ color: '#CC785C' }} />
                          </ListItemIcon>
                          <ListItemText primary="Practice /θ/ sound in 'think, thank, three'" primaryTypographyProps={{ style: { fontFamily: '"Inter", sans-serif', color: '#1B1B18' } }} />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <PlayArrow sx={{ color: '#CC785C' }} />
                          </ListItemIcon>
                          <ListItemText primary="Work on /r/ pronunciation in 'pronunciation'" primaryTypographyProps={{ style: { fontFamily: '"Inter", sans-serif', color: '#1B1B18' } }} />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: '#F7F3EA', boxShadow: 'none', border: '1px solid rgba(27,27,24,0.06)', borderRadius: '8px' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontFamily: 'Georgia, serif', fontWeight: 700, color: '#1B1B18' }}>
                        📈 Recommended Next Steps
                      </Typography>
                      <List dense>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <VolumeUp sx={{ color: '#CC785C' }} />
                          </ListItemIcon>
                          <ListItemText primary="Record yourself saying tongue twisters" primaryTypographyProps={{ style: { fontFamily: '"Inter", sans-serif', color: '#1B1B18' } }} />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <VolumeUp sx={{ color: '#CC785C' }} />
                          </ListItemIcon>
                          <ListItemText primary="Practice with minimal pairs exercises" primaryTypographyProps={{ style: { fontFamily: '"Inter", sans-serif', color: '#1B1B18' } }} />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        {/* Visual Aid Dialog */}
        <Dialog 
          open={showVisualAid} 
          onClose={() => setShowVisualAid(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { bgcolor: '#EDE6D6', borderRadius: '12px', p: 1 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(27,27,24,0.06)' }}>
            <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.25rem', color: '#1B1B18' }}>Pronunciation Guide</Typography>
            <IconButton onClick={() => setShowVisualAid(false)} sx={{ color: '#1B1B18' }}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <PhoneticVisualAid phoneme={selectedPhoneme} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SmartFeedbackAgent;
