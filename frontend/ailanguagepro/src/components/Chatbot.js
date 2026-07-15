import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import smartNavigation from '../services/smartNavigationService';
import { findBestResponse } from '../services/knowledgeBase';
import contextAwareness from '../services/contextAwarenessService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  Fab,
  Collapse,
  Chip,
  Avatar,
  Fade,
  Slide,
} from '@mui/material';
import {
  Chat,
  Close,
  Send,
  SmartToy,
  SupportAgent,
  Navigation,
  Psychology,
  AutoAwesome,
} from '@mui/icons-material';

const parseEmojis = (text) => {
  if (!text) return '';
  const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|\u2600-\u26FF)/g;
  
  const parts = text.split(emojiRegex);
  return parts.map((part, index) => {
    if (part.match(emojiRegex)) {
      return <span key={index} className="mono-emoji">{part}</span>;
    }
    return part;
  });
};

const Chatbot = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatbot_messages');
    const savedUserName = localStorage.getItem('chatbot_username');
    
    if (saved) {
      return JSON.parse(saved);
    } else {
      // Use context-aware greeting for new users
      const greeting = savedUserName ? 
        contextAwareness.getContextualGreeting(savedUserName) :
        contextAwareness.getContextualGreeting();
      
      return [
        {
          type: 'bot',
          message: greeting,
          timestamp: new Date().toISOString()
        }
      ];
    }
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('chatbot_username') || '';
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages and username to localStorage
  useEffect(() => {
    localStorage.setItem('chatbot_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatbot_username', userName);
  }, [userName]);

  const quickActions = [
    { text: 'Go to Practice', icon: '🎤' },
    { text: 'How to record?', icon: '📱' },
    { text: 'Improve scores', icon: '📈' },
    { text: 'Audio issues', icon: '🔧' },
    { text: 'App features', icon: '✨' },
    { text: 'Go to Analysis', icon: '📊' },
    { text: 'Pronunciation tips', icon: '📚' },
    { text: 'Scoring system', icon: '🏆' }
  ];

  const getResponse = (message) => {
    const msg = message.toLowerCase();
    
    // Check if user is introducing themselves
    if (msg.includes('my name is') || msg.includes('i am') || msg.includes('i\'m') || 
        msg.includes('name is') || msg.includes('call me') || msg.includes('i\'m called')) {
      let nameMatch = message.match(/(?:my name is|i am|i\'m|name is|call me|i\'m called)\s+([a-zA-Z]+)/i);
      if (!nameMatch) nameMatch = message.match(/^([a-zA-Z]+)$/);
      
      if (nameMatch) {
        const name = nameMatch[1];
        setUserName(name);
        return `Nice to meet you, ${name}! 😊 I'm your AI pronunciation assistant. How can I help you improve your English pronunciation today?`;
      }
    }
    
    if (msg.match(/^[a-zA-Z]+$/) && msg.length > 1 && msg.length < 20) {
      const name = message.charAt(0).toUpperCase() + message.slice(1).toLowerCase();
      setUserName(name);
      return `Nice to meet you, ${name}! 😊 I'm your AI pronunciation assistant. How can I help you improve your English pronunciation today?`;
    }
    
    const greeting = userName ? `${userName}, ` : '';
    
    // Comprehensive FAQ Database
    const faqDatabase = {
      // Account & Authentication
      'create account': `🔐 ${greeting}to create an account:\n\n1️⃣ Click "Register" on the login page\n2️⃣ Enter your email and password\n3️⃣ Fill in your profile details\n4️⃣ Verify your email (if required)\n5️⃣ Start practicing!\n\n✨ Say "go to register" to get started!`,
      'forgot password': `🔑 ${greeting}to reset your password:\n\n1️⃣ Click "Forgot Password" on login\n2️⃣ Enter your email address\n3️⃣ Check your email for reset link\n4️⃣ Follow the instructions\n\n📧 Check spam folder if you don't see it!`,
      'login issues': `🚪 ${greeting}login troubleshooting:\n\n✅ Check email/password spelling\n🔄 Clear browser cache\n🌐 Try incognito mode\n📧 Verify email is confirmed\n🔑 Use password reset if needed\n\n💡 Contact support if issues persist!`,
      
      // Technical Support
      'system requirements': `💻 ${greeting}system requirements:\n\n🌐 Browser: Chrome, Firefox, Safari, Edge\n📱 Device: Desktop, tablet, mobile\n🎤 Microphone: Required for recording\n📶 Internet: Stable connection needed\n💾 Storage: 50MB free space\n🔊 Audio: Speakers/headphones recommended`,
      'browser compatibility': `🌐 ${greeting}supported browsers:\n\n✅ Chrome 80+ (Recommended)\n✅ Firefox 75+\n✅ Safari 13+\n✅ Edge 80+\n\n🚀 For best experience:\n• Enable microphone permissions\n• Allow notifications\n• Update to latest version`,
      'mobile app': `📱 ${greeting}mobile experience:\n\n🌐 Use our web app on mobile browsers\n📱 Works on iOS Safari & Android Chrome\n🎤 Microphone access required\n📊 Full features available\n\n💡 Add to home screen for app-like experience!`,
      
      // Pronunciation & Learning
      'pronunciation tips': `🗣️ ${greeting}pronunciation improvement tips:\n\n🎯 Focus on problem sounds first\n⏰ Practice 15-20 minutes daily\n🔄 Repeat difficult words multiple times\n👂 Listen to native speakers\n📝 Record yourself regularly\n🎵 Use tongue twisters\n📚 Learn phonetic symbols\n🗣️ Practice with friends`,
      'accent training': `🌍 ${greeting}accent training guide:\n\n🎯 Identify your target accent\n👂 Listen to native speakers daily\n🔄 Mimic rhythm and intonation\n📝 Practice stress patterns\n🎵 Work on connected speech\n📚 Study phonetic differences\n🎤 Record and compare regularly`,
      'common mistakes': `⚠️ ${greeting}common pronunciation mistakes:\n\n🔸 Speaking too fast\n🔸 Ignoring word stress\n🔸 Mixing up similar sounds\n🔸 Not practicing regularly\n🔸 Focusing only on individual words\n🔸 Ignoring rhythm and flow\n\n💡 Our AI helps identify these issues!`,
      
      // App Features Deep Dive
      'scoring system': `📊 ${greeting}detailed scoring breakdown:\n\n🌟 90-100%: Native-like fluency\n✅ 80-89%: Very clear speech\n👍 70-79%: Good pronunciation\n📚 60-69%: Needs improvement\n📖 50-59%: Significant work needed\n❌ Below 50%: Major issues\n\n🤖 AI analyzes: accuracy, fluency, rhythm, clarity`,
      'progress tracking': `📈 ${greeting}track your progress:\n\n📊 Daily/weekly score trends\n🎯 Improvement in specific sounds\n⏱️ Practice time statistics\n🏆 Achievement milestones\n📝 Detailed session history\n🔄 Comparison over time\n\n✨ Say "go to analysis" to see your stats!`,
      'practice modes': `🎮 ${greeting}different practice modes:\n\n🎤 Free Recording: Practice any text\n📝 Guided Practice: Suggested sentences\n🏆 Challenges: Daily pronunciation tasks\n📚 Lessons: Structured learning paths\n🎯 Focus Mode: Target specific sounds\n⏱️ Timed Practice: Quick sessions`,
      
      // Troubleshooting Extended
      'audio quality': `🎵 ${greeting}improve audio quality:\n\n🎤 Use external microphone if possible\n🔇 Find quiet environment\n📱 Hold device 6-12 inches away\n🚫 Avoid background noise\n🎧 Use headphones to prevent echo\n🔊 Test audio levels first\n\n💡 Good audio = better scores!`,
      'slow performance': `⚡ ${greeting}speed up the app:\n\n🔄 Refresh the page\n🗑️ Clear browser cache\n📱 Close other tabs/apps\n📶 Check internet speed\n💾 Free up device storage\n🔄 Restart browser\n\n🚀 Try incognito mode for testing!`,
      'data usage': `📊 ${greeting}data usage information:\n\n📱 Audio upload: ~1MB per minute\n💾 App loading: ~5MB initial\n📈 Progress sync: ~100KB\n🔄 Regular usage: ~10MB/hour\n\n💡 Use WiFi for best experience!`,
      
      // Learning Resources
      'phonetic alphabet': `🔤 ${greeting}International Phonetic Alphabet (IPA):\n\n📚 Learn IPA symbols for accuracy\n🎯 Focus on your problem sounds\n📖 Use IPA dictionaries\n🔊 Practice with IPA transcriptions\n\n💡 Our app shows IPA for difficult words!`,
      'practice schedule': `📅 ${greeting}optimal practice schedule:\n\n🌅 Morning: 10-15 minutes daily\n🎯 Focus: One sound per week\n📝 Sessions: 3-5 recordings each\n📊 Review: Check progress weekly\n🏆 Goals: Improve 5% each week\n\n⏰ Consistency beats intensity!`,
      'learning resources': `📚 ${greeting}additional learning resources:\n\n🎥 YouTube pronunciation channels\n📱 Dictionary apps with audio\n🎧 Podcasts for listening practice\n📖 Phonetics textbooks\n🗣️ Language exchange partners\n🎤 Speech therapy apps\n\n🌟 Our AI complements all these tools!`
    };
    
    // First, try context-aware response
    const contextResponse = contextAwareness.getContextualResponse(message, userName);
    if (contextResponse) {
      return contextResponse;
    }
    
    // Then check the comprehensive knowledge base
    const knowledgeResponse = findBestResponse(message, userName);
    if (knowledgeResponse) {
      return knowledgeResponse;
    }
    
    // Check FAQ database for additional responses
    for (const [key, response] of Object.entries(faqDatabase)) {
      if (msg.includes(key) || key.split(' ').every(word => msg.includes(word))) {
        return response;
      }
    }
    
    // Smart Navigation using the navigation service
    const navigationIntent = smartNavigation.parseNavigationIntent(message);
    if (navigationIntent && navigationIntent.confidence > 0.6) {
      const navResponse = smartNavigation.generateNavigationResponse(navigationIntent, userName);
      
      if (onNavigate) {
        onNavigate(navigationIntent.tabIndex);
        smartNavigation.navigateToTab(navigationIntent.tabIndex, message);
        setTimeout(() => setIsOpen(false), 1000);
      }
      
      return navResponse.message;
    }
    
    // Enhanced Help Topics with more comprehensive responses
    const helpTopics = {
      'recording': {
        keywords: ['record', 'audio', 'microphone', 'mic', 'how to record', 'recording process', 'voice recording', 'audio recording'],
        response: `🎤 ${greeting}complete recording guide:\n\n📋 Step-by-step process:\n1️⃣ Click the microphone button\n2️⃣ Allow browser microphone access\n3️⃣ Wait for the "Recording..." indicator\n4️⃣ Speak clearly and naturally\n5️⃣ Click stop when finished\n6️⃣ Review your recording\n7️⃣ Submit for AI analysis\n\n🎯 Pro recording tips:\n• Find a quiet room (no echo)\n• Speak at normal conversational pace\n• Hold device 6-12 inches from mouth\n• Avoid background noise/music\n• Use headphones to prevent feedback\n• Take a breath before starting\n• Speak with confidence\n\n🔧 Troubleshooting:\n• Check microphone permissions\n• Test mic in other apps\n• Try different browser\n• Refresh page if issues\n\n✨ Say "go to practice" and I'll take you there!`
      },
      'low_score': {
        keywords: ['score low', 'bad score', 'poor score', 'low rating', 'why low', 'low marks', 'poor rating', 'bad rating', 'score not good'],
        response: `📊 ${greeting}understanding low scores:\n\n🔍 Common causes:\n🔸 Background noise or echo\n🔸 Speaking too fast or too slow\n🔸 Poor microphone quality\n🔸 Unclear pronunciation\n🔸 Wrong word stress\n🔸 Distance from microphone\n🔸 Nervous or hesitant speech\n🔸 Non-native accent interference\n\n🚀 Immediate improvements:\n• Record in quiet environment\n• Speak slowly and deliberately\n• Check microphone settings\n• Practice shorter sentences first\n• Focus on clear consonants\n• Use proper word stress\n• Relax and speak confidently\n\n📈 Long-term strategies:\n• Daily 15-minute practice\n• Focus on one sound at a time\n• Listen to native speakers\n• Record same text multiple times\n• Use phonetic guides\n\n💪 Remember: Every expert was once a beginner!`
      },
      'improvement': {
        keywords: ['improve', 'better', 'get better', 'tips', 'advice', 'enhancement', 'progress', 'development'],
        response: `🚀 ${greeting}comprehensive improvement plan:\n\n📅 Daily Practice Routine:\n• 15-20 minutes consistent practice\n• Morning sessions for better focus\n• Track progress weekly\n\n🎯 Targeted Practice:\n• Identify your problem sounds\n• Practice minimal pairs (bit/beat)\n• Focus on word stress patterns\n• Work on sentence rhythm\n\n🔄 Effective Techniques:\n• Record same text 3-5 times\n• Listen to your recordings critically\n• Compare with native speakers\n• Use slow-motion playback\n• Practice with tongue twisters\n\n📚 Learning Resources:\n• IPA (phonetic alphabet) study\n• Watch pronunciation videos\n• Use dictionary audio features\n• Join pronunciation groups\n\n🏆 Advanced Tips:\n• Record in different environments\n• Practice connected speech\n• Work on intonation patterns\n• Focus on natural rhythm\n• Use shadowing technique\n\n💡 Remember: Consistency beats perfection!`
      },
      'scores': {
        keywords: ['score mean', 'what scores', 'score meaning', 'rating system', 'scoring system', 'how scores work'],
        response: `📈 ${greeting}detailed scoring system:\n\n🏆 Score Ranges:\n🌟 90-100% = Excellent (Native-like fluency)\n✅ 80-89% = Very Good (Clear & natural)\n👍 70-79% = Good (Easily understandable)\n📚 60-69% = Fair (Some clarity issues)\n📖 50-59% = Needs Work (Difficult to understand)\n❌ Below 50% = Significant Improvement Needed\n\n🤖 AI Analysis Factors:\n• Pronunciation accuracy (40%)\n• Clarity and articulation (25%)\n• Fluency and rhythm (20%)\n• Word stress and intonation (15%)\n\n📊 What Each Score Means:\n• 95%+: Professional level\n• 85%+: Confident communication\n• 75%+: Effective daily conversation\n• 65%+: Basic communication needs\n• Below 65%: Focus on fundamentals\n\n💡 Pro tip: Aim for consistent 75%+ rather than occasional perfect scores!`
      },
      'troubleshooting': {
        keywords: ['not working', 'problem', 'error', 'issue', 'broken', 'fix', 'bug', 'glitch', 'malfunction'],
        response: `🔧 ${greeting}comprehensive troubleshooting guide:\n\n🔄 Quick Fixes (Try First):\n• Refresh page (Ctrl+F5 or Cmd+R)\n• Clear browser cache and cookies\n• Try incognito/private browsing\n• Restart browser completely\n• Check for browser updates\n\n🎤 Microphone Issues:\n• Check browser permissions (click lock icon)\n• Test microphone in other apps\n• Try different browser (Chrome recommended)\n• Check system audio settings\n• Restart audio drivers\n• Try external microphone\n\n🌐 Connection Problems:\n• Test internet speed (need 1+ Mbps)\n• Disable VPN/proxy temporarily\n• Try different network/WiFi\n• Check firewall settings\n• Restart router if needed\n\n💻 Device-Specific:\n• Close unnecessary tabs/apps\n• Free up storage space\n• Update operating system\n• Check antivirus settings\n\n📱 Mobile Issues:\n• Enable microphone in browser settings\n• Try landscape orientation\n• Close background apps\n• Check mobile data/WiFi\n\n🆘 Still stuck? Contact support with:\n• Browser type and version\n• Device type and OS\n• Error message (if any)\n• Steps you've already tried`
      }
    };
    
    for (const [key, topic] of Object.entries(helpTopics)) {
      if (topic.keywords.some(keyword => msg.includes(keyword))) {
        return topic.response;
      }
    }
    

    
    // Extended contextual responses
    const contextualResponses = {
      // Practice and Exercise
      'practice': `📚 ${greeting}comprehensive practice guide:\n\n🎯 Daily Practice Plan:\n• 15-20 minutes daily sessions\n• Start with 5-word sentences\n• Gradually increase complexity\n• Focus on one sound per week\n\n📝 Practice Types:\n• Minimal pairs (ship/sheep)\n• Tongue twisters for fluency\n• News articles for natural speech\n• Poetry for rhythm and stress\n\n🔄 Effective Techniques:\n• Record same text 3-5 times\n• Listen back critically\n• Compare with native speakers\n• Practice in front of mirror\n\n✨ Say "go to practice" to start now!`,
      
      'feedback': `📋 ${greeting}AI feedback breakdown:\n\n🤖 What AI Analyzes:\n• Pronunciation accuracy (phonemes)\n• Word stress patterns\n• Sentence rhythm and flow\n• Clarity and articulation\n• Speaking pace and pauses\n• Overall intelligibility\n\n📊 Feedback Types:\n• Numerical score (0-100%)\n• Specific sound corrections\n• Stress pattern suggestions\n• Pace recommendations\n• Practice exercises\n\n💡 Use feedback to target weak areas!`,
      
      // App Information
      'about': `🌟 ${greeting}Speakify AI - Your Personal Pronunciation Coach!\n\n🎯 What We Do:\n• AI-powered pronunciation assessment\n• Real-time feedback and scoring\n• Progress tracking and analytics\n• Personalized learning paths\n• Professional speech coaching\n\n🚀 Key Features:\n• Advanced ML speech analysis\n• Instant feedback system\n• Multi-device compatibility\n• Progress visualization\n• 24/7 AI assistant (that's me!)\n\n🏆 Perfect for students, professionals, and language learners!`,
      
      'tutorial': `🚀 ${greeting}complete getting started guide:\n\n📋 Quick Start (5 minutes):\n1️⃣ Click "Practice" tab\n2️⃣ Choose a sentence or type your own\n3️⃣ Click record button\n4️⃣ Allow microphone access\n5️⃣ Speak clearly and naturally\n6️⃣ Click stop when done\n7️⃣ Get instant AI feedback\n8️⃣ Review your score and tips\n\n🎯 Pro Tips for Beginners:\n• Start with short, simple sentences\n• Speak at normal conversational pace\n• Use headphones for better audio\n• Practice in quiet environment\n• Don't worry about perfect scores initially\n\n📊 Track Progress:\n• Check "Records" for session history\n• View "Analysis" for improvement trends\n• Set daily practice goals\n\n✨ Ready to start? Say "go to practice"!`,
      
      'features': `🗺️ ${greeting}complete feature overview:\n\n🏠 Home Dashboard:\n• Practice statistics\n• Recent sessions\n• Progress overview\n• Quick access buttons\n\n🎤 Practice Section:\n• Free text recording\n• Suggested sentences\n• Real-time recording\n• Instant AI feedback\n\n📝 Test Mode:\n• Structured assessments\n• Level evaluation\n• Skill benchmarking\n• Progress milestones\n\n📊 Records History:\n• All past sessions\n• Score trends\n• Audio playback\n• Detailed feedback\n\n📈 Analysis Dashboard:\n• Performance metrics\n• Improvement graphs\n• Weak area identification\n• Practice recommendations\n\n🤖 AI Coach (Me!):\n• 24/7 assistance\n• Instant navigation\n• Learning tips\n• Troubleshooting help\n\nJust say "go to [section]" to navigate instantly!`,
      
      // Technical Information
      'technology': `🤖 ${greeting}our advanced AI technology:\n\n🔊 Speech Processing:\n• Real-time audio analysis\n• Phoneme recognition\n• Prosody evaluation\n• Spectral analysis\n• Temporal pattern matching\n\n📊 Machine Learning:\n• Deep neural networks\n• Native speaker models\n• Accent adaptation\n• Continuous learning\n• Personalized feedback\n\n🎯 Assessment Criteria:\n• Phonetic accuracy\n• Fluency metrics\n• Rhythm analysis\n• Stress patterns\n• Intonation curves\n\n🚀 The result? Professional-grade pronunciation coaching powered by cutting-edge AI!`,
      
      'support': `🆘 ${greeting}comprehensive support options:\n\n🤖 AI Assistant (Me!):\n• Instant help 24/7\n• Navigation assistance\n• Feature explanations\n• Troubleshooting guide\n• Learning tips and advice\n\n📚 Self-Help Resources:\n• In-app tutorials\n• FAQ database\n• Video guides\n• Practice tips\n• Technical documentation\n\n📞 Contact Support:\n• Email support team\n• Live chat (business hours)\n• Bug reporting\n• Feature requests\n• Account assistance\n\n🔄 Quick Fixes:\n• Refresh page\n• Clear browser cache\n• Check microphone permissions\n• Try different browser\n\nI'm your first line of support - ask me anything!`
    };
    
    // Check contextual responses
    for (const [key, response] of Object.entries(contextualResponses)) {
      if (msg.includes(key) || (key === 'about' && (msg.includes('what is speakify') || msg.includes('what does this app do'))) ||
          (key === 'tutorial' && (msg.includes('how to use') || msg.includes('getting started'))) ||
          (key === 'features' && (msg.includes('tabs') || msg.includes('sections') || msg.includes('what can i do'))) ||
          (key === 'technology' && (msg.includes('ai') || msg.includes('artificial intelligence') || msg.includes('how does it work'))) ||
          (key === 'support' && (msg.includes('help') || msg.includes('contact')))) {
        return response;
      }
    }
    
    // Specific device and technical queries
    if (msg.includes('microphone') || msg.includes('mic') || msg.includes('permission')) {
      return `🎤 ${greeting}microphone setup and troubleshooting:\n\n✅ Initial Setup:\n• Click microphone button in app\n• Allow browser microphone access\n• Look for microphone icon in address bar\n• Grant permissions when prompted\n\n🔧 Troubleshooting Steps:\n• Check browser permissions (click lock icon)\n• Test microphone in other apps\n• Try different browser (Chrome recommended)\n• Check system audio settings\n• Restart browser if needed\n\n🎯 Optimization Tips:\n• Use external microphone for better quality\n• Find quiet environment (no echo)\n• Position 6-12 inches from mouth\n• Use headphones to prevent feedback\n• Test audio levels before recording\n\n💡 Remember: Good audio quality = better pronunciation scores!`;
    }
    
    if (msg.includes('browser') || msg.includes('compatibility') || msg.includes('device')) {
      return `🌐 ${greeting}device and browser compatibility:\n\n✅ Recommended Browsers:\n• Chrome 80+ (Best performance)\n• Firefox 75+ (Good compatibility)\n• Safari 13+ (iOS/Mac users)\n• Edge 80+ (Windows users)\n\n📱 Device Support:\n• Desktop computers (Windows/Mac/Linux)\n• Laptops and tablets\n• Smartphones (iOS/Android)\n• Chromebooks\n\n⚙️ System Requirements:\n• Microphone access required\n• Stable internet (1+ Mbps)\n• 50MB free storage\n• Modern browser with WebRTC support\n\n🚀 Performance Tips:\n• Close unnecessary tabs\n• Update browser regularly\n• Enable hardware acceleration\n• Use WiFi for best experience\n\nMost modern devices work perfectly!`;
    }
    
    // Gratitude and farewell responses
    if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
      const thankYouResponses = [
        `😊 ${greeting}you're absolutely welcome! I'm thrilled to help you on your pronunciation journey!`,
        `🌟 ${greeting}my pleasure! Helping you improve is what I'm here for!`,
        `💪 ${greeting}you're so welcome! Keep up the great practice - you're making excellent progress!`,
        `✨ ${greeting}happy to help! Remember, I'm always here whenever you need assistance!`
      ];
      return thankYouResponses[Math.floor(Math.random() * thankYouResponses.length)] + 
             `\n\n🚀 Keep practicing and you'll see amazing results! Feel free to ask me anything else about Speakify AI!`;
    }
    
    if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) {
      const farewellResponses = [
        `👋 ${greeting}goodbye! Keep practicing - you're doing fantastic!`,
        `🌟 ${greeting}see you later! Remember, consistent practice leads to amazing results!`,
        `🏆 ${greeting}farewell! You're on the right path to pronunciation mastery!`,
        `✨ ${greeting}until next time! Keep up the excellent work!`
      ];
      return farewellResponses[Math.floor(Math.random() * farewellResponses.length)] + 
             `\n\n🤖 I'm always here when you need help or have questions. Happy practicing!`;
    }
    
    // Smart Default Response with comprehensive suggestions
    const smartSuggestions = {
      navigation: [
        '🏠 "Go to home"',
        '🎤 "Go to practice"', 
        '📊 "Go to records"',
        '📈 "Go to analysis"'
      ],
      help: [
        '🎤 "How do I record audio?"',
        '📊 "What do the scores mean?"',
        '🚀 "How can I improve?"',
        '🔧 "Audio not working"'
      ],
      learning: [
        '📚 "Pronunciation tips"',
        '🎯 "Practice schedule"',
        '🔤 "Phonetic alphabet"',
        '🌍 "Accent training"'
      ],
      technical: [
        '🌐 "Browser compatibility"',
        '💻 "System requirements"',
        '📱 "Mobile app"',
        '🔊 "Audio quality"'
      ]
    };
    
    // Use smart context-aware response as fallback
    return contextAwareness.getSmartResponse(message, userName);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Update context awareness
    contextAwareness.updateContext('lastMessage', userMessage);
    
    let currentHistory = [];
    setMessages(prev => {
        currentHistory = [...prev];
        return [...prev, {
            type: 'user',
            message: userMessage,
            timestamp: new Date().toISOString()
        }];
    });
    
    setIsTyping(true);
    
    // Check for smart navigation locally to preserve fast tab switching
    const navigationIntent = smartNavigation.parseNavigationIntent(userMessage);
    if (navigationIntent && navigationIntent.confidence > 0.6) {
      const navResponse = smartNavigation.generateNavigationResponse(navigationIntent, userName);
      
      if (onNavigate) {
        onNavigate(navigationIntent.tabIndex);
        smartNavigation.navigateToTab(navigationIntent.tabIndex, userMessage);
        setTimeout(() => setIsOpen(false), 1000);
      }
      
      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'bot',
        message: navResponse.message,
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    try {
      const response = await axiosInstance.post('/chatbot/message', {
        message: userMessage,
        history: currentHistory,
        userName: userName
      });

      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'bot',
        message: response.data.reply,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error("Chatbot API failed, falling back to local:", error);
      setIsTyping(false);
      const fallbackResponse = getResponse(userMessage);
      setMessages(prev => [...prev, {
        type: 'bot',
        message: fallbackResponse,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setShowSuggestions(false);
  };
  
  // Smart suggestion system
  const getSmartSuggestions = (inputText) => {
    if (!inputText || inputText.length < 2) return [];
    
    const text = inputText.toLowerCase();
    const allSuggestions = [
      // Navigation suggestions
      { text: 'go to practice', category: 'navigation', icon: '🎤' },
      { text: 'go to home', category: 'navigation', icon: '🏠' },
      { text: 'go to records', category: 'navigation', icon: '📊' },
      { text: 'go to analysis', category: 'navigation', icon: '📈' },
      { text: 'go to test', category: 'navigation', icon: '📝' },
      
      // Help suggestions
      { text: 'how to record audio', category: 'help', icon: '🎤' },
      { text: 'what do scores mean', category: 'help', icon: '📊' },
      { text: 'how to improve pronunciation', category: 'help', icon: '🚀' },
      { text: 'audio not working', category: 'help', icon: '🔧' },
      { text: 'browser compatibility', category: 'help', icon: '🌐' },
      
      // Learning suggestions
      { text: 'pronunciation tips', category: 'learning', icon: '📚' },
      { text: 'practice schedule', category: 'learning', icon: '📅' },
      { text: 'accent training', category: 'learning', icon: '🌍' },
      { text: 'common mistakes', category: 'learning', icon: '⚠️' },
      { text: 'phonetic alphabet', category: 'learning', icon: '🔤' },
      
      // Features suggestions
      { text: 'app features', category: 'features', icon: '✨' },
      { text: 'scoring system', category: 'features', icon: '🏆' },
      { text: 'progress tracking', category: 'features', icon: '📈' },
      { text: 'practice modes', category: 'features', icon: '🎮' }
    ];
    
    // Filter suggestions based on input
    const filtered = allSuggestions.filter(suggestion => 
      suggestion.text.toLowerCase().includes(text) ||
      text.split(' ').some(word => suggestion.text.includes(word))
    );
    
    return filtered.slice(0, 5); // Return top 5 matches
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    
    // Update suggestions
    const newSuggestions = getSmartSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0 && value.length > 1);
  };
  
  const selectSuggestion = (suggestion) => {
    setInput(suggestion.text);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Fab
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          bgcolor: '#CC785C',
          color: 'white',
          boxShadow: '0 4px 16px rgba(204, 120, 92, 0.25)',
          '&:hover': { 
            bgcolor: '#b8674d',
            boxShadow: '0 6px 20px rgba(204, 120, 92, 0.35)'
          },
          transition: 'all 0.2s ease',
          zIndex: 1000
        }}
      >
        {isOpen ? <Close /> : <Chat />}
      </Fab>



      {/* Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Card sx={{
          position: 'fixed',
          bottom: 90,
          right: 24,
          width: 400,
          height: 600,
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: '#F7F3EA',
          border: '1px solid rgba(27,27,24,0.06)'
        }}>
          <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ 
              p: 2.5, 
              bgcolor: '#EDE6D6',
              color: '#1B1B18',
              borderBottom: '1px solid rgba(27,27,24,0.06)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: '#CC785C', 
                  width: 40, 
                  height: 40,
                  color: 'white'
                }}>
                  <Psychology sx={{ fontSize: 20 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Georgia, serif', lineHeight: 1.2 }}>
                    AI Pronunciation Coach
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B6B63', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif' }}>
                    Online • Ready to help
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => setIsOpen(false)} 
                  sx={{ 
                    color: '#1B1B18',
                    '&:hover': { bgcolor: 'rgba(27,27,24,0.04)' }
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', maxHeight: 400, bgcolor: '#F7F3EA' }}>
              <Stack spacing={3}>
                {messages.map((msg, index) => (
                  <Box key={index} sx={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}>
                    <Box sx={{
                      maxWidth: '80%',
                      p: 1.5,
                      borderRadius: msg.type === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      bgcolor: msg.type === 'user' ? '#CC785C' : '#EDE6D6',
                      color: msg.type === 'user' ? 'white' : '#1B1B18',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      border: 'none'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          lineHeight: 1.4,
                          whiteSpace: 'pre-line',
                          fontSize: '0.875rem',
                          fontFamily: '"Inter", sans-serif'
                        }}
                      >
                        {parseEmojis(msg.message)}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          opacity: 0.7,
                          fontSize: '0.7rem',
                          mt: 0.5,
                          display: 'block',
                          fontFamily: '"IBM Plex Mono", monospace'
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: '12px 12px 12px 2px',
                      bgcolor: '#EDE6D6',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 1, 2].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: '#CC785C',
                              animation: `typing 1.4s infinite ${i * 0.2}s`
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Stack>
            </Box>

            <style>
              {`
                @keyframes typing {
                  0%, 60%, 100% { opacity: 0.4; }
                  30% { opacity: 1; }
                }
              `}
            </style>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <Box sx={{ px: 2, pb: 2, bgcolor: '#EDE6D6', borderTop: '1px solid rgba(27,27,24,0.05)' }}>
                <Typography variant="caption" sx={{ color: '#6B6B63', mb: 1, display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Quick actions:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {quickActions.slice(0, 6).map((action, index) => (
                    <Chip
                      key={index}
                      label={action.text}
                      size="small"
                      onClick={() => handleQuickQuestion(action.text)}
                      sx={{
                        fontSize: '0.75rem',
                        height: 28,
                        cursor: 'pointer',
                        bgcolor: '#F7F3EA',
                        color: '#1B1B18',
                        borderRadius: '6px',
                        '&:hover': {
                          bgcolor: 'rgba(204,120,92,0.1)',
                          color: '#CC785C'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Input */}
            <Box sx={{ p: 2, borderTop: '1px solid rgba(27,27,24,0.05)', bgcolor: '#EDE6D6' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ position: 'relative', flex: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    inputRef={inputRef}
                    placeholder="Type your message..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    onFocus={() => input.length > 1 && setSuggestions(getSmartSuggestions(input))}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    multiline
                    maxRows={2}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        bgcolor: '#F7F3EA',
                        '& fieldset': {
                          borderColor: 'rgba(27,27,24,0.1)'
                        },
                        '&:hover fieldset': {
                          borderColor: '#CC785C'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#CC785C'
                        }
                      }
                    }}
                  />
                  
                  {/* Smart Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <Box sx={{
                      position: 'absolute',
                      bottom: '100%',
                      left: 0,
                      right: 0,
                      bgcolor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      mb: 0.5,
                      maxHeight: 150,
                      overflowY: 'auto'
                    }}>
                      {suggestions.map((suggestion, index) => (
                        <Box
                          key={index}
                          onClick={() => selectSuggestion(suggestion)}
                          sx={{
                            p: 1.5,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: '#f5f5f5'
                            },
                            borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none'
                          }}
                        >
                          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            {suggestion.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  sx={{ 
                    bgcolor: '#CC785C',
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#b8674d'
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(27,27,24,0.1)'
                    }
                  }}
                >
                  <Send fontSize="small" sx={{ color: 'white' }} />
                </Button>
              </Box>
              <Typography variant="caption" sx={{ color: '#999', mt: 1, display: 'block', fontSize: '0.7rem' }}>
                Press Enter to send • Shift+Enter for new line
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Slide>
    </>
  );
};

export default Chatbot;
