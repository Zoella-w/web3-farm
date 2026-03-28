import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, prefix = '', suffix = '', decimals = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      // We'll use a manual interval for the animation to avoid complex motion values for simple counters
      // Alternatively, we can use framer-motion's animate function
    });

    let startTimestamp: number | null = null;
    const duration = 2000;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = (t: number) => t * (2 - t);
      const current = startValue + (value - startValue) * easeOutQuad(progress);
      setDisplayValue(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

const OnchainData = () => {
  // Mock data for demonstration
  const data = [
    { label: 'A池（运营）总资金', value: 1250000.5, prefix: '$', decimals: 2 },
    { label: 'B池（发展）总资金', value: 3450000.75, prefix: '$', decimals: 2 },
    { label: 'VeggieBox代币价格', value: 1.2345, prefix: '$', decimals: 4 },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mt-12">
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
          className="bg-gray-dark/80 backdrop-blur-sm border border-gray-light rounded-2xl p-6 text-center hover:border-accent-green-mid transition-colors duration-300"
        >
          <h3 className="text-gray-400 text-sm font-medium mb-2">{item.label}</h3>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-tech-gradient">
            <AnimatedNumber
              value={item.value}
              prefix={item.prefix}
              decimals={item.decimals}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OnchainData;
