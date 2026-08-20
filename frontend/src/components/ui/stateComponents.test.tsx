import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';

describe('shared state components', () => {
  it('renders a loading status message', () => {
    render(<LoadingState message="Loading modules..." />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading modules...');
  });

  it('renders an error and invokes retry', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Could not load modules" onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load modules');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders an empty state title and message', () => {
    render(<EmptyState title="No modules" message="Ask an administrator to publish one." />);

    expect(screen.getByRole('heading', { name: 'No modules' })).toBeInTheDocument();
    expect(screen.getByText('Ask an administrator to publish one.')).toBeInTheDocument();
  });
});