'use client';

import { WalletProvider } from '@/context/WalletContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsPanel from '@/components/StatsPanel';
import CreateVault from '@/components/CreateVault';
import VaultList from '@/components/VaultList';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-[#0a0a14] text-white relative overflow-hidden">
        {/* Subtle ambient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-violet-900/10 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-indigo-900/10 rounded-full blur-[160px]" />
        </div>

        <Navbar />

        <main className="relative z-10">
          <Hero />
          <StatsPanel />
          <CreateVault />
          <VaultList />
        </main>

        <Footer />
      </div>
    </WalletProvider>
  );
}
