"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock types
interface DividendEvent {
  id: string;
  time: number;
  user: string;
  boxes: number;
  totalDividend: number;
  perNftDividend: number;
  hash: string;
}

interface PersonalDividend {
  id: string;
  time: number;
  hash: string;
  amount: number;
  status: 'Received' | 'Claimable';
}

const NFT_TOTAL_SUPPLY = 50;
const VBX_TOTAL_SUPPLY = 20000;

const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function PoolsYieldPage() {
  const { address, isConnected } = useAccount();
  const [soldNftIds] = useLocalStorage<number[]>("greenfield_sold_nfts", []);

  // Static Mock Data
  const poolA_Balance = 12540.50;
  const poolB_Balance = 5000.00;
  const vbx_Sold = 8450;
  const nft_Sold = soldNftIds.length || 12; // Use local storage or mock
  const pendingProposals = 2;

  const [dividendStream] = useState<DividendEvent[]>([
    { id: '1', time: Date.now() - 1000 * 60 * 5, user: '0x74f2...a0e9', boxes: 5, totalDividend: 0.20, perNftDividend: 0.004, hash: '0x123...abc' },
    { id: '2', time: Date.now() - 1000 * 60 * 15, user: '0x8c7b...e9d8', boxes: 12, totalDividend: 0.48, perNftDividend: 0.0096, hash: '0x456...def' },
    { id: '3', time: Date.now() - 1000 * 60 * 45, user: '0x1a2b...f1a2', boxes: 2, totalDividend: 0.08, perNftDividend: 0.0016, hash: '0x789...ghi' },
    { id: '4', time: Date.now() - 1000 * 60 * 120, user: '0x3d4e...b5c6', boxes: 20, totalDividend: 0.80, perNftDividend: 0.016, hash: '0xabc...123' },
    { id: '5', time: Date.now() - 1000 * 60 * 180, user: '0x5f6g...d7e8', boxes: 8, totalDividend: 0.32, perNftDividend: 0.0064, hash: '0xdef...456' },
  ]);

  const [personalHistory] = useState<PersonalDividend[]>([
    { id: 'p1', time: Date.now() - 1000 * 60 * 5, hash: '0x123...abc', amount: 0.004, status: 'Claimable' },
    { id: 'p2', time: Date.now() - 1000 * 60 * 15, hash: '0x456...def', amount: 0.0096, status: 'Received' },
    { id: 'p3', time: Date.now() - 1000 * 60 * 45, hash: '0x789...ghi', amount: 0.0016, status: 'Received' },
  ]);

  // Check if user holds NFT (mock check for demo)
  const holdsNft = isConnected && (soldNftIds.length > 0 || true); // Always true for demo if connected

  const formatRelativeTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <Header />

      <div className="pt-32 max-w-7xl mx-auto px-6">
        <header className="mb-14">
          <h1 className="text-5xl font-bold text-white tracking-tight">Pools & Yield</h1>
          <p className="text-gray-400 text-xl mt-4 max-w-3xl">
            Transparency through on-chain data. View the state of our treasuries and real-time yield distribution.
          </p>
        </header>

        {/* Module 1: Treasury Details */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Pool A */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-dark/40 backdrop-blur-md border border-gray-light/50 p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 group-hover:text-accent-green-mid transition-all duration-500">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <h3 className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-2">Operational Treasury (Pool A)</h3>
            <div className="text-4xl font-black text-white mb-2">{poolA_Balance.toLocaleString()} <span className="text-xl font-normal text-gray-500">USDC</span></div>
            <div className="text-accent-green-mid text-sm font-medium mb-8">Source: VeggieBox Sales</div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">VBX Sales Progress</span>
                <span className="text-white font-bold">{Math.floor((vbx_Sold / VBX_TOTAL_SUPPLY) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-dark/60 rounded-full overflow-hidden border border-gray-light/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(vbx_Sold / VBX_TOTAL_SUPPLY) * 100}%` }}
                  className="h-full bg-tech-gradient"
                />
              </div>
              <div className="text-xs text-gray-500 text-right">{vbx_Sold.toLocaleString()} / {VBX_TOTAL_SUPPLY.toLocaleString()} VBX</div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              This pool covers the farm&apos;s operational costs for the current season, including seeds, fertilizer, labor, and maintenance. 80% of funds are paid to the farmer upon VeggieBox redemption.
            </p>
          </motion.div>

          {/* Pool B */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-dark/40 backdrop-blur-md border border-gray-light/50 p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 group-hover:text-accent-green-mid transition-all duration-500">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              </svg>
            </div>

            <h3 className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-2">Growth Treasury (Pool B)</h3>
            <div className="text-4xl font-black text-white mb-2">{poolB_Balance.toLocaleString()} <span className="text-xl font-normal text-gray-500">USDC</span></div>
            <div className="text-accent-green-mid text-sm font-medium mb-8">Source: HarvestShare NFT Sales</div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">NFT Minting Progress</span>
                <span className="text-white font-bold">{Math.floor((nft_Sold / NFT_TOTAL_SUPPLY) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-dark/60 rounded-full overflow-hidden border border-gray-light/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(nft_Sold / NFT_TOTAL_SUPPLY) * 100}%` }}
                  className="h-full bg-tech-gradient"
                />
              </div>
              <div className="text-xs text-gray-500 text-right">{nft_Sold} / {NFT_TOTAL_SUPPLY} NFTs</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-dark/50 rounded-2xl border border-gray-light/20 mb-4">
              <div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Pending Proposals</div>
                <div className="text-white font-black text-xl">{pendingProposals}</div>
              </div>
              <Link href="/#framework" className="px-4 py-2 bg-accent-green-mid/10 border border-accent-green-mid/30 rounded-xl text-accent-green-mid text-xs font-bold hover:bg-accent-green-mid/20 transition-colors">
                Go to Governance
              </Link>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              This pool is dedicated to strategic farm expansion and infrastructure. Every expenditure must be proposed and approved by HarvestShare NFT holders.
            </p>
          </motion.div>
        </section>

        {/* Module 2: Live Dividend Stream */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-3xl font-bold text-white tracking-tight">Live Dividend Stream</h2>
          </div>

          <div className="bg-gray-dark/40 backdrop-blur-md border border-gray-light/50 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-light/20">
                    <th className="px-8 py-6 text-gray-400 text-xs font-bold uppercase tracking-wider">Time</th>
                    <th className="px-8 py-6 text-gray-400 text-xs font-bold uppercase tracking-wider">User</th>
                    <th className="px-8 py-6 text-gray-400 text-xs font-bold uppercase tracking-wider">Redemption</th>
                    <th className="px-8 py-6 text-gray-400 text-xs font-bold uppercase tracking-wider">Total Dividend</th>
                    <th className="px-8 py-6 text-gray-400 text-xs font-bold uppercase tracking-wider text-accent-green-mid">Dividend per NFT</th>
                    <th className="px-8 py-6 text-gray-400 text-xs font-bold uppercase tracking-wider">TX</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-light/10">
                  {dividendStream.map((event) => (
                    <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="text-white font-medium" title={new Date(event.time).toLocaleString()}>
                          {formatRelativeTime(event.time)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-light/30 border border-gray-light/20" />
                          <div className="text-gray-300 font-mono text-sm">{event.user}</div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-white font-bold">{event.boxes} Boxes</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-white font-bold">{event.totalDividend.toFixed(2)} USDC</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-accent-green-mid font-black">+{event.perNftDividend.toFixed(4)} USDC</div>
                      </td>
                      <td className="px-8 py-6">
                        <a href={`https://basescan.org/tx/${event.hash}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {dividendStream.length === 0 && (
              <div className="px-8 py-20 text-center text-gray-500">
                Dividend records will appear here in real-time when users redeem VeggieBoxes.
              </div>
            )}
          </div>
        </section>

        {/* Module 3: My Yield Dashboard (Conditional) */}
        {isConnected ? (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">My Yield Dashboard</h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green-mid/10 border border-accent-green-mid/30 text-accent-green-mid text-xs font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green-mid" />
                Connected: {formatAddress(address || "")}
              </div>
            </div>

            {holdsNft ? (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-dark/40 border border-gray-light/50 p-6 rounded-3xl">
                    <div className="text-gray-400 text-xs font-bold uppercase mb-2">NFTs Held</div>
                    <div className="text-3xl font-black text-white">{soldNftIds.length || 1} <span className="text-sm font-normal text-gray-500">HarvestShares</span></div>
                  </div>
                  <div className="bg-gray-dark/40 border border-gray-light/50 p-6 rounded-3xl">
                    <div className="text-gray-400 text-xs font-bold uppercase mb-2">Total Earned</div>
                    <div className="text-3xl font-black text-white">42.85 <span className="text-sm font-normal text-gray-500">USDC</span></div>
                  </div>
                  <div className="bg-gray-dark/40 border border-accent-green-mid/40 p-6 rounded-3xl flex items-center justify-between">
                    <div>
                      <div className="text-gray-400 text-xs font-bold uppercase mb-2">Claimable Balance</div>
                      <div className="text-3xl font-black text-accent-green-mid">8.24 <span className="text-sm font-normal text-accent-green-mid/60">USDC</span></div>
                    </div>
                    <button className="px-6 py-3 bg-tech-gradient text-[#1c1c1c] font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all">
                      Claim
                    </button>
                  </div>
                </div>

                {/* Personal History */}
                <div className="bg-gray-dark/40 border border-gray-light/50 rounded-3xl p-8">
                  <h3 className="text-white font-bold text-xl mb-6">Personal Dividend History</h3>
                  <div className="space-y-4">
                    {personalHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-5 bg-gray-dark/30 border border-gray-light/20 rounded-2xl group">
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-xl bg-accent-green-mid/10 flex items-center justify-center text-accent-green-mid">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-white font-bold">+{item.amount.toFixed(4)} USDC</div>
                            <div className="text-gray-500 text-xs">{new Date(item.time).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={`text-[10px] px-2 py-1 rounded-full border font-bold ${item.status === 'Claimable' ? 'border-accent-green-mid/40 text-accent-green-mid bg-accent-green-mid/5' : 'border-gray-light/40 text-gray-500'
                            }`}>
                            {item.status}
                          </span>
                          <a href={`https://basescan.org/tx/${item.hash}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-dark/40 border border-gray-light/50 rounded-3xl p-12 text-center">
                <div className="w-20 h-20 bg-accent-green-mid/10 rounded-full flex items-center justify-center text-accent-green-mid mx-auto mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No HarvestShare NFTs Found</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-8">
                  You don&apos;t hold any HarvestShare NFTs yet. Buy an NFT to start receiving real-time dividends and participate in governance.
                </p>
                <Link href="/buy#nft" className="px-10 py-4 bg-tech-gradient text-[#1c1c1c] font-bold text-lg rounded-full hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all inline-block">
                  Buy NFT Now
                </Link>
              </div>
            )}
          </section>
        ) : (
          <div className="mb-16 bg-gray-dark/40 border border-gray-light/50 rounded-3xl p-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Connect Wallet to View Dashboard</h3>
            <p className="text-gray-400 mb-8">Connect your wallet to track your personal dividends and claimable balance.</p>
            <div className="flex justify-center">
              <div className="text-gray-500 text-sm italic">Please use the connect button in the header.</div>
            </div>
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 text-gray-500 hover:text-accent-green-mid transition-colors font-bold text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L21 10M1 14l2.64 4.36A9 9 0 0020.49 15" />
            </svg>
            Refresh Data
          </button>
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
    </main>
  );
}
