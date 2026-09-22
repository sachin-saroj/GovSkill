import React from 'react';

export interface CompetencyIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  level: number; // 1 to totalLevels
  totalLevels?: number;
  levelNames?: string[];
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const CompetencyIndicator: React.FC<CompetencyIndicatorProps> = ({
  level,
  totalLevels = 4,
  levelNames = ['Foundation', 'Practitioner', 'Specialist', 'Master'],
  size = 'md',
  showLabel = true,
  className = '',
  ...props
}) => {
  const currentLevel = Math.min(Math.max(1, level), totalLevels);
  const currentName = levelNames[currentLevel - 1] || `Level ${currentLevel}`;

  const segmentHeights = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={`space-y-1.5 ${className}`} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-sans font-medium text-[#0A0A0A]">{currentName}</span>
          <span className="font-mono text-[11px] text-[#6B6357]">
            {currentLevel}/{totalLevels}
          </span>
        </div>
      )}
      <div
        className="flex items-center gap-1.5"
        role="meter"
        aria-valuenow={currentLevel}
        aria-valuemin={1}
        aria-valuemax={totalLevels}
        aria-label={`Competency level: ${currentName} (${currentLevel} of ${totalLevels})`}
      >
        {Array.from({ length: totalLevels }).map((_, index) => {
          const isFilled = index < currentLevel;
          return (
            <div
              key={index}
              className={`flex-1 rounded-full ${segmentHeights} transition-all duration-300 ${
                isFilled
                  ? 'bg-[#2A5B4A] shadow-xs'
                  : 'bg-[#EDE4D0] border border-[#D9CFBB]'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CompetencyIndicator;
