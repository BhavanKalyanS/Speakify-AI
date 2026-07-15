import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import {
  Quiz,
  CheckCircle,
  Cancel,
  School,
} from '@mui/icons-material';

const basicEnglishQuestions = [
  {
    id: 1,
    question: "How do you pronounce the word 'WATER'?",
    options: ["WAH-ter", "WA-ter", "WAY-ter", "WOT-er"],
    correct: 1,
    type: "basic_words",
    difficulty: "beginner"
  },
  {
    id: 2,
    question: "Which is the correct pronunciation of 'SCHOOL'?",
    options: ["IS-kool", "SKOOL", "ES-kool", "SCHOOL-a"],
    correct: 1,
    type: "consonant_clusters",
    difficulty: "beginner"
  },
  {
    id: 3,
    question: "How do you say 'VEGETABLE'?",
    options: ["VEJ-ta-bul", "VEG-e-ta-bul", "VEJ-i-ta-bul", "VE-ge-table"],
    correct: 0,
    type: "common_words",
    difficulty: "beginner"
  },
  {
    id: 4,
    question: "What is the correct way to say 'COMFORTABLE'?",
    options: ["COM-for-ta-bul", "KUMF-ter-bul", "COM-fort-able", "KUMF-ta-bul"],
    correct: 1,
    type: "difficult_words",
    difficulty: "intermediate"
  },
  {
    id: 5,
    question: "How do you pronounce 'OFTEN'?",
    options: ["OF-ten", "AWF-ten", "OF-fen", "AWF-fen"],
    correct: 1,
    type: "silent_letters",
    difficulty: "beginner"
  },
  {
    id: 6,
    question: "Which is correct for 'SCHEDULE'?",
    options: ["SHED-yool", "SKED-yool", "IS-ked-yool", "SHED-ule"],
    correct: 1,
    type: "british_american",
    difficulty: "intermediate"
  },
  {
    id: 7,
    question: "How do you say 'PIZZA'?",
    options: ["PIZ-za", "PEET-sa", "PIZ-a", "PITS-a"],
    correct: 1,
    type: "foreign_words",
    difficulty: "beginner"
  },
  {
    id: 8,
    question: "What is the correct pronunciation of 'FEBRUARY'?",
    options: ["FEB-ru-ary", "FEB-yoo-ary", "FEB-roo-ary", "FE-bru-ary"],
    correct: 1,
    type: "months",
    difficulty: "intermediate"
  },
  {
    id: 9,
    question: "How do you pronounce 'WEDNESDAY'?",
    options: ["WED-nes-day", "WENZ-day", "WED-nez-day", "WENDS-day"],
    correct: 1,
    type: "days",
    difficulty: "beginner"
  },
  {
    id: 10,
    question: "Which is the correct way to say 'LIBRARY'?",
    options: ["LI-bra-ry", "LIB-rer-y", "LI-ber-ary", "LIB-ra-ry"],
    correct: 1,
    type: "common_places",
    difficulty: "intermediate"
  },
  {
    id: 11,
    question: "How do you pronounce 'COLONEL'?",
    options: ["COL-o-nel", "KER-nel", "CO-lo-nel", "COL-nel"],
    correct: 1,
    type: "irregular_words",
    difficulty: "advanced"
  },
  {
    id: 12,
    question: "What is the correct pronunciation of 'RECEIPT'?",
    options: ["RE-ceipt", "ri-SEET", "RE-sept", "ri-SEPT"],
    correct: 1,
    type: "silent_letters",
    difficulty: "intermediate"
  },
  {
    id: 13,
    question: "How do you say 'CLOTHES'?",
    options: ["CLOTH-es", "KLOHZ", "CLOTH-s", "KLO-thes"],
    correct: 1,
    type: "th_sounds",
    difficulty: "beginner"
  },
  {
    id: 14,
    question: "Which is correct for 'BUSINESS'?",
    options: ["BU-si-ness", "BIZ-nis", "BUS-i-ness", "BI-zi-ness"],
    correct: 1,
    type: "common_words",
    difficulty: "intermediate"
  },
  {
    id: 15,
    question: "How do you pronounce 'KNIFE'?",
    options: ["K-nife", "NYFE", "NI-fe", "KA-nife"],
    correct: 1,
    type: "silent_letters",
    difficulty: "beginner"
  },
  {
    id: 16,
    question: "What is the correct way to say 'ISLAND'?",
    options: ["IS-land", "EYE-land", "I-sland", "AY-land"],
    correct: 1,
    type: "silent_letters",
    difficulty: "beginner"
  },
  {
    id: 17,
    question: "How do you pronounce 'QUEUE'?",
    options: ["KWEY-ue", "KYOO", "KWE-ue", "KWAY"],
    correct: 1,
    type: "foreign_words",
    difficulty: "intermediate"
  },
  {
    id: 18,
    question: "Which is correct for 'DAUGHTER'?",
    options: ["DAU-gh-ter", "DAW-ter", "DA-ugh-ter", "DOFF-ter"],
    correct: 1,
    type: "silent_letters",
    difficulty: "beginner"
  },
  {
    id: 19,
    question: "How do you say 'PSYCHOLOGY'?",
    options: ["P-sy-chol-o-gy", "sy-KOL-o-jee", "PSY-chol-o-gy", "si-KOL-o-gy"],
    correct: 1,
    type: "silent_letters",
    difficulty: "advanced"
  },
  {
    id: 20,
    question: "What is the correct pronunciation of 'ANSWER'?",
    options: ["AN-swer", "AN-ser", "ANS-wer", "AAN-swer"],
    correct: 1,
    type: "silent_letters",
    difficulty: "beginner"
  }
];

const TestComponent = ({ onSuggestTest }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const handleAnswerChange = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < basicEnglishQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    basicEnglishQuestions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / basicEnglishQuestions.length) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getRecommendation = (score) => {
    if (score >= 80) {
      return {
        level: "Advanced",
        message: "Excellent! You have a strong foundation in English pronunciation basics.",
        suggestions: [
          "Focus on advanced pronunciation techniques",
          "Practice with complex vocabulary",
          "Work on natural speech patterns"
        ]
      };
    } else if (score >= 60) {
      return {
        level: "Intermediate",
        message: "Good foundation! Some areas need improvement.",
        suggestions: [
          "Review stress patterns in multi-syllable words",
          "Practice phonetic symbols",
          "Focus on vowel sounds"
        ]
      };
    } else {
      return {
        level: "Beginner",
        message: "Basic concepts need strengthening. Regular practice recommended.",
        suggestions: [
          "Start with basic phonetic awareness",
          "Practice simple word pronunciation",
          "Learn fundamental stress patterns",
          "Take pronunciation courses"
        ]
      };
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTestStarted(true);
  };

  if (!testStarted) {
    return (
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#2D3748', mb: 4 }}>
          Basic English Pronunciation Test
        </Typography>
        
        <Card>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Quiz sx={{ fontSize: 80, color: '#10A37F', mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2D3748', mb: 2 }}>
              Test Your Pronunciation Knowledge
            </Typography>
            <Typography variant="body1" sx={{ color: '#718096', mb: 4, maxWidth: 600, mx: 'auto' }}>
              This test evaluates your understanding of basic English pronunciation concepts including 
              stress patterns, phonetics, syllables, and sound recognition. It takes about 5-10 minutes to complete.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10A37F' }}>
                    20
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#718096' }}>
                    Questions
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10B981' }}>
                    10-15
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#718096' }}>
                    Minutes
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              size="large"
              onClick={() => setTestStarted(true)}
              sx={{
                bgcolor: '#10A37F',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Start Test
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const recommendation = getRecommendation(score);
    
    return (
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#2D3748', mb: 4 }}>
          Test Results
        </Typography>
        
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ 
              bgcolor: getScoreColor(score),
              color: 'white',
              p: 3,
              borderRadius: 2,
              mb: 3
            }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                {score}%
              </Typography>
              <Typography variant="h6">
                {recommendation.level} Level
              </Typography>
            </Box>
            
            <Typography variant="h6" sx={{ color: '#2D3748', mb: 2 }}>
              {recommendation.message}
            </Typography>
            
            <LinearProgress
              variant="determinate"
              value={score}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#E2E8F0',
                '& .MuiLinearProgress-bar': { bgcolor: getScoreColor(score) }
              }}
            />
          </CardContent>
        </Card>
        
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3748', mb: 3 }}>
              Recommendations for Improvement:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recommendation.suggestions.map((suggestion, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <School sx={{ color: '#10A37F', fontSize: 20 }} />
                  <Typography variant="body1" sx={{ color: '#4A5568' }}>
                    {suggestion}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
        
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={restartTest}
            sx={{ bgcolor: '#10A37F', mr: 2 }}
          >
            Retake Test
          </Button>
          <Button
            variant="outlined"
            onClick={() => setTestStarted(false)}
            sx={{ borderColor: '#10A37F', color: '#10A37F' }}
          >
            Back to Start
          </Button>
        </Box>
      </Box>
    );
  }

  const question = basicEnglishQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / basicEnglishQuestions.length) * 100;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#2D3748', mb: 4 }}>
        Basic English Pronunciation Test
      </Typography>
      
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#718096' }}>
                Question {currentQuestion + 1} of {basicEnglishQuestions.length}
              </Typography>
              <Chip 
                label={question.type.replace('_', ' ')} 
                size="small" 
                sx={{ bgcolor: 'rgba(16, 163, 127, 0.08)', color: '#10A37F' }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: '#E2E8F0',
                '& .MuiLinearProgress-bar': { bgcolor: '#10A37F' }
              }}
            />
          </Box>
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3748', mb: 3 }}>
            {question.question}
          </Typography>
          
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio sx={{ color: '#10A37F', '&.Mui-checked': { color: '#10A37F' } }} />}
                  label={option}
                  sx={{
                    mb: 1,
                    p: 2,
                    border: '1px solid #E2E8F0',
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#F7FAFC' }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              sx={{ borderColor: '#10A37F', color: '#10A37F' }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={answers[question.id] === undefined}
              sx={{ bgcolor: '#10A37F' }}
            >
              {currentQuestion === basicEnglishQuestions.length - 1 ? 'Finish Test' : 'Next'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestComponent;


