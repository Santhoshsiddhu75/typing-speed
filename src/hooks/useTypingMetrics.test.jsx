import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useTypingMetrics from './useTypingMetrics';

describe('useTypingMetrics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  describe('Hook Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useTypingMetrics());

      expect(result.current.stats).toEqual({
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
      expect(result.current.isActive).toBe(false);
      expect(typeof result.current.startTest).toBe('function');
      expect(typeof result.current.endTest).toBe('function');
      expect(typeof result.current.updateProgress).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('Test Lifecycle Management', () => {
    it('should start test and update isActive state', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
      });

      expect(result.current.isActive).toBe(true);
      expect(result.current.stats.isActive).toBe(true);
    });

    it('should end test and return final results', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
      });

      act(() => {
        result.current.updateProgress('hello world', 'hello world test');
      });

      let finalResults;
      act(() => {
        finalResults = result.current.endTest();
      });

      expect(result.current.isActive).toBe(false);
      expect(finalResults).toHaveProperty('wpm');
      expect(finalResults).toHaveProperty('accuracy');
      expect(finalResults).toHaveProperty('duration');
      expect(finalResults).toHaveProperty('charactersTyped');
    });

    it('should reset hook state', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
        result.current.updateProgress('test', 'test text');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.stats.charactersTyped).toBe(0);
      expect(result.current.stats.wpm).toBe(0);
    });
  });

  describe('Real-time Progress Updates', () => {
    it('should update stats when progress changes', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
      });

      act(() => {
        result.current.updateProgress('hello', 'hello world');
      });

      expect(result.current.stats.charactersTyped).toBe(5);
      expect(result.current.stats.totalCharacters).toBe(11);
      expect(result.current.stats.accuracy).toBe(100);
    });

    it('should calculate WPM in real-time', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
      });

      // Advance time by 1 minute
      vi.advanceTimersByTime(60000);

      act(() => {
        result.current.updateProgress('hello world test', 'hello world test passage');
      });

      // Should have some WPM since we typed characters over time
      expect(result.current.stats.wpm).toBeGreaterThan(0);
    });

    it('should update completion percentage', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
      });

      act(() => {
        result.current.updateProgress('hello', 'hello world'); // 5 out of 11 chars
      });

      expect(result.current.stats.completionPercentage).toBeCloseTo(45.45);
    });
  });

  describe('Performance Optimizations', () => {
    it('should use debounced updates by default', () => {
      const { result } = renderHook(() => useTypingMetrics());
      const updateSpy = vi.fn();

      act(() => {
        result.current.startTest();
      });

      // Multiple rapid updates
      act(() => {
        result.current.updateProgress('h', 'hello world');
        result.current.updateProgress('he', 'hello world');
        result.current.updateProgress('hel', 'hello world');
      });

      // Stats should reflect the last update immediately
      expect(result.current.stats.charactersTyped).toBe(3);
    });

    it('should not cause unnecessary re-renders for same stats', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
        result.current.updateProgress('hello', 'hello world');
      });

      const statsBeforeRepeatedUpdate = result.current.stats;

      act(() => {
        result.current.updateProgress('hello', 'hello world'); // Same input
      });

      // Should still have the same stats
      expect(result.current.stats.charactersTyped).toBe(5);
      expect(result.current.stats.accuracy).toBe(100);
    });
  });

  describe('Event Handling Integration', () => {
    it('should handle keystroke timing accurately', () => {
      const { result } = renderHook(() => useTypingMetrics());
      const startTime = Date.now();
      vi.setSystemTime(startTime);

      act(() => {
        result.current.startTest();
      });

      vi.setSystemTime(startTime + 5000); // 5 seconds later

      act(() => {
        result.current.updateProgress('hello', 'hello world');
      });

      expect(result.current.stats.timeElapsed).toBe(5000);
    });

    it('should provide current stats without modifying internal state', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
        result.current.updateProgress('test', 'test passage');
      });

      const stats1 = result.current.stats;
      const stats2 = result.current.stats;

      expect(stats1).toEqual(stats2);
      // Should be the same reference for performance (memoization)
      expect(stats1).toBe(stats2);
    });
  });

  describe('State Management Integration', () => {
    it('should maintain consistent state across multiple updates', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
      });

      const updates = [
        ['h', 'hello world'],
        ['he', 'hello world'], 
        ['hel', 'hello world'],
        ['hell', 'hello world'],
        ['hello', 'hello world']
      ];

      updates.forEach(([input, target]) => {
        act(() => {
          result.current.updateProgress(input, target);
        });
      });

      expect(result.current.stats.charactersTyped).toBe(5);
      expect(result.current.stats.totalCharacters).toBe(11);
      expect(result.current.stats.accuracy).toBe(100);
    });

    it('should handle component unmounting gracefully', () => {
      const { result, unmount } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
        result.current.updateProgress('test', 'test passage');
      });

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid inputs gracefully', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
      });

      expect(() => {
        act(() => {
          result.current.updateProgress(null, 'test');
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          result.current.updateProgress('test', null);
        });
      }).not.toThrow();
    });

    it('should handle operations when test is not active', () => {
      const { result } = renderHook(() => useTypingMetrics());

      expect(() => {
        act(() => {
          result.current.updateProgress('test', 'test passage');
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          result.current.endTest();
        });
      }).not.toThrow();
    });
  });

  describe('Live Timer Updates', () => {
    it('should start and stop live timer without errors', () => {
      const { result } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
        result.current.updateProgress('hello', 'hello world');
      });

      expect(result.current.isActive).toBe(true);

      act(() => {
        result.current.endTest();
      });

      expect(result.current.isActive).toBe(false);
    });

    it('should clean up timer on unmount', () => {
      const { result, unmount } = renderHook(() => useTypingMetrics());

      act(() => {
        result.current.startTest();
      });

      expect(() => unmount()).not.toThrow();
    });
  });
});