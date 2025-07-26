/**
 * TypingMetrics - Core calculation engine for typing speed and accuracy
 * 
 * Implements singleton pattern to maintain consistent state across components.
 * Provides real-time WPM and accuracy calculations using industry-standard formulas.
 */
class TypingMetrics {
  static instance = null;

  constructor() {
    if (TypingMetrics.instance) {
      throw new Error('Use TypingMetrics.getInstance()');
    }
    
    this.reset();
    this.updateFrequency = 100; // Default 100ms debounce
    this.pendingUpdate = null;
  }

  /**
   * Get singleton instance of TypingMetrics
   * @returns {TypingMetrics} The singleton instance
   */
  static getInstance() {
    if (!TypingMetrics.instance) {
      TypingMetrics.instance = new TypingMetrics();
    }
    return TypingMetrics.instance;
  }

  /**
   * Reset all metrics to initial state
   */
  reset() {
    this.startTime = null;
    this.endTime = null;
    this.active = false;
    this.userInput = '';
    this.targetText = '';
    this.lastUpdateTime = null;
    
    // Clear any pending debounced updates
    if (this.pendingUpdate) {
      clearTimeout(this.pendingUpdate);
      this.pendingUpdate = null;
    }
  }

  /**
   * Start a new typing test
   */
  startTest() {
    this.reset();
    this.startTime = Date.now();
    this.active = true;
  }

  /**
   * End the current typing test
   * @returns {Object} Final results including all metrics
   */
  endTest() {
    if (!this.active) {
      return {
        wpm: 0,
        accuracy: 0,
        duration: 0,
        charactersTyped: 0,
        startTime: null,
        endTime: null
      };
    }

    this.endTime = Date.now();
    this.active = false;

    const stats = this.getCurrentStats();
    
    return {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      duration: this.endTime - this.startTime,
      charactersTyped: stats.charactersTyped,
      totalCharacters: stats.totalCharacters,
      startTime: this.startTime,
      endTime: this.endTime,
      isComplete: stats.isComplete
    };
  }

  /**
   * Update progress with current user input (immediate)
   * @param {string} userInput - Text typed by user
   * @param {string} targetText - Target text to match
   */
  updateProgress(userInput, targetText) {
    if (!this.active) return;

    this.userInput = userInput;
    this.targetText = targetText;
    this.lastUpdateTime = Date.now();
  }

  /**
   * Update progress with debounced calculations for performance
   * @param {string} userInput - Text typed by user
   * @param {string} targetText - Target text to match
   * @param {Function} callback - Optional callback to receive stats
   */
  updateProgressDebounced(userInput, targetText, callback = null) {
    if (!this.active) return;

    // Update immediately for accurate calculations
    this.userInput = userInput;
    this.targetText = targetText;
    this.lastUpdateTime = Date.now();

    // Clear any pending update
    if (this.pendingUpdate) {
      clearTimeout(this.pendingUpdate);
    }

    // Schedule debounced callback
    if (callback) {
      this.pendingUpdate = setTimeout(() => {
        const stats = this.getCurrentStats();
        callback(stats);
        this.pendingUpdate = null;
      }, this.updateFrequency);
    }
  }

  /**
   * Set the debounce frequency for updates
   * @param {number} frequency - Update frequency in milliseconds
   */
  setUpdateFrequency(frequency) {
    this.updateFrequency = Math.max(10, frequency); // Minimum 10ms
  }

  /**
   * Calculate current WPM using standard formula
   * @returns {number} Words per minute (rounded to nearest integer)
   */
  calculateWPM() {
    if (!this.active || !this.startTime || this.userInput.length === 0) {
      return 0;
    }

    const currentTime = this.lastUpdateTime || Date.now();
    const timeElapsedMs = currentTime - this.startTime;
    
    if (timeElapsedMs <= 0) {
      return 0;
    }

    const timeElapsedMinutes = timeElapsedMs / 60000;
    const charactersTyped = this.userInput.length;
    
    // Standard WPM formula: (characters / 5) / minutes
    const wpm = (charactersTyped / 5) / timeElapsedMinutes;
    
    return Math.round(wpm);
  }

  /**
   * Calculate current accuracy percentage
   * @returns {number} Accuracy percentage (0-100, rounded to nearest integer)
   */
  calculateAccuracy() {
    if (this.userInput.length === 0) {
      return 100; // Perfect accuracy when nothing typed
    }

    let correctCharacters = 0;
    const typedLength = this.userInput.length;
    
    // For accuracy calculation, we only compare up to the target text length
    // but calculate percentage based on characters actually typed
    const comparisonLength = Math.min(typedLength, this.targetText.length);
    
    for (let i = 0; i < comparisonLength; i++) {
      if (this.userInput[i] === this.targetText[i]) {
        correctCharacters++;
      }
    }

    // If user typed more than target, count extra characters as incorrect
    const accuracy = (correctCharacters / typedLength) * 100;
    return Math.round(accuracy);
  }

  /**
   * Get current statistics without modifying state
   * @returns {Object} Current metrics and progress information
   */
  getCurrentStats() {
    const wpm = this.calculateWPM();
    const accuracy = this.calculateAccuracy();
    const charactersTyped = this.userInput.length;
    const totalCharacters = this.targetText.length;
    const charactersRemaining = Math.max(0, totalCharacters - charactersTyped);
    const completionPercentage = totalCharacters > 0 
      ? Math.round((charactersTyped / totalCharacters) * 100 * 100) / 100 // Round to 2 decimals
      : 0;
    const isComplete = charactersTyped >= totalCharacters && this.userInput === this.targetText;

    return {
      wpm,
      accuracy,
      charactersTyped,
      totalCharacters,
      charactersRemaining,
      completionPercentage,
      isComplete,
      isActive: this.active,
      timeElapsed: this.active && this.startTime ? Date.now() - this.startTime : 0
    };
  }

  /**
   * Check if test is currently active
   * @returns {boolean} True if test is active
   */
  isActive() {
    return this.active;
  }

  /**
   * Get test start time
   * @returns {number|null} Start time timestamp or null if not started
   */
  getStartTime() {
    return this.startTime;
  }

  /**
   * Get test end time
   * @returns {number|null} End time timestamp or null if not ended
   */
  getEndTime() {
    return this.endTime;
  }
}

export default TypingMetrics;