import { render, screen } from '@testing-library/react';
import TextHighlighter from './TextHighlighter';

describe('TextHighlighter Component', () => {
  const sampleText = "The quick brown fox";
  
  it('renders text without highlighting when no input provided', () => {
    render(<TextHighlighter targetText={sampleText} userInput="" />);
    
    expect(screen.getByText('The')).toBeInTheDocument();
    expect(screen.getByText('quick')).toBeInTheDocument();
    expect(screen.getByText('brown')).toBeInTheDocument();
    expect(screen.getByText('fox')).toBeInTheDocument();
  });

  it('highlights correct words in green', () => {
    render(<TextHighlighter targetText={sampleText} userInput="The quick" />);
    
    // Check that correct words get the proper styling (look for the inner span with font-semibold)
    const theWordSpan = screen.getByText('The');
    expect(theWordSpan).toHaveClass('font-semibold');
    
    const quickWordSpan = screen.getByText('quick');
    expect(quickWordSpan).toHaveClass('font-semibold');
  });

  it('highlights incorrect characters in red', () => {
    render(<TextHighlighter targetText={sampleText} userInput="Teh" />);
    
    // Should show "T" in green (correct), "e" in red (incorrect), "h" in red (incorrect)
    const correctT = screen.getByText('T');
    expect(correctT).toHaveClass('text-emerald-500');
    
    // The incorrect characters should be in red
    const incorrectChars = screen.getAllByText(/[eh]/);
    incorrectChars.forEach(char => {
      expect(char).toHaveClass('text-red-500');
    });
  });

  it('shows neutral styling for untyped words', () => {
    render(<TextHighlighter targetText={sampleText} userInput="The" />);
    
    // Check that untyped words have basic styling
    const untypedWord = screen.getByText('quick');
    expect(untypedWord).toBeInTheDocument();
    // The word should not have font-semibold (which is applied to correct words)
    expect(untypedWord).not.toHaveClass('font-semibold');
  });

  it('displays cursor indicator at correct position', () => {
    render(<TextHighlighter targetText={sampleText} userInput="The q" />);
    
    const cursor = screen.getByTestId('typing-cursor');
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass('animate-pulse');
    expect(cursor).toHaveClass('inline-block');
  });

  it('handles word boundaries correctly', () => {
    render(<TextHighlighter targetText={sampleText} userInput="The quick " />);
    
    const theWord = screen.getByText('The');
    const quickWord = screen.getByText('quick');
    
    expect(theWord).toHaveClass('font-semibold');
    expect(quickWord).toHaveClass('font-semibold');
  });

  it('handles partial word typing', () => {
    render(<TextHighlighter targetText={sampleText} userInput="The qui" />);
    
    const theWord = screen.getByText('The');
    expect(theWord).toHaveClass('font-semibold');
    
    // The word "quick" is being typed partially, so it shows "qui" in green and "ck" in gray
    const typedPart = screen.getByText('qui');
    expect(typedPart).toHaveClass('text-emerald-500');
  });
});