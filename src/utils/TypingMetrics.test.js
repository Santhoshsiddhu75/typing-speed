import { describe, it, expect, beforeEach, vi } from 'vitest';
import TypingMetrics from './TypingMetrics';

describe('TypingMetrics', () => {
  let typingMetrics;
  
  beforeEach(() => {
    // Reset singleton instance before each test
    TypingMetrics.instance = null;
    typingMetrics = TypingMetrics.getInstance();
    // Mock Date.now for consistent timing tests
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = TypingMetrics.getInstance();
      const instance2 = TypingMetrics.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should not allow direct instantiation', () => {
      expect(() => new TypingMetrics()).toThrow('Use TypingMetrics.getInstance()');
    });
  });

  describe('Test Lifecycle', () => {
    it('should start test and record start time', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      
      typingMetrics.startTest();
      
      expect(typingMetrics.isActive()).toBe(true);
      expect(typingMetrics.getStartTime()).toBe(startTime);
    });

    it('should end test and record end time', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      typingMetrics.startTest();
      
      const endTime = startTime + 60000; // 1 minute later
      vi.setSystemTime(endTime);
      
      const result = typingMetrics.endTest();
      
      expect(typingMetrics.isActive()).toBe(false);
      expect(result.duration).toBe(60000);
      expect(result.endTime).toBe(endTime);
    });

    it('should reset test state when starting new test', () => {
      typingMetrics.startTest();
      typingMetrics.updateProgress('hello', 'hello world');
      
      typingMetrics.startTest(); // Start new test
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.wpm).toBe(0);
      expect(stats.accuracy).toBe(100); // Default accuracy when no characters typed
      expect(stats.charactersTyped).toBe(0);
    });
  });

  describe('WPM Calculation', () => {
    it('should calculate WPM using standard formula (characters/5)/minutes', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      typingMetrics.startTest();
      
      // Simulate 30 seconds of typing with 25 characters
      vi.setSystemTime(startTime + 30000);
      typingMetrics.updateProgress('hello world, this is test', 'hello world, this is test text');
      
      const stats = typingMetrics.getCurrentStats();
      // 25 characters / 5 = 5 words, 0.5 minutes elapsed = 10 WPM
      expect(stats.wpm).toBe(10);
    });

    it('should return 0 WPM when no time has elapsed', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      typingMetrics.startTest();
      
      // No time advancement
      typingMetrics.updateProgress('hello', 'hello world');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.wpm).toBe(0);
    });

    it('should handle very fast typing speeds correctly', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      typingMetrics.startTest();
      
      // Simulate 10 seconds with 150 characters (very fast typing)
      vi.setSystemTime(startTime + 10000);
      const fastText = 'a'.repeat(150);
      typingMetrics.updateProgress(fastText, fastText + ' more text');
      
      const stats = typingMetrics.getCurrentStats();
      // 150 characters / 5 = 30 words, 10/60 = 0.167 minutes = 180 WPM
      expect(stats.wpm).toBe(180);
    });
  });

  describe('Accuracy Calculation', () => {
    it('should calculate accuracy as percentage of correct characters', () => {
      typingMetrics.startTest();
      
      // 9 correct out of 9 characters = 100% accuracy
      typingMetrics.updateProgress('hello wor', 'hello world');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.accuracy).toBe(100);
    });

    it('should handle 100% accuracy correctly', () => {
      typingMetrics.startTest();
      
      typingMetrics.updateProgress('hello', 'hello world');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.accuracy).toBe(100);
    });

    it('should handle 0% accuracy correctly', () => {
      typingMetrics.startTest();
      
      typingMetrics.updateProgress('xxxxx', 'hello');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.accuracy).toBe(0);
    });

    it('should return 100% accuracy when no characters typed', () => {
      typingMetrics.startTest();
      
      typingMetrics.updateProgress('', 'hello world');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.accuracy).toBe(100);
    });

    it('should handle partial correct typing accurately', () => {
      typingMetrics.startTest();
      
      // "hello wxrld" vs "hello world" = 10/11 = 91%
      typingMetrics.updateProgress('hello wxrld', 'hello world');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.accuracy).toBe(91);
    });
  });

  describe('Progress Tracking', () => {
    it('should track characters typed and remaining', () => {
      typingMetrics.startTest();
      
      typingMetrics.updateProgress('hello wo', 'hello world');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.charactersTyped).toBe(8);
      expect(stats.totalCharacters).toBe(11);
      expect(stats.charactersRemaining).toBe(3);
    });

    it('should track completion percentage', () => {
      typingMetrics.startTest();
      
      typingMetrics.updateProgress('hello', 'hello world');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.completionPercentage).toBe(45.45); // 5/11 * 100, rounded to 2 decimals
    });

    it('should handle completion correctly', () => {
      typingMetrics.startTest();
      
      typingMetrics.updateProgress('hello world', 'hello world');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.isComplete).toBe(true);
      expect(stats.completionPercentage).toBe(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty input correctly', () => {
      typingMetrics.startTest();
      
      typingMetrics.updateProgress('', '');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.wpm).toBe(0);
      expect(stats.accuracy).toBe(100);
      expect(stats.charactersTyped).toBe(0);
    });

    it('should handle longer typed text than target', () => {
      typingMetrics.startTest();
      
      typingMetrics.updateProgress('hello world extra', 'hello world');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.charactersTyped).toBe(17);
      expect(stats.totalCharacters).toBe(11);
      // First 11 characters match (100%), but 6 extra characters count as errors
      // 11 correct out of 17 total = 65% accuracy
      expect(stats.accuracy).toBe(65);
    });

    it('should handle special characters and punctuation', () => {
      typingMetrics.startTest();
      
      typingMetrics.updateProgress('Hello, World!', 'Hello, World!');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.accuracy).toBe(100);
      expect(stats.charactersTyped).toBe(13);
    });

    it('should not throw error when ending test that was never started', () => {
      expect(() => typingMetrics.endTest()).not.toThrow();
    });
  });

  describe('Performance Requirements', () => {
    it('should complete calculations in under 10ms', () => {
      typingMetrics.startTest();
      
      const start = performance.now();
      typingMetrics.updateProgress('hello world test', 'hello world test passage for performance');
      const end = performance.now();
      
      expect(end - start).toBeLessThan(10);
    });

    it('should handle rapid successive updates without performance degradation', () => {
      typingMetrics.startTest();
      
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        typingMetrics.updateProgress('test'.repeat(i), 'test text passage');
      }
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50); // Total for 100 updates should be under 50ms
    });
  });

  describe('Integration Support', () => {
    it('should provide current stats without modifying state', () => {
      typingMetrics.startTest();
      typingMetrics.updateProgress('hello', 'hello world');
      
      const stats1 = typingMetrics.getCurrentStats();
      const stats2 = typingMetrics.getCurrentStats();
      
      expect(stats1).toEqual(stats2);
      expect(stats1).not.toBe(stats2); // Should be different objects
    });

    it('should provide final results on test end', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      typingMetrics.startTest();
      
      vi.setSystemTime(startTime + 60000);
      typingMetrics.updateProgress('hello world', 'hello world');
      
      const finalResult = typingMetrics.endTest();
      
      expect(finalResult).toHaveProperty('wpm');
      expect(finalResult).toHaveProperty('accuracy');
      expect(finalResult).toHaveProperty('duration');
      expect(finalResult).toHaveProperty('charactersTyped');
      expect(finalResult).toHaveProperty('startTime');
      expect(finalResult).toHaveProperty('endTime');
    });
  });

  describe('Debounced Updates', () => {
    it('should handle debounced updates without immediate callback', () => {
      typingMetrics.startTest();
      
      typingMetrics.updateProgressDebounced('hello', 'hello world');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.charactersTyped).toBe(5);
      expect(stats.accuracy).toBe(100);
    });

    it('should call callback after debounce delay', () => {
      const callback = vi.fn();
      typingMetrics.startTest();
      
      typingMetrics.updateProgressDebounced('hello', 'hello world', callback);
      
      expect(callback).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      
      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        charactersTyped: 5,
        accuracy: 100
      }));
    });

    it('should cancel previous debounced update when new one is requested', () => {
      const callback = vi.fn();
      typingMetrics.startTest();
      
      typingMetrics.updateProgressDebounced('hello', 'hello world', callback);
      vi.advanceTimersByTime(50); // Half way through
      
      typingMetrics.updateProgressDebounced('hello w', 'hello world', callback);
      vi.advanceTimersByTime(50); // Complete first timer (should be cancelled)
      
      expect(callback).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50); // Complete second timer
      
      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        charactersTyped: 7
      }));
    });

    it('should allow setting custom update frequency', () => {
      const callback = vi.fn();
      typingMetrics.setUpdateFrequency(200);
      typingMetrics.startTest();
      
      typingMetrics.updateProgressDebounced('hello', 'hello world', callback);
      
      vi.advanceTimersByTime(100);
      expect(callback).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledOnce();
    });

    it('should enforce minimum update frequency of 10ms', () => {
      typingMetrics.setUpdateFrequency(5);
      expect(typingMetrics.updateFrequency).toBe(10);
    });

    it('should clear pending updates on reset', () => {
      const callback = vi.fn();
      typingMetrics.startTest();
      
      typingMetrics.updateProgressDebounced('hello', 'hello world', callback);
      typingMetrics.reset();
      
      vi.advanceTimersByTime(100);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});