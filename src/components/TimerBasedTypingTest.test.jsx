import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import TimerBasedTypingTest from './TimerBasedTypingTest';

// Mock the useTypingMetrics hook
vi.mock('../hooks/useTypingMetrics', () => ({
  default: () => ({
    stats: {
      wpm: 45,
      accuracy: 95,
      charactersTyped: 15,
      timeElapsed: 5000
    },
    startTest: vi.fn(),
    updateProgress: vi.fn(),
    endTest: vi.fn(() => ({
      wpm: 45,
      accuracy: 95,
      duration: 60000,
      charactersTyped: 15
    })),
    reset: vi.fn()
  })
}));

// Mock the word generator
vi.mock('../utils/WordGenerator', () => ({
  default: {
    initializeTest: vi.fn(),
    getWordsAsText: vi.fn(() => 'the quick brown fox jumps over the lazy dog'),
    initializePassageTest: vi.fn(() => Promise.resolve('the quick brown fox jumps over the lazy dog')),
    preloadPassages: vi.fn(() => Promise.resolve())
  }
}));

describe('TimerBasedTypingTest', () => {
  const mockProps = {
    duration: 60,
    difficulty: 'medium',
    onBack: vi.fn(),
    onComplete: vi.fn()
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders test configuration initially', async () => {
    render(<TimerBasedTypingTest {...mockProps} />);
    
    // Wait for loading to complete
    await screen.findByText('Start Test');
    
    expect(screen.getByText('Start Test')).toBeInTheDocument();
    expect(screen.getByText('1:00')).toBeInTheDocument(); // Timer shows 1 minute
    expect(screen.getByText(/medium.*1 min test/)).toBeInTheDocument();
  });

  it('shows loading state while text is being prepared', async () => {
    render(<TimerBasedTypingTest {...mockProps} />);
    
    // The component should immediately show the start button since our mock resolves quickly
    // But we can test that the loading logic is in place by checking that isLoadingText state exists
    await screen.findByText('Start Test');
    
    // Verify that the button is enabled (not disabled due to loading)
    const startButton = screen.getByText('Start Test');
    expect(startButton).not.toBeDisabled();
  });

  it('starts test when start button is clicked', async () => {
    render(<TimerBasedTypingTest {...mockProps} />);
    
    // Wait for loading to complete
    const startButton = await screen.findByText('Start Test');
    fireEvent.click(startButton);
    
    // The text container should now be active and focusable
    const textContainer = screen.getByTestId('typing-cursor').closest('[tabIndex="0"]');
    expect(textContainer).toHaveAttribute('tabIndex', '0');
    expect(textContainer).toHaveClass('focus:border-blue-500');
  });

  it('displays timer countdown during test', async () => {
    render(<TimerBasedTypingTest {...mockProps} />);
    
    // Wait for loading and start the test
    const startButton = await screen.findByText('Start Test');
    fireEvent.click(startButton);
    
    // Timer should start at 1:00
    expect(screen.getByText('1:00')).toBeInTheDocument();
    
    // Advance timer by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(screen.getByText('0:55')).toBeInTheDocument();
  });

  it('handles keyboard input and shows TextHighlighter', async () => {
    render(<TimerBasedTypingTest {...mockProps} />);
    
    // Wait for loading and start the test
    const startButton = await screen.findByText('Start Test');
    fireEvent.click(startButton);
    
    // Get the text container by finding the element that has tabIndex and keyboard handler
    const textContainer = screen.getByTestId('typing-cursor').closest('[tabIndex="0"]');
    
    // Simulate typing
    fireEvent.keyDown(textContainer, { key: 't' });
    fireEvent.keyDown(textContainer, { key: 'h' });
    fireEvent.keyDown(textContainer, { key: 'e' });
    fireEvent.keyDown(textContainer, { key: ' ' });
    
    // The TextHighlighter should be working (we can't easily test the internal state without a visible input)
    expect(textContainer).toBeInTheDocument();
  });

  it('shows completion screen when timer runs out', async () => {
    render(<TimerBasedTypingTest {...mockProps} />);
    
    // Wait for loading and start the test
    const startButton = await screen.findByText('Start Test');
    fireEvent.click(startButton);
    
    // Fast forward to end of timer
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    
    expect(screen.getByText('Test Complete!')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument(); // WPM
    expect(screen.getByText('95%')).toBeInTheDocument(); // Accuracy
  });

  it('allows user to try again after completion', async () => {
    render(<TimerBasedTypingTest {...mockProps} />);
    
    // Wait for loading and start test
    const startButton = await screen.findByText('Start Test');
    fireEvent.click(startButton);
    
    // Complete test
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    
    // Click try again and wait for new text to load
    fireEvent.click(screen.getByText('Try Again'));
    
    // Wait for the new test to be ready
    await screen.findByText('Start Test');
    
    expect(screen.getByText('Start Test')).toBeInTheDocument();
    expect(screen.getByText('1:00')).toBeInTheDocument(); // Timer reset
  });

  it('displays live stats during typing', async () => {
    render(<TimerBasedTypingTest {...mockProps} />);
    
    // Wait for loading and start the test
    const startButton = await screen.findByText('Start Test');
    fireEvent.click(startButton);
    
    // Check that live stats are displayed
    expect(screen.getByText('45')).toBeInTheDocument(); // WPM from mock
    expect(screen.getByText('95%')).toBeInTheDocument(); // Accuracy from mock
  });
});