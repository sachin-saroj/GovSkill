import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProgressBar from './ProgressBar';

describe('ProgressBar Component', () => {
  it('renders progress bar with accessible role and aria attributes', () => {
    render(<ProgressBar value={60} label="Curriculum Progress" showPercentage />);

    const bar = screen.getByRole('progressbar', { name: 'Curriculum Progress' });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute('aria-valuenow', '60');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('Curriculum Progress')).toBeInTheDocument();
  });

  it('clamps values below 0 and above max gracefully', () => {
    const { rerender } = render(<ProgressBar value={-10} label="Clamped Min" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

    rerender(<ProgressBar value={150} max={100} label="Clamped Max" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('supports different visual variants', () => {
    const { container } = render(<ProgressBar value={80} variant="success" />);
    expect(container.querySelector('.bg-emerald-600')).toBeInTheDocument();
  });
});
