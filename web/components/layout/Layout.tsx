import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-fintech-bg)] text-[var(--color-fintech-text)] font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-full shrink-0 z-20">
        <Sidebar />
      </div>

      {/* Mobile Header & Menu Overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 p-4 flex justify-between items-center pointer-events-none">
            <Button className="pointer-events-auto shadow-lg bg-[var(--color-fintech-bg-alt)] border border-[var(--color-fintech-border)]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="text-[var(--color-fintech-text)]" /> : <Menu className="text-[var(--color-fintech-text)]" />}
            </Button>
      </div>

      {mobileMenuOpen && (
          <div className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-3/4 h-full bg-[var(--color-fintech-bg-alt)] shadow-xl" onClick={e => e.stopPropagation()}>
                  <Sidebar />
              </div>
          </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden relative no-scrollbar pt-16 md:pt-0">
        {children}
      </div>
    </div>
  );
};
