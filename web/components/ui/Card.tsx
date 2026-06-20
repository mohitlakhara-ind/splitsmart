import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  const themeStyles = `rounded-xl border border-[var(--color-fintech-border)] shadow-sm bg-[var(--color-fintech-bg)] text-[var(--color-fintech-text)]`;

  return (
    <div className={`p-6 ${themeStyles} ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className={`text-xl font-bold font-display`}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
