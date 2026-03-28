"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import Header from "@/components/Header";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";

// --- Types & Constants ---

type ProposalStatus = "Voting" | "Passed" | "Executed" | "Rejected";

interface SupportingFile {
  name: string;
  type: string;
  cid: string;
}

interface Proposal {
  id: string;
  numericId: number;
  title: string;
  description: string;
  status: ProposalStatus;
  amount: number;
  endTime: number;
  createdAt: number;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  supportingFiles: SupportingFile[];
  myVote?: "For" | "Against";
}

const FARMER_ADDRESS = "0x74f2e9d1a8c3b5e4f60d21a9c8b7f5e4d3c2b1a0e9"; // Mock Farmer
const POOL_B_BALANCE = 5000.00;

// --- Mock Data ---

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "P001",
    numericId: 1,
    title: "Purchase Spring Organic Seeds & Fertilizer",
    description: "## Background\nAs we enter the spring planting season, we need to secure high-quality organic seeds and specialized fertilizer to ensure the yield quality.\n\n## Budget Allocation\n- **Organic Seeds**: 600 USDC\n- **Natural Fertilizer**: 400 USDC\n\n## Expected Benefits\nImproved crop resilience and 15% higher market value for produce.",
    status: "Executed",
    amount: 1000,
    endTime: Date.now() - 86400000 * 5,
    createdAt: Date.now() - 86400000 * 10,
    proposer: FARMER_ADDRESS,
    votesFor: 35,
    votesAgainst: 2,
    supportingFiles: [
      { name: "Supplier_Quote.pdf", type: "pdf", cid: "Qm..." },
      { name: "Soil_Analysis.png", type: "image", cid: "Qm..." }
    ],
    myVote: "For"
  },
  {
    id: "P002",
    numericId: 2,
    title: "Solar-Powered Automated Irrigation Upgrade",
    description: "## Overview\nTo reduce labor costs and electricity usage, we propose installing a smart solar-powered irrigation system.\n\n## Costs\n- **Solar Panels**: 800 USDC\n- **Sensors & Pumps**: 1200 USDC\n\n## Impact\n24/7 precise watering based on soil moisture levels.",
    status: "Voting",
    amount: 2000,
    endTime: Date.now() + 86400000 * 3,
    createdAt: Date.now() - 86400000 * 2,
    proposer: FARMER_ADDRESS,
    votesFor: 12,
    votesAgainst: 3,
    supportingFiles: [
      { name: "Project_Blueprints.pdf", type: "pdf", cid: "Qm..." }
    ]
  },
  {
    id: "P003",
    numericId: 3,
    title: "Community Greenhouse Expansion (Phase 1)",
    description: "Expansion of our existing greenhouse capacity by 30% to accommodate rare heirloom varieties.",
    status: "Passed",
    amount: 1500,
    endTime: Date.now() - 3600000,
    createdAt: Date.now() - 86400000 * 4,
    proposer: FARMER_ADDRESS,
    votesFor: 28,
    votesAgainst: 5,
    supportingFiles: []
  }
];

// --- Sub-components ---

const StatusBadge = ({ status }: { status: ProposalStatus }) => {
  const styles = {
    Voting: "bg-accent-green-mid/10 text-accent-green-mid border-accent-green-mid/30",
    Passed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    Executed: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    Rejected: "bg-gray-500/10 text-gray-400 border-gray-500/30"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status]}`}>
      {status}
    </span>
  );
};

const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function GovernancePage() {
  const { address, isConnected } = useAccount();
  const [soldNftIds] = useLocalStorage<number[]>("greenfield_sold_nfts", []);
  
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [view, setView] = useState<"list" | "details">("list");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmVoteModal, setConfirmVoteModal] = useState<{ type: "For" | "Against" } | null>(null);

  const holdsNft = isConnected && (soldNftIds.length > 0 || true); // Mock for demo
  const isFarmer = isConnected && address?.toLowerCase() === FARMER_ADDRESS.toLowerCase();
  const myVoteWeight = 2; // Mock weight

  const handleOpenDetails = (p: Proposal) => {
    setSelectedProposal(p);
    setView("details");
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedProposal(null);
  };

  const getRemainingTime = (endTime: number) => {
    const diff = endTime - Date.now();
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    return `${days}d ${hours}h remaining`;
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <Header />

      <div className="pt-32 max-w-7xl mx-auto px-6">
        <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-5xl font-bold text-white tracking-tight">DAO Governance</h1>
              <div className="px-4 py-1.5 rounded-2xl bg-accent-green-mid/10 border border-accent-green-mid/30 text-accent-green-mid text-xs font-black uppercase">
                Pool B: {POOL_B_BALANCE.toLocaleString()} USDC
              </div>
            </div>
            <p className="text-gray-400 text-xl">
              HarvestShare NFT holders collectively decide every expenditure from the Growth Treasury (Pool B).
            </p>
          </div>
          
          {isFarmer && view === "list" && (
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-tech-gradient text-[#1c1c1c] font-black rounded-2xl hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all"
            >
              + Create Proposal
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {view === "list" ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {proposals.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => handleOpenDetails(p)}
                  className="bg-gray-dark/40 backdrop-blur-md border border-gray-light/40 rounded-3xl p-8 cursor-pointer hover:border-accent-green-mid/40 transition-all group relative"
                >
                  <div className="flex justify-between items-start mb-6">
                    <StatusBadge status={p.status} />
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">#{p.id}</div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent-green-mid transition-colors">{p.title}</h3>
                  
                  <div className="mb-8">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Request Amount</div>
                    <div className="text-2xl font-black text-white">{p.amount.toLocaleString()} <span className="text-sm font-normal text-gray-500">USDC</span></div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                      <span className="text-accent-green-mid">For: {p.votesFor}</span>
                      <span className="text-red-400">Against: {p.votesAgainst}</span>
                    </div>
                    <div className="h-1.5 bg-gray-dark rounded-full overflow-hidden flex border border-white/5">
                      <div className="h-full bg-accent-green-mid" style={{ width: `${(p.votesFor / (p.votesFor + p.votesAgainst || 1)) * 100}%` }} />
                      <div className="h-full bg-red-400" style={{ width: `${(p.votesAgainst / (p.votesFor + p.votesAgainst || 1)) * 100}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase">
                    <div>Ends: {new Date(p.endTime).toLocaleDateString()}</div>
                    <div className="text-accent-green-mid">{getRemainingTime(p.endTime)}</div>
                  </div>

                  {p.myVote && (
                    <div className="absolute bottom-4 right-8 text-[9px] text-accent-green-mid font-black uppercase tracking-widest">
                      You Voted: {p.myVote}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto"
            >
              <button 
                onClick={handleBackToList}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold text-sm mb-10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Proposals
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Detail Content */}
                <div className="lg:col-span-8 space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <StatusBadge status={selectedProposal!.status} />
                      <span className="text-gray-500 font-black uppercase tracking-widest text-sm">Proposal #{selectedProposal!.id}</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white">{selectedProposal!.title}</h2>
                    
                    <div className="flex flex-wrap gap-8 py-6 border-y border-gray-light/20">
                      <div>
                        <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Proposer</div>
                        <div className="text-white font-mono text-sm flex items-center gap-2">
                          {formatAddress(selectedProposal!.proposer)}
                          <a href="#" className="text-gray-600 hover:text-white"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg></a>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Created At</div>
                        <div className="text-white font-bold text-sm">{new Date(selectedProposal!.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Voting Ends</div>
                        <div className="text-white font-bold text-sm">{new Date(selectedProposal!.endTime).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-dark/30 border border-gray-light/30 rounded-3xl p-10 prose prose-invert max-w-none">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedProposal!.description}
                    </div>
                  </div>

                  {selectedProposal!.supportingFiles.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-white font-bold text-xl">Supporting Documents</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedProposal!.supportingFiles.map((file, idx) => (
                          <div key={idx} className="bg-gray-dark/40 border border-gray-light/30 rounded-2xl p-4 flex items-center justify-between group hover:border-accent-green-mid/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-gray-light flex items-center justify-center text-gray-400">
                                {file.type === 'image' ? (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                                ) : (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
                                )}
                              </div>
                              <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{file.name}</div>
                            </div>
                            <a href="#" className="text-gray-500 hover:text-accent-green-mid">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v4M7 10l5 5 5-5M12 15V3"/></svg>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Voting Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-gray-dark/40 border border-gray-light/50 rounded-3xl p-8 sticky top-32">
                    <div className="mb-10">
                      <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Request Amount</div>
                      <div className="text-4xl font-black text-white">{selectedProposal!.amount.toLocaleString()} <span className="text-xl font-normal text-gray-500">USDC</span></div>
                    </div>

                    {/* Results Progress */}
                    <div className="space-y-6 mb-10">
                      <div className="flex justify-between items-end">
                        <div className="text-white font-bold">Voting Results</div>
                        <div className="text-accent-green-mid font-black text-xl">{Math.round((selectedProposal!.votesFor / (selectedProposal!.votesFor + selectedProposal!.votesAgainst || 1)) * 100)}% For</div>
                      </div>
                      <div className="h-3 bg-gray-dark rounded-full overflow-hidden flex border border-white/5">
                        <div className="h-full bg-accent-green-mid" style={{ width: `${(selectedProposal!.votesFor / (selectedProposal!.votesFor + selectedProposal!.votesAgainst || 1)) * 100}%` }} />
                        <div className="h-full bg-red-400" style={{ width: `${(selectedProposal!.votesAgainst / (selectedProposal!.votesFor + selectedProposal!.votesAgainst || 1)) * 100}%` }} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-black/20 rounded-2xl border border-gray-light/10">
                          <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">For</div>
                          <div className="text-xl font-black text-white">{selectedProposal!.votesFor}</div>
                        </div>
                        <div className="p-4 bg-black/20 rounded-2xl border border-gray-light/10">
                          <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Against</div>
                          <div className="text-xl font-black text-white">{selectedProposal!.votesAgainst}</div>
                        </div>
                      </div>
                    </div>

                    {/* Voting Panel */}
                    {selectedProposal!.status === "Voting" && (
                      <div className="space-y-6 pt-8 border-t border-gray-light/20">
                        {selectedProposal!.myVote ? (
                          <div className="p-6 bg-accent-green-mid/5 border border-accent-green-mid/30 rounded-2xl">
                            <div className="flex items-center gap-3 text-accent-green-mid font-bold mb-1">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                              You Voted {selectedProposal!.myVote}
                            </div>
                            <div className="text-[10px] text-gray-500">Timestamp: {new Date().toLocaleString()}</div>
                          </div>
                        ) : holdsNft ? (
                          <div className="space-y-4">
                            <h4 className="text-white font-bold">Cast Your Vote</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <button 
                                onClick={() => setConfirmVoteModal({ type: "For" })}
                                className="py-4 bg-accent-green-mid/10 border border-accent-green-mid/30 rounded-2xl text-accent-green-mid font-black hover:bg-accent-green-mid/20 transition-all"
                              >
                                For
                              </button>
                              <button 
                                onClick={() => setConfirmVoteModal({ type: "Against" })}
                                className="py-4 bg-red-400/10 border border-red-400/30 rounded-2xl text-red-400 font-black hover:bg-red-400/20 transition-all"
                              >
                                Against
                              </button>
                            </div>
                            <div className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                              Your Vote Weight: {myVoteWeight} Votes
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 bg-gray-dark/60 border border-gray-light/30 rounded-2xl text-center">
                            <div className="text-gray-400 text-xs mb-4">Hold HarvestShare NFT to participate in voting.</div>
                            <Link href="/buy#nft" className="text-accent-green-mid font-black text-xs uppercase hover:underline">Buy NFT Now</Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Modals --- */}

      {/* Create Proposal Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-gray-dark border border-gray-light/40 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-bold text-white">Create New Proposal</h2>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>

                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-xs font-black uppercase tracking-widest ml-1">Proposal Title</label>
                    <input 
                      className="w-full bg-black/40 border border-gray-light/30 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent-green-mid/50 transition-colors" 
                      placeholder="e.g. Expand Greenhouse Area"
                      maxLength={50}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-400 text-xs font-black uppercase tracking-widest ml-1">Request Amount (USDC)</label>
                    <div className="relative">
                      <input 
                        type="number"
                        className="w-full bg-black/40 border border-gray-light/30 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent-green-mid/50 transition-colors" 
                        placeholder="0.00"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">USDC</div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase ml-1">
                      <span className="text-gray-500">Available in Pool B: {POOL_B_BALANCE.toLocaleString()} USDC</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-400 text-xs font-black uppercase tracking-widest ml-1">Description (Markdown Supported)</label>
                    <textarea 
                      rows={6}
                      className="w-full bg-black/40 border border-gray-light/30 rounded-2xl px-6 py-4 text-white outline-none focus:border-accent-green-mid/50 transition-colors resize-none" 
                      placeholder="Describe the background, budget, and benefits..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-gray-400 text-xs font-black uppercase tracking-widest ml-1">Supporting Files</label>
                    <div className="border-2 border-dashed border-gray-light/20 rounded-3xl p-10 text-center hover:border-accent-green-mid/30 transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-gray-light/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:text-accent-green-mid transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                      </div>
                      <div className="text-white font-bold">Click or drag to upload</div>
                      <div className="text-gray-500 text-xs mt-1">PDF, Image, Invoice (Max 10MB)</div>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 py-4 bg-gray-light/10 border border-gray-light/30 rounded-2xl text-white font-bold hover:bg-gray-light/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 bg-tech-gradient text-[#1c1c1c] font-black rounded-2xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all"
                    >
                      Initiate Proposal
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vote Confirmation Modal */}
      <AnimatePresence>
        {confirmVoteModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmVoteModal(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-gray-dark border border-gray-light/40 w-full max-w-md rounded-[40px] p-10 shadow-2xl text-center"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ${confirmVoteModal.type === 'For' ? 'bg-accent-green-mid/10 text-accent-green-mid' : 'bg-red-400/10 text-red-400'}`}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  {confirmVoteModal.type === 'For' ? <path d="M20 6L9 17l-5-5"/> : <path d="M18 6L6 18M6 6l12 12"/>}
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Confirm Your Vote</h3>
              <p className="text-gray-400 mb-8">
                You are about to cast <span className="text-white font-black">{myVoteWeight} Votes</span> in favor of <span className={`font-black ${confirmVoteModal.type === 'For' ? 'text-accent-green-mid' : 'text-red-400'}`}>{confirmVoteModal.type.toUpperCase()}</span> for Proposal #{selectedProposal?.id}.
              </p>
              
              <div className="p-4 bg-black/30 rounded-2xl border border-gray-light/20 mb-10 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-bold uppercase tracking-widest">Est. Gas Fee</span>
                <span className="text-gray-300">~0.0012 MATIC</span>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmVoteModal(null)}
                  className="flex-1 py-4 bg-gray-light/10 border border-gray-light/30 rounded-2xl text-white font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Logic to update state mockingly
                    setProposals(prev => prev.map(p => p.id === selectedProposal?.id ? {...p, myVote: confirmVoteModal.type, votesFor: confirmVoteModal.type === 'For' ? p.votesFor + myVoteWeight : p.votesFor, votesAgainst: confirmVoteModal.type === 'Against' ? p.votesAgainst + myVoteWeight : p.votesAgainst} : p));
                    setSelectedProposal(prev => prev ? {...prev, myVote: confirmVoteModal.type, votesFor: confirmVoteModal.type === 'For' ? prev.votesFor + myVoteWeight : prev.votesFor, votesAgainst: confirmVoteModal.type === 'Against' ? prev.votesAgainst + myVoteWeight : prev.votesAgainst} : null);
                    setConfirmVoteModal(null);
                  }}
                  className="flex-1 py-4 bg-tech-gradient text-[#1c1c1c] font-black rounded-2xl"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
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
