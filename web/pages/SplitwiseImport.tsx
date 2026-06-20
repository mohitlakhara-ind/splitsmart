import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { getSplitwiseAuthUrl } from '../services/api';

export const SplitwiseImport = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleOAuthImport = async () => {
    setLoading(true);
    try {
      const response = await getSplitwiseAuthUrl();
      const { authorization_url } = response.data;

      // Redirect to Splitwise OAuth page
      window.location.href = authorization_url;
    } catch (error: any) {
      console.error('OAuth error:', error);
      addToast(error.response?.data?.detail || 'Failed to initiate authorization', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 transition-colors duration-300 bg-[var(--color-fintech-bg)] text-[var(--color-fintech-text)]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[var(--color-fintech-bg-alt)] rounded-3xl shadow-md border border-[var(--color-fintech-border)] p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 transition-all bg-[var(--color-fintech-primary)]/10 rounded-full shadow-sm">
              <Download className="w-8 h-8 text-[var(--color-fintech-primary)]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-[var(--color-fintech-text)]">
              Import from Splitwise
            </h1>
            <p className="text-base text-[var(--color-fintech-text-muted)] font-medium">
              Seamlessly migrate all your data in just a few clicks
            </p>
          </div>

          {/* Main Button */}
          <button
            onClick={handleOAuthImport}
            disabled={loading}
            className="w-full py-4 px-6 flex items-center justify-center gap-3 transition-all bg-[var(--color-fintech-primary)] hover:bg-[var(--color-fintech-primary-dark)] text-white font-bold rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Connect with Splitwise</span>
              </>
            )}
          </button>

          <p className="text-center text-sm mb-6 text-[var(--color-fintech-text-muted)] font-medium">
            You'll be redirected to Splitwise for authorization
          </p>

          <div className="grid grid-cols-1 gap-4">
            {/* What will be imported */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-blue-900">
                <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                What's being imported
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 font-medium ml-2">
                {['All your friends', 'All your groups', 'All expenses & splits', 'All settlements'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Notes */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-amber-900">
                <div className="w-6 h-6 flex items-center justify-center bg-amber-100 text-amber-600 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                Good to know
              </h3>
              <ul className="space-y-2 text-sm text-amber-800 font-medium ml-2">
                {[
                  'Process may take a few minutes',
                  'Select specific groups next',
                  "Existing data won't be affected"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
