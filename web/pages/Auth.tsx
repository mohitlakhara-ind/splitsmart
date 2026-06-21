import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CreditCard } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordStrength } from '../components/ui/PasswordStrength';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  login as apiLogin,
  signup as apiSignup,
  loginWithGoogle,
} from '../services/api';
import { signInWithGoogle } from '../services/firebase';

type FormErrors = {
  email?: string;
  password?: string;
  name?: string;
};

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !name) {
      newErrors.name = 'Name is required';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const idToken = await signInWithGoogle();
      const res = await loginWithGoogle(idToken);
      const { access_token, user } = res.data ?? {};
      if (!access_token || !user) {
        throw new Error('Invalid response from server');
      }
      login(access_token, user);
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('');
      } else if (err.response) {
        const detail = err.response.data?.detail;
        setError(
          typeof detail === 'string'
            ? detail
            : detail?.[0]?.msg || 'Google authentication failed'
        );
      } else {
        setError(err.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await apiLogin({ email, password });
      } else {
        res = await apiSignup({ email, password, name });
      }

      const { access_token, user } = res.data;
      login(access_token, user);
      addToast(isLogin ? 'Welcome back!' : 'Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response) {
        const detail = err.response.data?.detail;
        setError(
          typeof detail === 'string'
            ? detail
            : detail?.[0]?.msg || 'Authentication failed'
        );
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: 'email' | 'password' | 'name') => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[var(--color-fintech-bg)] text-[var(--color-fintech-text)]">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--color-fintech-primary)] text-white items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-fintech-primary)] to-[var(--color-fintech-secondary)] opacity-90" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay" />

        {/* Animated Shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 to-transparent blur-3xl rounded-full pointer-events-none"
        />

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[var(--color-fintech-bg-alt)] text-[var(--color-fintech-primary)] flex items-center justify-center rounded-2xl shadow-xl">
                <CreditCard size={32} strokeWidth={2.5} />
              </div>
              <h1 className="text-5xl font-display font-black tracking-tight">Splitwiser</h1>
            </div>
            <h2 className="text-3xl font-display font-bold mb-6 leading-tight">
              The smartest way to share expenses with friends.
            </h2>
            <div className="space-y-4 text-lg text-white/80 font-medium">
              <p className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center text-[var(--color-fintech-primary)] bg-[var(--color-fintech-bg-alt)] rounded-full text-sm font-bold shadow-sm">✓</span>
                Track shared expenses effortlessly
              </p>
              <p className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center text-[var(--color-fintech-primary)] bg-[var(--color-fintech-bg-alt)] rounded-full text-sm font-bold shadow-sm">✓</span>
                Settle up with a single tap
              </p>
              <p className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center text-[var(--color-fintech-primary)] bg-[var(--color-fintech-bg-alt)] rounded-full text-sm font-bold shadow-sm">✓</span>
                Beautiful, intuitive interface
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex flex-col gap-3">
              <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Get the App</span>
              <a
                href="/splitwiser.apk"
                download
                className="inline-flex items-center gap-3 self-start px-5 py-3 bg-white text-[var(--color-fintech-primary)] hover:bg-[var(--color-fintech-bg-alt)] font-bold rounded-xl shadow-lg transition-all text-sm group"
              >
                <svg className="w-5 h-5 text-green-600 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 12c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-11 0c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11.56-5.3l1.83-3.17c.07-.12.03-.28-.09-.35-.12-.07-.28-.03-.35.09l-1.85 3.2C16.14 5.76 14.15 5 12 5c-2.15 0-4.14.76-5.63 1.97L4.52 3.77c-.07-.12-.23-.16-.35-.09-.12.07-.16.23-.09.35l1.83 3.17C2.7 9.17 1 12.38 1 16h22c0-3.62-1.7-6.83-4.94-9.3z"/>
                </svg>
                Download Splitwiser Android App
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-display font-bold tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-fintech-text-muted)] font-medium">
              {isLogin ? 'Enter your details to access your account' : 'Start splitting bills in seconds'}
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 p-3 font-semibold transition-all bg-[var(--color-fintech-bg)] text-[var(--color-fintech-text)] border border-[var(--color-fintech-border)] hover:bg-[var(--color-fintech-bg-alt)] rounded-xl shadow-sm"
            >
              {googleLoading ? (
                <Spinner
                  size={20}
                  className="text-[var(--color-fintech-text-muted)]"
                  ariaLabel="Signing in with Google"
                />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" role="img" aria-labelledby="google-logo-title">
                  <title id="google-logo-title">Google logo</title>
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[var(--color-fintech-border)]"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-semibold text-[var(--color-fintech-text-muted)] uppercase tracking-wider">Or continue with email</span>
              <div className="flex-grow border-t border-[var(--color-fintech-border)]"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <Input
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearFieldError('name');
                      }}
                      required
                      error={fieldErrors.name}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                required
                error={fieldErrors.email}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError('password');
                }}
                required
                error={fieldErrors.password}
              />

              {!isLogin && <PasswordStrength password={password} />}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 text-red-600 text-sm font-medium border border-red-100 bg-red-50 rounded-xl"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-3 text-base"
              >
                {isLogin ? 'Log In' : 'Create Account'} <ArrowRight size={18} />
              </Button>
            </form>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFieldErrors({});
                  setError('');
                }}
                className="text-sm font-semibold text-[var(--color-fintech-primary)] hover:text-[var(--color-fintech-primary-dark)] transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Log In'}
              </button>
            </div>

            <div className="text-center pt-6 border-t border-[var(--color-fintech-border)] mt-6">
              <p className="text-xs text-[var(--color-fintech-text-muted)] font-semibold mb-3">Or use the mobile app</p>
              <a
                href="/splitwiser.apk"
                download
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-fintech-bg-alt)] border border-[var(--color-fintech-border)] hover:bg-[var(--color-fintech-border)] text-[var(--color-fintech-text)] font-semibold rounded-xl shadow-sm transition-all text-xs group"
              >
                <svg className="w-4 h-4 text-green-500 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 12c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-11 0c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm11.56-5.3l1.83-3.17c.07-.12.03-.28-.09-.35-.12-.07-.28-.03-.35.09l-1.85 3.2C16.14 5.76 14.15 5 12 5c-2.15 0-4.14.76-5.63 1.97L4.52 3.77c-.07-.12-.23-.16-.35-.09-.12.07-.16.23-.09.35l1.83 3.17C2.7 9.17 1 12.38 1 16h22c0-3.62-1.7-6.83-4.94-9.3z"/>
                </svg>
                Download Splitwiser Android App (APK)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
