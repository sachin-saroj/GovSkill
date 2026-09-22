import React from 'react';
import { IconCheck } from './icons';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  error,
  className = '',
  id,
  disabled,
  checked,
  ...props
}) => {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative flex items-center pt-0.5">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={checkboxId}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-150 cursor-pointer select-none peer-focus-visible:ring-2 peer-focus-visible:ring-[#0A0A0A] peer-focus-visible:ring-offset-2 ${
            disabled ? 'cursor-not-allowed opacity-40 bg-[#EDE4D0]' : 'bg-[#F5EFE0]'
          } ${
            error
              ? 'border-[#C97B5A]'
              : 'border-[#D9CFBB] hover:border-[#0A0A0A]/40'
          } peer-checked:bg-[#0A0A0A] peer-checked:border-[#0A0A0A] peer-checked:text-[#F5EFE0]`}
        >
          <IconCheck
            size="xs"
            className="opacity-0 peer-checked:opacity-100 transition-opacity duration-100"
          />
        </label>
      </div>

      <div className="space-y-0.5">
        <label
          htmlFor={checkboxId}
          className={`block text-[13.5px] font-sans font-medium select-none cursor-pointer leading-tight ${
            disabled ? 'cursor-not-allowed text-[#6B6357]/60' : 'text-[#0A0A0A]'
          }`}
        >
          {label}
        </label>
        {description && (
          <p className="text-[12px] font-normal text-[#6B6357] leading-relaxed">
            {description}
          </p>
        )}
        {error && (
          <p role="alert" className="text-[12px] font-medium text-[#C97B5A]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
