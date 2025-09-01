import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, Clock, Zap, AlertCircle } from 'lucide-react';

interface SessionInsightsProps {
  insight: string;
  phase: 'pre-onset' | 'onset' | 'peak' | 'tail' | 'after';
  onDismiss: () => void;
}

export const SessionInsights: React.FC<SessionInsightsProps> = ({
  insight,
  phase,
  onDismiss
}) => {
  const [autoHide, setAutoHide] = useState(true);
  
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss]);
  
  const getIcon = () => {
    switch (phase) {
      case 'pre-onset':
        return <Clock className="w-4 h-4" />;
      case 'onset':
        return <TrendingUp className="w-4 h-4" />;
      case 'peak':
        return <Zap className="w-4 h-4" />;
      case 'tail':
        return <Brain className="w-4 h-4" />;
      case 'after':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };
  
  const getGradient = () => {
    switch (phase) {
      case 'pre-onset':
        return 'from-blue-500/20 to-blue-600/20';
      case 'onset':
        return 'from-purple-500/20 to-blue-500/20';
      case 'peak':
        return 'from-yellow-500/20 to-orange-500/20';
      case 'tail':
        return 'from-green-500/20 to-blue-500/20';
      case 'after':
        return 'from-purple-500/20 to-pink-500/20';
      default:
        return 'from-gray-500/20 to-gray-600/20';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-24 left-6 right-6 z-50"
      onMouseEnter={() => setAutoHide(false)}
      onMouseLeave={() => setAutoHide(true)}
    >
      <div className={`bg-gradient-to-r ${getGradient()} backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-white/10 text-white/80">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-white/90 text-sm leading-relaxed">
              {insight}
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};