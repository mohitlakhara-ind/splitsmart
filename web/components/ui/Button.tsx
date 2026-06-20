import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "transition-all duration-200 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };

  let themeStyles = "";

  if (variant === 'primary') themeStyles += " bg-[var(--color-fintech-primary)] hover:bg-[var(--color-fintech-primary-dark)] text-white shadow-sm";
  if (variant === 'secondary') themeStyles += " bg-[var(--color-fintech-bg)] text-[var(--color-fintech-text)] border border-[var(--color-fintech-border)] hover:bg-[var(--color-fintech-bg-alt)] shadow-sm";
  if (variant === 'danger') themeStyles += " bg-red-500 hover:bg-red-600 text-white shadow-sm";
  if (variant === 'ghost') themeStyles += " bg-transparent text-[var(--color-fintech-text)] hover:bg-[var(--color-fintech-bg-alt)]";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${themeStyles} ${className}`}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Spinner size={size === 'sm' ? 16 : 20} />}
      {children}
    </button>
  );
};
