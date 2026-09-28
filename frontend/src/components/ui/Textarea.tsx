import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  success,
  className = '',
  id,
  disabled,
  rows = 4,
  ...props
}) => {
  const generatedId = React.useId();
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);
  const errorId = error ? `${textareaId}-error` : undefined;
  const helperId = helperText ? `${textareaId}-helper` : undefined;
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
          htmlFor={textareaId}
          className="block text-[13px] font-sans font-medium text-[#121212] tracking-tight"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        disabled={disabled}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`w-full rounded-2xl border bg-[#FAF4E4] px-4 py-3 text-[14px] text-[#121212] placeholder-[#6F6759]/60 transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-[#EDE7D9]/60 disabled:cursor-not-allowed resize-y ${stateBorderClasses} ${className}`}
        {...props}
      />
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

export default Textarea;
