import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProgressChart from './ProgressChart';
import { AssessmentHistoryItem } from '@/types';

describe('ProgressChart Component', () => {
  it('renders intentional empty state when fewer than 2 attempts exist', () => {
    render(<ProgressChart history={[]} />);
    expect(screen.getByText('Competency Growth Trajectory')).toBeInTheDocument();
    expect(screen.getByText('Insufficient Historical Trajectory')).toBeInTheDocument();
    expect(
      screen.getByText(/Complete at least 2 scored assessments to plot your verified attempt-over-attempt score growth curve/i)
    ).toBeInTheDocument();
  });

  it('renders SVG trajectory chart with benchmark line when 2 or more attempts exist', () => {
    const attempts: AssessmentHistoryItem[] = [
      {
        attempt_id: 'att-1',
        module_id: 'mod-1',
        module_title: 'Cybersecurity Basics',
        score: 3,
        total: 5,
        score_percentage: 60,
        attempt_number: 1,
        passed: false,
        submitted_at: '2026-08-20T10:00:00Z',
      },
      {
        attempt_id: 'att-2',
        module_id: 'mod-1',
        module_title: 'Cybersecurity Basics',
        score: 4,
        total: 5,
        score_percentage: 80,
        attempt_number: 2,
        passed: true,
        submitted_at: '2026-08-22T10:00:00Z',
      },
    ];

    render(<ProgressChart history={attempts} />);

    expect(screen.getByText('Competency Growth Trajectory')).toBeInTheDocument();
    expect(screen.getByText('2 Evaluations')).toBeInTheDocument();
    expect(screen.getByText('75% Target')).toBeInTheDocument();
    expect(screen.getByText('Initial Evaluation')).toBeInTheDocument();
    expect(screen.getByText('Latest Attempt')).toBeInTheDocument();
  });
});
