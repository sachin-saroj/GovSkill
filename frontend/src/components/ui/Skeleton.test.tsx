import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton Component', () => {
  it('renders rectangular skeleton by default with pulse animation', () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('animate-pulse', 'rounded-civic-lg');
  });

  it('renders circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('rounded-full');
  });

  it('renders text variant with default line height and full width', () => {
    const { container } = render(<Skeleton variant="text" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('rounded-full', 'h-4', 'w-full');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-12 w-48 bg-slate-300" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('h-12', 'w-48', 'bg-slate-300');
  });
});
