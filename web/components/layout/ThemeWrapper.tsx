import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useTheme();

  // Clean Fintech Light theme
  const bgClass = mode === 'dark' 
    ? 'bg-[var(--color-fintech-secondary)] text-[var(--color-fintech-bg)]' 
    : 'bg-[var(--color-fintech-bg-alt)] text-[var(--color-fintech-text)]';

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${bgClass} font-sans`}>
      {children}
    </div>
  );
};
