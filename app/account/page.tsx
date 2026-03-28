"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useReadContract, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import Link from "next/link";
import Header from "@/components/Header";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Constants (mocking some for the UI)
const VBX_PRICE_USDC = 1;
const REDEMPTION_RATE = 0.9; // 90%
const SEASON_ACTIVE = true; // Toggle for demo

// Mock Types
interface ActivityRecord {
  id: string;
  type: "Buy" | "Redeem" | "Vote" | "Claim";
  description: string;
  timestamp: number;
  status: "Success" | "Pending" | "Failed";
  hash: string;
}

interface VoteRecord {
  id: string;
  proposalId: string;
  title: string;
  vote: "For" | "Against";
  timestamp: number;
  status: "Passed" | "Executed" | "Defeated";
}

const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function AccountPage() {
  const { address, isConnected } = useAccount();
  const [soldNftIds] = useLocalStorage<number[]>("greenfield_sold_nfts", []);

  // State for tabs
  const [activeTab, setActiveTab] = useState<"votes" | "transactions">("transactions");

  // Action inputs
  const [vbxRedeemAmount, setVbxRedeemAmount] = useState("");
  const [vbxTokenRedeemAmount, setVbxTokenRedeemAmount] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Mock Data
  const [vbxBalance] = useState(150.5);
  const myNftIds = soldNftIds.length > 0 ? [soldNftIds[0], soldNftIds[1] || 42] : [7, 24]; // Mock if empty
  const [totalDividends] = useState(42.85);
  const [claimableDividends] = useState(8.24);
  const [usdcBalance] = useState(2540.20);
  const [maticBalance] = useState(12.5);

  const [activities] = useState<ActivityRecord[]>([
    { id: "1", type: "Buy", description: "Bought 100 VBX", timestamp: Date.now() - 1000 * 60 * 60 * 2, status: "Success", hash: "0x123...abc" },
    { id: "2", type: "Redeem", description: "Redeemed 10 Boxes", timestamp: Date.now() - 1000 * 60 * 60 * 24, status: "Success", hash: "0x456...def" },
    { id: "3", type: "Claim", description: "Claimed 15.2 USDC", timestamp: Date.now() - 1000 * 60 * 60 * 48, status: "Success", hash: "0x789...ghi" },
  ]);

  const [votes] = useState<VoteRecord[]>([
    { id: "v1", proposalId: "001", title: "Expand Farm Area B", vote: "For", timestamp: Date.now() - 1000 * 60 * 60 * 72, status: "Executed" },
    { id: "v2", proposalId: "002", title: "New Irrigation System", vote: "For", timestamp: Date.now() - 1000 * 60 * 60 * 120, status: "Passed" },
  ]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setToast("Address copied to clipboard");
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="pt-40 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 bg-accent-green-mid/10 rounded-full flex items-center justify-center text-accent-green-mid mb-8">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 text-center max-w-md mb-8">
            Please connect your wallet to access your account, view your assets, and manage your investments.
          </p>
          <div className="text-gray-500 text-sm italic">Use the connect button in the header to get started.</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <Header />

      <div className="pt-32 max-w-7xl mx-auto px-6">
        <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold text-white tracking-tight">My Account</h1>
            <p className="text-gray-400 text-xl mt-4">Manage your assets and track your farm activities.</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-dark/40 border border-gray-light/30 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-full bg-tech-gradient flex items-center justify-center text-[#1c1c1c] font-black">
              {address?.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{formatAddress(address || "")}</span>
                <button onClick={() => copyToClipboard(address || "")} className="text-gray-500 hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                </button>
                <a href={`https://basescan.org/address/${address}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </div>
              <div className="text-[10px] text-accent-green-mid font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green-mid" />
                Base Network Connected
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content - Left */}
          <div className="lg:col-span-7 space-y-10">
            {/* Module 1: Asset Overview */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Asset Overview</h2>
              <div className="space-y-4">
                {/* VBX Card */}
                <div className="bg-gray-dark/40 border border-gray-light/40 rounded-3xl p-6 flex items-center justify-between group hover:border-accent-green-mid/30 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gray-light flex items-center justify-center text-accent-green-mid font-black text-xl">
                      VBX
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">VeggieBox (VBX)</div>
                      <div className="text-gray-400 text-xs mt-0.5 font-medium">
                        {SEASON_ACTIVE ? "Redeemable for fresh produce" : `Refundable at ${REDEMPTION_RATE * 100}% rate`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white">{vbxBalance.toFixed(2)} VBX</div>
                    <div className="text-gray-500 text-sm font-medium">≈ {(vbxBalance * VBX_PRICE_USDC).toFixed(2)} USDC</div>
                  </div>
                </div>

                {/* NFT Card */}
                <div className="bg-gray-dark/40 border border-gray-light/40 rounded-3xl p-6 space-y-6 group hover:border-accent-green-mid/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-accent-green-mid/10 border border-accent-green-mid/20 flex items-center justify-center text-accent-green-mid">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">HarvestShare NFT</div>
                        <div className="text-gray-400 text-xs mt-0.5 font-medium">{myNftIds.length} Shareholder Badges</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Total Earned</div>
                      <div className="text-xl font-black text-accent-green-mid">{totalDividends.toFixed(2)} USDC</div>
                    </div>
                  </div>

                  {/* NFT Horizontal List */}
                  <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {myNftIds.map((id) => (
                      <Link key={id} href={`/buy#nft`} className="flex-none">
                        <div className="w-16 h-16 rounded-xl bg-gray-dark border border-gray-light/30 flex items-center justify-center relative group/nft transition-all hover:border-accent-green-mid/50 hover:scale-105">
                          <span className="text-xs font-bold text-gray-500 group-hover/nft:text-accent-green-mid transition-colors">#{String(id).padStart(3, '0')}</span>
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-green-mid" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Liquidity Card */}
                <div className="bg-gray-dark/40 border border-gray-light/40 rounded-3xl p-6 grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">USDC Balance</div>
                    <div className="text-xl font-black text-white">{usdcBalance.toLocaleString()} <span className="text-xs font-normal text-gray-500">USDC</span></div>
                  </div>
                  <div className="space-y-1 border-l border-gray-light/20 pl-6">
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">MATIC Balance</div>
                    <div className="text-xl font-black text-white">{maticBalance.toLocaleString()} <span className="text-xs font-normal text-gray-500">MATIC</span></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Module 2: My Actions */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white">My Operations</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Action A: Redeem VeggieBox */}
                {vbxBalance > 0 && SEASON_ACTIVE && (
                  <div className="bg-gray-dark/60 border border-accent-green-mid/40 rounded-3xl p-8 space-y-6">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-2">Redeem VeggieBox</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">Redeem your VBX for fresh vegetables. This also triggers yield for shareholders.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="number"
                          value={vbxRedeemAmount}
                          onChange={(e) => setVbxRedeemAmount(e.target.value)}
                          placeholder="0.0"
                          className="w-full bg-black/40 border border-gray-light/30 rounded-2xl px-5 py-4 text-white text-xl outline-none focus:border-accent-green-mid/50 transition-colors"
                        />
                        <button
                          onClick={() => setVbxRedeemAmount(String(vbxBalance))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-green-mid font-bold text-sm hover:text-accent-green-end transition-colors"
                        >
                          MAX
                        </button>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-4">You will receive {vbxRedeemAmount || "0"} Veggie Boxes</div>
                        <button className="w-full py-4 bg-tech-gradient text-[#1c1c1c] font-black rounded-2xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all">
                          Confirm Redemption
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action B: Redeem Tokens (Refund) */}
                {!SEASON_ACTIVE && vbxBalance > 0 && (
                  <div className="bg-gray-dark/60 border border-accent-green-mid/30 rounded-3xl p-8 space-y-6">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-2">Redeem Token</h3>
                      <div className="inline-block px-3 py-1 rounded-full bg-accent-green-mid/10 text-accent-green-mid text-[10px] font-bold uppercase mb-3">Season Ended</div>
                      <p className="text-gray-400 text-xs leading-relaxed">The season has ended. You can now redeem your remaining VBX for USDC at {REDEMPTION_RATE * 100}% rate.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="number"
                          value={vbxTokenRedeemAmount}
                          onChange={(e) => setVbxTokenRedeemAmount(e.target.value)}
                          placeholder="0.0"
                          className="w-full bg-black/40 border border-gray-light/30 rounded-2xl px-5 py-4 text-white text-xl outline-none focus:border-accent-green-mid/50 transition-colors"
                        />
                        <button
                          onClick={() => setVbxTokenRedeemAmount(String(vbxBalance))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-green-mid font-bold text-sm hover:text-accent-green-end transition-colors"
                        >
                          MAX
                        </button>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-4">You will receive {(Number(vbxTokenRedeemAmount || 0) * REDEMPTION_RATE).toFixed(2)} USDC</div>
                        <button className="w-full py-4 bg-tech-gradient text-[#1c1c1c] font-black rounded-2xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all">
                          Claim Refund
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action C: Claim Dividends */}
                {myNftIds.length > 0 && (
                  <div className="bg-gray-dark/60 border border-accent-green-mid/40 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-2">Claim Dividends</h3>
                      <p className="text-gray-400 text-xs leading-relaxed mb-6">Withdraw your accumulated earnings from HarvestShare NFT distributions.</p>

                      <div className="mb-8">
                        <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Claimable Balance</div>
                        <div className="text-4xl font-black text-accent-green-mid">{claimableDividends.toFixed(2)} <span className="text-xl font-normal text-accent-green-mid/60">USDC</span></div>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-tech-gradient text-[#1c1c1c] font-black rounded-2xl hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all">
                      One-Click Claim
                    </button>
                  </div>
                )}

                {/* No Assets Guide */}
                {vbxBalance === 0 && myNftIds.length === 0 && (
                  <div className="md:col-span-2 bg-gray-dark/60 border border-gray-light/40 rounded-3xl p-12 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">You haven&apos;t started your farm journey yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-10">Purchase VeggieBox to redeem fresh produce or HarvestShare NFTs to share in the farm&apos;s success.</p>
                    <Link href="/buy" className="px-10 py-4 bg-tech-gradient text-[#1c1c1c] font-black text-lg rounded-full hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all inline-block">
                      Go to Marketplace
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Activity Records - Right */}
          <div className="lg:col-span-5">
            <div className="bg-gray-dark/40 border border-gray-light/50 rounded-3xl overflow-hidden flex flex-col h-[600px]">
              <div className="flex border-b border-gray-light/20 p-2 gap-2 bg-black/20">
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === "transactions" ? "bg-gray-light text-white shadow-lg" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                >
                  Activity History
                </button>
                <button
                  onClick={() => setActiveTab("votes")}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === "votes" ? "bg-gray-light text-white shadow-lg" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                >
                  Governance Votes
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {activeTab === "transactions" ? (
                    <motion.div
                      key="tx"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {activities.map((act) => (
                        <div key={act.id} className="bg-gray-dark/50 border border-gray-light/20 p-5 rounded-2xl flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${act.type === "Buy" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
                              act.type === "Redeem" ? "bg-orange-500/10 border-orange-500/30 text-orange-400" :
                                act.type === "Vote" ? "bg-purple-500/10 border-purple-500/30 text-purple-400" :
                                  "bg-accent-green-mid/10 border-accent-green-mid/30 text-accent-green-mid"
                              }`}>
                              {act.type === "Buy" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" /><path d="M3 6h18M16 10a4 4 0 01-8 0" /></svg>}
                              {act.type === "Redeem" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8l-2-1-2 1m2-1v2m-2-2v2M3 8l2-1 2 1m-2-1v2m2-2v2M2 11l7-9 7 9-7 9-7-9z" /></svg>}
                              {act.type === "Claim" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>}
                            </div>
                            <div>
                              <div className="text-white font-bold text-sm">{act.description}</div>
                              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-0.5">{new Date(act.timestamp).toLocaleString()}</div>
                            </div>
                          </div>
                          <a href={`https://basescan.org/tx/${act.hash}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="vote"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {votes.map((vote) => (
                        <div key={vote.id} className="bg-gray-dark/50 border border-gray-light/20 p-5 rounded-2xl space-y-4 group">
                          <div className="flex items-center justify-between">
                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Proposal #{vote.proposalId}</div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${vote.status === 'Executed' ? 'border-accent-green-mid/40 text-accent-green-mid bg-accent-green-mid/5' :
                              vote.status === 'Passed' ? 'border-blue-500/40 text-blue-400 bg-blue-500/5' :
                                'border-red-500/40 text-red-400 bg-red-500/5'
                              }`}>
                              {vote.status}
                            </span>
                          </div>
                          <div className="text-white font-bold">{vote.title}</div>
                          <div className="flex items-center justify-between">
                            <div className={`text-xs font-black uppercase flex items-center gap-1.5 ${vote.vote === 'For' ? 'text-accent-green-mid' : 'text-red-400'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${vote.vote === 'For' ? 'bg-accent-green-mid' : 'bg-red-400'}`} />
                              Voted {vote.vote}
                            </div>
                            <div className="text-[10px] text-gray-500 font-bold">{new Date(vote.timestamp).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-light text-white px-6 py-4 rounded-2xl border border-gray-light/60 shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

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
