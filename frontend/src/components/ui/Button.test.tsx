import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders children with primary variant and default styling', () => {
    render(<Button>Submit Dispatch</Button>);
    const button = screen.getByRole('button', { name: /submit dispatch/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-[#0A0A0A]', 'text-[#F5EFE0]');
  });

  it('supports dark mode inverted styling', () => {
    render(<Button dark>Dark Stage CTA</Button>);
    const button = screen.getByRole('button', { name: /dark stage cta/i });
    expect(button).toHaveClass('bg-[#F5EFE0]', 'text-[#0A0A0A]');
  });

  it('renders secondary variant with directional arrow', () => {
    render(<Button variant="secondary">Explore Curriculum</Button>);
    const button = screen.getByRole('button', { name: /explore curriculum/i });
    expect(button).toBeInTheDocument();
    // Verify directional SVG is present
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('supports danger/destructive and success variants', () => {
    const { rerender } = render(<Button variant="danger">Revoke Credential</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[#C97B5A]');

    rerender(<Button variant="success">Verify Signature</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[#2A5B4A]');
  });

  it('handles loading state with spinner and disabled behavior', () => {
    const handleClick = vi.fn();
    render(<Button isLoading onClick={handleClick}>Saving</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('svg')).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles standard disabled state correctly', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled Action</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
