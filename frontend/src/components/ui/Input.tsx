import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[#1A1F2B] mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border border-[#E2E6EB] bg-white px-3 py-2 text-sm text-[#1A1F2B] placeholder-[#5A6472] focus:outline-none focus:ring-2 focus:ring-[#1E4D8C]/30 focus:border-[#1E4D8C] ${
          error ? 'border-[#C0392B] focus:ring-[#C0392B]/30 focus:border-[#C0392B]' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
};
export default Input;
