import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => (
  <div className="flex min-h-[60vh] items-center justify-center gap-2 text-[#5A6472]" role="status">
    <Loader2 className="h-5 w-5 animate-spin text-[#1E4D8C]" aria-hidden="true" />
    <span>{message}</span>
  </div>
);

export default LoadingState;