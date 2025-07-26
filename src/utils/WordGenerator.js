/**
 * WordGenerator - Generates continuous words based on difficulty level
 * Provides infinite word streams for timer-based typing tests
 * Now supports both word-based and passage-based text generation
 */

import textService from './TextService.js';

class WordGenerator {
  constructor() {
    // Easy words - common, short words
    this.easyWords = [
      'the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'his', 'they',
      'this', 'have', 'from', 'one', 'had', 'but', 'word', 'not', 'what', 'all',
      'were', 'when', 'your', 'can', 'said', 'each', 'which', 'she', 'how', 'will',
      'about', 'out', 'many', 'time', 'very', 'her', 'its', 'way', 'could', 'him',
      'into', 'has', 'more', 'go', 'no', 'do', 'would', 'my', 'so', 'get',
      'me', 'now', 'come', 'made', 'may', 'take', 'them', 'see', 'know', 'just',
      'first', 'well', 'work', 'life', 'only', 'new', 'old', 'find', 'here', 'way',
      'use', 'man', 'day', 'too', 'any', 'your', 'how', 'say', 'each', 'give'
    ];

    // Medium words - mixed length and complexity
    this.mediumWords = [
      'people', 'because', 'government', 'little', 'world', 'school', 'still', 'never',
      'house', 'while', 'should', 'found', 'thought', 'long', 'place', 'right',
      'where', 'much', 'family', 'own', 'leave', 'put', 'old', 'different', 'move',
      'following', 'came', 'want', 'show', 'also', 'around', 'large', 'need',
      'feel', 'try', 'ask', 'turn', 'kind', 'change', 'end', 'play', 'help',
      'line', 'might', 'home', 'hand', 'picture', 'again', 'point', 'after',
      'mother', 'thing', 'world', 'information', 'back', 'face', 'others', 'many',
      'within', 'public', 'speak', 'level', 'allow', 'add', 'office', 'spend'
    ];

    // Hard words - longer, technical, less common
    this.hardWords = [
      'development', 'environment', 'management', 'technology', 'international',
      'experience', 'available', 'community', 'opportunity', 'understand',
      'important', 'remember', 'individual', 'everything', 'organization',
      'particular', 'university', 'necessary', 'structure', 'difference',
      'relationship', 'traditional', 'significant', 'professional', 'political',
      'economic', 'financial', 'analysis', 'performance', 'responsibility',
      'administration', 'implementation', 'communication', 'investigation',
      'transportation', 'infrastructure', 'characteristic', 'establishment',
      'environmental', 'psychological', 'technological', 'comprehensive',
      'achievement', 'requirement', 'measurement', 'improvement', 'agreement'
    ];

    this.currentWordIndex = 0;
    this.currentDifficulty = 'medium';
    this.generatedWords = [];
  }

  /**
   * Set the difficulty level for word generation
   * @param {string} difficulty - 'easy', 'medium', or 'hard'
   */
  setDifficulty(difficulty) {
    this.currentDifficulty = difficulty;
    this.currentWordIndex = 0;
    this.generatedWords = [];
  }

  /**
   * Get the word list for current difficulty
   * @returns {string[]} Array of words
   */
  getCurrentWordList() {
    switch (this.currentDifficulty) {
      case 'easy':
        return this.easyWords;
      case 'medium':
        return this.mediumWords;
      case 'hard':
        return this.hardWords;
      default:
        return this.mediumWords;
    }
  }

  /**
   * Generate a random word from the current difficulty list
   * @returns {string} A random word
   */
  getRandomWord() {
    const wordList = this.getCurrentWordList();
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  }

  /**
   * Generate a sequence of random words
   * @param {number} count - Number of words to generate
   * @returns {string[]} Array of random words
   */
  generateWords(count = 50) {
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(this.getRandomWord());
    }
    return words;
  }

  /**
   * Get next batch of words for continuous typing
   * @param {number} count - Number of words to get
   * @returns {string[]} Array of words
   */
  getNextWords(count = 20) {
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(this.getRandomWord());
    }
    this.generatedWords.push(...words);
    return words;
  }

  /**
   * Get words starting from a specific index
   * Useful for maintaining cursor position in continuous text
   * @param {number} startIndex - Starting word index
   * @param {number} count - Number of words to get
   * @returns {string[]} Array of words
   */
  getWordsFromIndex(startIndex, count = 20) {
    // Ensure we have enough words generated
    while (this.generatedWords.length < startIndex + count) {
      this.generatedWords.push(...this.generateWords(50));
    }
    
    return this.generatedWords.slice(startIndex, startIndex + count);
  }

  /**
   * Initialize word stream for a test
   * @param {string} difficulty - Test difficulty
   * @param {number} initialCount - Initial number of words to generate
   * @returns {string[]} Initial word array
   */
  initializeTest(difficulty, initialCount = 100) {
    this.setDifficulty(difficulty);
    this.generatedWords = this.generateWords(initialCount);
    return this.generatedWords.slice(0, Math.min(20, initialCount));
  }

  /**
   * Get words as a continuous text string
   * @param {number} wordCount - Number of words to include
   * @returns {string} Space-separated words
   */
  getWordsAsText(wordCount = 50) {
    const words = this.getNextWords(wordCount);
    return words.join(' ');
  }

  /**
   * Get difficulty statistics
   * @returns {object} Stats about current difficulty
   */
  getDifficultyStats() {
    const wordList = this.getCurrentWordList();
    const avgLength = wordList.reduce((sum, word) => sum + word.length, 0) / wordList.length;
    
    return {
      difficulty: this.currentDifficulty,
      wordCount: wordList.length,
      averageLength: Math.round(avgLength * 10) / 10,
      shortestWord: Math.min(...wordList.map(w => w.length)),
      longestWord: Math.max(...wordList.map(w => w.length))
    };
  }

  /**
   * Reset the generator state
   */
  reset() {
    this.currentWordIndex = 0;
    this.generatedWords = [];
  }

  /**
   * Get a passage-based text for typing practice
   * @param {string} difficulty - Test difficulty
   * @param {boolean} forceAPI - Force API call even if cache exists
   * @returns {Promise<string>} Text passage
   */
  async getPassageText(difficulty = 'medium', forceAPI = false) {
    try {
      return await textService.getTextPassage(difficulty, forceAPI);
    } catch (error) {
      console.warn('Failed to get passage text, falling back to word generation:', error);
      // Fallback to word-based generation
      this.setDifficulty(difficulty);
      const words = this.generateWords(30);
      return words.join(' ') + '.';
    }
  }

  /**
   * Initialize test with passage-based text for specific duration
   * @param {string} difficulty - Test difficulty
   * @param {number} durationSeconds - Test duration in seconds
   * @param {boolean} usePassages - Whether to use passage-based text
   * @returns {Promise<string>} Complete text for entire test
   */
  async initializePassageTest(difficulty, durationSeconds = 60, usePassages = true) {
    if (usePassages) {
      try {
        // Calculate target word count based on duration
        // Assuming average typing speed of 40 WPM, add 50% buffer
        const targetWords = Math.ceil((durationSeconds / 60) * 40 * 1.5);
        
        const completeText = await this.generateCompleteTestText(difficulty, targetWords);
        return completeText;
      } catch (error) {
        console.warn('Passage initialization failed, using word generation:', error);
      }
    }
    
    // Fallback to word generation
    this.setDifficulty(difficulty);
    const targetWords = Math.ceil((durationSeconds / 60) * 40 * 1.5);
    this.generatedWords = this.generateWords(targetWords);
    return this.generatedWords.join(' ');
  }

  /**
   * Generate complete text for entire test duration with timeout
   * @param {string} difficulty - Test difficulty
   * @param {number} targetWords - Target number of words
   * @returns {Promise<string>} Complete text
   */
  async generateCompleteTestText(difficulty, targetWords) {
    // Skip API entirely - it's too unreliable
    // Generate dynamic text using word combinations instead
    return this.generateDynamicText(difficulty, targetWords);
  }

  /**
   * Try to get text from API (with potential multiple calls)
   * @param {string} difficulty 
   * @param {number} targetWords 
   * @returns {Promise<string>}
   */
  async tryAPIText(difficulty, targetWords) {
    let completeText = '';
    let currentWordCount = 0;
    let attempts = 0;
    const maxAttempts = 3; // Reduced attempts for speed

    while (currentWordCount < targetWords && attempts < maxAttempts) {
      const passage = await this.getPassageText(difficulty);
      const passageWords = passage.split(' ').length;
      
      if (completeText === '') {
        completeText = passage;
      } else {
        completeText += ' ' + passage;
      }
      
      currentWordCount += passageWords;
      attempts++;
      
      // No delays for speed
      if (currentWordCount >= targetWords) break;
    }

    return completeText;
  }

  /**
   * Generate dynamic text that's different every time
   * @param {string} difficulty 
   * @param {number} targetWords 
   * @returns {string}
   */
  generateDynamicText(difficulty, targetWords) {
    // Mix static texts with random word generation for variety
    const staticTexts = textService.fallbackTexts[difficulty] || textService.fallbackTexts.medium;
    let completeText = '';
    let currentWordCount = 0;
    
    // Start with 1-2 random static sentences
    const numStaticSentences = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numStaticSentences && currentWordCount < targetWords * 0.6; i++) {
      const randomText = staticTexts[Math.floor(Math.random() * staticTexts.length)];
      const wordsInText = randomText.split(' ').length;
      
      if (completeText === '') {
        completeText = randomText;
      } else {
        completeText += ' ' + randomText;
      }
      currentWordCount += wordsInText;
    }
    
    // Fill the rest with dynamically generated word sequences
    this.setDifficulty(difficulty);
    while (currentWordCount < targetWords) {
      const remainingWords = targetWords - currentWordCount;
      const wordsToGenerate = Math.min(remainingWords, Math.floor(Math.random() * 15) + 10); // 10-25 words
      
      const additionalWords = this.generateWords(wordsToGenerate);
      completeText += ' ' + additionalWords.join(' ');
      currentWordCount += wordsToGenerate;
    }

    return completeText;
  }

  /**
   * Generate static text immediately (no API calls) - kept for compatibility
   * @param {string} difficulty 
   * @param {number} targetWords 
   * @returns {string}
   */
  generateStaticText(difficulty, targetWords) {
    // Use expanded static fallback texts
    const staticTexts = textService.fallbackTexts[difficulty] || textService.fallbackTexts.medium;
    let completeText = '';
    let currentWordCount = 0;
    let textIndex = 0;

    while (currentWordCount < targetWords && textIndex < staticTexts.length) {
      const text = staticTexts[textIndex];
      const wordsInText = text.split(' ').length;
      
      if (completeText === '') {
        completeText = text;
      } else {
        completeText += ' ' + text;
      }
      
      currentWordCount += wordsInText;
      textIndex++;
    }

    // If we still need more words, cycle through texts again
    while (currentWordCount < targetWords) {
      const remainingWords = targetWords - currentWordCount;
      this.setDifficulty(difficulty);
      const additionalWords = this.generateWords(remainingWords);
      completeText += ' ' + additionalWords.join(' ');
      break;
    }

    return completeText;
  }

  /**
   * Get additional passage text for continuous typing
   * @param {string} difficulty - Test difficulty
   * @returns {Promise<string>} Additional text
   */
  async getAdditionalPassageText(difficulty) {
    try {
      const passage = await this.getPassageText(difficulty);
      return ' ' + passage;
    } catch (error) {
      console.warn('Failed to get additional passage, using words:', error);
      return ' ' + this.getWordsAsText(20);
    }
  }

  /**
   * Preload cache for better performance
   * @param {string} difficulty 
   */
  async preloadPassages(difficulty) {
    try {
      await textService.preloadCache(difficulty, 5);
    } catch (error) {
      console.warn('Failed to preload passages:', error);
    }
  }
}

// Export singleton instance
const wordGenerator = new WordGenerator();
export default wordGenerator;