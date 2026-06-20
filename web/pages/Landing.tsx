import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Layers, 
  Users, 
  Zap, 
  Smartphone, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';

export const Landing = () => {
  const { mode } = useTheme();
  const [billAmount, setBillAmount] = useState<number>(120);
  const [numPeople, setNumPeople] = useState<number>(3);

  // Split calculations for the interactive widget
  const splitAmount = (billAmount / numPeople).toFixed(2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-fintech-bg)] text-[var(--color-fintech-text)] overflow-x-hidden selection:bg-[var(--color-fintech-primary)] selection:text-white">
      {/* Decorative background noise/gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[200px] left-[10%] w-[35%] aspect-square bg-[var(--color-fintech-primary)]/10 rounded-full blur-[120px] dark:bg-[var(--color-fintech-primary)]/5" />
        <div className="absolute -top-[100px] right-[10%] w-[30%] aspect-square bg-[var(--color-fintech-secondary)]/15 rounded-full blur-[100px] dark:bg-[var(--color-fintech-secondary)]/5" />
      </div>
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none z-0" />

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-[var(--color-fintech-border)] backdrop-blur-md bg-[var(--color-fintech-bg)]/80 sticky top-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[var(--color-fintech-primary)] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-fintech-primary)]/20">
              <CreditCard size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-display font-black tracking-tight text-[var(--color-fintech-text)]">
              SplitSmart
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-[var(--color-fintech-text-muted)] hover:text-[var(--color-fintech-text)] transition-colors px-3 py-2">
              Log In
            </Link>
            <Link to="/signup">
              <Button size="sm" className="shadow-md">
                Get Started <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          className="lg:col-span-7 space-y-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-fintech-primary)]/10 text-[var(--color-fintech-primary)] text-xs font-bold border border-[var(--color-fintech-primary)]/20">
            <Sparkles size={12} />
            <span>Introducing SplitSmart 2.0</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight leading-[1.08] text-[var(--color-fintech-text)]">
            Settle shared bills, <span className="bg-gradient-to-r from-[var(--color-fintech-primary)] to-[var(--color-fintech-secondary)] bg-clip-text text-transparent">seamlessly.</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--color-fintech-text-muted)] max-w-xl font-medium leading-relaxed">
            The smartest way to split expenses with friends, roommates, and travel buddies. No math, no awkward texts, just one tap to get settled.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link to="/signup" className="flex-1 sm:flex-initial">
              <Button size="lg" className="w-full sm:w-auto px-8 py-4 shadow-xl shadow-[var(--color-fintech-primary)]/20 text-base font-bold">
                Start Splitting For Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a 
              href="/splitsmart.apk" 
              download 
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[var(--color-fintech-bg-alt)] border border-[var(--color-fintech-border)] hover:bg-[var(--color-fintech-border)] text-[var(--color-fintech-text)] font-semibold transition-all shadow-sm text-sm group"
            >
              <svg className="w-5 h-5 text-green-500 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 12c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-11 0c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11.56-5.3l1.83-3.17c.07-.12.03-.28-.09-.35-.12-.07-.28-.03-.35.09l-1.85 3.2C16.14 5.76 14.15 5 12 5c-2.15 0-4.14.76-5.63 1.97L4.52 3.77c-.07-.12-.23-.16-.35-.09-.12.07-.16.23-.09.35l1.83 3.17C2.7 9.17 1 12.38 1 16h22c0-3.62-1.7-6.83-4.94-9.3z"/>
              </svg>
              <span>Download Android App</span>
            </a>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-[var(--color-fintech-border)] max-w-md">
            <div className="flex -space-x-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--color-fintech-bg)] bg-[var(--color-fintech-primary)] flex items-center justify-center font-bold text-[9px] text-white">
                  {['M', 'S', 'A', 'K'][i - 1]}
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--color-fintech-text-muted)] font-semibold">
              Trusted by 10,000+ users splitting bills everyday.
            </p>
          </div>
        </motion.div>

        {/* Hero Interactive Split Calculator Mockup */}
        <motion.div 
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative p-6 md:p-8 rounded-3xl bg-[var(--color-fintech-bg-alt)] border border-[var(--color-fintech-border)] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-fintech-secondary)]/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-[var(--color-fintech-text)] flex items-center gap-2">
                <Zap className="text-[var(--color-fintech-primary)]" size={18} />
                Insta-Split Calculator
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-fintech-primary)]/10 text-[var(--color-fintech-primary)]">
                Try it live
              </span>
            </div>

            {/* Slider Widget */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-[var(--color-fintech-text-muted)]">Bill Amount</span>
                  <span className="text-[var(--color-fintech-text)]">${billAmount}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="5" 
                  value={billAmount}
                  onChange={(e) => setBillAmount(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-[var(--color-fintech-border)] appearance-none cursor-pointer accent-[var(--color-fintech-primary)]"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-[var(--color-fintech-text-muted)]">Split Between</span>
                  <span className="text-[var(--color-fintech-text)]">{numPeople} friends</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="12" 
                  step="1" 
                  value={numPeople}
                  onChange={(e) => setNumPeople(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-[var(--color-fintech-border)] appearance-none cursor-pointer accent-[var(--color-fintech-primary)]"
                />
              </div>

              {/* Live Calculations */}
              <div className="p-5 rounded-2xl bg-[var(--color-fintech-bg)] border border-[var(--color-fintech-border)] text-center space-y-1 shadow-sm">
                <p className="text-xs font-bold text-[var(--color-fintech-text-muted)] uppercase tracking-wider">Each Person Pays</p>
                <p className="text-4xl font-display font-black text-[var(--color-fintech-primary)]">
                  ${splitAmount}
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-semibold text-[var(--color-fintech-text-muted)] border-b border-[var(--color-fintech-border)] pb-2">
                  <span>Person</span>
                  <span>Owes</span>
                </div>
                {Array.from({ length: Math.min(numPeople, 3) }).map((_, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--color-fintech-primary)]/10 text-[var(--color-fintech-primary)] text-[10px] font-bold flex items-center justify-center">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {idx === 0 ? 'You' : `Friend ${idx}`}
                    </span>
                    <span className="font-semibold text-[var(--color-fintech-text)]">${splitAmount}</span>
                  </div>
                ))}
                {numPeople > 3 && (
                  <p className="text-xs text-[var(--color-fintech-text-muted)] italic text-right font-medium">
                    + {numPeople - 3} more friends
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Benefits / Core Features Section */}
      <section className="relative z-10 border-t border-[var(--color-fintech-border)] bg-[var(--color-fintech-bg-alt)]/30 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3.5xl font-display font-black tracking-tight text-[var(--color-fintech-text)]">
              Engineered for seamless bill management
            </h2>
            <p className="text-[var(--color-fintech-text-muted)] font-medium text-base">
              Everything you need to manage group budgets, household utilities, dinner shares, and split calculations without the complexity.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-[var(--color-fintech-bg)] border border-[var(--color-fintech-border)] shadow-sm space-y-4 hover:shadow-md hover:border-[var(--color-fintech-primary)]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-fintech-primary)]/10 text-[var(--color-fintech-primary)] flex items-center justify-center transition-transform group-hover:scale-110">
                <Layers size={22} />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--color-fintech-text)]">Group Budgets</h3>
              <p className="text-sm text-[var(--color-fintech-text-muted)] leading-relaxed font-medium">
                Create dedicated groups for trips, rent, dinner dates, or projects. Keep everything sorted and transparent.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-[var(--color-fintech-bg)] border border-[var(--color-fintech-border)] shadow-sm space-y-4 hover:shadow-md hover:border-[var(--color-fintech-primary)]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-fintech-primary)]/10 text-[var(--color-fintech-primary)] flex items-center justify-center transition-transform group-hover:scale-110">
                <Users size={22} />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--color-fintech-text)]">Debt Minimizer</h3>
              <p className="text-sm text-[var(--color-fintech-text-muted)] leading-relaxed font-medium">
                Our smart clearing algorithm simplifies balances, ensuring people pay the absolute minimum transactions to settle up.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-[var(--color-fintech-bg)] border border-[var(--color-fintech-border)] shadow-sm space-y-4 hover:shadow-md hover:border-[var(--color-fintech-primary)]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-fintech-primary)]/10 text-[var(--color-fintech-primary)] flex items-center justify-center transition-transform group-hover:scale-110">
                <Smartphone size={22} />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--color-fintech-text)]">Fully Native App</h3>
              <p className="text-sm text-[var(--color-fintech-text-muted)] leading-relaxed font-medium">
                Download the fully-featured Android APK directly from the browser. Check balances, split bills, and scan receipts on the go.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Firebase Auth Showcase Section */}
      <section className="relative z-10 py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-inner">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-3.5xl font-display font-black tracking-tight text-[var(--color-fintech-text)]">
            One-Click Google Authentication
          </h2>
          <p className="text-[var(--color-fintech-text-muted)] leading-relaxed font-medium">
            We use Firebase Auth to provide passwordless secure login. Click the "Continue with Google" button, authenticate with Google, and you're logged in across both Web and Android apps.
          </p>
          <ul className="space-y-3 font-semibold text-sm">
            <li className="flex items-center gap-2.5 text-[var(--color-fintech-text)]">
              <CheckCircle2 size={16} className="text-[var(--color-fintech-primary)]" />
              Secure token-based auth (JWT)
            </li>
            <li className="flex items-center gap-2.5 text-[var(--color-fintech-text)]">
              <CheckCircle2 size={16} className="text-[var(--color-fintech-primary)]" />
              Same account on Android & Web
            </li>
            <li className="flex items-center gap-2.5 text-[var(--color-fintech-text)]">
              <CheckCircle2 size={16} className="text-[var(--color-fintech-primary)]" />
              No passwords to remember
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7 p-1 rounded-3xl bg-gradient-to-tr from-[var(--color-fintech-primary)]/20 to-[var(--color-fintech-secondary)]/20 border border-[var(--color-fintech-border)] shadow-xl overflow-hidden">
          <div className="bg-[var(--color-fintech-bg-alt)] p-6 md:p-8 rounded-[22px] space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--color-fintech-border)] pb-4">
              <span className="text-xs font-bold text-[var(--color-fintech-text-muted)] uppercase tracking-wider">Authentication Flow</span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-fintech-bg)] border border-[var(--color-fintech-border)] shadow-sm">
              <div className="space-y-1">
                <p className="font-bold text-sm text-[var(--color-fintech-text)]">Firebase Security SDK</p>
                <p className="text-xs text-[var(--color-fintech-text-muted)] font-medium">Verify your session cryptographically.</p>
              </div>
              <Link to="/login" className="self-start md:self-auto">
                <Button size="sm" className="whitespace-nowrap flex items-center gap-2 font-bold">
                  Try Google Login <ChevronRight size={14} />
                </Button>
              </Link>
            </div>

            <div className="flex justify-between items-center text-xs text-[var(--color-fintech-text-muted)] font-semibold px-2">
              <span>Web Interface (Popup Flow)</span>
              <div className="w-16 h-px bg-[var(--color-fintech-border)]" />
              <span>Android App (Native SDK)</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Download Banner */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-tr from-[var(--color-fintech-primary)] to-[var(--color-fintech-secondary)] text-white shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
          
          <div className="space-y-4 max-w-lg z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight leading-tight">
              Get SplitSmart on your Android phone
            </h2>
            <p className="text-white/80 text-sm md:text-base font-medium">
              Take the mobile application with you on trips and dinners. Download our ready-to-use Android package (APK) now.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto z-10">
            <a 
              href="/splitsmart.apk" 
              download 
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-3 px-6 py-4 bg-white text-[var(--color-fintech-primary)] hover:bg-neutral-100 font-bold rounded-2xl shadow-lg transition-all text-sm group"
            >
              <svg className="w-5 h-5 text-green-600 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 12c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-11 0c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11.56-5.3l1.83-3.17c.07-.12.03-.28-.09-.35-.12-.07-.28-.03-.35.09l-1.85 3.2C16.14 5.76 14.15 5 12 5c-2.15 0-4.14.76-5.63 1.97L4.52 3.77c-.07-.12-.23-.16-.35-.09-.12.07-.16.23-.09.35l1.83 3.17C2.7 9.17 1 12.38 1 16h22c0-3.62-1.7-6.83-4.94-9.3z"/>
              </svg>
              <span>Download APK</span>
            </a>
            <Link to="/signup" className="flex-1 sm:flex-initial">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-2xl shadow-md transition-all text-sm">
                Open Web Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--color-fintech-border)] py-12 bg-[var(--color-fintech-bg-alt)]/20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--color-fintech-primary)] text-white rounded-lg flex items-center justify-center shadow-md">
              <CreditCard size={14} strokeWidth={2.5} />
            </div>
            <span className="text-base font-display font-black tracking-tight text-[var(--color-fintech-text)]">
              SplitSmart
            </span>
          </div>

          <p className="text-xs text-[var(--color-fintech-text-muted)] font-medium text-center md:text-right">
            © 2026 SplitSmart Inc. All rights reserved. Google & Firebase are trademarks of Google LLC.
          </p>
        </div>
      </footer>
    </div>
  );
};
