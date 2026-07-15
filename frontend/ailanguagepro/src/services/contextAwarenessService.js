// Smart Context Awareness Service
// Provides intelligent, context-aware responses based on user behavior and app state

class ContextAwarenessService {
  constructor() {
    this.userContext = {
      currentTab: 0,
      sessionStartTime: new Date(),
      interactionCount: 0,
      commonQuestions: [],
      userPreferences: {},
      lastActivity: null,
      skillLevel: 'beginner', // beginner, intermediate, advanced
      practiceHistory: [],
      problemAreas: []
    };
    
    this.contextualResponses = new Map();
    this.initializeContextualResponses();
  }

  initializeContextualResponses() {
    // Context-aware response templates
    this.contextualResponses.set('first_visit', {
      triggers: ['hello', 'hi', 'start', 'begin'],
      response: (userName) => `👋 Welcome to Speakify AI${userName ? `, ${userName}` : ''}! 

🎯 I'm your personal pronunciation coach, and I'm here to help you master English pronunciation!

🚀 Quick Start Guide:
• Say "go to practice" to start recording
• Ask "how to record" for detailed instructions  
• Try "what can you do" to see all my features
• Need help anytime? Just ask!

💡 Pro tip: I can navigate you to any section instantly - just say "go to [section name]"!

What would you like to explore first? 🌟`
    });

    this.contextualResponses.set('returning_user', {
      triggers: ['hello', 'hi', 'back'],
      response: (userName, context) => `🎉 Welcome back${userName ? `, ${userName}` : ''}! 

📊 Since your last visit:
• You've practiced ${context.practiceHistory.length} times
• Your average score trend: ${this.getScoreTrend(context)}
• Most practiced area: ${context.commonQuestions[0] || 'General pronunciation'}

🎯 Ready to continue your pronunciation journey?
• "Go to practice" - Start a new session
• "Show my progress" - View your improvement
• "Continue where I left off" - Resume last activity

What would you like to work on today? 🚀`
    });

    this.contextualResponses.set('struggling_user', {
      triggers: ['help', 'difficult', 'hard', 'frustrated'],
      response: (userName) => `💪 I understand pronunciation can be challenging${userName ? `, ${userName}` : ''}!

🌟 You're not alone - here's how I can help:
• Personalized practice recommendations
• Step-by-step improvement guidance
• Instant feedback and corrections
• Progress tracking to show your growth

🎯 Let's tackle this together:
• "Show me easy exercises" - Start with basics
• "What are my problem areas" - Identify focus points
• "Give me encouragement" - Motivation boost
• "Practice tips" - Expert advice

Remember: Every expert was once a beginner! 🏆`
    });

    this.contextualResponses.set('advanced_user', {
      triggers: ['advanced', 'expert', 'professional', 'business'],
      response: (userName) => `🎓 Great to meet an advanced learner${userName ? `, ${userName}` : ''}!

🚀 Advanced features for you:
• Professional pronunciation assessment
• Business communication focus
• Accent refinement techniques
• Advanced phonetic analysis
• Presentation skills practice

🎯 Specialized training options:
• "Professional practice" - Business scenarios
• "Accent coaching" - Native-like fluency
• "Advanced analytics" - Detailed performance data
• "Phonetic training" - IPA and technical aspects

Ready to perfect your pronunciation? 💼`
    });
  }

  updateContext(key, value) {
    this.userContext[key] = value;
    this.userContext.lastActivity = new Date();
    this.userContext.interactionCount++;
  }

  getCurrentContext() {
    return { ...this.userContext };
  }

  getContextualGreeting(userName = '') {
    const now = new Date();
    const hour = now.getHours();
    const isFirstVisit = this.userContext.interactionCount === 0;
    const isReturningUser = this.userContext.interactionCount > 10;

    let timeGreeting = '';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    if (isFirstVisit) {
      return this.contextualResponses.get('first_visit').response(userName);
    } else if (isReturningUser) {
      return this.contextualResponses.get('returning_user').response(userName, this.userContext);
    } else {
      return `${timeGreeting}${userName ? `, ${userName}` : ''}! 🌟 How can I help you improve your pronunciation today?`;
    }
  }

  getContextualResponse(message, userName = '') {
    const msg = message.toLowerCase();
    
    // Analyze user's current state and needs
    const userState = this.analyzeUserState(msg);
    
    // Check for contextual response patterns
    for (const [contextType, contextData] of this.contextualResponses.entries()) {
      if (contextData.triggers.some(trigger => msg.includes(trigger))) {
        if (contextType === 'struggling_user' && userState.needsEncouragement) {
          return contextData.response(userName);
        } else if (contextType === 'advanced_user' && userState.isAdvanced) {
          return contextData.response(userName);
        }
      }
    }

    return null; // No contextual response found
  }

  analyzeUserState(message) {
    const strugglingKeywords = ['difficult', 'hard', 'frustrated', 'not improving', 'giving up', 'confused'];
    const advancedKeywords = ['advanced', 'professional', 'business', 'expert', 'native-like', 'perfect'];
    const encouragementKeywords = ['help', 'support', 'motivation', 'encourage'];

    return {
      needsEncouragement: strugglingKeywords.some(keyword => message.includes(keyword)),
      isAdvanced: advancedKeywords.some(keyword => message.includes(keyword)),
      needsMotivation: encouragementKeywords.some(keyword => message.includes(keyword)),
      isNewUser: this.userContext.interactionCount < 5,
      isActiveUser: this.userContext.interactionCount > 20
    };
  }

  getPersonalizedSuggestions(userName = '') {
    const suggestions = [];
    const context = this.userContext;

    // Based on current tab
    switch (context.currentTab) {
      case 0: // Home
        suggestions.push('🎤 "Start practicing" - Begin a pronunciation session');
        suggestions.push('📊 "Show my progress" - View your improvement');
        break;
      case 1: // Practice
        suggestions.push('🎯 "Recording tips" - Improve your audio quality');
        suggestions.push('📈 "How to improve scores" - Get better results');
        break;
      case 2: // Test
        suggestions.push('🏆 "Test strategies" - Maximize your performance');
        suggestions.push('📋 "What do scores mean" - Understand your results');
        break;
      case 3: // Records
        suggestions.push('📊 "Analyze my progress" - Detailed insights');
        suggestions.push('🔄 "Practice again" - Repeat previous sessions');
        break;
      case 4: // Analysis
        suggestions.push('🎯 "Focus areas" - Target weak points');
        suggestions.push('📅 "Practice schedule" - Optimize your routine');
        break;
    }

    // Based on user level
    if (context.skillLevel === 'beginner') {
      suggestions.push('📚 "Getting started guide" - Learn the basics');
      suggestions.push('🎤 "How to record" - Step-by-step instructions');
    } else if (context.skillLevel === 'advanced') {
      suggestions.push('🎓 "Advanced techniques" - Professional tips');
      suggestions.push('🌍 "Accent training" - Native-like fluency');
    }

    return suggestions.slice(0, 4); // Return top 4 suggestions
  }

  getScoreTrend(context) {
    if (context.practiceHistory.length < 2) return 'Not enough data';
    
    const recent = context.practiceHistory.slice(-5);
    const average = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    
    if (average >= 85) return '📈 Excellent (85%+)';
    if (average >= 75) return '📊 Good (75%+)';
    if (average >= 65) return '📉 Improving (65%+)';
    return '🎯 Needs focus (<65%)';
  }

  trackUserInteraction(type, data = {}) {
    this.userContext.interactionCount++;
    this.userContext.lastActivity = new Date();
    
    // Track common questions
    if (type === 'question') {
      this.userContext.commonQuestions.push(data.question);
      // Keep only last 10 questions
      if (this.userContext.commonQuestions.length > 10) {
        this.userContext.commonQuestions.shift();
      }
    }
    
    // Track practice sessions
    if (type === 'practice' && data.score) {
      this.userContext.practiceHistory.push(data.score);
      // Keep only last 20 sessions
      if (this.userContext.practiceHistory.length > 20) {
        this.userContext.practiceHistory.shift();
      }
    }
    
    // Update skill level based on performance
    this.updateSkillLevel();
  }

  updateSkillLevel() {
    const recentScores = this.userContext.practiceHistory.slice(-10);
    if (recentScores.length < 5) return;
    
    const average = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    
    if (average >= 85) {
      this.userContext.skillLevel = 'advanced';
    } else if (average >= 70) {
      this.userContext.skillLevel = 'intermediate';
    } else {
      this.userContext.skillLevel = 'beginner';
    }
  }

  getSmartResponse(message, userName = '') {
    // Track this interaction
    this.trackUserInteraction('question', { question: message });
    
    // Try to get contextual response first
    const contextualResponse = this.getContextualResponse(message, userName);
    if (contextualResponse) {
      return contextualResponse;
    }
    
    // Return personalized suggestions if no specific response
    const suggestions = this.getPersonalizedSuggestions(userName);
    const greeting = userName ? `${userName}, ` : '';
    
    return `🤔 ${greeting}I want to give you the most helpful response! Here are some personalized suggestions based on where you are:

${suggestions.join('\n')}

💡 You can also:
• Ask specific questions about pronunciation
• Request navigation to any section
• Get technical support
• Receive learning tips and motivation

What interests you most? 😊`;
  }

  // Export context data for analytics
  exportContextData() {
    return {
      ...this.userContext,
      exportTime: new Date(),
      sessionDuration: new Date() - this.userContext.sessionStartTime
    };
  }

  // Reset context (for new session)
  resetContext() {
    const preservedData = {
      practiceHistory: this.userContext.practiceHistory,
      skillLevel: this.userContext.skillLevel,
      userPreferences: this.userContext.userPreferences
    };
    
    this.userContext = {
      currentTab: 0,
      sessionStartTime: new Date(),
      interactionCount: 0,
      commonQuestions: [],
      userPreferences: preservedData.userPreferences,
      lastActivity: null,
      skillLevel: preservedData.skillLevel,
      practiceHistory: preservedData.practiceHistory,
      problemAreas: []
    };
  }
}

// Create singleton instance
const contextAwareness = new ContextAwarenessService();

export default contextAwareness;


