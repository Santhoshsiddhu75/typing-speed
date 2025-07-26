import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TestResults from './TestResults';

describe('TestResults', () => {
  const mockResults = {
    wpm: 45,
    accuracy: 95,
    duration: 60000, // 1 minute in milliseconds
    charactersTyped: 225,
    wordsTyped: 45,
    difficulty: 'medium',
    testType: 'timer-based'
  };

  const mockProps = {
    results: mockResults,
    onRetry: vi.fn(),
    onNewTest: vi.fn(),
    previousBest: null,
    showPersonalRecords: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders test results with correct metrics', () => {
    render(<TestResults {...mockProps} />);
    
    expect(screen.getByText('Test Complete!')).toBeInTheDocument();
    expect(screen.getByText('Words Per Minute')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument(); // Accuracy
    expect(screen.getByText('1:00')).toBeInTheDocument(); // Time
    expect(screen.getByText('225')).toBeInTheDocument(); // Characters
  });

  it('shows performance level badge', () => {
    render(<TestResults {...mockProps} />);
    
    // With 45 WPM, should show Intermediate level
    expect(screen.getByText('Intermediate Level')).toBeInTheDocument();
  });

  it('displays action buttons', () => {
    render(<TestResults {...mockProps} />);
    
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('New Test')).toBeInTheDocument();
    expect(screen.getByText('Save Results')).toBeInTheDocument();
  });

  it('calls onRetry when Try Again is clicked', () => {
    render(<TestResults {...mockProps} />);
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    
    expect(mockProps.onRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onNewTest when New Test is clicked', () => {
    render(<TestResults {...mockProps} />);
    
    const newTestButton = screen.getByText('New Test');
    fireEvent.click(newTestButton);
    
    expect(mockProps.onNewTest).toHaveBeenCalledTimes(1);
  });

  it('shows new record notification when WPM improves', () => {
    const propsWithRecord = {
      ...mockProps,
      previousBest: { wpm: 40, accuracy: 90 }
    };
    
    render(<TestResults {...propsWithRecord} />);
    
    expect(screen.getByText('New Personal Record!')).toBeInTheDocument();
    expect(screen.getByText(/You beat your previous best by 5.0 WPM/)).toBeInTheDocument();
  });

  it('shows improvement indicators when previous best exists', () => {
    const propsWithPrevious = {
      ...mockProps,
      previousBest: { wpm: 40, accuracy: 90 }
    };
    
    render(<TestResults {...propsWithPrevious} />);
    
    expect(screen.getByText('Progress vs. Previous Best')).toBeInTheDocument();
    expect(screen.getByText('WPM Change')).toBeInTheDocument();
    expect(screen.getByText('Accuracy Change')).toBeInTheDocument();
  });

  it('shows motivational message', () => {
    render(<TestResults {...mockProps} />);
    
    // Should show positive message for good accuracy and speed
    expect(screen.getByText(/Excellent accuracy!/)).toBeInTheDocument();
    expect(screen.getByText(/Every practice session makes you better!/)).toBeInTheDocument();
  });

  it('displays different performance levels correctly', () => {
    // Test Expert level (70+ WPM)
    const expertResults = { ...mockResults, wpm: 75 };
    const { rerender } = render(<TestResults {...mockProps} results={expertResults} />);
    expect(screen.getByText('Expert Level')).toBeInTheDocument();

    // Test Advanced level (50+ WPM)
    const advancedResults = { ...mockResults, wpm: 55 };
    rerender(<TestResults {...mockProps} results={advancedResults} />);
    expect(screen.getByText('Advanced Level')).toBeInTheDocument();

    // Test Beginner level (<30 WPM)
    const beginnerResults = { ...mockResults, wpm: 25 };
    rerender(<TestResults {...mockProps} results={beginnerResults} />);
    expect(screen.getByText('Beginner Level')).toBeInTheDocument();
  });

  it('handles missing optional data gracefully', () => {
    const minimalResults = {
      wpm: 30,
      accuracy: 85,
      duration: 120000,
      charactersTyped: 150
    };
    
    const minimalProps = {
      results: minimalResults,
      onRetry: vi.fn(),
      onNewTest: vi.fn()
    };
    
    render(<TestResults {...minimalProps} />);
    
    expect(screen.getByText('Test Complete!')).toBeInTheDocument();
    expect(screen.getByText('Words Per Minute')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument(); // Accuracy
  });
});