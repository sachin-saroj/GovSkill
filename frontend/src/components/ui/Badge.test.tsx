import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renders success/certified badge with civic green styling', () => {
    render(<Badge variant="certified">Certified Officer</Badge>);
    const badge = screen.getByText(/certified officer/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-[#1E4537]');
  });

  it('renders warning badge with warm ochre styling', () => {
    render(<Badge variant="warning">Revision Due</Badge>);
    const badge = screen.getByText(/revision due/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-[#7A5B14]');
  });

  it('renders danger badge with terracotta styling', () => {
    render(<Badge variant="danger">Rule Failed</Badge>);
    const badge = screen.getByText(/rule failed/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-[#8F3E22]');
  });

  it('renders status dot when dot prop is enabled', () => {
    const { container } = render(<Badge variant="success" dot>Active Cadre</Badge>);
    const dot = container.querySelector('span > span');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('rounded-full', 'bg-[#2A5B4A]');
  });
});
