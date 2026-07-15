import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Grid
} from '@mui/material';
import { Close, Psychology, PlayArrow } from '@mui/icons-material';
import SmartFeedbackAgent from './SmartFeedbackAgent';

const SmartAgentDemo = ({ open, onClose }) => {
  const [showDemo, setShowDemo] = useState(false);

  // Mock feedback data for demo
  const demoFeedback = {
    score: 78,
    feedback: "Good pronunciation overall. Focus on the 'th' sounds and 'r' pronunciation for improvement.",
    details: {
      metrics: {
        clarity_score: 0.82,
        fluency_score: 0.75,
        pace_score: 0.80
      }
    },
    processing_time: "2.3",
    confidence: 0.87
  };

  const demoText = "I think the weather is getting better for pronunciation practice";

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: '#10A37F',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Psychology sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600}>
            Smart Feedback Agent Demo
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        {!showDemo ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#2D3748' }}>
              Experience Advanced AI Pronunciation Analysis
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: 'rgba(16, 163, 127, 0.08)', border: '1px solid rgba(16, 163, 127, 0.2)', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#10A37F' }}>
                      🔍 Phonetic Analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Detailed breakdown of individual sounds and phonemes in your speech
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: '#F0FFF4', border: '1px solid #C6F6D5', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#10B981' }}>
                      🎯 Correction Strategies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Personalized techniques and exercises for pronunciation improvement
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: '#F0F8FF', border: '1px solid #BEE3F8', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#3182CE' }}>
                      👁️ Visual Aids
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mouth position diagrams and visual pronunciation guides
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#E53E3E' }}>
                      📚 Practice Exercises
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Targeted exercises and tongue twisters for specific sounds
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ 
              bgcolor: '#F7FAFC', 
              border: '1px solid #E2E8F0', 
              borderRadius: 2, 
              p: 3, 
              mb: 4 
            }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Demo Sentence:
              </Typography>
              <Typography variant="h6" sx={{ 
                color: '#2D3748', 
                fontStyle: 'italic',
                bgcolor: 'white',
                p: 2,
                borderRadius: 1,
                border: '1px solid #E2E8F0'
              }}>
                "{demoText}"
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={() => setShowDemo(true)}
              sx={{
                bgcolor: '#10A37F',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: '25px'
              }}
            >
              Start Demo Analysis
            </Button>
          </Box>
        ) : (
          <Box>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Chip 
                label="Demo Mode" 
                sx={{ 
                  bgcolor: '#10A37F', 
                  color: 'white',
                  fontWeight: 600,
                  mb: 2
                }} 
              />
              <Typography variant="body1" color="text.secondary">
                Analyzing: "{demoText}"
              </Typography>
            </Box>
            
            <SmartFeedbackAgent 
              feedback={demoFeedback} 
              targetText={demoText}
            />
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setShowDemo(false)}
                sx={{ mr: 2, color: '#6B7280', borderColor: '#6B7280' }}
              >
                Back to Overview
              </Button>
              <Button
                variant="contained"
                onClick={onClose}
                sx={{ bgcolor: '#10A37F' }}
              >
                Try It Yourself
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SmartAgentDemo;


