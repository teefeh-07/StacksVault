'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative border-t border-white/5 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
                                    <path d="M3 5v16a2 2 0 0 0 2 2h15" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">StacksVault</span>
                        </div>
                        <p className="text-sm text-white/30 leading-relaxed max-w-sm">
                            Decentralized micro-savings platform built on Stacks. Save smarter, save on-chain,
                            secured by Bitcoin.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Stacks Docs', url: 'https://docs.stacks.co' },
                                { name: 'Clarity Language', url: 'https://docs.stacks.co/clarity' },
                                { name: 'Stacks Explorer', url: 'https://explorer.stacks.co' },
                                { name: 'Leather Wallet', url: 'https://leather.io' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
                                    >
                                        <ExternalLink size={12} />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contest Info */}
                    <div>
                        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Contest</h4>
                        <p className="text-sm text-white/30 leading-relaxed mb-4">
                            Built for the Stacks Builder Rewards contest (March 2026).
                            Demonstrating real DeFi utility on Bitcoin L2.
                        </p>
                        <motion.a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white transition-colors"
                        >
                            <Github size={16} />
                            View Source
                        </motion.a>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-white/5 text-center">
                    <p className="text-sm text-white/20">
                        © 2026 StacksVault. Built with Clarity, Stacks, and Next.js.
                    </p>
                </div>
            </div>
        </footer>
    );
}
