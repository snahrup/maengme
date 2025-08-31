import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo, ClockHand } from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showClock, setShowClock] = useState(false);
  
  useEffect(() => {
    // Fade in logo
    setTimeout(() => setShowLogo(true), 200);
    
    // Start clock animation
    setTimeout(() => setShowClock(true), 800);
    
    // Complete and navigate
    setTimeout(() => onComplete(), 3500);
  }, [onComplete]);
  
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Logo */}
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Logo size={180} animate={false} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Clock hand animation */}
        {showClock && (
          <ClockHand size={180} />
        )}
      </div>
      
      {/* App name */}
      <motion.div
        className="absolute bottom-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: showLogo ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h1 className="text-2xl font-light text-white tracking-wider">MaengMe</h1>
        <p className="text-white/50 text-sm mt-1">Precision Tracking</p>
      </motion.div>
    </motion.div>
  );
};