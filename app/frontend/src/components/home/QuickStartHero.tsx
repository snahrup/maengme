import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Clock, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuickStartStore } from '../../stores/quickStartStore';
import { formatDistanceToNow } from 'date-fns';

export const QuickStartHero: React.FC = () => {
  const navigate = useNavigate();
  const { canQuickStart, getQuickStartData } = useQuickStartStore();
  
  const quickStartData = getQuickStartData();
  const hasQuickStart = canQuickStart();
  
  const handleQuickStart = () => {
    if (hasQuickStart && quickStartData) {
      // Navigate directly to active session with last settings
      navigate('/session/active', {
        state: {
          productId: quickStartData.lastProductId,
          productName: quickStartData.lastProductName,
          dose: quickStartData.lastDose,
          method: quickStartData.lastMethod,
          quickStart: true
        }
      });
    } else {
      // No previous session, go to product selection
      navigate('/products');
    }
  };

  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl p-8"
      style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 animate-gradient" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">Quick Start</h3>
          {hasQuickStart && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20"
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Ready</span>
            </motion.div>
          )}
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="w-full py-6 rounded-2xl font-bold text-xl shadow-2xl relative overflow-hidden group"
          style={{
            background: hasQuickStart 
              ? 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)'
              : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: '#000'
          }}
          onClick={handleQuickStart}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {hasQuickStart ? 'Quick Start Session' : 'Start First Session'}
            <TrendingUp className="w-5 h-5" />
          </span>
        </motion.button>
        
        {hasQuickStart && quickStartData ? (
          <motion.div 
            className="mt-6 p-4 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-medium">
                  {quickStartData.lastProductName || 'Last Product'}
                </span>
              </div>
              <span className="text-white/40 text-sm">
                {quickStartData.lastDose}g • {quickStartData.lastMethod}
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Clock className="w-3 h-3" />
              <span>
                Last used {formatDistanceToNow(new Date(quickStartData.lastUsed!), { addSuffix: true })}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-white/40 text-xs">
                Tap to start with these settings or choose a different product
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="mt-6 p-4 rounded-xl text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <p className="text-white/50 text-sm">
              No previous sessions yet
            </p>
            <p className="text-white/30 text-xs mt-1">
              Your first session will enable quick start
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};