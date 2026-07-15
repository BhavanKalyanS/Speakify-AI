// Smart Navigation Service for Chatbot
// Handles instant navigation and context-aware routing

class SmartNavigationService {
  constructor() {
    this.navigationHistory = [];
    this.currentTab = 0;
    this.tabNames = ['Home', 'Practice', 'Test', 'Records', 'Analysis'];
  }

  // Enhanced navigation with context awareness
  navigateToTab(tabIndex, context = '') {
    if (tabIndex >= 0 && tabIndex < this.tabNames.length) {
      this.navigationHistory.push({
        from: this.currentTab,
        to: tabIndex,
        timestamp: new Date(),
        context: context
      });
      this.currentTab = tabIndex;
      return {
        success: true,
        tabName: this.tabNames[tabIndex],
        message: `Navigated to ${this.tabNames[tabIndex]}`,
        previousTab: this.tabNames[this.navigationHistory[this.navigationHistory.length - 1]?.from] || 'Unknown'
      };
    }
    return {
      success: false,
      message: 'Invalid tab index'
    };
  }

  // Smart keyword matching for navigation
  parseNavigationIntent(message) {
    const msg = message.toLowerCase();
    
    const navigationPatterns = {
      0: { // Home
        keywords: ['home', 'dashboard', 'main', 'overview', 'start', 'beginning'],
        phrases: ['go home', 'take me home', 'main page', 'dashboard', 'home page']
      },
      1: { // Practice
        keywords: ['practice', 'record', 'recording', 'microphone', 'speak', 'pronunciation'],
        phrases: ['start practicing', 'record audio', 'practice pronunciation', 'go to practice', 'start recording']
      },
      2: { // Test
        keywords: ['test', 'quiz', 'assessment', 'evaluate', 'examination', 'check'],
        phrases: ['take test', 'pronunciation test', 'skill assessment', 'check my level']
      },
      3: { // Records
        keywords: ['records', 'history', 'sessions', 'past', 'previous', 'log'],
        phrases: ['my records', 'session history', 'past recordings', 'recording history']
      },
      4: { // Analysis
        keywords: ['analysis', 'progress', 'stats', 'performance', 'analytics', 'improvement'],
        phrases: ['show progress', 'my analysis', 'performance data', 'improvement stats']
      }
    };

    // Check for exact phrase matches first
    for (const [tabIndex, pattern] of Object.entries(navigationPatterns)) {
      for (const phrase of pattern.phrases) {
        if (msg.includes(phrase)) {
          return {
            tabIndex: parseInt(tabIndex),
            confidence: 0.9,
            matchType: 'phrase',
            matchedText: phrase
          };
        }
      }
    }

    // Check for keyword matches
    for (const [tabIndex, pattern] of Object.entries(navigationPatterns)) {
      for (const keyword of pattern.keywords) {
        if (msg.includes(keyword)) {
          return {
            tabIndex: parseInt(tabIndex),
            confidence: 0.7,
            matchType: 'keyword',
            matchedText: keyword
          };
        }
      }
    }

    return null;
  }

  // Get navigation suggestions based on current context
  getNavigationSuggestions(currentTab) {
    const suggestions = {
      0: ['Go to Practice', 'View Records', 'Check Analysis'], // From Home
      1: ['View Records', 'Check Analysis', 'Take Test'], // From Practice
      2: ['Go to Practice', 'View Records', 'Check Analysis'], // From Test
      3: ['Go to Practice', 'Take Test', 'Check Analysis'], // From Records
      4: ['Go to Practice', 'View Records', 'Take Test'] // From Analysis
    };

    return suggestions[currentTab] || suggestions[0];
  }

  // Get contextual help based on current tab
  getContextualHelp(tabIndex) {
    const helpTexts = {
      0: "🏠 You're on the Home dashboard. Here you can see your practice overview, recent sessions, and quick access to all features.",
      1: "🎤 You're in the Practice section. Click the microphone to start recording your pronunciation for AI analysis.",
      2: "📝 You're in the Test section. Take structured pronunciation assessments to evaluate your current skill level.",
      3: "📊 You're viewing your Records. Here you can see all your past sessions, scores, and detailed feedback history.",
      4: "📈 You're in the Analysis section. Review your progress trends, improvement areas, and performance statistics."
    };

    return helpTexts[tabIndex] || "Navigate to any section using the tabs above or ask me to take you there!";
  }

  // Generate smart responses for navigation
  generateNavigationResponse(intent, userName = '') {
    const greeting = userName ? `${userName}, ` : '';
    
    if (!intent) {
      return `🤔 ${greeting}I didn't catch which section you'd like to visit. Try saying:\n\n• "Go to practice" 🎤\n• "Show my records" 📊\n• "Take me to analysis" 📈\n• "Go home" 🏠\n• "Start a test" 📝`;
    }

    const tabName = this.tabNames[intent.tabIndex];
    const contextHelp = this.getContextualHelp(intent.tabIndex);
    
    return {
      message: `🚀 ${greeting}taking you to ${tabName} now!\n\n${contextHelp}`,
      tabIndex: intent.tabIndex,
      tabName: tabName,
      confidence: intent.confidence
    };
  }

  // Track user navigation patterns for better suggestions
  getNavigationStats() {
    const stats = {
      totalNavigations: this.navigationHistory.length,
      mostVisitedTab: this.getMostVisitedTab(),
      navigationPattern: this.getNavigationPattern(),
      averageSessionLength: this.getAverageSessionLength()
    };

    return stats;
  }

  getMostVisitedTab() {
    const tabCounts = {};
    this.navigationHistory.forEach(nav => {
      tabCounts[nav.to] = (tabCounts[nav.to] || 0) + 1;
    });

    const mostVisited = Object.entries(tabCounts).reduce((a, b) => 
      tabCounts[a[0]] > tabCounts[b[0]] ? a : b
    );

    return mostVisited ? {
      tabIndex: parseInt(mostVisited[0]),
      tabName: this.tabNames[mostVisited[0]],
      count: mostVisited[1]
    } : null;
  }

  getNavigationPattern() {
    if (this.navigationHistory.length < 2) return 'Insufficient data';
    
    const patterns = {};
    for (let i = 1; i < this.navigationHistory.length; i++) {
      const from = this.navigationHistory[i-1].to;
      const to = this.navigationHistory[i].to;
      const pattern = `${from}->${to}`;
      patterns[pattern] = (patterns[pattern] || 0) + 1;
    }

    const mostCommon = Object.entries(patterns).reduce((a, b) => 
      patterns[a[0]] > patterns[b[0]] ? a : b
    );

    return mostCommon ? {
      pattern: mostCommon[0],
      count: mostCommon[1],
      description: `Most common: ${this.tabNames[mostCommon[0].split('->')[0]]} → ${this.tabNames[mostCommon[0].split('->')[1]]}`
    } : 'No clear pattern';
  }

  getAverageSessionLength() {
    if (this.navigationHistory.length < 2) return 0;
    
    const sessions = [];
    let sessionStart = this.navigationHistory[0].timestamp;
    
    for (let i = 1; i < this.navigationHistory.length; i++) {
      const timeDiff = this.navigationHistory[i].timestamp - this.navigationHistory[i-1].timestamp;
      if (timeDiff > 300000) { // 5 minutes gap = new session
        sessions.push(this.navigationHistory[i-1].timestamp - sessionStart);
        sessionStart = this.navigationHistory[i].timestamp;
      }
    }
    
    if (sessions.length > 0) {
      const avgMs = sessions.reduce((a, b) => a + b, 0) / sessions.length;
      return Math.round(avgMs / 60000); // Convert to minutes
    }
    
    return 0;
  }

  // Clear navigation history (for privacy)
  clearHistory() {
    this.navigationHistory = [];
    return 'Navigation history cleared successfully.';
  }

  // Export navigation data for analytics
  exportNavigationData() {
    return {
      history: this.navigationHistory,
      stats: this.getNavigationStats(),
      currentTab: this.currentTab,
      timestamp: new Date()
    };
  }
}

// Create singleton instance
const smartNavigation = new SmartNavigationService();

export default smartNavigation;


