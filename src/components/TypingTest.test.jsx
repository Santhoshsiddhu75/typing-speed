import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TypingTest from './TypingTest';

// Mock the TimerBasedTypingTest component
vi.mock('./TimerBasedTypingTest', () => ({
  default: ({ duration, difficulty, onBack, onComplete }) => (
    <div data-testid="timer-based-test">
      <p>Timer Test: {duration}s, {difficulty}</p>
      <button onClick={onBack}>Back</button>
      <button onClick={() => onComplete({ wpm: 45, accuracy: 95 })}>Complete</button>
    </div>
  )
}));

describe('TypingTest Component', () => {
  it('renders the test configuration interface', () => {
    render(<TypingTest />);
    
    // Check if main title is present
    expect(screen.getByText('Typing Speed Test')).toBeInTheDocument();
    expect(screen.getByText('Test your typing speed and accuracy with timed challenges')).toBeInTheDocument();
  });

  it('displays timer selection options', () => {
    render(<TypingTest />);
    
    // Check for timer selection header and options using more specific queries
    expect(screen.getByText('Select Test Duration')).toBeInTheDocument();
    expect(screen.getAllByText('1 min').length).toBeGreaterThan(0);
    expect(screen.getByText('2 mins')).toBeInTheDocument();
    expect(screen.getByText('5 mins')).toBeInTheDocument();
    expect(screen.getByText('Quick test')).toBeInTheDocument();
    expect(screen.getByText('Standard test')).toBeInTheDocument();
    expect(screen.getByText('Endurance test')).toBeInTheDocument();
  });

  it('displays difficulty selection options', () => {
    render(<TypingTest />);
    
    // Check for difficulty options
    expect(screen.getByText('Select Difficulty Level')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Hard')).toBeInTheDocument();
    expect(screen.getByText('Common words, simple vocabulary')).toBeInTheDocument();
    expect(screen.getByText('Mixed vocabulary, moderate complexity')).toBeInTheDocument();
    expect(screen.getByText('Advanced words, technical terms')).toBeInTheDocument();
  });

  it('starts test when start button is clicked', () => {
    render(<TypingTest />);
    
    const startButton = screen.getByText('Start Typing Test');
    fireEvent.click(startButton);
    
    // Should now show the timer-based test component
    expect(screen.getByTestId('timer-based-test')).toBeInTheDocument();
    expect(screen.getByText('Timer Test: 60s, medium')).toBeInTheDocument();
  });

  it('allows changing timer selection', () => {
    render(<TypingTest />);
    
    // Find and click the 2 mins button using more specific selector
    const buttons = screen.getAllByRole('button');
    const twoMinButton = buttons.find(button => button.textContent.includes('2 mins') && button.textContent.includes('Standard test'));
    fireEvent.click(twoMinButton);
    
    // Start the test
    const startButton = screen.getByText('Start Typing Test');
    fireEvent.click(startButton);
    
    // Should show 120 seconds (2 mins)
    expect(screen.getByText('Timer Test: 120s, medium')).toBeInTheDocument();
  });

  it('allows changing difficulty selection', () => {
    render(<TypingTest />);
    
    // Find and click Hard difficulty button using more specific selector
    const buttons = screen.getAllByRole('button');
    const hardButton = buttons.find(button => button.textContent.includes('Hard') && button.textContent.includes('Advanced words'));
    fireEvent.click(hardButton);
    
    // Start the test
    const startButton = screen.getByText('Start Typing Test');
    fireEvent.click(startButton);
    
    // Should show hard difficulty
    expect(screen.getByText('Timer Test: 60s, hard')).toBeInTheDocument();
  });

  it('can return to configuration from test', () => {
    render(<TypingTest />);
    
    // Start test
    const startButton = screen.getByText('Start Typing Test');
    fireEvent.click(startButton);
    
    // Click back button
    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);
    
    // Should be back to configuration
    expect(screen.getByText('Start Typing Test')).toBeInTheDocument();
    expect(screen.getByText('Select Test Duration')).toBeInTheDocument();
  });

  it('handles test completion', () => {
    render(<TypingTest />);
    
    // Start test
    const startButton = screen.getByText('Start Typing Test');
    fireEvent.click(startButton);
    
    // Complete test
    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);
    
    // Should still be in test component (it handles its own completion UI)
    expect(screen.getByTestId('timer-based-test')).toBeInTheDocument();
  });

  it('displays configuration summary correctly', () => {
    render(<TypingTest />);
    
    // Check that initial selection is shown in the Test Configuration section
    expect(screen.getByText('Test Configuration')).toBeInTheDocument();
    // Check both difficulty and timer appear in summary (they're in separate spans)
    const configSection = screen.getByText('Test Configuration').closest('div');
    expect(configSection).toHaveTextContent('1 min');
    expect(configSection).toHaveTextContent('medium');
    
    // Find buttons and change selections
    const buttons = screen.getAllByRole('button');
    const hardButton = buttons.find(button => button.textContent.includes('Hard') && button.textContent.includes('Advanced words'));
    const fiveMinsButton = buttons.find(button => button.textContent.includes('5 mins') && button.textContent.includes('Endurance test'));
    
    fireEvent.click(hardButton);
    fireEvent.click(fiveMinsButton);
    
    // Check updated summary
    const updatedConfigSection = screen.getByText('Test Configuration').closest('div');
    expect(updatedConfigSection).toHaveTextContent('5 mins');
    expect(updatedConfigSection).toHaveTextContent('hard');
  });
});