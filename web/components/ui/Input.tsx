import React, { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', type, id, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  let inputStyles = "w-full outline-none transition-all duration-200 p-3 rounded-xl border border-[var(--color-fintech-border)] bg-[var(--color-fintech-bg)] focus:border-[var(--color-fintech-primary)] focus:ring-2 focus:ring-[var(--color-fintech-primary)]/20 text-[var(--color-fintech-text)] placeholder-[var(--color-fintech-text-muted)]";

  if (isPassword) {
    inputStyles += " pr-10";
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label htmlFor={inputId} className="text-sm font-semibold ml-1 text-[var(--color-fintech-text)]">{label}</label>}
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={`${inputStyles} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-fintech-primary)]/50 text-[var(--color-fintech-text-muted)] hover:text-[var(--color-fintech-text)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span id={errorId} role="alert" className="text-red-500 text-xs font-bold mt-1">{error}</span>}
    </div>
  );
};
