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
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-caption font-semibold text-civic-900 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          disabled={disabled}
          className={`w-full rounded-civic-md border bg-white px-4 py-2.5 text-body text-slate-900 placeholder-slate-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-civic-800/20 focus:border-civic-800 disabled:bg-slate-100 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-9' : ''
          } ${rightIcon ? 'pr-9' : ''} ${
            error
              ? 'border-red-400 text-red-900 focus:ring-red-500/20 focus:border-red-500'
              : 'border-slate-300 hover:border-slate-400'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 flex items-center pointer-events-none text-slate-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="text-caption font-medium text-red-600 animate-fade-in">{error}</p>}
      {!error && helperText && <p className="text-caption font-medium text-civic-500">{helperText}</p>}
    </div>
  );
};

export default Input;
