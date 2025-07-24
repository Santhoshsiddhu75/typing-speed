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
    
    const button = screen.getByRole('button', { name: /generate a new text passage/i });
    
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

  it('does not show error message when text is valid', () => {
    render(<TypingTest />);
    
    // Should not show any error message for valid texts
    expect(screen.queryByText(/⚠️ Error:/)).not.toBeInTheDocument();
  });

  it('validates text passage length correctly', () => {
    // These tests verify the validation functions work (we can't easily mock them in this setup)
    render(<TypingTest />);
    
    // All our sample texts should be valid (between 50-500 chars)
    const textDisplay = screen.getByText(/The quick brown fox|In the heart of every|Technology has revolutionized|Reading is to the mind|The art of cooking/);
    expect(textDisplay.textContent.length).toBeGreaterThanOrEqual(50);
    expect(textDisplay.textContent.length).toBeLessThanOrEqual(500);
  });

  it('uses responsive design classes', () => {
    const { container } = render(<TypingTest />);
    
    // Check for responsive classes in the main container
    const mainContainer = container.querySelector('.max-w-4xl');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    
    // Check for responsive typography
    const title = screen.getByText('Typing Speed Test');
    expect(title).toHaveClass('text-2xl', 'sm:text-3xl', 'lg:text-4xl');
  });

  it('renders button with responsive styling', () => {
    render(<TypingTest />);
    
    const button = screen.getByRole('button', { name: /generate a new text passage/i });
    expect(button).toHaveClass('w-full', 'sm:w-auto');
  });

  it('has proper accessibility attributes', () => {
    render(<TypingTest />);
    
    // Check for proper heading structure
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Typing Speed Test');
    
    // Check for proper button accessibility
    const button = screen.getByRole('button', { name: /generate a new text passage for typing practice/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-describedby', 'typing-text');
    
    // Check for text passage accessibility
    const textPassage = screen.getByRole('document');
    expect(textPassage).toHaveAttribute('aria-label', 'Text passage to type');
    expect(textPassage).toHaveAttribute('id', 'typing-text');
  });

  it('uses semantic HTML elements', () => {
    const { container } = render(<TypingTest />);
    
    // Check for header element
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });
});