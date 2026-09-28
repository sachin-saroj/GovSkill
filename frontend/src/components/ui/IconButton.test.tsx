import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton, CategoryIconCircle } from './index';

describe('IconButton & CategoryIconCircle Primitives', () => {
  it('renders IconButton with accessible label and handles click', () => {
    const handleClick = vi.fn();
    render(
      <IconButton aria-label="Close dialog" onClick={handleClick}>
        <span data-testid="icon">×</span>
      </IconButton>
    );

    const button = screen.getByRole('button', { name: /close dialog/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders IconButton in disabled state and ignores clicks', () => {
    const handleClick = vi.fn();
    render(
      <IconButton aria-label="Refresh view" disabled onClick={handleClick}>
        <span>↺</span>
      </IconButton>
    );

    const button = screen.getByRole('button', { name: /refresh view/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders CategoryIconCircle with domain styling and hidden from accessibility tree', () => {
    const { container } = render(
      <CategoryIconCircle domain="sage" size="md">
        <span>🌿</span>
      </CategoryIconCircle>
    );

    const circle = container.firstChild as HTMLElement;
    expect(circle).toHaveAttribute('aria-hidden', 'true');
    expect(circle.className).toContain('bg-sage-100');
    expect(circle.className).toContain('text-sage-800');
  });
});
