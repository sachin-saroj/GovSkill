import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-sans font-medium text-[#0A0A0A] tracking-tight">
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
          className={`w-full rounded-xl border bg-[#F5EFE0] px-4 py-2.5 text-[14px] text-[#0A0A0A] placeholder-[#6B6357]/50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]/10 focus:border-[#0A0A0A] disabled:bg-[#EDE4D0]/50 disabled:cursor-not-allowed min-h-[44px] ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${
            error
              ? 'border-[#C97B5A] text-[#8F3E22] focus:ring-[#C97B5A]/20 focus:border-[#C97B5A]'
              : 'border-[#D9CFBB] hover:border-[#0A0A0A]/40'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3.5 flex items-center pointer-events-none text-[#6B6357]">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-[12px] font-medium text-[#C97B5A] animate-fade-in">{error}</p>}
      {!error && helperText && <p className="text-[12px] font-normal text-[#6B6357]">{helperText}</p>}
    </div>
  );
};

export default Input;
