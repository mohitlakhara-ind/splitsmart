import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowRight, Plus, Search, TrendingDown, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { CURRENCIES } from '../constants';
import { useToast } from '../contexts/ToastContext';
import { createGroup, getBalanceSummary, getGroups, joinGroup } from '../services/api';
import { BalanceSummary, Group, GroupBalanceSummary } from '../types';
import { formatCurrency } from '../utils/formatters';

export const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [balanceSummary, setBalanceSummary] = useState<BalanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCurrency, setNewGroupCurrency] = useState('USD');
  const [joinCode, setJoinCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [groupsRes, balanceRes] = await Promise.all([
        getGroups(),
        getBalanceSummary()
      ]);
      setGroups(groupsRes.data.groups);
      setBalanceSummary(balanceRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGroupBalance = (groupId: string): GroupBalanceSummary | undefined => {
    return balanceSummary?.groupsSummary?.find((g: any) => g.groupId === groupId);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGroup({ name: newGroupName, currency: newGroupCurrency });
      setNewGroupName('');
      setNewGroupCurrency('USD');
      setIsCreateModalOpen(false);
      loadData();
      addToast('Group created successfully!', 'success');
    } catch (err) {
      addToast('Failed to create group', 'error');
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await joinGroup(joinCode);
      setJoinCode('');
      setIsJoinModalOpen(false);
      loadData();
      addToast('Joined group successfully!', 'success');
    } catch (err) {
      addToast('Failed to join group (Invalid code or already joined)', 'error');
    }
  };

  const filteredGroups = useMemo(() =>
    groups.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [groups, searchTerm]
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen space-y-8">
      {/* Immersive Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-fintech-primary)] to-[var(--color-fintech-secondary)] opacity-90" />
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.svg')] filter contrast-125 brightness-100 mix-blend-overlay" />

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-white/20 text-white backdrop-blur-md rounded-full shadow-sm">
                Dashboard
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white">
              Groups
            </h1>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex gap-3">
              <Button onClick={() => setIsJoinModalOpen(true)} variant="secondary" className="flex-1 border-transparent hover:bg-white/10 text-white bg-white/20 backdrop-blur-md">
                Join via Code
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)} className="flex-1 bg-[var(--color-fintech-bg-alt)] text-[var(--color-fintech-primary)] hover:bg-gray-50 shadow-sm">
                <Plus size={20} /> Create Group
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
              <input
                type="text"
                aria-label="Search groups"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 outline-none transition-all w-full font-semibold bg-white/10 border border-white/20 focus:bg-white/20 focus:border-white/30 backdrop-blur-md rounded-xl text-white placeholder:text-white/60 shadow-sm"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode='popLayout'>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-3xl" />
            ))
          ) : (
            filteredGroups.map((group) => {
              const groupBalance = getGroupBalance(group._id);
              const balanceAmount = groupBalance?.amount || 0;

              return (
                <motion.button
                  key={group._id}
                  layout
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/groups/${group._id}`)}
                  aria-label={`View details for group ${group.name}`}
                  className="group cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col h-full w-full text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-fintech-primary)]/50 rounded-3xl border border-[var(--color-fintech-border)] shadow-sm bg-[var(--color-fintech-bg)] hover:shadow-md"
                >
                  <div className="h-32 w-full flex items-center px-6 relative overflow-hidden bg-[var(--color-fintech-primary)]/10">
                    <div className="absolute inset-0 opacity-5 bg-[url('/noise.svg')] filter contrast-125 brightness-100" />
                    <div className="relative z-10 flex justify-between w-full items-center">
                      <div className="w-16 h-16 flex items-center justify-center text-3xl font-display font-black bg-[var(--color-fintech-bg-alt)] shadow-sm text-[var(--color-fintech-primary)] rounded-2xl">
                        {group.name.charAt(0)}
                      </div>
                      {balanceAmount !== 0 && (
                        <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-full shadow-sm ${balanceAmount > 0
                          ? 'bg-[var(--color-fintech-primary)]/10 text-[var(--color-fintech-primary)] border border-[var(--color-fintech-primary)]/20'
                          : 'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                          {balanceAmount > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {balanceAmount > 0 ? 'Owed' : 'Owe'} {formatCurrency(Math.abs(balanceAmount), group.currency)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-display font-bold mb-1 text-[var(--color-fintech-text)]">{group.name}</h3>
                    <p className="text-sm text-[var(--color-fintech-text-muted)] mb-6 font-semibold">Currency: {group.currency}</p>

                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-[var(--color-fintech-border)]">
                      <span className="text-xs font-semibold text-[var(--color-fintech-text-muted)] uppercase tracking-wider">Created {new Date(group.createdAt).toLocaleDateString()}</span>
                      <div className="w-10 h-10 flex items-center justify-center transition-all bg-[var(--color-fintech-bg-alt)] text-[var(--color-fintech-text-muted)] group-hover:bg-[var(--color-fintech-primary)] group-hover:text-white rounded-full shadow-sm">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>

        {!loading && filteredGroups.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              icon={<Users size={32} aria-hidden="true" />}
              title="No Groups Found"
              description={searchTerm
                ? `No groups match "${searchTerm}". Try a different search term.`
                : "You haven't joined any groups yet. Create a new one or join with a code to start splitting expenses!"}
              action={searchTerm ? undefined : {
                label: "Create New Group",
                onClick: () => setIsCreateModalOpen(true)
              }}
            />
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Group"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </>
        }
      >
        <form id="createGroupForm" className="space-y-4">
          <Input
            autoFocus
            label="Group Name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="e.g. Hawaii Trip 2024"
            required
          />
          <div className="space-y-1.5">
            <label htmlFor="new-group-currency" className="text-sm font-semibold ml-1 text-[var(--color-fintech-text)]">
              Currency
            </label>
            <select
              id="new-group-currency"
              value={newGroupCurrency}
              onChange={(e) => setNewGroupCurrency(e.target.value)}
              className="w-full p-3 transition-all outline-none rounded-xl border border-[var(--color-fintech-border)] bg-[var(--color-fintech-bg)] focus:border-[var(--color-fintech-primary)] focus:ring-2 focus:ring-[var(--color-fintech-primary)]/20 text-[var(--color-fintech-text)]"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) - {c.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Join Group"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsJoinModalOpen(false)}>Cancel</Button>
            <Button onClick={handleJoinGroup}>Join Group</Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            autoFocus
            label="Invite Code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Paste code here"
            required
          />
        </form>
      </Modal>
    </div>
  );
};