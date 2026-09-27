import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const ProblemChild: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Simulated UI Rendering Crash');
  }
  return <div>Safe Child Content</div>;
};

describe('ErrorBoundary Component', () => {
  it('renders normal children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe Child Content')).toBeInTheDocument();
  });

  it('catches render error and displays accessible error state', () => {
    // Suppress console.error in test output for intentional error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('An Unexpected Error Occurred')).toBeInTheDocument();
    expect(screen.getByText(/Simulated UI Rendering Crash/i)).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary-retry-btn')).toBeInTheDocument();

    spy.mockRestore();
  });
});
