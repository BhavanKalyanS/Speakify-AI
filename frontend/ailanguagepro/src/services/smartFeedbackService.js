// Smart Feedback Agent Service
class SmartFeedbackService {
  
  // Analyze phonetic patterns in text
  static analyzePhonetics(text, audioData) {
    const words = text.toLowerCase().split(' ');
    const phonemes = [];
    
    // Mock phonetic analysis - in real implementation, this would use speech recognition API
    words.forEach(word => {
      const phoneticData = this.getPhoneticData(word);
      if (phoneticData) {
        phonemes.push(...phoneticData);
      }
    });
    
    return {
      phonemes: phonemes.slice(0, 5), // Limit to top 5 challenging phonemes
      commonErrors: this.identifyCommonErrors(phonemes),
      difficulty: this.calculateDifficulty(phonemes)
    };
  }
  
  // Get phonetic data for a word
  static getPhoneticData(word) {
    const phoneticMap = {
      'think': [{ symbol: '/θ/', position: 'initial', difficulty: 'high', score: Math.random() * 40 + 60 }],
      'the': [{ symbol: '/ð/', position: 'initial', difficulty: 'medium', score: Math.random() * 30 + 70 }],
      'pronunciation': [
        { symbol: '/r/', position: 'medial', difficulty: 'high', score: Math.random() * 35 + 65 },
        { symbol: '/ʃ/', position: 'medial', difficulty: 'medium', score: Math.random() * 25 + 75 }
      ],
      'three': [{ symbol: '/θ/', position: 'initial', difficulty: 'high', score: Math.random() * 40 + 60 }],
      'weather': [{ symbol: '/ð/', position: 'medial', difficulty: 'medium', score: Math.random() * 30 + 70 }],
      'right': [{ symbol: '/r/', position: 'initial', difficulty: 'high', score: Math.random() * 35 + 65 }],
      'world': [{ symbol: '/r/', position: 'medial', difficulty: 'high', score: Math.random() * 35 + 65 }]
    };
    
    return phoneticMap[word]?.map(p => ({ ...p, word }));
  }
  
  // Identify common error patterns
  static identifyCommonErrors(phonemes) {
    const errorPatterns = [];
    const thSounds = phonemes.filter(p => p.symbol === '/θ/' || p.symbol === '/ð/');
    const rSounds = phonemes.filter(p => p.symbol === '/r/');
    
    if (thSounds.length > 0) {
      errorPatterns.push({
        error: 'th-sound substitution',
        frequency: thSounds.some(s => s.score < 70) ? 'high' : 'medium',
        impact: 'clarity',
        phonemes: thSounds
      });
    }
    
    if (rSounds.length > 0) {
      errorPatterns.push({
        error: 'r-sound approximation',
        frequency: rSounds.some(s => s.score < 75) ? 'high' : 'medium',
        impact: 'accent',
        phonemes: rSounds
      });
    }
    
    return errorPatterns;
  }
  
  // Calculate overall difficulty
  static calculateDifficulty(phonemes) {
    if (phonemes.length === 0) return 'low';
    
    const avgScore = phonemes.reduce((sum, p) => sum + p.score, 0) / phonemes.length;
    const highDiffCount = phonemes.filter(p => p.difficulty === 'high').length;
    
    if (avgScore < 70 || highDiffCount > 2) return 'high';
    if (avgScore < 80 || highDiffCount > 0) return 'medium';
    return 'low';
  }
  
  // Generate correction strategies
  static getCorrectionStrategies(phonemes) {
    const strategies = {};
    
    phonemes.forEach(phoneme => {
      if (!strategies[phoneme.symbol]) {
        strategies[phoneme.symbol] = this.getPhonemeStrategy(phoneme.symbol);
      }
    });
    
    return strategies;
  }
  
  // Get specific strategy for a phoneme
  static getPhonemeStrategy(symbol) {
    const strategyMap = {
      '/θ/': {
        techniques: [
          'Place tongue tip between teeth',
          'Blow air gently through tongue and teeth',
          'Practice with mirror for visual feedback',
          'Start with voiceless /θ/ before voiced /ð/'
        ],
        exercises: [
          'Repeat: think, thank, three, through',
          'Tongue twisters: "Thirty-three thick trees"',
          'Minimal pairs: think/sink, thank/tank',
          'Sentence practice: "I think three things"'
        ],
        difficulty: 'The /θ/ sound is challenging because it doesn\'t exist in many languages. The tongue position between teeth is unfamiliar.',
        tips: [
          'Don\'t substitute with /s/ or /f/ sounds',
          'Feel the air flow over your tongue',
          'Practice slowly before increasing speed'
        ]
      },
      '/ð/': {
        techniques: [
          'Same tongue position as /θ/ but add voice',
          'Feel vibration in throat while saying it',
          'Practice alternating /θ/ and /ð/',
          'Use vocal cords while maintaining tongue position'
        ],
        exercises: [
          'Practice: the, this, that, there',
          'Minimal pairs: thy/thigh, breathe/breath',
          'Common words: mother, father, brother',
          'Sentence: "The weather is getting better"'
        ],
        difficulty: 'The voiced /ð/ requires coordination of tongue position and vocal cord vibration.',
        tips: [
          'Don\'t substitute with /d/ or /z/ sounds',
          'Feel the vibration in your throat',
          'Practice with common words first'
        ]
      },
      '/r/': {
        techniques: [
          'Curl tongue tip slightly back (not touching roof)',
          'Keep tongue sides touching upper molars',
          'Voice the sound with throat vibration',
          'Maintain lip rounding for some contexts'
        ],
        exercises: [
          'Practice: red, right, around, pronunciation',
          'R-blends: brown, green, practice, problem',
          'Final R: car, door, water, better',
          'Sentence: "The red car runs around the corner"'
        ],
        difficulty: 'English /r/ requires specific tongue positioning not found in many languages. It\'s neither rolled nor tapped.',
        tips: [
          'Don\'t roll or tap the tongue',
          'Keep tongue relaxed and curved',
          'Practice in different word positions'
        ]
      }
    };
    
    return strategyMap[symbol] || {
      techniques: ['Focus on clear articulation', 'Practice slowly', 'Use mirror for visual feedback'],
      exercises: ['Repeat the sound in isolation', 'Practice in simple words', 'Use in sentences'],
      difficulty: 'This sound may require focused practice for clear pronunciation.',
      tips: ['Listen to native speakers', 'Record yourself practicing', 'Be patient with progress']
    };
  }
}

export default SmartFeedbackService;


