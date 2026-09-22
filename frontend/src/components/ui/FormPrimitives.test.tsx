import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input, Textarea, Select, Checkbox, Radio, RadioGroup, SearchField } from './index';

describe('Form Primitives', () => {
  it('renders standalone Radio with label', () => {
    render(<Radio label="Single Officer Option" id="single-radio" />);
    expect(screen.getByLabelText(/single officer option/i)).toBeInTheDocument();
  });

  it('renders Input with label, error, and aria attributes', () => {
    render(<Input label="Officer Email" error="Invalid government email domain" />);
    expect(screen.getByLabelText(/officer email/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid government email domain');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders Textarea with rows and helper text', () => {
    render(<Textarea label="Case Notes" helperText="Include revenue circle dispatch number" rows={5} />);
    expect(screen.getByLabelText(/case notes/i)).toBeInTheDocument();
    expect(screen.getByText(/include revenue circle dispatch number/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('renders Select with options and handles selection change', () => {
    const handleChange = vi.fn();
    render(
      <Select
        label="Jurisdiction Circle"
        options={[
          { value: 'north', label: 'North Circle' },
          { value: 'south', label: 'South Circle' },
        ]}
        onChange={handleChange}
      />
    );

    const select = screen.getByLabelText(/jurisdiction circle/i);
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'south' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders Checkbox with accessible toggle and description', () => {
    const handleChange = vi.fn();
    render(
      <Checkbox
        label="Statutory Acknowledgment"
        description="I certify all attached land records are verified"
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders RadioGroup and handles value selection', () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup
        name="cadreTier"
        label="Officer Cadre"
        value="revenue"
        onChange={handleChange}
        options={[
          { value: 'revenue', label: 'Revenue Inspector' },
          { value: 'tahsildar', label: 'Deputy Tahsildar' },
        ]}
      />
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();

    fireEvent.click(radios[1]);
    expect(handleChange).toHaveBeenCalledWith('tahsildar');
  });

  it('renders SearchField with clear action', () => {
    const handleClear = vi.fn();
    const handleChange = vi.fn();
    render(
      <SearchField
        value="circular 2026"
        onChange={handleChange}
        onClear={handleClear}
      />
    );

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toHaveValue('circular 2026');

    const clearButton = screen.getByLabelText(/clear search query/i);
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    expect(handleClear).toHaveBeenCalled();
  });
});
