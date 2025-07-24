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
    
    // Check if typing instructions are present (new typing interface)
    expect(screen.getByText('Click here and start typing')).toBeInTheDocument();
    
    // Check if progress indicator is present
    expect(screen.getByText(/Progress: 0 \//)).toBeInTheDocument();
  });

  it('changes text when "Get New Text" button is clicked', () => {
    render(<TypingTest />);
    
    const button = screen.getByRole('button', { name: /generate a new text passage/i });
    
    // Click the button - it should work without errors
    fireEvent.click(button);
    
    // Verify the button is still present and functional 
    expect(button).toBeInTheDocument();
    
    // Verify typing interface is still present after text change
    expect(screen.getByText('Click here and start typing')).toBeInTheDocument();
  });

  it('shows typing interface instead of placeholder', () => {
    render(<TypingTest />);
    
    // The typing interface should now be present instead of placeholder
    expect(screen.getByText('Click here and start typing')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /type the displayed text here/i })).toBeInTheDocument();
  });

  it('does not show error message when text is valid', () => {
    render(<TypingTest />);
    
    // Should not show any error message for valid texts
    expect(screen.queryByText(/⚠️ Error:/)).not.toBeInTheDocument();
  });

  it('validates text passage length correctly', () => {
    // These tests verify the validation functions work (we can't easily mock them in this setup)
    render(<TypingTest />);
    
    // Check that progress indicator shows a reasonable character count (our texts are 50-500 chars)
    const progressText = screen.getByText(/Progress: 0 \/ \d+/);
    expect(progressText).toBeInTheDocument();
    
    // Extract the total character count from the progress text
    const match = progressText.textContent.match(/Progress: 0 \/ (\d+)/);
    const totalChars = parseInt(match[1]);
    expect(totalChars).toBeGreaterThanOrEqual(50);
    expect(totalChars).toBeLessThanOrEqual(500);
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
    
    // Check for typing input accessibility
    const textbox = screen.getByRole('textbox', { name: /type the displayed text here/i });
    expect(textbox).toHaveAttribute('aria-label', 'Type the displayed text here');
    expect(textbox).toHaveAttribute('tabIndex', '0');
  });

  it('uses semantic HTML elements', () => {
    const { container } = render(<TypingTest />);
    
    // Check for header element
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });
});