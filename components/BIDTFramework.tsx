"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface FrameworkCardProps {
  letter: string;
  name: string;
  summary: string;
  desc: string;
  tags: string[];
  color: string;
  icon: React.ReactNode;
  delay: number;
}

const FrameworkCard = ({ letter, name, summary, desc, tags, color, icon, delay }: FrameworkCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
        opacity: { duration: 0.6, delay },
        y: { duration: 0.6, delay }
      }}
      whileHover={{
        y: -10,
        borderColor: 'rgba(16, 185, 129, 0.4)',
        boxShadow: '0 0 25px rgba(16, 185, 129, 0.15)',
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="relative flex-1 bg-gray-dark/40 backdrop-blur-md border border-gray-light/50 rounded-3xl overflow-hidden group flex flex-col min-h-[580px] hover:bg-gray-dark/60 transition-colors duration-200"
    >
      {/* Top Accent Bar */}
      <div className="h-[3px] w-full opacity-40" style={{ backgroundColor: color }} />

      <div className="p-8 flex flex-col h-full">
        {/* Icon with Color Glow */}
        <div
          className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{
            backgroundColor: `${color}15`,
            color: color,
            boxShadow: `0 0 20px ${color}10`
          }}
        >
          {icon}
        </div>

        {/* Letter and Full Name */}
        <div className="mb-6">
          <h3 className="text-5xl font-black mb-1" style={{ color }}>{letter}</h3>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">{name}</p>
        </div>

        {/* Core Summary */}
        <p className="text-lg font-bold text-white mb-4 leading-tight">
          {summary}
        </p>

        {/* Detailed Description */}
        <p className="text-sm text-gray-400 leading-relaxed mb-8 flex-1">
          {desc}
        </p>

        {/* Keyword Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag, idx) => (
            <span 
              key={idx}
              className="text-xs font-mono px-2 py-1 rounded bg-gray-light/50 text-gray-500 group-hover:text-gray-300 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Subtle Background Letter Decoration */}
      <div
        className="absolute -right-4 -bottom-4 text-[12rem] font-black opacity-[0.03] pointer-events-none select-none transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.06]"
        style={{ color }}
      >
        {letter}
      </div>
    </motion.div>
  );
};

const BIDTFramework = () => {
  const frameworkData = [
    {
      letter: "B",
      name: "Business",
      summary: "Solving farm pre-sale cash flow pain points, connecting consumers and investors.",
      desc: "By locking in demand through FT pre-sales and securing development funds via NFT financing, we build a sustainable Community Supported Agriculture (CSA) model.",
      tags: ["#PreSaleModel", "#TwoSidedMarket", "#CSA"],
      color: "#3B82F6", // Blue
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      letter: "I",
      name: "Innovation",
      summary: "Automating revenue distribution via smart contracts, pioneering transparent agrifinance.",
      desc: "Real-time fund allocation and instant yield distribution powered by audited smart contracts ensure every harvest benefit reaches stakeholders without delay.",
      tags: ["#HybridTokenModel", "#InstantYield", "#Transparency"],
      color: "#10B981", // Green
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
        </svg>
      )
    },
    {
      letter: "D",
      name: "Data & Assets",
      summary: "On-chain asset backing with real-world valuation, securing community wealth.",
      desc: "Every token is backed by physical farm assets and production data. Transparency in asset valuation ensures the intrinsic value of the community's digital holdings.",
      tags: ["#AssetBacking", "#RealWorldAssets", "#OnChainData"],
      color: "#8B5CF6", // Purple
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="7" y1="15" x2="7.01" y2="15" />
          <line x1="11" y1="15" x2="11.01" y2="15" />
        </svg>
      )
    },
    {
      letter: "T",
      name: "Technology",
      summary: "Integrating IoT and Blockchain for full farm-to-table traceability.",
      desc: "Leveraging IoT sensors and blockchain oracles for full farm-to-table traceability, with automated smart contracts ensuring tamper-proof execution.",
      tags: ["#IoT", "#Oracle", "#Traceability"],
      color: "#F59E0B", // Orange
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  return (
    <section id="framework" className="relative py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-white tracking-tight mb-4">
            A Framework Built for the Future
          </h2>
          <p className="text-xl text-gray-400">
            Our core philosophy: BIDT — A multidimensional approach to Web3 farming.
          </p>
        </motion.div>

        {/* Framework Cards Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {frameworkData.map((data, idx) => (
            <FrameworkCard key={idx} {...data} delay={idx * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BIDTFramework;
