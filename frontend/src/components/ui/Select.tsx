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
    'border-[#3A3835]/30 hover:border-[#121212]/60 focus:border-[#121212] focus:ring-[#121212]/15';

  if (error) {
    stateBorderClasses =
      'border-[#D9457F] text-[#8F3E22] focus:ring-[#D9457F]/20 focus:border-[#D9457F]';
  }

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[13px] font-sans font-medium text-[#121212] tracking-tight"
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
          className={`w-full appearance-none rounded-xl border bg-[#FAF4E4] px-4 py-2.5 pr-10 text-[14px] text-[#121212] transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-[#EDE7D9]/60 disabled:cursor-not-allowed min-h-[44px] cursor-pointer ${stateBorderClasses} ${className}`}
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
        <span className="absolute right-3.5 flex items-center pointer-events-none text-[#6F6759]">
          <IconChevronDown size="sm" />
        </span>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-[12px] font-medium text-[#D9457F] text-[#C97B5A]">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-[12px] font-normal text-[#6F6759]">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
