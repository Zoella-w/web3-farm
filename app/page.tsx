"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import OnchainData from '@/components/OnchainData';
import VideoBackground from '@/components/VideoBackground';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <Header />

      <div className="relative h-screen flex items-center justify-center border-b border-gray-dark">
        <VideoBackground />
        <div className="relative bottom-[15px] container mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl font-bold mb-7"
          >
            Welcome to <span className="text-transparent bg-clip-text bg-tech-gradient">GreenField</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl text-gray-300 max-w-2xl mx-auto mb-11"
          >
            The next generation Web3 platform for sustainable agriculture and community governance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button className="bg-tech-gradient text-[#1a1a1a] px-[52px] py-[14px] rounded-full font-bold text-2xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300">
              Explore Now
            </button>
          </motion.div>
        </div>
      </div>

      <section className="py-24 relative z-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              Platform <span className="text-transparent bg-clip-text bg-tech-gradient">Statistics</span>
            </h2>
            <OnchainData />
          </motion.div>
        </div>
      </section>

      {/* More sections can be added here */}
      <div className="h-screen bg-background"></div>
    </main>
  );
}
