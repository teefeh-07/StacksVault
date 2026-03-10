'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Vault, Trophy } from 'lucide-react';
import { useStacksVault, PlatformStats } from '@/hooks/useStacksVault';
import { formatStx } from '@/lib/constants';

export default function StatsPanel() {
    const { getPlatformStats } = useStacksVault();
    const [stats, setStats] = useState<PlatformStats>({
        totalVaults: 0,
        totalLocked: 0,
        totalGoalsCompleted: 0,
        totalUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getPlatformStats();
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [getPlatformStats]);

    const statCards = [
        {
            label: 'Total Vaults',
            value: stats.totalVaults.toLocaleString(),
            icon: <Vault size={20} />,
            gradient: 'from-violet-500 to-purple-600',
            shadowColor: 'shadow-violet-500/20',
        },
        {
            label: 'STX Locked',
            value: `${formatStx(stats.totalLocked)} STX`,
            icon: <Activity size={20} />,
            gradient: 'from-indigo-500 to-blue-600',
            shadowColor: 'shadow-indigo-500/20',
        },
        {
            label: 'Goals Completed',
            value: stats.totalGoalsCompleted.toLocaleString(),
            icon: <Trophy size={20} />,
            gradient: 'from-emerald-500 to-teal-600',
            shadowColor: 'shadow-emerald-500/20',
        },
        {
            label: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: <Users size={20} />,
            gradient: 'from-orange-500 to-amber-600',
            shadowColor: 'shadow-orange-500/20',
        },
    ];

    return (
        <section id="dashboard" className="relative py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Platform Analytics
                    </h2>
                    <p className="mt-3 text-white/40 text-lg">Real-time on-chain statistics</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className={`relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm shadow-xl ${card.shadowColor}`}
                        >
                            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} mb-4`}>
                                <span className="text-white">{card.icon}</span>
                            </div>
                            <p className="text-sm text-white/40 font-medium">{card.label}</p>
                            {loading ? (
                                <div className="mt-1 h-8 w-24 bg-white/5 rounded-lg animate-pulse" />
                            ) : (
                                <p className="mt-1 text-2xl font-bold text-white">{card.value}</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
