import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={`
        flex flex-col items-center justify-center text-center p-12 w-full
        bg-[var(--color-fintech-bg-alt)] border border-[var(--color-fintech-border)] rounded-3xl shadow-sm
        ${className}
      `}
    >
      <div
        aria-hidden="true"
        className={`
        mb-6 p-4 text-4xl
        bg-[var(--color-fintech-primary)]/10 text-[var(--color-fintech-primary)] rounded-full
      `}>
        {icon}
      </div>

      <h3 className="text-2xl font-display font-bold mb-2 text-[var(--color-fintech-text)]">
        {title}
      </h3>

      <p className="text-base font-medium mb-8 max-w-md text-[var(--color-fintech-text-muted)]">
        {description}
      </p>

      {action && (
        <Button onClick={action.onClick} variant="primary" size="lg">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
};
