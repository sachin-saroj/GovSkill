import React from 'react';
import Card from './Card';
import Button from './Button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <Card className={`p-8 text-center bg-[#EDE4D0]/70 border border-[#D9CFBB] shadow-[0_16px_40px_-15px_rgba(10,10,10,0.06)] rounded-2xl space-y-4 max-w-md mx-auto ${className}`}>
      <div className="h-12 w-12 rounded-full bg-[#F5EFE0] text-[#0A0A0A] mx-auto flex items-center justify-center border border-[#D9CFBB] shadow-xs">
        <Icon className="h-5 w-5 text-[#0A0A0A]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-serif text-[18px] sm:text-[20px] font-normal text-[#0A0A0A] tracking-[-0.02em]">
          {title}
        </h3>
        <p className="text-[13px] font-normal text-[#6B6357] max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <div className="pt-2">
          <Button size="sm" variant="outline" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EmptyState;
