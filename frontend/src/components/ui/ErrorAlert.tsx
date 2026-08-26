import React from 'react';
import { AlertCircle, X, RotateCcw } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'System Error',
  message,
  onDismiss,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`p-4 rounded-civic-xl bg-red-50 border border-red-200 text-caption text-red-700 flex items-start justify-between gap-4 shadow-civic-xs animate-fade-in ${className}`}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          {title && <p className="font-semibold text-red-900 leading-tight">{title}</p>}
          <p className="leading-relaxed text-red-700">{message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-red-200 rounded-civic-md text-red-800 text-caption font-semibold hover:bg-red-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="p-1 text-red-500 hover:text-red-800 hover:bg-red-100 rounded-civic-sm transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
