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

  let stateBorderClasses =
    'border-[#3A3835]/30 hover:border-[#121212]/60 focus:border-[#121212] focus:ring-[#121212]/15';

  if (error) {
    stateBorderClasses =
      'border-[#D9457F] text-[#8F3E22] focus:ring-[#D9457F]/20 focus:border-[#D9457F]';
  } else if (success) {
    stateBorderClasses =
      'border-[#98AD60] focus:ring-[#98AD60]/20 focus:border-[#98AD60]';
  }

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-sans font-medium text-[#121212] tracking-tight"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 flex items-center pointer-events-none text-[#6F6759]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`w-full rounded-xl border bg-[#FAF4E4] px-4 py-2.5 text-[14px] text-[#121212] placeholder-[#6F6759]/60 transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-[#EDE7D9]/60 disabled:cursor-not-allowed min-h-[44px] ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${stateBorderClasses} ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3.5 flex items-center pointer-events-none text-[#6F6759]">
            {rightIcon}
          </span>
        )}
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

export default Input;
