import React from 'react';
import { motion } from 'framer-motion';

interface TimerDisplayProps {
  elapsed: number;
  className?: string;
  isActive?: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  elapsed, 
  className = '',
  isActive = false 
}) => {
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };
  
  return (
    <motion.div 
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-timer-lg font-display font-extralight tabular-nums tracking-tight"
        style={{
          color: isActive ? '#00FF41' : '#FFFFFF',
          textShadow: isActive ? '0 0 30px rgba(0, 255, 65, 0.6)' : 'none',
        }}
        animate={isActive ? {
          textShadow: [
            '0 0 30px rgba(0, 255, 65, 0.6)',
            '0 0 40px rgba(0, 255, 65, 0.8)',
            '0 0 30px rgba(0, 255, 65, 0.6)'
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {formatTime(elapsed)}
      </motion.div>
    </motion.div>
  );
};