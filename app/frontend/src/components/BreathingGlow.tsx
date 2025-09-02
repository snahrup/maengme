import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface BreathingGlowProps {
  phase: 'waiting' | 'onset' | 'peak' | 'comedown';
  intensity: number; // 0-1, how close to peak
}

export const BreathingGlow: React.FC<BreathingGlowProps> = ({
  phase,
  intensity
}) => {
  // Phase-based configuration
  const config = useMemo(() => {
    switch (phase) {
      case 'waiting':
        return {
          color1: 'rgba(29, 161, 255, 0.05)', // Light blue
          color2: 'rgba(0, 122, 255, 0.02)',   // Darker blue
          duration: 6, // Slow breathing
          scale: 1.1
        };
      case 'onset':
        return {
          color1: 'rgba(255, 204, 0, 0.08)',   // Yellow
          color2: 'rgba(255, 170, 0, 0.04)',   // Orange-yellow
          duration: 4, // Slightly faster
          scale: 1.15
        };
      case 'peak':
        return {
          color1: 'rgba(52, 211, 153, 0.12)',  // Green
          color2: 'rgba(16, 185, 129, 0.06)',  // Emerald
          duration: 2, // Fast breathing
          scale: 1.25
        };
      case 'comedown':
        return {
          color1: 'rgba(139, 92, 246, 0.06)',  // Purple
          color2: 'rgba(109, 40, 217, 0.03)',  // Deep purple
          duration: 5, // Slowing down
          scale: 1.12
        };
    }
  }, [phase]);

  // Calculate dynamic values based on intensity
  const dynamicScale = 1 + (config.scale - 1) * intensity;
  const dynamicDuration = config.duration * (1 - intensity * 0.3); // Speed up slightly with intensity

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Primary glow orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: [1, dynamicScale, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: dynamicDuration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: '600px',
            height: '600px',
            background: `radial-gradient(circle at center, ${config.color1} 0%, ${config.color2} 40%, transparent 70%)`,
            filter: 'blur(60px)',
            transform: 'translate3d(0, 0, 0)' // Force GPU acceleration
          }}
        />
      </motion.div>

      {/* Secondary offset glow for depth */}
      <motion.div
        className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 3, delay: 0.5 }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: dynamicDuration * 1.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dynamicDuration * 0.25
          }}
          style={{
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle at center, ${config.color1} 0%, transparent 60%)`,
            filter: 'blur(80px)',
            transform: 'translate3d(0, 0, 0)'
          }}
        />
      </motion.div>

      {/* Tertiary glow for additional atmosphere */}
      <motion.div
        className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 3, delay: 1 }}
      >
        <motion.div
          className="relative"
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: dynamicDuration * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dynamicDuration * 0.5
          }}
          style={{
            width: '350px',
            height: '350px',
            background: `radial-gradient(circle at center, ${config.color2} 0%, transparent 50%)`,
            filter: 'blur(70px)',
            transform: 'translate3d(0, 0, 0)'
          }}
        />
      </motion.div>

      {/* Ambient edge glow during peak */}
      {phase === 'peak' && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: intensity * 0.3 }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, ${config.color1} 0%, transparent 30%),
                radial-gradient(circle at 80% 50%, ${config.color1} 0%, transparent 30%),
                radial-gradient(circle at 50% 20%, ${config.color2} 0%, transparent 30%),
                radial-gradient(circle at 50% 80%, ${config.color2} 0%, transparent 30%)
              `,
              filter: 'blur(100px)',
              transform: 'translate3d(0, 0, 0)'
            }}
          />
        </motion.div>
      )}
    </div>
  );
};