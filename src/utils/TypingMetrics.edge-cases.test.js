import { describe, it, expect, beforeEach, vi } from 'vitest';
import TypingMetrics from './TypingMetrics';

describe('TypingMetrics Edge Cases', () => {
  let typingMetrics;
  
  beforeEach(() => {
    // Reset singleton instance before each test
    TypingMetrics.instance = null;
    typingMetrics = TypingMetrics.getInstance();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  describe('Fast Typing (>150 WPM)', () => {
    it('should handle very fast typing speeds accurately', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      
      typingMetrics.startTest();
      
      // Simulate very fast typing: 200 characters in 12 seconds = ~200 WPM
      const fastText = 'The quick brown fox jumps over the lazy dog. This is a test of very fast typing speed that should exceed 150 words per minute when calculated properly by the system.';
      
      vi.setSystemTime(startTime + 12000); // 12 seconds
      typingMetrics.updateProgress(fastText, fastText + ' Additional text here.');
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.wpm).toBeGreaterThan(150);
      expect(stats.wpm).toBeLessThan(500); // Reasonable upper bound
      expect(stats.accuracy).toBe(100);
    });

    it('should maintain accuracy during rapid keystroke sequences', () => {
      typingMetrics.startTest();
      
      const rapidUpdates = [
        'T', 'Th', 'The', 'The ', 'The q', 'The qu', 'The qui', 'The quic', 'The quick'
      ];
      
      rapidUpdates.forEach((text, index) => {
        vi.setSystemTime(Date.now() + (index * 50)); // 50ms between keystrokes
        typingMetrics.updateProgress(text, 'The quick brown fox');
      });
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.accuracy).toBe(100);
      expect(stats.charactersTyped).toBe(9);
    });

    it('should not crash with extremely rapid updates', () => {
      typingMetrics.startTest();
      
      // Simulate 1000 updates in rapid succession
      const targetText = 'This is a performance stress test for the typing metrics engine';
      
      expect(() => {
        for (let i = 0; i < 1000; i++) {
          const text = targetText.substring(0, (i % targetText.length) + 1);
          typingMetrics.updateProgress(text, targetText);
        }
      }).not.toThrow();
    });
  });

  describe('Backspacing and Corrections', () => {
    it('should handle backspace corrections accurately', () => {
      typingMetrics.startTest();
      
      // Type "Hello world" then backspace to "Hello w" then type "orld"
      typingMetrics.updateProgress('Hello world', 'Hello world');
      expect(typingMetrics.getCurrentStats().accuracy).toBe(100);
      
      // Simulate backspacing
      typingMetrics.updateProgress('Hello w', 'Hello world');
      const statsAfterBackspace = typingMetrics.getCurrentStats();
      expect(statsAfterBackspace.charactersTyped).toBe(7);
      expect(statsAfterBackspace.accuracy).toBe(100);
      
      // Continue typing
      typingMetrics.updateProgress('Hello world', 'Hello world');
      const finalStats = typingMetrics.getCurrentStats();
      expect(finalStats.accuracy).toBe(100);
      expect(finalStats.charactersTyped).toBe(11);
    });

    it('should handle multiple backspace corrections', () => {
      typingMetrics.startTest();
      
      const sequence = [
        ['Hello wrold', 'Hello world'], // Typo
        ['Hello wro', 'Hello world'],   // Backspace to fix
        ['Hello wor', 'Hello world'],   // Backspace more
        ['Hello worl', 'Hello world'],  // Continue typing
        ['Hello world', 'Hello world']  // Complete
      ];
      
      sequence.forEach(([input, target]) => {
        typingMetrics.updateProgress(input, target);
      });
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.accuracy).toBe(100);
      expect(stats.isComplete).toBe(true);
    });

    it('should maintain reasonable accuracy with frequent corrections', () => {
      typingMetrics.startTest();
      
      // Simulate a user who makes mistakes and corrects them
      const corrections = [
        ['Hello', 'Hello world'],
        ['Hello wrold', 'Hello world'],    // Mistake
        ['Hello wro', 'Hello world'],      // Backspace
        ['Hello world', 'Hello world'],    // Correct
      ];
      
      corrections.forEach(([input, target]) => {
        typingMetrics.updateProgress(input, target);
      });
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.accuracy).toBeGreaterThan(80); // Should still be reasonably high
    });
  });

  describe('Cursor Repositioning and Non-Sequential Editing', () => {
    it('should handle cursor repositioning gracefully', () => {
      typingMetrics.startTest();
      
      // Simulate typing where cursor moves to different positions
      // This is a limitation - we can't easily detect cursor position
      // But we should handle non-sequential input gracefully
      
      typingMetrics.updateProgress('Hello world', 'Hello world');
      const stats1 = typingMetrics.getCurrentStats();
      
      // Simulate editing middle of text (cursor repositioning)
      typingMetrics.updateProgress('Hello beautiful world', 'Hello beautiful world');
      const stats2 = typingMetrics.getCurrentStats();
      
      expect(stats2.charactersTyped).toBeGreaterThan(stats1.charactersTyped);
      expect(stats2.accuracy).toBeGreaterThan(0);
    });

    it('should handle text replacement scenarios', () => {
      typingMetrics.startTest();
      
      // User types correctly first
      typingMetrics.updateProgress('The quick brown fox', 'The quick brown fox jumps');
      const stats1 = typingMetrics.getCurrentStats();
      expect(stats1.accuracy).toBe(100);
      
      // User selects and replaces text (this is a limitation of character-based accuracy)
      typingMetrics.updateProgress('The fast brown fox', 'The quick brown fox jumps'); // "quick" -> "fast"
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.charactersTyped).toBe(18); // "The fast brown fox" = 18 chars
      // Text replacement will lower accuracy due to character mismatches
      expect(stats.accuracy).toBeGreaterThan(0);
      expect(stats.accuracy).toBeLessThan(100);
    });
  });

  describe('Incomplete Test Scenarios', () => {
    it('should handle test abandonment gracefully', () => {
      typingMetrics.startTest();
      typingMetrics.updateProgress('Hello', 'Hello world this is a longer passage');
      
      // User abandons test - reset without completing
      const statsBeforeReset = typingMetrics.getCurrentStats();
      expect(statsBeforeReset.isComplete).toBe(false);
      
      typingMetrics.reset();
      
      const statsAfterReset = typingMetrics.getCurrentStats();
      expect(statsAfterReset.charactersTyped).toBe(0);
      expect(statsAfterReset.wpm).toBe(0);
      expect(statsAfterReset.isActive).toBe(false);
    });

    it('should provide meaningful stats for partially completed tests', () => {
      typingMetrics.startTest();
      
      const targetText = 'This is a longer passage that will not be completed fully';
      typingMetrics.updateProgress('This is a long', targetText);
      
      const partialStats = typingMetrics.getCurrentStats();
      expect(partialStats.completionPercentage).toBeGreaterThan(0);
      expect(partialStats.completionPercentage).toBeLessThan(100);
      expect(partialStats.charactersRemaining).toBeGreaterThan(0);
      expect(partialStats.isComplete).toBe(false);
    });

    it('should handle ending test before completion', () => {
      typingMetrics.startTest();
      typingMetrics.updateProgress('Partial', 'Partial completion test');
      
      const results = typingMetrics.endTest();
      
      expect(results).toHaveProperty('wpm');
      expect(results).toHaveProperty('accuracy');
      expect(results).toHaveProperty('duration');
      expect(results.isComplete).toBe(false);
      expect(results.charactersTyped).toBe(7);
    });
  });

  describe('Performance Edge Cases', () => {
    it('should execute calculations in under 10ms for normal input', () => {
      typingMetrics.startTest();
      
      const start = performance.now();
      typingMetrics.updateProgress('Test performance measurement', 'Test performance measurement for speed');
      const end = performance.now();
      
      expect(end - start).toBeLessThan(10);
    });

    it('should handle very long text passages efficiently', () => {
      typingMetrics.startTest();
      
      // Generate a very long text passage
      const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);
      const userInput = longText.substring(0, 500);
      
      const start = performance.now();
      typingMetrics.updateProgress(userInput, longText);
      const end = performance.now();
      
      expect(end - start).toBeLessThan(20); // Allow a bit more time for long text
      
      const stats = typingMetrics.getCurrentStats();
      expect(stats.charactersTyped).toBe(500);
      expect(stats.totalCharacters).toBe(longText.length);
    });

    it('should maintain performance with frequent stat queries', () => {
      typingMetrics.startTest();
      typingMetrics.updateProgress('Performance test', 'Performance test passage');
      
      const start = performance.now();
      
      // Query stats 1000 times
      for (let i = 0; i < 1000; i++) {
        typingMetrics.getCurrentStats();
      }
      
      const end = performance.now();
      expect(end - start).toBeLessThan(50); // Should be very fast
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory with repeated test cycles', () => {
      // Run many test cycles to check for memory leaks
      for (let i = 0; i < 100; i++) {
        typingMetrics.startTest();
        typingMetrics.updateProgress(`Test ${i}`, `Test ${i} passage`);
        typingMetrics.endTest();
        typingMetrics.reset();
      }
      
      // Should not throw or have issues after many cycles
      typingMetrics.startTest();
      const stats = typingMetrics.getCurrentStats();
      expect(stats.wpm).toBe(0);
      expect(stats.isActive).toBe(true);
    });

    it('should clean up debounced timers properly', () => {
      typingMetrics.startTest();
      
      // Create multiple debounced updates
      for (let i = 0; i < 10; i++) {
        typingMetrics.updateProgressDebounced(`Test ${i}`, 'Test passage', () => {});
      }
      
      // Reset should clean up all pending timers
      expect(() => typingMetrics.reset()).not.toThrow();
    });
  });

  describe('Data Integrity', () => {
    it('should maintain consistent state across all operations', () => {
      typingMetrics.startTest();
      
      const operations = [
        () => typingMetrics.updateProgress('H', 'Hello world'),
        () => typingMetrics.updateProgress('He', 'Hello world'),
        () => typingMetrics.updateProgress('Hel', 'Hello world'),
        () => typingMetrics.getCurrentStats(),
        () => typingMetrics.updateProgress('Hell', 'Hello world'),
        () => typingMetrics.updateProgress('Hello', 'Hello world'),
      ];
      
      operations.forEach(op => {
        expect(() => op()).not.toThrow();
      });
      
      const finalStats = typingMetrics.getCurrentStats();
      expect(finalStats.charactersTyped).toBe(5);
      expect(finalStats.accuracy).toBe(100);
    });

    it('should handle edge case timing scenarios', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      
      typingMetrics.startTest();
      
      // Test with zero elapsed time
      typingMetrics.updateProgress('A', 'ABC');
      let stats = typingMetrics.getCurrentStats();
      expect(stats.wpm).toBe(0); // Should handle zero time gracefully
      
      // Test with very small time intervals
      vi.setSystemTime(startTime + 1); // 1ms later
      typingMetrics.updateProgress('AB', 'ABC');
      stats = typingMetrics.getCurrentStats();
      expect(stats.wpm).toBeGreaterThanOrEqual(0);
    });
  });
});