import { motion } from 'framer-motion';
import { Check, ChevronLeft, Receipt, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { handleSplitwiseCallback } from '../services/api';
import { getCurrencySymbol } from '../utils/formatters';

interface PreviewGroup {
  splitwiseId: string;
  name: string;
  currency: string;
  memberCount: number;
  expenseCount: number;
  totalAmount: number;
  imageUrl?: string;
}

export const SplitwiseGroupSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [groups, setGroups] = useState<PreviewGroup[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    // Get OAuth params from location state (passed from callback)
    const state = location.state as { accessToken?: string; groups?: PreviewGroup[] };

    if (state?.groups) {
      setGroups(state.groups);
      setAccessToken(state.accessToken || '');
      // Select all groups by default
      setSelectedGroupIds(new Set(state.groups.map(g => g.splitwiseId)));
      setLoading(false);
    } else {
      addToast('No group data available', 'error');
      navigate('/import/splitwise');
    }
  }, [location.state, addToast, navigate]);

  const toggleGroup = (groupId: string) => {
    const newSelected = new Set(selectedGroupIds);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    setSelectedGroupIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedGroupIds.size === groups.length) {
      setSelectedGroupIds(new Set());
    } else {
      setSelectedGroupIds(new Set(groups.map(g => g.splitwiseId)));
    }
  };

  const handleStartImport = async () => {
    if (selectedGroupIds.size === 0) {
      addToast('Please select at least one group', 'error');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      addToast('Authentication required. Please log in again.', 'error');
      navigate('/login');
      return;
    }

    setImporting(true);
    try {
      // Call the import API with selected groups and access token
      const response = await handleSplitwiseCallback(
        undefined, // no code
        undefined, // no state
        Array.from(selectedGroupIds),
        accessToken // pass stored access token
      );

      const jobId = response.data.import_job_id || response.data.importJobId;

      // Navigate to callback/progress page
      navigate('/import/splitwise/callback', {
        state: { jobId, skipOAuth: true }
      });

    } catch (error: any) {
      console.error('Import start error:', error);
      addToast(
        error.response?.data?.detail || 'Failed to start import',
        'error'
      );
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-fintech-bg)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 mx-auto mb-4 border-[var(--color-fintech-primary)] border-t-transparent"></div>
          <p className="text-[var(--color-fintech-text-muted)] font-medium">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 transition-colors duration-300 bg-[var(--color-fintech-bg)] text-[var(--color-fintech-text)]">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/import/splitwise')}
          className="flex items-center gap-1 mb-4 text-sm font-semibold transition-colors text-[var(--color-fintech-text-muted)] hover:text-[var(--color-fintech-text)]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 bg-[var(--color-fintech-bg-alt)] rounded-3xl shadow-sm border border-[var(--color-fintech-border)] p-6"
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2 text-[var(--color-fintech-text)]">
            Select Groups to Import
          </h1>
          <p className="text-base text-[var(--color-fintech-text-muted)] font-medium">
            Your Splitwise groups are ready. Choose which ones to bring to Splitwiser.
          </p>
        </motion.div>

        {/* Selection Controls */}
        <div className="bg-[var(--color-fintech-bg-alt)] rounded-2xl shadow-sm border border-[var(--color-fintech-border)] p-4 mb-4 flex items-center justify-between">
          <div className="text-sm font-medium text-[var(--color-fintech-text-muted)]">
            <span className="font-bold text-[var(--color-fintech-primary)]">
              {selectedGroupIds.size}
            </span> of {groups.length} groups selected
          </div>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm font-bold transition-colors text-[var(--color-fintech-primary)] hover:text-[var(--color-fintech-primary-dark)]"
          >
            {selectedGroupIds.size === groups.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Groups List */}
        <div className="space-y-3 mb-6">
          {groups.map((group) => {
            const isSelected = selectedGroupIds.has(group.splitwiseId);

            return (
              <motion.div
                key={group.splitwiseId}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={() => toggleGroup(group.splitwiseId)}
                className={`transition-all cursor-pointer p-4 bg-[var(--color-fintech-bg-alt)] rounded-2xl shadow-sm hover:shadow-md border border-[var(--color-fintech-border)] hover:border-[var(--color-fintech-primary)]/50 ${isSelected ? 'ring-2 ring-[var(--color-fintech-primary)]/20 border-[var(--color-fintech-primary)]' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-all rounded-full border-2 ${isSelected
                    ? 'bg-[var(--color-fintech-primary)] border-[var(--color-fintech-primary)]'
                    : 'bg-[var(--color-fintech-bg-alt)] border-[var(--color-fintech-border)]'
                    }`}>
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </div>

                  {/* Group Image */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center font-display font-bold text-lg rounded-xl bg-[var(--color-fintech-primary)]/10 text-[var(--color-fintech-primary)] shadow-sm">
                      {group.imageUrl ? (
                        <img
                          src={group.imageUrl}
                          alt={group.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        group.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>

                  {/* Group Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-display font-bold mb-1 truncate text-[var(--color-fintech-text)]">
                      {group.name}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <div className="flex items-center gap-1 font-medium text-[var(--color-fintech-text-muted)]">
                        <Users className="w-4 h-4 opacity-70" />
                        <span>{group.memberCount} members</span>
                      </div>

                      <div className="flex items-center gap-1 font-medium text-[var(--color-fintech-text-muted)]">
                        <Receipt className="w-4 h-4 opacity-70" />
                        <span>{group.expenseCount} expenses</span>
                      </div>

                      <div className="flex items-center gap-1 font-bold text-[var(--color-fintech-primary)]">
                        <span>{getCurrencySymbol(group.currency)}</span>
                        <span>
                          {new Intl.NumberFormat(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(group.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Import Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[var(--color-fintech-bg-alt)] rounded-3xl shadow-sm border border-[var(--color-fintech-border)] p-6"
        >
          <button
            type="button"
            onClick={handleStartImport}
            disabled={importing || selectedGroupIds.size === 0}
            className="w-full py-4 px-6 flex items-center justify-center gap-3 transition-all bg-[var(--color-fintech-primary)] hover:bg-[var(--color-fintech-primary-dark)] text-white font-bold rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Importing...</span>
              </>
            ) : (
              <span>
                Import {selectedGroupIds.size} Selected Group{selectedGroupIds.size !== 1 ? 's' : ''}
              </span>
            )}
          </button>

          {selectedGroupIds.size === 0 && (
            <p className="text-center text-sm font-medium mt-3 text-[var(--color-fintech-text-muted)]">
              Select at least one group to proceed
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
