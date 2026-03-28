"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CustomWalletConnect } from './CustomWalletConnect';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Buy Tokens', href: '/buy' },
    { label: 'Pools & Yield', href: '/pools-yield' },
    { label: 'Governance', href: '/#framework' },
    { label: 'Account', href: '/account' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="container mx-auto px-6 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-tech-gradient rounded-full"></div>
          <span className="text-2xl font-bold text-white tracking-wider">GreenField</span>
        </div>

        <nav className="flex gap-8 ml-12">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-300 hover:text-accent-green-mid transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <CustomWalletConnect />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
