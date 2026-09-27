import React, { useState, useId } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}
      {isVisible && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1 text-[10px] font-sans font-medium text-white bg-zinc-900/95 backdrop-blur-sm rounded shadow-lg border border-white/10 whitespace-nowrap pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95 ${
            position === 'top'
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-1.5'
              : 'top-full left-1/2 -translate-x-1/2 mt-1.5'
          }`}
        >
          {content}
          <span
            className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-zinc-900 rotate-45 border-white/10 ${
              position === 'top'
                ? 'top-full -mt-1 border-r border-b'
                : 'bottom-full -mb-1 border-l border-t'
            }`}
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
};

export default Tooltip;
