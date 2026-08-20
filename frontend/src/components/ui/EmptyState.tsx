import React from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => (
  <div className="rounded-xl border border-dashed border-[#E2E6EB] bg-white p-8 text-center">
    <h2 className="text-lg font-semibold text-[#1A1F2B]">{title}</h2>
    <p className="mt-2 text-sm text-[#5A6472]">{message}</p>
  </div>
);

export default EmptyState;