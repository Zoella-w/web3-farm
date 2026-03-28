"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchContractEvent } from 'wagmi';

// Types for data cards
interface DataCardProps {
  title: string;
  value: string;
  subtitle: string;
  progress?: number;
  tooltip: string;
  link?: string;
}

const DataCard = ({ title, value, subtitle, progress, tooltip, link }: DataCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5, borderColor: 'rgba(16, 185, 129, 0.4)' }}
      className="relative bg-gray-dark/40 backdrop-blur-md border border-gray-light/50 p-6 rounded-2xl flex flex-col justify-between h-full group transition-colors"
      onClick={() => link && (window.location.href = link)}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</span>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-gray-500 hover:text-accent-green-mid transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-light text-xs text-gray-300 rounded shadow-xl z-20 pointer-events-none"
              >
                {tooltip}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold text-white group-hover:text-accent-green-mid transition-colors">
          {value}
        </div>
        {progress !== undefined && (
          <div className="w-full h-1 bg-gray-light rounded-full overflow-hidden mt-1">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-tech-gradient"
            />
          </div>
        )}
        <div className="text-xs text-gray-500 flex justify-between">
          <span>{subtitle}</span>
          {progress !== undefined && <span className="text-accent-green-mid">{progress}%</span>}
        </div>
      </div>
    </motion.div>
  );
};

// Types for dividend events
interface DividendEvent {
  id: string;
  time: string;
  user: string;
  boxes: number;
  amount: string;
}

const YieldStream = () => {
  const [events, setEvents] = useState<DividendEvent[]>([
    { id: '1', time: '12:30:45', user: '0x8a7d...3f2e', boxes: 2, amount: '0.08' },
    { id: '2', time: '12:31:12', user: '0x3c2b...9a1d', boxes: 5, amount: '0.20' },
    { id: '3', time: '12:32:05', user: '0xf4e1...bc8a', boxes: 1, amount: '0.04' },
    { id: '4', time: '12:33:18', user: '0x7d9a...4c6b', boxes: 10, amount: '0.40' },
    { id: '5', time: '12:34:50', user: '0x2b8c...e1f3', boxes: 3, amount: '0.12' },
    { id: '6', time: '12:35:10', user: '0x9d3e...2f1a', boxes: 1, amount: '0.04' },
    { id: '7', time: '12:36:22', user: '0x1c4d...5e6f', boxes: 4, amount: '0.16' },
    { id: '8', time: '12:37:15', user: '0x5e6f...7g8h', boxes: 2, amount: '0.08' },
    { id: '9', time: '12:38:05', user: '0x3c2b...9a1d', boxes: 1, amount: '0.04' },
    { id: '10', time: '12:39:40', user: '0x8a7d...3f2e', boxes: 6, amount: '0.24' },
  ]);

  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const users = ['0x1a2b', '0x3c4d', '0x5e6f', '0x7g8h', '0x9i0j'];
      const newEvent: DividendEvent = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        user: `${users[Math.floor(Math.random() * users.length)]}...${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        boxes: Math.floor(Math.random() * 5) + 1,
        amount: (Math.random() * 0.5).toFixed(2),
      };
      // Keep exactly 20 items
      setEvents(prev => [newEvent, ...prev].slice(0, 20));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-dark/40 backdrop-blur-md border border-gray-light/50 rounded-3xl p-8 flex flex-col h-[650px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <h3 className="text-xl font-bold text-white tracking-tight">Live Yield Stream</h3>
      </div>

      <div
        className="relative flex-1 overflow-y-auto pr-2 custom-scrollbar"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)'
        }}
      >
        <div ref={listRef} className="space-y-5 py-4">
          <AnimatePresence initial={false}>
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20, backgroundColor: "rgba(42, 42, 42, 0.3)" }}
                animate={{
                  opacity: 1,
                  x: 0,
                  backgroundColor: ["rgba(42, 42, 42, 0.3)", "rgba(16, 185, 129, 0.15)", "rgba(42, 42, 42, 0.3)"],
                  borderColor: ["rgba(42, 42, 42, 0.2)", "rgba(16, 185, 129, 0.4)", "rgba(42, 42, 42, 0.2)"],
                  boxShadow: ["0 0 0px rgba(16, 185, 129, 0)", "0 0 15px rgba(16, 185, 129, 0.2)", "0 0 0px rgba(16, 185, 129, 0)"]
                }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.8,
                  backgroundColor: { duration: 1.5, times: [0, 0.2, 1] },
                  borderColor: { duration: 1.5, times: [0, 0.2, 1] },
                  boxShadow: { duration: 1.5, times: [0, 0.2, 1] }
                }}
                className="relative bg-gray-light/30 border border-gray-light/20 p-6 rounded-2xl flex items-center justify-between group hover:bg-gray-light/50 transition-colors overflow-hidden"
              >
                {/* Shimmer overlay effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                />
                <div className="flex flex-col gap-2 relative z-10">
                  <span className="text-xs font-mono text-gray-500">{event.time}</span>
                  <div className="text-base text-gray-300">
                    User <span className="text-accent-green-mid font-mono">{event.user}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="text-sm px-2 py-1 rounded text-gray-400 uppercase">{event.boxes} Boxes</span>
                    <span className="text-xl font-bold text-accent-green-mid">+{event.amount} USDC</span>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-tighter">Yield Distributed to NFT Holders</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
};

const LiveDataTrust = () => {
  const dashboardData: DataCardProps[] = [
    {
      title: "Operational Treasury",
      value: "$45,230 USDC",
      subtitle: "Pool A (Operations)",
      tooltip: "Funds dedicated to daily farm operations, labor, and maintenance.",
      link: "/treasury/a"
    },
    {
      title: "Growth Treasury",
      value: "$12,450 USDC",
      subtitle: "Pool B (Development)",
      tooltip: "Funds dedicated to farm expansion, new equipment, and R&D.",
      link: "/treasury/b"
    },
    {
      title: "VeggieBox Sales",
      value: "16,842 / 20,000",
      subtitle: "Current Season Progress",
      progress: 84.2,
      tooltip: "Total VeggieBox tokens sold this season out of the 20,000 limit.",
    },
    {
      title: "HarvestShare NFT Sales",
      value: "42 / 50",
      subtitle: "NFT Minting Progress",
      progress: 84,
      tooltip: "Total HarvestShare NFTs minted out of the 50 available.",
    },
    {
      title: "Total Dividends Distributed",
      value: "$8,240 USDC",
      subtitle: "Cumulative Yield",
      tooltip: "Total amount of dividends distributed to all NFT holders since inception.",
    },
    {
      title: "Last 24H Distribution",
      value: "$142.50 USDC",
      subtitle: "24H Active Yield",
      tooltip: "Total dividend payout distributed in the last 24 hours.",
    }
  ];

  return (
    <section id="live-data" className="relative py-32 bg-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-green-mid/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Dashboard */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h2 className="text-4xl font-bold text-white tracking-tight">Data Transparency & Trust</h2>
              <p className="text-gray-400">Real-time insight into GreenField&apos;s economic health.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dashboardData.map((data, idx) => (
                <DataCard key={idx} {...data} />
              ))}
            </div>
          </div>

          {/* Right: Yield Stream */}
          <motion.div
            className="lg:col-span-5 h-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <YieldStream />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveDataTrust;
