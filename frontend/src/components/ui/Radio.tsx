import React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  description,
  className = '',
  id,
  disabled,
  checked,
  ...props
}) => {
  const generatedId = React.useId();
  const radioId = id || generatedId;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="relative flex items-center pt-0.5">
        <input
          type="radio"
          id={radioId}
          checked={checked}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={radioId}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#3A3835]/35 transition-all duration-150 cursor-pointer select-none peer-focus-visible:ring-2 peer-focus-visible:ring-[#121212] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#FAF4E4] ${
            disabled ? 'cursor-not-allowed opacity-40 bg-[#EDE7D9]' : 'bg-[#FAF4E4]'
          } peer-checked:border-[#121212] hover:border-[#121212]/50`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#121212] opacity-0 peer-checked:opacity-100 transition-opacity duration-100" />
        </label>
      </div>

      <div className="space-y-0.5">
        <label
          htmlFor={radioId}
          className={`block text-[13.5px] font-sans font-medium select-none cursor-pointer leading-tight ${
            disabled ? 'cursor-not-allowed text-[#6F6759]/60' : 'text-[#121212]'
          }`}
        >
          {label}
        </label>
        {description && (
          <p className="text-[12px] font-normal text-[#6F6759] leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export interface RadioOption {
  value: string | number;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string | number;
  onChange: (value: any) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  className = '',
}) => {
  return (
    <fieldset className={`space-y-2.5 ${className}`}>
      {label && (
        <legend className="text-[13px] font-sans font-medium text-[#121212] tracking-tight">
          {label}
        </legend>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <Radio
            key={String(option.value)}
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            label={option.label}
            description={option.description}
            onChange={() => onChange(option.value)}
          />
        ))}
      </div>
      {error && (
        <p role="alert" className="text-[12px] font-medium text-[#D9457F] text-[#C97B5A]">
          {error}
        </p>
      )}
    </fieldset>
  );
};

export default Radio;
