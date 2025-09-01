import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { Package, Clock, ChartBar, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  onStartSession: () => void;
  onViewHistory: () => void;
  onViewPresets: () => void;
  onSelectProduct: () => void;
  sessionsCount: number;
  lastSessionDate?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartSession,
  onViewHistory,
  onViewPresets,
  onSelectProduct,
  sessionsCount = 0,
  lastSessionDate
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        className="glass-panel w-full max-w-md mx-auto p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <Logo size={96} animate={true} className="mx-auto mb-4" />
          <h1 className="text-display font-display font-extralight text-white">MaengMe</h1>
          <p className="text-white/50 text-small mt-2">Precision Session Tracking</p>
        </div>
        
        {/* Stats */}
        {sessionsCount > 0 && (
          <div className="mb-8 p-4 bg-glass-5 rounded-glass-lg">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-small">Sessions Tracked</span>
              <span className="text-white text-body">{sessionsCount}</span>
            </div>
            {lastSessionDate && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-white/70 text-small">Last Session</span>
                <span className="text-white/50 text-small">{lastSessionDate}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Main Actions */}
        <div className="space-y-3">
          {/* Start New Session - Primary */}
          <motion.button
            onClick={onSelectProduct}
            className="w-full py-4 bg-glass-15 backdrop-blur-md border border-glass-30 rounded-glass-lg text-white text-body hover:bg-glass-20 transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-5 h-5 text-green-400" />
              <span>Start New Session</span>
              <Sparkles className="w-4 h-4 text-green-400 group-hover:animate-pulse" />
            </div>
          </motion.button>
          
          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={onViewPresets}
              className="py-3 glass-button rounded-glass text-white/70 text-small"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Presets
            </motion.button>
            
            <motion.button
              onClick={onViewHistory}
              className="py-3 glass-button rounded-glass text-white/70 text-small"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              History
            </motion.button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white/30 text-tiny">Not medical advice</p>
        </div>
      </motion.div>
    </div>
  );
};