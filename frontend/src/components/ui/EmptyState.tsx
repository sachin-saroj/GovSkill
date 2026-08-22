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
    <Card className={`p-8 sm:p-10 text-center bg-white border-slate-200 shadow-civic-sm space-y-4 max-w-md mx-auto ${className}`}>
      <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center border border-slate-200/80 shadow-civic-xs">
        <Icon className="h-6 w-6 text-slate-500" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
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
