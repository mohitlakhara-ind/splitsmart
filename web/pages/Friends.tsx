import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Search, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { getFriendsBalance, getGroups } from '../services/api';
import { formatCurrency } from '../utils/formatters';

interface GroupBreakdown {
  groupId: string;
  groupName: string;
  balance: number;
  imageUrl?: string;
}

interface Friend {
  id: string;
  userId: string;
  userName: string;
  userImageUrl?: string;
  netBalance: number;
  breakdown: GroupBreakdown[];
}

export const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [friendsRes, groupsRes] = await Promise.all([
          getFriendsBalance(),
          getGroups()
        ]);

        const friendsData = friendsRes.data.friendsBalance || [];
        const groups = groupsRes.data.groups || [];

        const gMap = new Map<string, { name: string; imageUrl?: string }>(
          groups.map((g: { _id: string; name: string; imageUrl?: string }) => [g._id, { name: g.name, imageUrl: g.imageUrl }])
        );

        interface FriendBalanceData {
          userId: string;
          userName: string;
          userImageUrl?: string;
          netBalance: number;
          breakdown?: { groupId: string; groupName: string; balance: number }[];
        }

        const transformedFriends = friendsData.map((friend: FriendBalanceData) => ({
          id: friend.userId,
          userId: friend.userId,
          userName: friend.userName,
          userImageUrl: friend.userImageUrl,
          netBalance: friend.netBalance,
          breakdown: (friend.breakdown || []).map((group: { groupId: string; groupName: string; balance: number }) => ({
            groupId: group.groupId,
            groupName: group.groupName,
            balance: group.balance,
            imageUrl: gMap.get(group.groupId)?.imageUrl
          }))
        }));

        setFriends(transformedFriends);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch friends balance data:', err);
        setError('Unable to load friends data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFriends = friends.filter(f =>
    f.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOwedToYou = friends.reduce((acc, curr) => curr.netBalance > 0 ? acc + curr.netBalance : acc, 0);
  const totalYouOwe = friends.reduce((acc, curr) => curr.netBalance < 0 ? acc + Math.abs(curr.netBalance) : acc, 0);

  const formatPrice = (amount: number) => {
    return formatCurrency(Math.abs(amount));
  };

  const getAvatarContent = (imageUrl: string | undefined, name: string, size: 'sm' | 'lg' = 'lg') => {
    const sizeClass = size === 'lg' ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-sm';

    if (imageUrl && /^(https?:|data:image)/.test(imageUrl)) {
      return (
        <img
          src={imageUrl}
          alt={name}
          className={`${sizeClass} object-cover border-2 border-white shadow-sm rounded-full`}
        />
      );
    }
    return (
      <div className={`${sizeClass} flex items-center justify-center font-bold text-[var(--color-fintech-primary)] bg-[var(--color-fintech-primary)]/10 shadow-sm rounded-full`}>
        {name.charAt(0)}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Immersive Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-[var(--color-fintech-primary)] opacity-90" />
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.svg')] filter contrast-125 brightness-100 mix-blend-overlay" />

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-white/20 text-white backdrop-blur-md rounded-full shadow-sm">
                Dashboard
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white">
              Friends
            </h1>
          </div>

          <div className="w-full md:w-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-fintech-text-muted)]" size={20} />
            <input
              type="text"
              placeholder="Find a friend..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 outline-none transition-all w-full md:w-80 font-semibold bg-[var(--color-fintech-bg-alt)] border border-[var(--color-fintech-border)] focus:ring-2 focus:ring-[var(--color-fintech-primary)]/20 rounded-2xl text-[var(--color-fintech-text)] placeholder-[var(--color-fintech-text-muted)] shadow-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 flex items-center justify-between bg-[var(--color-fintech-primary)]/10 border border-[var(--color-fintech-primary)]/20 rounded-3xl shadow-sm"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-1 text-[var(--color-fintech-primary)]">Total Owed to You</p>
            <h3 className="text-4xl font-black text-[var(--color-fintech-primary)]">{formatPrice(totalOwedToYou)}</h3>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-[var(--color-fintech-primary)] text-white rounded-full shadow-sm">
            <TrendingUp size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 flex items-center justify-between bg-red-50 border border-red-100 rounded-3xl shadow-sm"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-1 text-red-500">Total You Owe</p>
            <h3 className="text-4xl font-black text-red-500">{formatPrice(totalYouOwe)}</h3>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-full shadow-sm">
            <TrendingDown size={24} />
          </div>
        </motion.div>
      </div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 flex items-center justify-between bg-red-50 border border-red-100 rounded-2xl shadow-sm"
        >
          <p className="font-semibold text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 font-bold text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Friends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <AnimatePresence mode='popLayout'>
          {filteredFriends.length === 0 && !error ? (
            <div className="col-span-full">
              <EmptyState
                icon={<Users size={32} aria-hidden="true" />}
                title="No Friends Found"
                description={searchTerm
                  ? `No friends match "${searchTerm}".`
                  : "You don't have any friends with active balances. Friends appear here once you share expenses in a group."}
              />
            </div>
          ) : (
            filteredFriends.map((friend, index) => (
              <motion.div
                layout
                key={friend.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden flex flex-col transition-all duration-300 bg-[var(--color-fintech-bg)] border border-[var(--color-fintech-border)] hover:border-[var(--color-fintech-primary)]/50 shadow-sm hover:shadow-md rounded-3xl"
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(friend.id)}
                  aria-expanded={expandedId === friend.id}
                  aria-label={`${friend.userName}, ${friend.netBalance > 0 ? 'owes you' : friend.netBalance < 0 ? 'you owe' : 'settled'} ${formatPrice(friend.netBalance)}`}
                  className="w-full p-6 text-left cursor-pointer">

                  <div className="flex items-start justify-between mb-4">
                    {getAvatarContent(friend.userImageUrl, friend.userName, 'lg')}
                    <div className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm ${friend.netBalance > 0
                      ? 'bg-[var(--color-fintech-primary)]/10 text-[var(--color-fintech-primary)] border border-[var(--color-fintech-primary)]/20'
                      : friend.netBalance < 0
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-[var(--color-fintech-border)] text-[var(--color-fintech-text-muted)] border border-[var(--color-fintech-border)]'
                      }`}>
                      {friend.netBalance > 0 ? 'Owes You' : friend.netBalance < 0 ? 'You Owe' : 'Settled'}
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold mb-1 text-[var(--color-fintech-text)]">{friend.userName}</h3>
                  <p className={`text-2xl font-black ${friend.netBalance > 0
                    ? 'text-[var(--color-fintech-primary)]'
                    : friend.netBalance < 0
                      ? 'text-red-500'
                      : 'text-[var(--color-fintech-text-muted)]'
                    }`}>
                    {friend.netBalance > 0 ? '+' : friend.netBalance < 0 ? '-' : ''}{formatPrice(friend.netBalance)}
                  </p>
                </button>

                <AnimatePresence>
                  {expandedId === friend.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[var(--color-fintech-border)] bg-[var(--color-fintech-bg-alt)]"
                    >
                      <div className="p-4 space-y-3">
                        <p className="text-xs font-bold uppercase text-[var(--color-fintech-text-muted)] tracking-wider">Group Breakdown</p>
                        {friend.breakdown.map(g => (
                          <div key={g.groupId} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                              {getAvatarContent(g.imageUrl, g.groupName, 'sm')}
                              <span className="font-semibold text-[var(--color-fintech-text)]">{g.groupName}</span>
                            </div>
                            <span className={`font-bold ${g.balance > 0 ? 'text-[var(--color-fintech-primary)]' : g.balance < 0 ? 'text-red-500' : 'text-[var(--color-fintech-text-muted)]'}`}>
                              {g.balance > 0 ? '+' : g.balance < 0 ? '-' : ''}{formatPrice(g.balance)}
                            </span>
                          </div>
                        ))}
                        {friend.breakdown.length === 0 && (
                          <p className="text-sm text-[var(--color-fintech-text-muted)] italic">No active groups</p>
                        )}
                        <button type="button" className="w-full mt-4 py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors bg-[var(--color-fintech-primary)] hover:bg-[var(--color-fintech-primary-dark)] text-white rounded-xl shadow-sm">
                          View Details <ArrowRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
