'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Target, Clock, Tag } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useStacksVault } from '@/hooks/useStacksVault';
import { daysToBlocks } from '@/lib/constants';

export default function CreateVault() {
    const { isConnected, connect } = useWallet();
    const { createVault } = useStacksVault();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '',
        targetAmount: '',
        daysUntilDeadline: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) {
            connect();
            return;
        }

        setIsSubmitting(true);
        try {
            const currentBlockHeight = 150000; // Approximate — would fetch from API
            const deadlineBlocks = currentBlockHeight + daysToBlocks(parseInt(form.daysUntilDeadline));

            await createVault(
                form.name,
                parseFloat(form.targetAmount),
                deadlineBlocks,
            );

            setForm({ name: '', targetAmount: '', daysUntilDeadline: '' });
            setIsOpen(false);
        } catch (error) {
            console.error('Error creating vault:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const presetGoals = [
        { name: 'Emergency Fund', amount: '100', days: '90' },
        { name: 'Vacation Savings', amount: '500', days: '180' },
        { name: 'Bitcoin Stack', amount: '1000', days: '365' },
        { name: 'Holiday Gift Fund', amount: '50', days: '60' },
    ];

    return (
        <section id="my-vaults" className="relative py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Create a Savings Vault
                    </h2>
                    <p className="mt-3 text-white/40 text-lg">Set your goal, deposit STX, and track your progress</p>
                </motion.div>

                {/* Trigger Button */}
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center"
                    >
                        <motion.button
                            onClick={() => setIsOpen(true)}
                            whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(124, 58, 237, 0.25)' }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg shadow-xl shadow-violet-500/20"
                        >
                            <Plus size={22} />
                            Create New Vault
                        </motion.button>
                    </motion.div>
                )}

                {/* Create Vault Form */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                        >
                            <div className="relative rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 shadow-2xl">
                                {/* Close button */}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                {/* Preset Goals */}
                                <div className="mb-8">
                                    <p className="text-sm text-white/40 font-medium mb-3">Quick Presets</p>
                                    <div className="flex flex-wrap gap-2">
                                        {presetGoals.map((preset, i) => (
                                            <motion.button
                                                key={i}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setForm({
                                                    name: preset.name,
                                                    targetAmount: preset.amount,
                                                    daysUntilDeadline: preset.days,
                                                })}
                                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                            >
                                                {preset.name}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Vault Name */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm text-white/60 font-medium mb-2">
                                            <Tag size={14} />
                                            Vault Name
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="e.g., Emergency Fund"
                                            maxLength={50}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors"
                                        />
                                    </div>

                                    {/* Target Amount */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm text-white/60 font-medium mb-2">
                                            <Target size={14} />
                                            Target Amount (STX)
                                        </label>
                                        <input
                                            type="number"
                                            value={form.targetAmount}
                                            onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                                            placeholder="e.g., 100"
                                            min="1"
                                            step="0.000001"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors"
                                        />
                                    </div>

                                    {/* Deadline */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm text-white/60 font-medium mb-2">
                                            <Clock size={14} />
                                            Days Until Deadline
                                        </label>
                                        <input
                                            type="number"
                                            value={form.daysUntilDeadline}
                                            onChange={(e) => setForm({ ...form, daysUntilDeadline: e.target.value })}
                                            placeholder="e.g., 90"
                                            min="1"
                                            max="3650"
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-colors"
                                        />
                                        {form.daysUntilDeadline && (
                                            <p className="mt-2 text-xs text-white/30">
                                                ≈ {daysToBlocks(parseInt(form.daysUntilDeadline))} Stacks blocks
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow disabled:opacity-50"
                                    >
                                        {!isConnected
                                            ? 'Connect Wallet to Create Vault'
                                            : isSubmitting
                                                ? 'Creating Vault...'
                                                : 'Create Vault'}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
