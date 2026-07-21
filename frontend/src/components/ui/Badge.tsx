import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info' }) => {
  const styles = {
    success: 'bg-[#2E9E6B]/10 text-[#2E9E6B]',
    danger: 'bg-[#C0392B]/10 text-[#C0392B]',
    warning: 'bg-[#D98E04]/10 text-[#D98E04]',
    info: 'bg-[#1E4D8C]/10 text-[#1E4D8C]',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};
export default Badge;
