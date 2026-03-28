"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/navigation';

const CallToAction = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  const [showContract, setShowContract] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Mock NFT holding status (In real app, use useReadContract)
  const hasNFT = false;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAction = (target: string, requiresNFT: boolean = false) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (requiresNFT && !hasNFT) {
      // Logic for NFT requirement could be a toast or tooltip
      return;
    }

    router.push(target);
  };

  const socialIcons = [
    {
      name: 'X', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      ), url: null
    },
    {
      name: 'Telegram', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
        </svg>
      ), url: null
    },
    {
      name: 'Github', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ), url: 'https://github.com/Zoella-w/web3-farm'
    }
  ];

  const contracts = [
    { name: "VeggieBox (ERC-20)", address: "0x861a014629bD7FADFAE540Fc4B8946EB9F81f695" },
    { name: "HarvestShare (ERC-721)", address: "0xbbc44C6B42819E31422Ad6bc09fd175014500c01" },
    { name: "CSA Farm Core Logic", address: "0x0000000000000000000000000000000000000000" }
  ];

  return (
    <section className="relative pt-32 pb-12 bg-background border-t border-gray-dark overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-green-mid/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-6xl font-bold text-white tracking-tight mb-8">
            Join the <span className="text-transparent bg-clip-text bg-tech-gradient">GreenField</span> Revolution Today
          </h2>
          <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
            Experience the future of agriculture where every seed sown is a share owned.
          </p>
        </motion.div>

        {/* Buttons Group */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-[56px]">
          {/* Primary CTA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAction('/buy')}
            className="w-full md:w-auto px-10 py-4 rounded-full bg-tech-gradient text-[#1c1c1c] font-bold text-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300"
          >
            Buy Veggie Tokens
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAction('/buy#nft')}
            className="w-full md:w-auto px-10 py-4 rounded-full bg-gray-dark border border-accent-green-mid/50 text-white font-bold text-xl hover:bg-gray-light transition-all duration-300"
          >
            Become a Shareholder
          </motion.button>

          {/* Outline CTA */}
          <div className="relative group w-full md:w-auto">
            <motion.button
              whileHover={(!isConnected || hasNFT) ? { scale: 1.05 } : {}}
              whileTap={(!isConnected || hasNFT) ? { scale: 0.95 } : {}}
              onClick={() => handleAction('/governance', true)}
              disabled={isConnected && !hasNFT}
              className={`w-full md:w-auto px-10 py-4 rounded-full border font-bold text-xl transition-all duration-300
                ${isConnected && !hasNFT
                  ? 'border-gray-light text-gray-600 cursor-not-allowed'
                  : 'border-gray-light text-gray-300 hover:border-gray-400 hover:text-white'}`}
            >
              Explore Governance
            </motion.button>
            {isConnected && !hasNFT && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-light text-xs text-gray-300 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-light/50">
                Requires HarvestShare NFT
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-20 border-t border-gray-light/20 flex flex-col items-center">
          {/* Contract Address Toggle */}
          <div className="relative mb-[180px] flex flex-col items-center">
            <button
              onClick={() => setShowContract(!showContract)}
              className="text-lg text-gray-500 hover:text-accent-green-mid flex items-center gap-2 transition-colors"
            >
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`transition-transform duration-300 ${showContract ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
              Smart Contract Addresses
            </button>
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-max">
              <AnimatePresence>
                {showContract && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -10 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -10 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2 text-sm font-mono text-gray-400 bg-gray-dark/50 p-4 rounded-xl border border-gray-light/30 backdrop-blur-sm min-w-[400px]">
                      {contracts.map((contract) => (
                        <div key={contract.name} className="flex justify-between items-center gap-8 group/item">
                          <span>{contract.name}:</span>
                          <div
                            className="flex items-center gap-2 cursor-pointer hover:text-accent-green-mid transition-colors relative"
                            onClick={() => handleCopy(contract.address)}
                          >
                            <span className="text-accent-green-mid">
                              {contract.address.slice(0, 6)}...{contract.address.slice(-4)}
                            </span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover/item:opacity-100">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <AnimatePresence>
                              {copiedText === contract.address && (
                                <motion.span
                                  initial={{ opacity: 0, y: 10, x: '-50%' }}
                                  animate={{ opacity: 1, y: -25, x: '-50%' }}
                                  exit={{ opacity: 0, y: -30, x: '-50%' }}
                                  className="absolute left-1/2 text-xs bg-accent-green-mid text-background px-2 py-1 rounded-md font-bold whitespace-nowrap"
                                >
                                  Copied!
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Socials & Copyright */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              {socialIcons.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url || undefined}
                  target={social.url ? "_blank" : undefined}
                  rel={social.url ? "noopener noreferrer" : undefined}
                  className={`text-gray-500 hover:text-accent-green-mid transition-colors ${!social.url ? 'cursor-default' : ''}`}
                  title={social.name}
                  onClick={(e) => !social.url && e.preventDefault()}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-500">
              <span className="cursor-default hover:text-gray-300 transition-colors flex items-center gap-1.5">
                Audit Report
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-light bg-gray-dark/50 text-gray-400">Audit Pending</span>
              </span>
              <span className="cursor-default hover:text-gray-300 transition-colors">Privacy Policy</span>
              <span>© 2026 GreenField. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
