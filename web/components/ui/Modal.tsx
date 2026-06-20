import { AnimatePresence, motion, Variants } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  const titleId = React.useId();

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants: Variants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { scale: 0.95, opacity: 0, y: 20 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] bg-[var(--color-fintech-bg-alt)] border border-[var(--color-fintech-border)] rounded-3xl shadow-xl text-[var(--color-fintech-text)]"
          >
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-[var(--color-fintech-border)] bg-slate-50/50">
              <h3 id={titleId} className="text-xl font-display font-bold text-[var(--color-fintech-text)]">{title}</h3>
              <button 
                type="button" 
                onClick={onClose} 
                className="p-2 -mr-2 text-[var(--color-fintech-text-muted)] hover:text-[var(--color-fintech-text)] hover:bg-[var(--color-fintech-border)] rounded-full transition-colors" 
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-5 mt-auto flex justify-end gap-3 border-t border-[var(--color-fintech-border)] bg-slate-50/50">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};