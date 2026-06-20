import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { getImportStatus, handleSplitwiseCallback } from '../services/api';

export const SplitwiseCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [status, setStatus] = useState('Processing authorization...');
  const [progress, setProgress] = useState(0);
  const [importing, setImporting] = useState(true);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Check if we're in progress tracking mode (skipOAuth from group selection)
    const state = location.state as { jobId?: string; skipOAuth?: boolean };
    if (state?.skipOAuth && state?.jobId) {
      // Start polling for existing job
      startProgressPolling(state.jobId);
      return;
    }

    // Prevent duplicate execution in React Strict Mode using ref
    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;

    const handleCallback = async () => {
      // Parse query parameters from the full URL (before the hash)
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (!code) {
        addToast('Authorization failed - no code received', 'error');
        navigate('/import/splitwise');
        return;
      }

      try {
        setStatus('Fetching your Splitwise data...');

        // First, exchange OAuth code for access token and get preview
        const tokenResponse = await handleSplitwiseCallback(code, state || '');

        // Check if we got groups in the response (from preview)
        if (tokenResponse.data.groups && tokenResponse.data.groups.length > 0) {
          // Navigate to group selection
          navigate('/import/splitwise/select-groups', {
            state: {
              accessToken: tokenResponse.data.accessToken,
              groups: tokenResponse.data.groups
            }
          });
          return;
        }

        // If no groups or preview data, start import directly (backward compatibility)
        const jobId = tokenResponse.data.import_job_id || tokenResponse.data.importJobId;

        if (!jobId) {
          throw new Error('No import job ID received');
        }
        addToast('Authorization successful! Starting import...', 'success');

        startProgressPolling(jobId);

      } catch (error: any) {
        addToast(
          error.response?.data?.detail || 'Failed to process authorization',
          'error'
        );
        setImporting(false);
        setTimeout(() => navigate('/import/splitwise'), 2000);
      }
    };

    handleCallback();
  }, [navigate, addToast, location.state]);

  const startProgressPolling = (jobId: string) => {
    setStatus('Import started...');

    // Poll for progress
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await getImportStatus(jobId);
        const statusData = statusResponse.data;

        // Log errors if any (keep for debugging in dev only)
        if (process.env.NODE_ENV === 'development' && statusData.errors && statusData.errors.length > 0) {
          console.warn('Import errors:', statusData.errors);
        }

        const progressPercentage = statusData.progress?.percentage || 0;
        const currentStage = statusData.progress?.currentStage || 'Processing...';

        setProgress(progressPercentage);
        setStatus(currentStage);

        if (statusData.status === 'completed') {
          clearInterval(pollInterval);
          setImporting(false);
          addToast('Import completed successfully!', 'success');
          setStatus('Completed! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else if (statusData.status === 'failed') {
          clearInterval(pollInterval);
          setImporting(false);
          addToast('Import failed', 'error');
          setStatus(`Failed: ${statusData.errors?.[0]?.message || 'Unknown error'}`);
        }
      } catch (error) {
        // Silently catch polling errors to avoid spamming console
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center transition-colors duration-300 bg-[var(--color-fintech-bg)]">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full bg-[var(--color-fintech-bg-alt)] rounded-3xl shadow-md border border-[var(--color-fintech-border)] p-8"
      >
        <div className="text-center mb-6">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 mb-4 border-[var(--color-fintech-primary)] border-t-transparent"></div>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2 text-[var(--color-fintech-text)]">
            {importing ? 'Importing Data' : 'Processing'}
          </h1>
          <p className="text-base font-medium text-[var(--color-fintech-text-muted)]">{status}</p>
        </div>

        {importing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-fintech-text-muted)]">Progress</span>
              <span className="text-lg font-bold text-[var(--color-fintech-text)]">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--color-fintech-border)] rounded-full border border-[var(--color-fintech-border)]">
              <div
                className="h-full transition-all duration-300 ease-out bg-[var(--color-fintech-primary)] rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <p className="text-sm font-medium text-blue-800 text-center">
            Please don't close this page until the import is complete.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
