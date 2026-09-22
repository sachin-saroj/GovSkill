import React from 'react';
import { IconChevronDown } from './icons';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  children,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const generatedId = React.useId();
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText ? `${selectId}-helper` : undefined;
  const describedBy = errorId || helperId || undefined;

  let stateBorderClasses =
    'border-[#D9CFBB] hover:border-[#0A0A0A]/40 focus:border-[#0A0A0A] focus:ring-[#0A0A0A]/10';

  if (error) {
    stateBorderClasses =
      'border-[#C97B5A] text-[#8F3E22] focus:ring-[#C97B5A]/20 focus:border-[#C97B5A]';
  }

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[13px] font-sans font-medium text-[#0A0A0A] tracking-tight"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`w-full appearance-none rounded-xl border bg-[#F5EFE0] px-4 py-2.5 pr-10 text-[14px] text-[#0A0A0A] transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-[#EDE4D0]/50 disabled:cursor-not-allowed min-h-[44px] cursor-pointer ${stateBorderClasses} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className="absolute right-3.5 flex items-center pointer-events-none text-[#6B6357]">
          <IconChevronDown size="sm" />
        </span>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-[12px] font-medium text-[#C97B5A]">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-[12px] font-normal text-[#6B6357]">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
