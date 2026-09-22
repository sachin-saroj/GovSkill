import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TrendIndicator, CompetencyIndicator, MetricCard } from './index';

describe('Data Visualization Primitives', () => {
  it('renders TrendIndicator with accessible label and direction', () => {
    render(<TrendIndicator direction="up" value="+18%" label="Competency growth" />);
    const trend = screen.getByLabelText(/competency growth: increased by \+18%/i);
    expect(trend).toBeInTheDocument();
    expect(trend).toHaveTextContent('+18%');
  });

  it('renders CompetencyIndicator with meter role and accurate level', () => {
    render(<CompetencyIndicator level={3} totalLevels={4} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '3');
    expect(meter).toHaveAttribute('aria-valuemax', '4');
    expect(screen.getByText('Specialist')).toBeInTheDocument();
  });

  it('renders MetricCard with large stat, label, and context', () => {
    render(
      <MetricCard
        label="Certified Officers"
        value={1240}
        suffix=" Active"
        context="Officers cleared through statutory scoring"
        trend={{ direction: 'up', value: '+14%' }}
      />
    );

    expect(screen.getByText(/certified officers/i)).toBeInTheDocument();
    expect(screen.getByText(/1,240 active/i)).toBeInTheDocument();
    expect(screen.getByText(/officers cleared through statutory scoring/i)).toBeInTheDocument();
  });
});
