import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showRadial, setShowRadial] = useState(false);
  
  useEffect(() => {
    // Fade in logo after 500ms
    setTimeout(() => setShowLogo(true), 500);
    
    // Start radial animation after 1.5s
    setTimeout(() => setShowRadial(true), 1500);
    
    // Complete and navigate after 3.5s
    setTimeout(() => onComplete(), 3500);
  }, [onComplete]);
  
  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-b from-bg-start to-bg-end flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Logo */}
        <AnimatePresence>
          {showLogo && (
            <motion.img
              src="/icon-512.png"
              alt="MaengMe"
              className="w-32 h-32 md:w-48 md:h-48"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>        
        {/* Radial clock animation */}
        {showRadial && (
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 200"
            style={{ transform: 'scale(1.3)' }}
          >
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#splashGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="565"
              initial={{ strokeDashoffset: 565, rotate: -90 }}
              animate={{ 
                strokeDashoffset: 0,
                rotate: 270
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut"
              }}
              style={{ transformOrigin: 'center' }}
            />
            <defs>
              <linearGradient id="splashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D4FF" stopOpacity="0" />
                <stop offset="50%" stopColor="#00D4FF" stopOpacity="1" />
                <stop offset="100%" stopColor="#1DA1FF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
      
      {/* App name */}
      <motion.div
        className="absolute bottom-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: showLogo ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h1 className="text-2xl font-light text-text-primary tracking-wider">MaengMe</h1>
        <p className="text-text-secondary/60 text-sm mt-1">Precision Tracking</p>
      </motion.div>
    </motion.div>
  );
};