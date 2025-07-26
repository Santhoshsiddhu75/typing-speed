import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import TypingMetrics from '../utils/TypingMetrics';

/**
 * Custom React hook for typing metrics integration
 * Provides real-time WPM and accuracy tracking with performance optimizations
 * 
 * @returns {Object} Hook interface with stats, controls, and event handlers
 */
const useTypingMetrics = () => {
  const metricsRef = useRef(null);
  const timerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    charactersTyped: 0,
    totalCharacters: 0,
    charactersRemaining: 0,
    completionPercentage: 0,
    isComplete: false,
    isActive: false,
    timeElapsed: 0
  });

  // Initialize metrics instance on first render
  useEffect(() => {
    if (!metricsRef.current) {
      metricsRef.current = TypingMetrics.getInstance();
    }
  }, []);

  // Memoized stats update callback for performance
  const updateStats = useCallback(() => {
    if (metricsRef.current) {
      const currentStats = metricsRef.current.getCurrentStats();
      setStats(currentStats);
    }
  }, []);

  // Start live timer that updates every second
  const startLiveTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      if (metricsRef.current && metricsRef.current.isActive()) {
        const currentStats = metricsRef.current.getCurrentStats();
        setStats(currentStats);
      }
    }, 1000); // Update every second
  }, []);

  // Stop live timer
  const stopLiveTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Debounced stats update for performance optimization
  const debouncedStatsUpdate = useCallback((newStats) => {
    setStats(newStats);
  }, []);

  /**
   * Start a new typing test
   */
  const startTest = useCallback(() => {
    if (metricsRef.current) {
      metricsRef.current.startTest();
      setIsActive(true);
      startLiveTimer(); // Start the live timer
      updateStats();
    }
  }, [updateStats, startLiveTimer]);

  /**
   * End the current typing test and return final results
   * @returns {Object} Final test results
   */
  const endTest = useCallback(() => {
    if (metricsRef.current) {
      const finalResults = metricsRef.current.endTest();
      setIsActive(false);
      stopLiveTimer(); // Stop the live timer
      updateStats();
      return finalResults;
    }
    return {
      wpm: 0,
      accuracy: 0,
      duration: 0,
      charactersTyped: 0,
      startTime: null,
      endTime: null
    };
  }, [updateStats, stopLiveTimer]);

  /**
   * Update typing progress with current user input
   * Uses debounced updates for performance optimization
   * @param {string} userInput - Current text typed by user
   * @param {string} targetText - Target text to match
   */
  const updateProgress = useCallback((userInput, targetText) => {
    if (metricsRef.current && isActive) {
      // Handle null/undefined inputs gracefully
      const safeUserInput = userInput || '';
      const safeTargetText = targetText || '';
      
      // Use debounced updates with callback for state management
      metricsRef.current.updateProgressDebounced(
        safeUserInput, 
        safeTargetText, 
        debouncedStatsUpdate
      );
      
      // Also update immediately for responsive UI
      const immediateStats = metricsRef.current.getCurrentStats();
      setStats(immediateStats);
    }
  }, [isActive, debouncedStatsUpdate]);

  /**
   * Reset hook and metrics state
   */
  const reset = useCallback(() => {
    if (metricsRef.current) {
      metricsRef.current.reset();
      setIsActive(false);
      stopLiveTimer(); // Stop the live timer
      setStats({
        wpm: 0,
        accuracy: 100,
        charactersTyped: 0,
        totalCharacters: 0,
        charactersRemaining: 0,
        completionPercentage: 0,
        isComplete: false,
        isActive: false,
        timeElapsed: 0
      });
    }
  }, [stopLiveTimer]);

  /**
   * Set custom update frequency for debounced updates
   * @param {number} frequency - Update frequency in milliseconds
   */
  const setUpdateFrequency = useCallback((frequency) => {
    if (metricsRef.current) {
      metricsRef.current.setUpdateFrequency(frequency);
    }
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  const hookInterface = useMemo(() => ({
    // Current statistics (memoized for performance)
    stats,
    
    // Test state
    isActive,
    
    // Control methods
    startTest,
    endTest,
    updateProgress,
    reset,
    
    // Configuration methods
    setUpdateFrequency,
    
    // Utility methods
    getCurrentStats: updateStats
  }), [
    stats,
    isActive,
    startTest,
    endTest,
    updateProgress,
    reset,
    setUpdateFrequency,
    updateStats
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (metricsRef.current && isActive) {
        metricsRef.current.reset();
      }
      stopLiveTimer(); // Clean up timer on unmount
    };
  }, [isActive, stopLiveTimer]);

  return hookInterface;
};

export default useTypingMetrics;