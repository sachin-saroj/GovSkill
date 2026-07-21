import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-xl border border-[#E2E6EB] bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};
export default Card;
