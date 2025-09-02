import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
  variant?: 'default' | 'icon' | 'full';
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 96, 
  animate = false,
  className = '',
  variant = 'default'
}) => {
  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={animate ? {
        filter: [
          'drop-shadow(0 0 20px rgba(29, 161, 255, 0.3))',
          'drop-shadow(0 0 40px rgba(29, 161, 255, 0.6))',
          'drop-shadow(0 0 20px rgba(29, 161, 255, 0.3))',
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
        <defs>
          {/* Gradient for modern look */}
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1DA1FF" />
            <stop offset="100%" stopColor="#007AFF" />
          </linearGradient>
          
          {/* Glass effect gradient */}
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
          </linearGradient>
          
          {/* Blur filter for glow */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle with gradient */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="url(#logoGradient)"
          opacity="0.1"
        />
        
        {/* Glass effect circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="url(#glassGradient)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1"
        />
        
        {/* Modern M design - streamlined */}
        <g filter="url(#glow)">
          <path
            d="M 40 140 L 40 60 L 70 120 L 100 60 L 130 120 L 160 60 L 160 140"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.95"
          />
          
          {/* Center dot accent */}
          <circle
            cx="100"
            cy="90"
            r="4"
            fill="white"
            opacity="0.8"
          />
        </g>
        
        {/* Time indicator arcs */}
        <path
          d="M 100 15 A 85 85 0 0 1 185 100"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        
        <path
          d="M 15 100 A 85 85 0 0 1 100 15"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        
        {/* Subtle inner ring */}
        <circle
          cx="100"
          cy="100"
          r="75"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
    </motion.div>
  );
};

// App Icon version for PWA (simpler, bolder for small sizes)
export const AppIcon: React.FC<{ size?: number }> = ({ size = 512 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1DA1FF" />
          <stop offset="100%" stopColor="#007AFF" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect width="512" height="512" rx="112" fill="url(#bgGradient)" />
      
      {/* Glass overlay */}
      <rect 
        width="512" 
        height="512" 
        rx="112" 
        fill="rgba(255, 255, 255, 0.1)" 
      />
      
      {/* M Symbol - bold for visibility */}
      <path
        d="M 100 380 L 100 132 L 180 300 L 256 132 L 332 300 L 412 132 L 412 380"
        stroke="white"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Center accent */}
      <circle
        cx="256"
        cy="216"
        r="16"
        fill="white"
      />
    </svg>
  );
};