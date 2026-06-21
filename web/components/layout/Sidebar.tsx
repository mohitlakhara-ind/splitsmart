import { CreditCard, Layers, LayoutDashboard, LogOut, Moon, Sun, UserCircle, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';

export const Sidebar = () => {
  const { mode, toggleMode } = useTheme();
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Groups', path: '/groups', icon: Layers },
    { label: 'Friends', path: '/friends', icon: Users },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const containerStyles = "h-full w-full flex flex-col p-6 bg-[var(--color-fintech-bg)] border-r border-[var(--color-fintech-border)]";

  return (
    <div className={containerStyles}>
      <div className="mb-8 px-2">
        <h1 className={`text-2xl font-display font-bold flex items-center gap-2 text-[var(--color-fintech-primary)]`}>
          <CreditCard className="text-[var(--color-fintech-primary)]" />
          Splitwiser
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive(item.path) 
                ? 'bg-[var(--color-fintech-primary)] text-white shadow-sm font-semibold'
                : 'text-[var(--color-fintech-text-muted)] hover:bg-[var(--color-fintech-bg-alt)] hover:text-[var(--color-fintech-text)]'
            }`}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        {user && (
          <div className="p-3 flex items-center gap-3 rounded-xl bg-[var(--color-fintech-bg-alt)] border border-[var(--color-fintech-border)]">
             {user.imageUrl && /^(https?:|data:image)/.test(user.imageUrl) ? (
                <img src={user.imageUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
             ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--color-fintech-primary)] flex items-center justify-center font-bold text-white shadow-sm">
                   {user.name.charAt(0)}
                </div>
             )}
             <div className="flex-1 overflow-hidden">
               <p className="font-semibold text-sm truncate text-[var(--color-fintech-text)]">{user.name}</p>
               <p className="text-xs text-[var(--color-fintech-text-muted)] truncate">{user.email}</p>
             </div>
          </div>
        )}

        <a
          href="/splitwiser.apk"
          download
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-[var(--color-fintech-border)] text-xs text-[var(--color-fintech-text-muted)] hover:bg-[var(--color-fintech-bg-alt)] hover:text-[var(--color-fintech-text)] transition-all font-semibold"
        >
          <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 12c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-11 0c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11.56-5.3l1.83-3.17c.07-.12.03-.28-.09-.35-.12-.07-.28-.03-.35.09l-1.85 3.2C16.14 5.76 14.15 5 12 5c-2.15 0-4.14.76-5.63 1.97L4.52 3.77c-.07-.12-.23-.16-.35-.09-.12.07-.16.23-.09.35l1.83 3.17C2.7 9.17 1 12.38 1 16h22c0-3.62-1.7-6.83-4.94-9.3z"/>
          </svg>
          <span>Download Android App</span>
        </a>

        <div className="flex gap-2">
           <Button size="sm" variant="ghost" onClick={toggleMode} className="flex-1 justify-center border border-[var(--color-fintech-border)]" title="Toggle Dark Mode">
             {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
           </Button>
           <Button variant="ghost" onClick={logout} className="flex-1 justify-center text-red-500 hover:bg-red-50 hover:text-red-600 border border-[var(--color-fintech-border)]">
             <LogOut size={18} />
           </Button>
        </div>
      </div>
    </div>
  );
};
