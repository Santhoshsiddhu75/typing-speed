import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TypingInput from './TypingInput';

describe('TypingInput Component', () => {
  const sampleText = "Hello world";
  const mockOnComplete = vi.fn();
  const mockOnProgressUpdate = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
    mockOnProgressUpdate.mockClear();
  });

  it('renders with target text displayed', () => {
    render(<TypingInput targetText={sampleText} />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
  });

  it('shows typing instructions initially', () => {
    render(<TypingInput targetText={sampleText} />);
    
    expect(screen.getByText('Click here and start typing')).toBeInTheDocument();
  });

  it('displays progress information', () => {
    render(<TypingInput targetText={sampleText} />);
    
    expect(screen.getByText(/Progress: 0 \/ 11 characters/)).toBeInTheDocument();
  });

  it('becomes active when clicked', () => {
    render(<TypingInput targetText={sampleText} />);
    
    const textArea = screen.getByRole('textbox', { name: /type the displayed text here/i });
    fireEvent.click(textArea);
    
    expect(textArea).toHaveClass('border-blue-500');
  });

  it('calls onProgressUpdate when typing', () => {
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
        isComplete: false
      })
    );
  });

  it('calls onComplete when text is fully typed', () => {
    render(
      <TypingInput 
        targetText={sampleText} 
        onComplete={mockOnComplete}
      />
    );
    
    const hiddenInput = document.querySelector('input[type="text"]');
    fireEvent.change(hiddenInput, { target: { value: sampleText } });
    
    expect(mockOnComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        userInput: sampleText,
        targetText: sampleText,
        accuracy: 100
      })
    );
  });

  it('displays accuracy calculation', async () => {
    render(<TypingInput targetText={sampleText} />);
    
    const hiddenInput = document.querySelector('input[type="text"]');
    fireEvent.change(hiddenInput, { target: { value: 'Hello' } });
    
    expect(screen.getByText(/Accuracy: 100%/)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TypingInput targetText={sampleText} />);
    
    const textArea = screen.getByRole('textbox', { name: /type the displayed text here/i });
    expect(textArea).toHaveAttribute('aria-label', 'Type the displayed text here');
    expect(textArea).toHaveAttribute('tabIndex', '0');
  });
});