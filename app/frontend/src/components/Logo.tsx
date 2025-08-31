import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 96, 
  animate = false,
  className = ''
}) => {
  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={animate ? {
        filter: [
          'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
          'drop-shadow(0 0 40px rgba(255, 255, 255, 0.5))',
          'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
        ]
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />
        
        {/* M letter - Vision Pro style thin lines */}
        <path
          d="M 50 130 L 50 70 L 80 110 L 100 70 L 120 110 L 150 70 L 150 130"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Leaf accent */}
        <path
          d="M 150 70 Q 165 55 180 60 Q 175 75 160 75 Q 155 72 150 70"
          fill="rgba(255, 255, 255, 0.3)"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1"
        />
        
        {/* Subtle inner glow circle */}
        <circle
          cx="100"
          cy="100"
          r="85"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </motion.div>
  );
};

// Clock hand component for splash animation
export const ClockHand: React.FC<{ size?: number }> = ({ size = 200 }) => {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ rotate: -90, opacity: 0 }}
      animate={{ 
        rotate: 270,
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.1, 0.9, 1]
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        style={{ filter: 'blur(1px)' }}
      >
        {/* Clock hand with gradient */}
        <defs>
          <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.5)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
        
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="20"
          stroke="url(#handGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Glow trail */}
        <circle
          cx="100"
          cy="20"
          r="8"
          fill="rgba(255, 255, 255, 0.8)"
          filter="blur(4px)"
        />
      </svg>
    </motion.div>
  );
};