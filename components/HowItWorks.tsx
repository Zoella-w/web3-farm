"use client";

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const HowItWorks = () => {
  const [highlight, setHighlight] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Handle visual feedback after anchor jump
    const handleHashChange = () => {
      if (window.location.hash === '#how-it-works') {
        setHighlight(true);
        setTimeout(() => setHighlight(false), 3000);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const steps = [
    {
      step: "01",
      title: "Consumers & Investors",
      desc: "Buy VeggieBox tokens to redeem seasonal fresh vegetables. Or buy HarvestShare NFTs to become a farm shareholder and share the profits of every harvest.",
      content: (
        <div className="flex gap-4 justify-center">
          {/* VeggieBox Badge */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gray-dark border border-accent-green-mid flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent-green-mid">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 11.2 6 13.2 7.6 14.5C6 15.8 5 17.8 5 20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20C19 17.8 18 15.8 16.4 14.5C18 13.2 19 11.2 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-accent-green-mid font-mono uppercase text-center">VeggieBox<br />(ERC-20 Fungible Token)</span>
          </div>
          {/* HarvestShare Badge */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gray-dark border border-accent-green-end flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent-green-end">
                <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 9L13 14L10 11L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-accent-green-end font-mono uppercase text-center">HarvestShare<br />(ERC-721 NFT)</span>
          </div>
        </div>
      )
    },
    {
      step: "02",
      title: "Transparent Funds, Instant Returns",
      desc: "Every transaction and investment is traceable on-chain. Whenever a VeggieBox is redeemed, 20% of the funds are instantly distributed to all NFT holders, ensuring real-time profit sharing.",
      content: (
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-6">
            <div className="flex flex-col items-center"><div className="w-20 h-8 rounded-md bg-gray-light flex items-center justify-center text-xs text-white uppercase">FT Sales</div></div>
            <div className="flex flex-col items-center"><div className="w-20 h-8 rounded-md bg-gray-light flex items-center justify-center text-xs text-white uppercase">NFT Sales</div></div>
          </div>
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none" className="text-gray-600">
            <path d="M20 0V20M60 0V20M20 20H60M40 20V40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
          <div className="flex gap-8">
            <div className="px-3 py-1 border border-gray-light rounded bg-gray-dark text-xs uppercase tracking-wider">Operational Treasury</div>
            <div className="px-3 py-1 border border-gray-light rounded bg-gray-dark text-xs uppercase tracking-wider">Growth Treasury</div>
          </div>
          <div className="flex gap-14 w-full justify-center items-center mt-2">
            <div className="flex flex-col items-center gap-1 opacity-60">
              <div className="text-xs uppercase">Farmer</div>
              <div className="w-1 h-4 bg-gray-600"></div>
              <div className="text-[12px] font-bold">80%</div>
            </div>
            <div className="flex flex-col items-center gap-1 text-accent-green-mid">
              <div className="relative left-4 text-xs uppercase">NFT Holders</div>
              <div className="relative left-4 w-1 h-4 bg-accent-green-mid"></div>
              <div className="relative left-4 text-[12px] font-bold flex items-center gap-1">20% <span className="text-xs">⚡ REAL-TIME</span></div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: "03",
      title: "Community-Led Growth",
      desc: "Farmers can apply for funds from the Growth Treasury. Every major expenditure is voted on by all NFT holders. True decentralized autonomy.",
      content: (
        <div className="flex items-center justify-between w-full max-w-[250px] mx-auto">
          <div className="flex flex-col items-center gap-2 mr-2">
            <div className="w-14 h-14 rounded-lg bg-gray-dark border border-gray-light flex items-center justify-center">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-tighter">Proposal</span>
          </div>
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-accent-green-mid/30">
            <path d="M0 6H18M18 6L14 2M18 6L14 10" stroke="currentColor" strokeWidth="1" />
          </svg>
          <div className="flex flex-col items-center gap-2 mr-2">
            <div className="w-14 h-14 rounded-lg bg-gray-dark border border-gray-light flex items-center justify-center">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7675 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.6281 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85782 7.69279 2.71537 9.79631 2.24013C11.8998 1.7649 14.1003 1.98234 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-tighter">Voting</span>
          </div>
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-accent-green-mid/30">
            <path d="M0 6H18M18 6L14 2M18 6L14 10" stroke="currentColor" strokeWidth="1" />
          </svg>
          <div className="flex flex-col items-center gap-2 mr-2">
            <div className="w-14 h-14 rounded-lg bg-gray-dark border border-accent-green-mid flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.1)]">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent-green-mid">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M19.4 15L21.7 16.3C22.1 16.5 22.3 17 22.1 17.4L20.1 20.9C19.9 21.3 19.4 21.5 19 21.3L16.7 20M12 18V21M7.3 16.3L5 17.4C4.6 17.6 4.1 17.4 3.9 17L1.9 13.5C1.7 13.1 1.9 12.6 2.3 12.4L4.6 11.1M4.6 7.7L2.3 6.4C1.9 6.2 1.7 5.7 1.9 5.3L3.9 1.8C4.1 1.4 4.6 1.2 5 1.4L7.3 2.7M12 6V3M16.7 7.7L19 6.4C19.4 6.2 19.9 6.4 20.1 6.8L22.1 10.3C22.3 10.7 22.1 11.2 21.7 11.4L19.4 12.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs text-accent-green-mid uppercase tracking-tighter">Execution</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section
      id="how-it-works"
      className={`relative py-32 bg-background transition-all duration-700 ${highlight ? 'ring-4 ring-accent-green-mid/20' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* 区块标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-white tracking-tight mb-4">How It Works</h2>
          <p className="text-xl text-gray-400 font-bold max-w-3xl mx-auto">
            Democratizing Farm Finance: From Consumer to Co-owner in Three Steps.
          </p>
        </motion.div>

        {/* 核心三步流程图 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <StepCard
                {...step}
                isHovered={hoveredIndex === index}
                isOtherHovered={hoveredIndex !== null && hoveredIndex !== index}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
              >
                {step.content}
              </StepCard>

              {/* Connector Arrows (Desktop) */}
              {index < 2 && (
                <div className={`hidden md:flex absolute left-[calc(${(index + 1) * 33.33}%)] top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 transition-opacity duration-300 ${hoveredIndex !== null ? 'opacity-5' : 'opacity-20'}`}>
                  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" className="text-accent-green-mid animate-pulse">
                    <path d="M0 12H58M58 12L48 2M58 12L48 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              {/* Connector Arrows (Mobile) */}
              {index < 2 && (
                <div className="md:hidden flex flex-col items-center gap-4 py-4 opacity-30">
                  <svg width="24" height="60" viewBox="0 0 24 60" fill="none" className="text-accent-green-mid">
                    <path d="M12 0V58M12 58L2 48M12 58L22 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

interface StepCardProps {
  step: string;
  title: string;
  desc: string;
  children: React.ReactNode;
  isHovered: boolean;
  isOtherHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const StepCard = ({ step, title, desc, children, isHovered, isOtherHovered, onHover, onLeave }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      animate={{
        scale: isHovered ? 1.06 : isOtherHovered ? 0.96 : 1,
        y: isHovered ? -10 : 0,
        opacity: isOtherHovered ? 0.6 : 1,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative bg-gray-dark/40 backdrop-blur-md border border-gray-light/80 p-10 pt-24 rounded-3xl text-center hover:bg-gray-dark/60 hover:border-accent-green-mid/30 transition-colors duration-300 z-10 flex flex-col items-center justify-start min-h-[560px] gap-8 cursor-default"
    >
      <div className="absolute top-6 left-8 text-4xl font-bold font-mono text-white/35 group-hover:text-accent-green-mid transition-colors">
        {step}
      </div>
      <div className="w-full h-[180px] flex items-center justify-center transition-all duration-500">
        {children}
      </div>
      <div className="space-y-4 text-left w-full">
        <h3 className="text-2xl font-bold text-white group-hover:text-accent-green-mid transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
