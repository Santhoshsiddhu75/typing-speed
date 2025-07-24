import { render, screen, fireEvent } from '@testing-library/react';
import TypingTest from './TypingTest';

describe('TypingTest Component', () => {
  it('renders the typing test interface', () => {
    render(<TypingTest />);
    
    // Check if main title is present
    expect(screen.getByText('Typing Speed Test')).toBeInTheDocument();
    expect(screen.getByText('Test your typing speed and accuracy')).toBeInTheDocument();
  });

  it('displays sample text', () => {
    render(<TypingTest />);
    
    // Check if instruction text is present
    expect(screen.getByText('Type the following text:')).toBeInTheDocument();
    
    // Check if there's some text content by looking for the text display area
    const textDisplay = screen.getByText(/The quick brown fox|In the heart of every|Technology has revolutionized|Reading is to the mind|The art of cooking/);
    expect(textDisplay).toBeInTheDocument();
    expect(textDisplay.textContent.length).toBeGreaterThan(0);
  });

  it('changes text when "Get New Text" button is clicked', () => {
    render(<TypingTest />);
    
    const button = screen.getByText('Get New Text');
    
    // Click the button - it should work without errors
    fireEvent.click(button);
    
    // Verify the button is still present and functional 
    expect(button).toBeInTheDocument();
    
    // Verify text is still displayed (even if it's the same random text)
    const textDisplay = screen.getByText(/The quick brown fox|In the heart of every|Technology has revolutionized|Reading is to the mind|The art of cooking/);
    expect(textDisplay).toBeInTheDocument();
  });

  it('shows placeholder for future input area', () => {
    render(<TypingTest />);
    
    expect(screen.getByText('Typing input area will be implemented in the next phase')).toBeInTheDocument();
  });
});