import React from 'react';
import { LapType } from '../types/timer';
import { motion } from 'framer-motion';

interface LapChipProps {
  type: LapType;
  label: string;
  onTap: () => void;
  isHighlighted?: boolean;
  isPrimed?: boolean;
}

const chipColors: Record<LapType, string> = {
  'onset': 'border-glass-stroke bg-glass-tint/60',
  'peak': 'border-accent-primary bg-accent-primary/20',
  'tail': 'border-chip-tail bg-chip-tail/20',
  'no-effect': 'border-glass-stroke bg-glass-tint/40',
  'custom': 'border-glass-stroke bg-glass-tint/60'
};

export const LapChip: React.FC<LapChipProps> = ({ 
  type, 
  label, 
  onTap, 
  isHighlighted = false,
  isPrimed = false 
}) => {
  return (
    <motion.button
      onClick={onTap}
      whileTap={{ scale: 0.95 }}
      className={`
        relative px-6 py-3 rounded-full border backdrop-blur-chip
        transition-all duration-200
        ${chipColors[type]}
        ${isHighlighted ? 'ring-2 ring-accent-primary shadow-glow' : ''}
        ${isPrimed ? 'animate-pulse-glow' : ''}
      `}
    >      <span className="text-text-primary font-medium text-sm">
        {label}
      </span>
      
      {isPrimed && (
        <motion.div 
          className="absolute -top-1 -right-1 w-2 h-2 bg-accent-primary rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};