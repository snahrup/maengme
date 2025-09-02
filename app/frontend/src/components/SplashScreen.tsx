import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  
  useEffect(() => {
    // Fade in logo
    setTimeout(() => setShowLogo(true), 200);
    
    // Complete and navigate
    setTimeout(() => onComplete(), 2500);
  }, [onComplete]);
  
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#0B1220] to-[#0E1A2F]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Logo with animation */}
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.43, 0.13, 0.23, 0.96],
                rotate: { type: "spring", damping: 15 }
              }}
            >
              <Logo size={180} animate={true} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/20"
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.5, 0, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </div>
      
      {/* App name */}
      <motion.div
        className="absolute bottom-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showLogo ? 1 : 0, y: showLogo ? 0 : 20 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-wide">MaengMe</h1>
        <p className="text-white/60 text-sm mt-2">Track Your Sessions</p>
      </motion.div>
    </motion.div>
  );
};