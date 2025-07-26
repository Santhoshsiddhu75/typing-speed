import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardContent } from './card';

describe('Design System Components', () => {
  it('renders Button with default variant', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Test Button');
    expect(button).toHaveClass('bg-primary');
  });

  it('renders Button with different variants', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('renders Card components properly', () => {
    render(
      <Card data-testid="test-card">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          Card content
        </CardContent>
      </Card>
    );
    
    const card = screen.getByTestId('test-card');
    expect(card).toHaveClass('rounded-xl', 'bg-card');
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom CSS variables', () => {
    render(<Button>Button</Button>);
    const button = screen.getByRole('button');
    
    // Check if the button has the expected classes that use our CSS variables
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
  });
});