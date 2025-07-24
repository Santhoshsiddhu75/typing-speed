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
    
    const theWord = screen.getByText('The');
    const quickWord = screen.getByText('quick');
    
    expect(theWord).toHaveClass('text-green-600');
    expect(quickWord).toHaveClass('text-green-600');
  });

  it('highlights incorrect words in red', () => {
    render(<TextHighlighter targetText={sampleText} userInput="Teh" />);
    
    const incorrectWord = screen.getByText('The');
    expect(incorrectWord).toHaveClass('text-red-600');
  });

  it('shows neutral styling for untyped words', () => {
    render(<TextHighlighter targetText={sampleText} userInput="The" />);
    
    const untypedWord = screen.getByText('quick');
    expect(untypedWord).toHaveClass('text-gray-700');
  });

  it('displays cursor indicator at correct position', () => {
    render(<TextHighlighter targetText={sampleText} userInput="The q" />);
    
    const cursor = screen.getByTestId('typing-cursor');
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass('animate-pulse');
  });

  it('handles word boundaries correctly', () => {
    render(<TextHighlighter targetText={sampleText} userInput="The quick " />);
    
    const theWord = screen.getByText('The');
    const quickWord = screen.getByText('quick');
    
    expect(theWord).toHaveClass('text-green-600');
    expect(quickWord).toHaveClass('text-green-600');
  });

  it('handles partial word typing', () => {
    render(<TextHighlighter targetText={sampleText} userInput="The qui" />);
    
    const theWord = screen.getByText('The');
    expect(theWord).toHaveClass('text-green-600');
    
    // The word "quick" is being typed partially, so it shows "qui" in green and "ck" in gray
    const typedPart = screen.getByText('qui');
    expect(typedPart).toHaveClass('text-green-600');
  });
});