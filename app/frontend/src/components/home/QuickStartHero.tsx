import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Clock, TrendingUp, Zap } from 'lucide-react';
import { useQuickStartStore } from '../../stores/quickStartStore';
import { formatDistanceToNow } from 'date-fns';

interface QuickStartHeroProps {
  onStartSession: () => void;
  onSelectProduct: () => void;
}

export const QuickStartHero: React.FC<QuickStartHeroProps> = ({ onStartSession, onSelectProduct }) => {
  const { canQuickStart, getQuickStartData } = useQuickStartStore();
  
  const quickStartData = getQuickStartData();
  const hasQuickStart = canQuickStart();
  
  const handleQuickStart = () => {
    if (hasQuickStart) {
      // Use the quick start callback
      onStartSession();
    } else {
      // No previous session, go to product selection
      onSelectProduct();
    }
  };

  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl p-8"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider">Quick Start</h3>
          {hasQuickStart && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-1 rounded-full"
              style={{
                background: 'rgba(0, 255, 65, 0.1)',
                border: '1px solid rgba(0, 255, 65, 0.3)'
              }}
            >
              <Zap className="w-3 h-3" style={{ color: '#00FF41' }} />
              <span className="text-xs font-medium" style={{ color: '#00FF41' }}>Ready</span>
            </motion.div>
          )}
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="w-full py-6 rounded-2xl font-bold text-xl relative overflow-hidden group"
          style={{
            background: hasQuickStart 
              ? 'linear-gradient(135deg, #00FF41 0%, #00D837 100%)'
              : 'rgba(255, 255, 255, 0.05)',
            border: hasQuickStart ? 'none' : '2px solid #00FF41',
            color: hasQuickStart ? '#0B1220' : '#00FF41',
            boxShadow: hasQuickStart 
              ? '0 0 30px rgba(0, 255, 65, 0.4), inset 0 0 20px rgba(0, 255, 65, 0.2)'
              : '0 0 20px rgba(0, 255, 65, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onClick={handleQuickStart}
        >
          {/* Pulse ring animation for ready state */}
          {hasQuickStart && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                border: '2px solid rgba(0, 255, 65, 0.3)'
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* Shimmer effect on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%)',
              animation: 'shimmer 2s infinite'
            }}
          />
          
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
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4" style={{ color: '#00FF41' }} />
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
              border: '1px solid rgba(255, 255, 255, 0.1)'
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