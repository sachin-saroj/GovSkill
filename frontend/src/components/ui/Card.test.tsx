import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';

describe('Card Component Hierarchy', () => {
  it('renders structural default card with warm neutral styling', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Statutory Overview</CardTitle>
          <CardDescription>Revenue circular guidelines</CardDescription>
        </CardHeader>
        <CardContent>Content body</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    );

    expect(screen.getByText('Statutory Overview')).toBeInTheDocument();
    expect(screen.getByText('Revenue circular guidelines')).toBeInTheDocument();
    expect(screen.getByText('Content body')).toBeInTheDocument();
    expect(screen.getByText('Footer actions')).toBeInTheDocument();
  });

  it('renders inverted / stage card with deep dark styling', () => {
    const { container } = render(
      <Card variant="inverted">
        <p>Inverted dark stage content</p>
      </Card>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-[#111111]', 'text-[#F5EFE0]');
  });

  it('renders technical corner brackets when enabled', () => {
    const { container } = render(
      <Card cornerBrackets>
        <p>Technical container</p>
      </Card>
    );

    expect(container.textContent).toContain('┌');
    expect(container.textContent).toContain('┐');
    expect(container.textContent).toContain('└');
    expect(container.textContent).toContain('┘');
  });

  it('renders interactive card variant with cursor pointer styling', () => {
    const { container } = render(
      <Card variant="interactive">
        <p>Clickable module card</p>
      </Card>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');
  });
});
