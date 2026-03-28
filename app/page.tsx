"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import OnchainData from '@/components/OnchainData';
import VideoBackground from '@/components/VideoBackground';
import HowItWorks from '@/components/HowItWorks';
import LiveDataTrust from '@/components/LiveDataTrust';
import BIDTFramework from '@/components/BIDTFramework';
import CallToAction from '@/components/CallToAction';

export default function Home() {
  const scrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update URL hash to trigger visual feedback in HowItWorks component
      window.history.pushState(null, '', '#how-it-works');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      
      // Remove the hash from URL after a short delay to keep it clean
      setTimeout(() => {
        window.history.replaceState(null, '', window.location.pathname);
      }, 1000);
    }
  };

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
            className="text-3xl text-gray-300 max-w-3xl mx-auto mb-11"
          >
            From Soil to Shares: Own the Future of Farming
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              className="inline-block bg-tech-gradient text-[#1c1c1c] px-14 py-3 rounded-full font-bold text-[23px] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300"
            >
              Explore Now
            </a>
          </motion.div>
        </div>
      </div>

      <HowItWorks />
      <LiveDataTrust />
      <BIDTFramework />
      <CallToAction />
    </main>
  );
}
