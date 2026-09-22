import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  success,
  leftIcon,
  rightIcon,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const generatedId = React.useId();
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = errorId || helperId || undefined;

  let stateBorderClasses = 'border-[#D9CFBB] hover:border-[#0A0A0A]/40 focus:border-[#0A0A0A] focus:ring-[#0A0A0A]/10';

  if (error) {
    stateBorderClasses =
      'border-[#C97B5A] text-[#8F3E22] focus:ring-[#C97B5A]/20 focus:border-[#C97B5A]';
  } else if (success) {
    stateBorderClasses =
      'border-[#2A5B4A] focus:ring-[#2A5B4A]/20 focus:border-[#2A5B4A]';
  }

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-sans font-medium text-[#0A0A0A] tracking-tight"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 flex items-center pointer-events-none text-[#6B6357]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`w-full rounded-xl border bg-[#F5EFE0] px-4 py-2.5 text-[14px] text-[#0A0A0A] placeholder-[#6B6357]/50 transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-[#EDE4D0]/50 disabled:cursor-not-allowed min-h-[44px] ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${stateBorderClasses} ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3.5 flex items-center pointer-events-none text-[#6B6357]">
            {rightIcon}
          </span>
        )}
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

export default Input;
