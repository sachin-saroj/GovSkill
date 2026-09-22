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
    'border-[#D9CFBB] hover:border-[#0A0A0A]/40 focus:border-[#0A0A0A] focus:ring-[#0A0A0A]/10';

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
          htmlFor={textareaId}
          className="block text-[13px] font-sans font-medium text-[#0A0A0A] tracking-tight"
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
        className={`w-full rounded-xl border bg-[#F5EFE0] px-4 py-3 text-[14px] text-[#0A0A0A] placeholder-[#6B6357]/50 transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-[#EDE4D0]/50 disabled:cursor-not-allowed resize-y ${stateBorderClasses} ${className}`}
        {...props}
      />
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

export default Textarea;
