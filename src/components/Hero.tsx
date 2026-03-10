'use client';

import { motion } from 'framer-motion';
import { useWallet } from '@/context/WalletContext';
import { Wallet, TrendingUp, Shield, Zap } from 'lucide-react';

export default function Hero() {
    const { isConnected, connect } = useWallet();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8"
                >
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                    <span className="text-sm text-violet-300 font-medium">Built on Stacks • Bitcoin L2</span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold leading-tight"
                >
                    <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Save Smarter with
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                        Decentralized Vaults
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-6 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
                >
                    Create personal savings goals secured by Bitcoin. Set targets, track progress,
                    and achieve your financial milestones — all on-chain.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    {!isConnected ? (
                        <motion.button
                            onClick={connect}
                            whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(124, 58, 237, 0.3)' }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg shadow-xl shadow-violet-500/20 transition-shadow"
                        >
                            <Wallet size={20} />
                            Connect & Start Saving
                        </motion.button>
                    ) : (
                        <motion.a
                            href="#my-vaults"
                            whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(124, 58, 237, 0.3)' }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg shadow-xl shadow-violet-500/20 transition-shadow"
                        >
                            Go to My Vaults
                        </motion.a>
                    )}
                    <motion.a
                        href="#dashboard"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-semibold text-lg hover:bg-white/10 transition-colors"
                    >
                        View Dashboard
                    </motion.a>
                </motion.div>

                {/* Feature cards */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        {
                            icon: <Shield size={24} />,
                            title: 'Bitcoin-Secured',
                            description: 'Your savings are secured by Bitcoin\'s proof-of-work through Stacks\' consensus mechanism.',
                            gradient: 'from-orange-500 to-amber-500',
                        },
                        {
                            icon: <TrendingUp size={24} />,
                            title: 'Goal Tracking',
                            description: 'Set target amounts and deadlines. Track your progress with real-time on-chain updates.',
                            gradient: 'from-violet-500 to-purple-500',
                        },
                        {
                            icon: <Zap size={24} />,
                            title: 'Non-Custodial',
                            description: 'You control your funds at all times. Smart contracts ensure trustless operation.',
                            gradient: 'from-indigo-500 to-blue-500',
                        },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="relative group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg`}>
                                <span className="text-white">{feature.icon}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
