import React from 'react';
import { motion } from 'framer-motion';
import { LapType } from '../types/timer';

interface LapChipProps {
  type: LapType;
  label: string;
  onTap: () => void;
  isHighlighted?: boolean;
}

export const LapChip: React.FC<LapChipProps> = ({ 
  label, 
  onTap,
  isHighlighted = false
}) => {
  return (
    <motion.button
      onClick={onTap}
      className={`
        px-6 py-3 rounded-glass
        backdrop-blur-md
        border transition-all duration-200
        ${isHighlighted 
          ? 'bg-glass-15 border-glass-30 shadow-lg' 
          : 'bg-glass-8 border-glass-15 hover:bg-glass-10 hover:border-glass-20'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={isHighlighted ? {
        boxShadow: [
          '0 0 20px rgba(255, 255, 255, 0.2)',
          '0 0 30px rgba(255, 255, 255, 0.3)',
          '0 0 20px rgba(255, 255, 255, 0.2)',
        ]
      } : {}}
      transition={isHighlighted ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      <span className={`text-body font-normal ${isHighlighted ? 'text-white' : 'text-white/70'}`}>
        {label}
      </span>
    </motion.button>
  );
};