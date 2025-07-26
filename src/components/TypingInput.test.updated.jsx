import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import TypingInput from './TypingInput';

// Mock the useTypingMetrics hook
vi.mock('../hooks/useTypingMetrics', () => ({
  default: () => ({
    stats: {
      wpm: 0,
      accuracy: 100,
      charactersTyped: 0,
      totalCharacters: 0,
      charactersRemaining: 0,
      completionPercentage: 0,
      isComplete: false,
      isActive: false,
      timeElapsed: 0
    },
    isActive: false,
    startTest: vi.fn(),
    endTest: vi.fn(() => ({
      wpm: 45,
      accuracy: 95,
      duration: 60000,
      charactersTyped: 10,
      startTime: Date.now() - 60000,
      endTime: Date.now()
    })),
    updateProgress: vi.fn(),
    reset: vi.fn()
  })
}));

describe('TypingInput Component with Metrics Integration', () => {
  const sampleText = "Hello world";
  const mockOnComplete = vi.fn();
  const mockOnProgressUpdate = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
    mockOnProgressUpdate.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Basic Functionality (Backward Compatibility)', () => {
    it('renders with target text displayed', () => {
      render(<TypingInput targetText={sampleText} />);
      
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('world')).toBeInTheDocument();
    });

    it('shows typing instructions initially', () => {
      render(<TypingInput targetText={sampleText} />);
      
      expect(screen.getByText('Click here and start typing')).toBeInTheDocument();
    });

    it('becomes active when clicked', () => {
      render(<TypingInput targetText={sampleText} />);
      
      const textArea = screen.getByRole('textbox', { name: /type the displayed text here/i });
      fireEvent.click(textArea);
      
      expect(textArea).toHaveClass('border-blue-400');
    });

    it('has proper accessibility attributes', () => {
      render(<TypingInput targetText={sampleText} />);
      
      const textArea = screen.getByRole('textbox', { name: /type the displayed text here/i });
      expect(textArea).toHaveAttribute('aria-label', 'Type the displayed text here');
      expect(textArea).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Metrics Integration', () => {
    it('displays real-time WPM during typing', () => {
      const mockUseTypingMetrics = vi.fn(() => ({
        stats: {
          wpm: 45,
          accuracy: 95,
          charactersTyped: 5,
          totalCharacters: 11,
          charactersRemaining: 6,
          completionPercentage: 45.45,
          isComplete: false,
          isActive: true,
          timeElapsed: 5000
        },
        isActive: true,
        startTest: vi.fn(),
        endTest: vi.fn(),
        updateProgress: vi.fn(),
        reset: vi.fn()
      }));

      vi.doMock('../hooks/useTypingMetrics', () => ({
        default: mockUseTypingMetrics
      }));

      render(<TypingInput targetText={sampleText} />);
      
      expect(screen.getByText(/WPM: 45/)).toBeInTheDocument();
    });

    it('displays improved accuracy calculation from TypingMetrics engine', () => {
      const mockUseTypingMetrics = vi.fn(() => ({
        stats: {
          wpm: 30,
          accuracy: 87,
          charactersTyped: 8,
          totalCharacters: 11,
          charactersRemaining: 3,
          completionPercentage: 72.73,
          isComplete: false,
          isActive: true,
          timeElapsed: 8000
        },
        isActive: true,
        startTest: vi.fn(),
        endTest: vi.fn(),
        updateProgress: vi.fn(),
        reset: vi.fn()
      }));

      vi.doMock('../hooks/useTypingMetrics', () => ({
        default: mockUseTypingMetrics
      }));

      render(<TypingInput targetText={sampleText} />);
      
      expect(screen.getByText(/Accuracy: 87%/)).toBeInTheDocument();
    });

    it('starts typing test when user begins typing', () => {
      const mockStartTest = vi.fn();
      const mockUpdateProgress = vi.fn();
      
      const mockUseTypingMetrics = vi.fn(() => ({
        stats: {
          wpm: 0,
          accuracy: 100,
          charactersTyped: 0,
          totalCharacters: 11,
          charactersRemaining: 11,
          completionPercentage: 0,
          isComplete: false,
          isActive: false,
          timeElapsed: 0
        },
        isActive: false,
        startTest: mockStartTest,
        endTest: vi.fn(),
        updateProgress: mockUpdateProgress,
        reset: vi.fn()
      }));

      vi.doMock('../hooks/useTypingMetrics', () => ({
        default: mockUseTypingMetrics
      }));

      render(<TypingInput targetText={sampleText} />);
      
      const hiddenInput = document.querySelector('input[type="text"]');
      fireEvent.change(hiddenInput, { target: { value: 'H' } });
      
      expect(mockStartTest).toHaveBeenCalledOnce();
      expect(mockUpdateProgress).toHaveBeenCalledWith('H', sampleText);
    });

    it('calls endTest and onComplete when typing is finished', () => {
      const mockEndTest = vi.fn(() => ({
        wpm: 45,
        accuracy: 100,
        duration: 30000,
        charactersTyped: 11,
        startTime: Date.now() - 30000,
        endTime: Date.now()
      }));
      
      const mockUseTypingMetrics = vi.fn(() => ({
        stats: {
          wpm: 45,
          accuracy: 100,
          charactersTyped: 11,
          totalCharacters: 11,
          charactersRemaining: 0,
          completionPercentage: 100,
          isComplete: true,
          isActive: true,
          timeElapsed: 30000
        },
        isActive: true,
        startTest: vi.fn(),
        endTest: mockEndTest,
        updateProgress: vi.fn(),
        reset: vi.fn()
      }));

      vi.doMock('../hooks/useTypingMetrics', () => ({
        default: mockUseTypingMetrics
      }));

      render(
        <TypingInput 
          targetText={sampleText} 
          onComplete={mockOnComplete}
        />
      );
      
      const hiddenInput = document.querySelector('input[type="text"]');
      fireEvent.change(hiddenInput, { target: { value: sampleText } });
      
      expect(mockEndTest).toHaveBeenCalledOnce();
      expect(mockOnComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          wpm: 45,
          accuracy: 100,
          duration: 30000
        })
      );
    });

    it('displays comprehensive progress information', () => {
      const mockUseTypingMetrics = vi.fn(() => ({
        stats: {
          wpm: 35,
          accuracy: 92,
          charactersTyped: 7,
          totalCharacters: 11,
          charactersRemaining: 4,
          completionPercentage: 63.64,
          isComplete: false,
          isActive: true,
          timeElapsed: 12000
        },
        isActive: true,
        startTest: vi.fn(),
        endTest: vi.fn(),
        updateProgress: vi.fn(),
        reset: vi.fn()
      }));

      vi.doMock('../hooks/useTypingMetrics', () => ({
        default: mockUseTypingMetrics
      }));

      render(<TypingInput targetText={sampleText} />);
      
      expect(screen.getByText(/Progress: 7 \/ 11 characters/)).toBeInTheDocument();
      expect(screen.getByText(/WPM: 35/)).toBeInTheDocument();
      expect(screen.getByText(/Accuracy: 92%/)).toBeInTheDocument();
    });
  });

  describe('Progress Updates Integration', () => {
    it('calls onProgressUpdate with enhanced metrics data', () => {
      const mockUseTypingMetrics = vi.fn(() => ({
        stats: {
          wpm: 40,
          accuracy: 88,
          charactersTyped: 5,
          totalCharacters: 11,
          charactersRemaining: 6,
          completionPercentage: 45.45,
          isComplete: false,
          isActive: true,
          timeElapsed: 7500
        },
        isActive: true,
        startTest: vi.fn(),
        endTest: vi.fn(),
        updateProgress: vi.fn(),
        reset: vi.fn()
      }));

      vi.doMock('../hooks/useTypingMetrics', () => ({
        default: mockUseTypingMetrics
      }));

      render(
        <TypingInput 
          targetText={sampleText} 
          onProgressUpdate={mockOnProgressUpdate}
        />
      );
      
      const hiddenInput = document.querySelector('input[type="text"]');
      fireEvent.change(hiddenInput, { target: { value: 'Hello' } });
      
      expect(mockOnProgressUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          userInput: 'Hello',
          targetText: sampleText,
          charactersTyped: 5,
          totalCharacters: 11,
          isComplete: false,
          wpm: 40,
          accuracy: 88,
          completionPercentage: 45.45,
          timeElapsed: 7500
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('handles typing metrics errors gracefully', () => {
      const mockUseTypingMetrics = vi.fn(() => ({
        stats: {
          wpm: 0,
          accuracy: 100,
          charactersTyped: 0,
          totalCharacters: 0,
          charactersRemaining: 0,
          completionPercentage: 0,
          isComplete: false,
          isActive: false,
          timeElapsed: 0
        },
        isActive: false,
        startTest: vi.fn(() => { throw new Error('Test error'); }),
        endTest: vi.fn(),
        updateProgress: vi.fn(),
        reset: vi.fn()
      }));

      vi.doMock('../hooks/useTypingMetrics', () => ({
        default: mockUseTypingMetrics
      }));

      render(<TypingInput targetText={sampleText} />);
      
      const hiddenInput = document.querySelector('input[type="text"]');
      
      expect(() => {
        fireEvent.change(hiddenInput, { target: { value: 'H' } });
      }).not.toThrow();
      
      // Should still display basic progress
      expect(screen.getByText(/Progress: 1 \/ 11 characters/)).toBeInTheDocument();
    });

    it('handles incomplete tests when component unmounts', () => {
      const mockReset = vi.fn();
      
      const mockUseTypingMetrics = vi.fn(() => ({
        stats: {
          wpm: 25,
          accuracy: 90,
          charactersTyped: 5,
          totalCharacters: 11,
          charactersRemaining: 6,
          completionPercentage: 45.45,
          isComplete: false,
          isActive: true,
          timeElapsed: 10000
        },
        isActive: true,
        startTest: vi.fn(),
        endTest: vi.fn(),
        updateProgress: vi.fn(),
        reset: mockReset
      }));

      vi.doMock('../hooks/useTypingMetrics', () => ({
        default: mockUseTypingMetrics
      }));

      const { unmount } = render(<TypingInput targetText={sampleText} />);
      
      unmount();
      
      expect(mockReset).toHaveBeenCalledOnce();
    });
  });
});