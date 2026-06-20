import { AlertTriangle, Info } from 'lucide-react';
import React from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

export type ConfirmVariant = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  // Determine styles based on variant
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertTriangle size={32} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={32} className="text-yellow-600" />;
      case 'info':
        return <Info size={32} className="text-blue-600" />;
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 text-red-600 border border-red-100 rounded-2xl';
      case 'warning':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-2xl';
      case 'info':
        return 'bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl';
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'danger': return 'danger';
      case 'warning': return 'primary';
      case 'info': return 'primary';
      default: return 'primary';
    }
  };

  const isDestructive = variant === 'danger' || variant === 'warning';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} autoFocus={isDestructive}>
            {cancelText}
          </Button>
          <Button variant={getButtonVariant()} onClick={onConfirm} autoFocus={!isDestructive}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4">
        <div className={`p-3 shrink-0 ${getIconBg()}`}>
          {getIcon()}
        </div>
        <div>
          <p className="text-base leading-relaxed text-[var(--color-fintech-text-muted)]">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
};
