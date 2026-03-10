'use client';

import { useWallet } from '@/context/WalletContext';
import { motion } from 'framer-motion';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { isConnected, isConnecting, stxAddress, connect, disconnect } = useWallet();
    const [showDropdown, setShowDropdown] = useState(false);

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[rgba(10,10,20,0.7)] border-b border-white/5"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="relative">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
                                    <path d="M3 5v16a2 2 0 0 0 2 2h15" />
                                </svg>
                            </div>
                            <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 opacity-20 blur-sm -z-10" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            StacksVault
                        </span>
                    </motion.div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {['Dashboard', 'My Vaults', 'Analytics'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Wallet Connection */}
                    <div className="relative">
                        {!isConnected ? (
                            <motion.button
                                onClick={connect}
                                disabled={isConnecting}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow disabled:opacity-50"
                            >
                                <Wallet size={16} />
                                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                            </motion.button>
                        ) : (
                            <div>
                                <motion.button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                                    {stxAddress ? truncateAddress(stxAddress) : 'Connected'}
                                    <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </motion.button>

                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-2xl overflow-hidden"
                                    >
                                        <div className="p-3 border-b border-white/5">
                                            <p className="text-xs text-white/40">Connected Address</p>
                                            <p className="text-sm text-white/80 font-mono mt-1 break-all">
                                                {stxAddress}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                disconnect();
                                                setShowDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors"
                                        >
                                            <LogOut size={14} />
                                            Disconnect Wallet
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
