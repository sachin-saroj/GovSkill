import React from 'react';
import { IconSearch, IconClose } from './icons';

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  onClear?: () => void;
  isLoading?: boolean;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  label,
  value,
  onChange,
  onClear,
  isLoading = false,
  placeholder = 'Search records, modules, officers…',
  className = '',
  disabled,
  id,
  ...props
}) => {
  const generatedId = React.useId();
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : generatedId);
  const hasValue = Boolean(value && String(value).length > 0);

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[13px] font-sans font-medium text-[#0A0A0A] tracking-tight"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-3.5 flex items-center pointer-events-none text-[#6B6357]">
          <IconSearch size="sm" />
        </span>
        <input
          type="search"
          id={inputId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full rounded-full border border-[#D9CFBB] bg-[#F5EFE0] pl-10 pr-10 py-2.5 text-[14px] text-[#0A0A0A] placeholder-[#6B6357]/50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]/10 focus:border-[#0A0A0A] hover:border-[#0A0A0A]/40 disabled:bg-[#EDE4D0]/50 disabled:cursor-not-allowed min-h-[44px]"
          {...props}
        />
        {hasValue && onClear && !disabled && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search query"
            className="absolute right-3.5 flex items-center justify-center p-1 rounded-full text-[#6B6357] hover:text-[#0A0A0A] hover:bg-[#EDE4D0] transition-colors cursor-pointer"
          >
            <IconClose size="xs" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchField;
