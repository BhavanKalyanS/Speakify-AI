import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Rating,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Mic,
  PlayArrow,
  Speed,
  Psychology,
  TrendingUp,
  Headset,
  AutoAwesome,
  LocalFireDepartment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import WaveformScoreRing from './WaveformScoreRing';

const LandingPage = () => {
  const navigate = useNavigate();
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedCount(prev => (prev < 2847 ? prev + 50 : 2847));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'rgba(247, 243, 234, 0.4)', backdropFilter: 'blur(20px)', boxShadow: 'none', borderBottom: '1px solid rgba(27,27,24,0.06)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => navigate('/login')}
              sx={{ color: '#6B6B63', fontSize: '0.95rem', fontWeight: 500, '&:hover': { bgcolor: 'rgba(27,27,24,0.04)' } }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: '#CC785C',
                color: 'white',
                borderRadius: '8px',
                padding: '6px 18px',
                '&:hover': { bgcolor: '#b8674d' }
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                icon={<AutoAwesome sx={{ color: '#CC785C !important' }} />}
                label="Professional Pronunciation Platform"
                sx={{
                  bgcolor: '#EDE6D6',
                  color: '#CC785C',
                  fontWeight: 600,
                  mb: 3,
                  border: '1px solid rgba(204, 120, 92, 0.25)',
                  fontFamily: '"Inter", sans-serif'
                }}
              />

              <Typography variant="h1" sx={{
                fontFamily: 'Georgia, serif',
                fontWeight: 700,
                color: '#1B1B18',
                mb: 3,
                fontSize: { xs: '2.8rem', md: '4.2rem' },
                lineHeight: 1.15,
              }}>
                Speak clearly.<br />Hear the difference.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Rating value={4.9} precision={0.1} readOnly size="medium"
                  sx={{ '& .MuiRating-iconFilled': { color: '#CC785C' } }}
                />
                <Typography sx={{ color: '#6B6B63', fontWeight: 500, fontSize: '1rem', fontFamily: '"Inter", sans-serif' }}>
                  4.9 out of 5 ({animatedCount.toLocaleString()} reviews)
                </Typography>
              </Box>

              <Typography variant="h5" sx={{
                color: '#6B6B63',
                mb: 4,
                lineHeight: 1.6,
                fontWeight: 400,
                fontSize: '1.25rem',
                fontFamily: '"Inter", sans-serif',
                maxWidth: '90%'
              }}>
                Transform your speaking skills with thoughtful AI coaching. Join over 50,000 students and professionals who have refined their pronunciation using tailored feedback.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: '#CC785C',
                    color: 'white',
                    py: 1.6,
                    px: 4.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    '&:hover': { bgcolor: '#b8674d' },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Start speaking
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  sx={{
                    borderColor: 'rgba(27,27,24,0.15)',
                    color: '#1B1B18',
                    py: 1.6,
                    px: 3.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    '&:hover': {
                      borderColor: '#CC785C',
                      bgcolor: 'rgba(204,120,92,0.05)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Watch Demo
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card sx={{
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 10px 40px rgba(27,27,24,0.05)',
                overflow: 'hidden'
              }}>
                <Box sx={{ bgcolor: '#CC785C', p: 2.5, color: 'white', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Headset sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: '"Inter", sans-serif', fontSize: '0.8rem' }}>
                    Live Audio Assessment Demo
                  </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  {/* Practice Sentence */}
                  <Typography variant="caption" sx={{ color: '#6B6B63', display: 'block', mb: 1, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                    Target Sentence
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#1B1B18', fontSize: '1.15rem', mb: 3.5, lineHeight: 1.4 }}>
                    "Reliability is the key to speech coaching."
                  </Typography>

                  {/* Audio Waveform visualization */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="caption" sx={{ color: '#6B6B63', display: 'block', mb: 1.5, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                      Voice Waveform Analysis
                    </Typography>
                    <Box sx={{
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      px: 2,
                      bgcolor: '#F7F3EA',
                      borderRadius: '8px',
                      border: '1px solid rgba(27,27,24,0.04)',
                      justifyContent: 'center'
                    }}>
                      {[15, 25, 45, 20, 35, 60, 50, 80, 40, 25, 65, 30, 45, 20, 50, 15].map((h, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: '4px',
                            height: `${h}%`,
                            bgcolor: '#CC785C',
                            borderRadius: '2px',
                            opacity: 0.85,
                            animation: `soundwave 1.5s infinite ease-in-out ${i * 0.1}s`
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Score comparison with vertical bar ring score motif */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <WaveformScoreRing score={58} size={110} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B6B63', textTransform: 'uppercase', mt: 1, fontSize: '0.75rem' }}>
                        First Attempt
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <WaveformScoreRing score={92} size={110} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#CC785C', textTransform: 'uppercase', mt: 1, fontSize: '0.75rem' }}>
                        After Practice
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3.5, p: 2, bgcolor: '#F7F3EA', borderRadius: '8px', border: '1px solid rgba(204,120,92,0.15)', textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#CC785C', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, letterSpacing: '0.5px' }}>
                      <LocalFireDepartment sx={{ fontSize: '1rem', color: '#CC785C' }} /> CLARITY IMPROVED BY +34%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Styles for Waveform animation */}
              <style>
                {`
                  @keyframes soundwave {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(0.4); }
                  }
                `}
              </style>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255, 255, 255, 0.4)', borderBottom: '1px solid rgba(255, 255, 255, 0.4)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace', mb: 0.5 }}>50K+</Typography>
              <Typography sx={{ color: '#6B6B63', fontSize: '0.95rem', fontWeight: 500 }}>Active Learners</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace', mb: 0.5 }}>85%</Typography>
              <Typography sx={{ color: '#6B6B63', fontSize: '0.95rem', fontWeight: 500 }}>Improvement Rate</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace', mb: 0.5 }}>30+</Typography>
              <Typography sx={{ color: '#6B6B63', fontSize: '0.95rem', fontWeight: 500 }}>Languages Supported</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#CC785C', fontFamily: '"IBM Plex Mono", monospace', mb: 0.5 }}>4.9★</Typography>
              <Typography sx={{ color: '#6B6B63', fontSize: '0.95rem', fontWeight: 500 }}>User Rating</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontFamily: 'Georgia, serif',
            color: '#1B1B18',
            mb: 1.5
          }}>
            Designed for Thoughtful Practice
          </Typography>
          <Typography sx={{
            textAlign: 'center',
            color: '#6B6B63',
            mb: 7,
            fontSize: '1.15rem',
            fontFamily: '"Inter", sans-serif'
          }}>
            A precision dashboard mapping your pronunciation journey
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: <Mic sx={{ fontSize: 32, color: '#CC785C' }} />,
                title: "Precision Recording",
                desc: "Capture pristine audio recordings. Built-in waveform monitoring highlights your vocal properties during practice."
              },
              {
                icon: <Psychology sx={{ fontSize: 32, color: '#CC785C' }} />,
                title: "Deep AI Analysis",
                desc: "Our model processes physical features of your voice (MFCCs and energy maps) to check your exact clarity metrics."
              },
              {
                icon: <Speed sx={{ fontSize: 32, color: '#CC785C' }} />,
                title: "Fluency & Pace Feedback",
                desc: "Receive actionable scoring breakdown on Clarity, Pace, and Fluency side-by-side inside your session records."
              },
              {
                icon: <TrendingUp sx={{ fontSize: 32, color: '#CC785C' }} />,
                title: "Visual Progress Trends",
                desc: "Check historical improvements with clean data curves charting your score timeline and practice stats."
              }
            ].map((feat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{
                  height: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(27,27,24,0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(204,120,92,0.1)'
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{
                      width: 56,
                      height: 56,
                      bgcolor: '#F7F3EA',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5
                    }}>
                      {feat.icon}
                    </Box>
                    <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700, fontFamily: 'Georgia, serif', color: '#1B1B18' }}>
                      {feat.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B63', fontSize: '0.925rem', lineHeight: 1.5 }}>
                      {feat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" sx={{
          textAlign: 'center',
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
          color: '#1B1B18',
          mb: 1.5
        }}>
          Learner Testimonials
        </Typography>
        <Typography sx={{
          textAlign: 'center',
          color: '#6B6B63',
          mb: 6,
          fontSize: '1.1rem'
        }}>
          Real feedback from professionals refining their accent
        </Typography>

        <Grid container spacing={4}>
          {[
            { name: "Maria Santos", role: "IELTS Student", letter: "M", text: "Speakify AI transformed my pronunciation completely! I went from 6.5 to 8.5 in IELTS speaking. The circular waveform scores make it so clear to track my progress." },
            { name: "James Liu", role: "Language Instructor", letter: "J", text: "As a language teacher, I'm amazed by the precision. I recommend Speakify AI to all my students. It provides consistent, objective, 24/7 coaching feedback." },
            { name: "Ahmed Khan", role: "Consultant", letter: "A", text: "Perfect for preparing business presentations. My confidence skyrocketed after focusing on the clarity coaching cards. A clean, premium experience." }
          ].map((testi, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{
                p: 4,
                bgcolor: '#EDE6D6',
                borderRadius: '12px',
                boxShadow: 'none',
                border: '1px solid rgba(27,27,24,0.03)',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3.5 }}>
                  <Avatar sx={{ bgcolor: '#CC785C', mr: 2, width: 44, height: 44, color: 'white', fontFamily: 'Georgia, serif', fontWeight: 'bold' }}>
                    {testi.letter}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#1B1B18', fontSize: '1.05rem', fontFamily: '"Inter", sans-serif' }}>{testi.name}</Typography>
                    <Typography sx={{ color: '#6B6B63', fontSize: '0.85rem' }}>{testi.role}</Typography>
                  </Box>
                </Box>
                <Typography sx={{ color: '#1B1B18', fontStyle: 'italic', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  "{testi.text}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{
        bgcolor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        py: 10,
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.4)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.4)'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{
            color: '#1B1B18',
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            mb: 3
          }}>
            Ready to refine your speech?
          </Typography>
          <Typography variant="h6" sx={{
            color: '#6B6B63',
            mb: 4,
            lineHeight: 1.6,
            maxWidth: '80%',
            mx: 'auto'
          }}>
            Start speaking now and see real-time waveform results mapping clarity, fluency, and timing.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: '#CC785C',
              color: 'white',
              py: 1.8,
              px: 6,
              fontSize: '1.15rem',
              fontWeight: 600,
              borderRadius: '12px',
              '&:hover': { bgcolor: '#b8674d' },
              transition: 'all 0.3s ease'
            }}
          >
            Start speaking
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1B1B18', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 3 }}>
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
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                Speakify AI
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#EDE6D6', mb: 2, opacity: 0.7 }}>
              The world's most advanced AI pronunciation coach
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B6B63' }}>
              © 2026 Speakify AI. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
