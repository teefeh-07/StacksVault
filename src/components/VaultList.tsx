'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle, Lock, Clock } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useStacksVault, VaultData } from '@/hooks/useStacksVault';
import { formatStx, blocksToDays } from '@/lib/constants';

export default function VaultList() {
    const { isConnected, stxAddress } = useWallet();
    const { getUserVaults, deposit, withdraw, emergencyWithdraw } = useStacksVault();
    const [vaults, setVaults] = useState<VaultData[]>([]);
    const [loading, setLoading] = useState(true);
    const [depositAmounts, setDepositAmounts] = useState<Record<number, string>>({});
    const [activeAction, setActiveAction] = useState<{ vaultId: number; action: string } | null>(null);

    useEffect(() => {
        if (!isConnected || !stxAddress) {
            setVaults([]);
            setLoading(false);
            return;
        }

        const fetchVaults = async () => {
            setLoading(true);
            try {
                const data = await getUserVaults();
                setVaults(data);
            } catch (err) {
                console.error('Error fetching vaults:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVaults();
    }, [isConnected, stxAddress, getUserVaults]);

    const handleDeposit = async (vaultId: number) => {
        const amount = parseFloat(depositAmounts[vaultId] || '0');
        if (amount <= 0) return;

        setActiveAction({ vaultId, action: 'deposit' });
        try {
            await deposit(vaultId, amount);
            setDepositAmounts(prev => ({ ...prev, [vaultId]: '' }));
        } catch (error) {
            console.error('Deposit error:', error);
        } finally {
            setActiveAction(null);
        }
    };

    const handleWithdraw = async (vaultId: number) => {
        setActiveAction({ vaultId, action: 'withdraw' });
        try {
            await withdraw(vaultId);
        } catch (error) {
            console.error('Withdraw error:', error);
        } finally {
            setActiveAction(null);
        }
    };

    const handleEmergencyWithdraw = async (vaultId: number) => {
        setActiveAction({ vaultId, action: 'emergency' });
        try {
            await emergencyWithdraw(vaultId);
        } catch (error) {
            console.error('Emergency withdraw error:', error);
        } finally {
            setActiveAction(null);
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 100) return 'from-emerald-500 to-teal-500';
        if (progress >= 75) return 'from-violet-500 to-indigo-500';
        if (progress >= 50) return 'from-blue-500 to-cyan-500';
        if (progress >= 25) return 'from-amber-500 to-orange-500';
        return 'from-rose-500 to-pink-500';
    };

    const getStatusBadge = (vault: VaultData) => {
        if (vault.isWithdrawn) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-xs text-white/40">
                    <CheckCircle size={12} />
                    Withdrawn
                </span>
            );
        }
        if (vault.isCompleted) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-xs text-emerald-400 border border-emerald-500/20">
                    <CheckCircle size={12} />
                    Goal Reached
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/10 text-xs text-violet-400 border border-violet-500/20">
                <Clock size={12} />
                In Progress
            </span>
        );
    };

    if (!isConnected) {
        return (
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/[0.06] border-dashed">
                        <Lock size={48} className="mx-auto text-white/20 mb-4" />
                        <h3 className="text-xl font-semibold text-white/60 mb-2">Connect Your Wallet</h3>
                        <p className="text-white/30">Connect your Leather or Xverse wallet to view your savings vaults.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Your Vaults
                    </h2>
                    <p className="mt-3 text-white/40 text-lg">Manage and track your savings progress</p>
                </motion.div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse">
                                <div className="h-6 w-40 bg-white/5 rounded mb-4" />
                                <div className="h-4 w-full bg-white/5 rounded mb-3" />
                                <div className="h-8 w-24 bg-white/5 rounded" />
                            </div>
                        ))}
                    </div>
                ) : vaults.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center p-12 rounded-3xl bg-white/[0.02] border border-white/[0.06] border-dashed"
                    >
                        <p className="text-lg text-white/40">No vaults yet. Create your first savings vault above!</p>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        <div className="space-y-6">
                            {vaults.map((vault, index) => {
                                const progress = Math.min(100, Math.round((vault.currentAmount / vault.targetAmount) * 100));
                                const isActive = activeAction?.vaultId === index;

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="p-6 pb-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{vault.name}</h3>
                                                    <p className="text-sm text-white/30 mt-1">
                                                        Created ~{blocksToDays(vault.createdAt)} days ago • {vault.totalDeposits} deposits
                                                    </p>
                                                </div>
                                                {getStatusBadge(vault)}
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-white/50">Progress</span>
                                                    <span className="text-sm font-semibold text-white">{progress}%</span>
                                                </div>
                                                <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        transition={{ duration: 1, ease: 'easeOut' }}
                                                        className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(progress)} shadow-lg`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="p-3 rounded-xl bg-white/[0.03]">
                                                    <p className="text-xs text-white/30">Current</p>
                                                    <p className="text-sm font-semibold text-white mt-1">{formatStx(vault.currentAmount)} STX</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-white/[0.03]">
                                                    <p className="text-xs text-white/30">Target</p>
                                                    <p className="text-sm font-semibold text-white mt-1">{formatStx(vault.targetAmount)} STX</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-white/[0.03]">
                                                    <p className="text-xs text-white/30">Deadline</p>
                                                    <p className="text-sm font-semibold text-white mt-1">Block #{vault.deadline.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {!vault.isWithdrawn && (
                                            <div className="px-6 pb-6 pt-2">
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    {/* Deposit */}
                                                    {!vault.isCompleted && (
                                                        <div className="flex-1 flex gap-2">
                                                            <input
                                                                type="number"
                                                                placeholder="Amount (STX)"
                                                                value={depositAmounts[index] || ''}
                                                                onChange={(e) =>
                                                                    setDepositAmounts(prev => ({ ...prev, [index]: e.target.value }))
                                                                }
                                                                className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50"
                                                            />
                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                onClick={() => handleDeposit(index)}
                                                                disabled={isActive}
                                                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors disabled:opacity-50"
                                                            >
                                                                <ArrowUpRight size={14} />
                                                                Deposit
                                                            </motion.button>
                                                        </div>
                                                    )}

                                                    {/* Withdraw */}
                                                    {vault.isCompleted && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            onClick={() => handleWithdraw(index)}
                                                            disabled={isActive}
                                                            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50"
                                                        >
                                                            <ArrowDownRight size={14} />
                                                            Withdraw ({formatStx(vault.currentAmount)} STX)
                                                        </motion.button>
                                                    )}

                                                    {/* Emergency Withdraw */}
                                                    {!vault.isCompleted && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            onClick={() => handleEmergencyWithdraw(index)}
                                                            disabled={isActive}
                                                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-amber-400 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                                                        >
                                                            <AlertTriangle size={14} />
                                                            Emergency
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </section>
    );
}
