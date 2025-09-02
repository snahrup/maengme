import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../stores/sessionStore';
import { formatDistanceToNow } from 'date-fns';

export const QuickStartHero: React.FC = () => {
  const navigate = useNavigate();
  const { sessions } = useSessionStore();
  
  // Get the most recent session
  const lastSession = sessions[sessions.length - 1];
  
  const handleQuickStart = () => {
    if (lastSession) {
      // Use last session's settings for quick start
      navigate('/session/active', {
        state: {
          productId: lastSession.productId,
          dose: lastSession.dose,
          method: lastSession.method || 'toss-wash',
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
        <h3 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">Quick Start</h3>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="w-full py-6 rounded-2xl font-bold text-xl shadow-2xl relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
            color: '#000'
          }}
          onClick={handleQuickStart}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            Start Session
            <TrendingUp className="w-5 h-5" />
          </span>
        </motion.button>
        
        {lastSession ? (
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
                <span className="text-white font-medium">{lastSession.productName || 'Previous Session'}</span>
              </div>
              <span className="text-white/40 text-sm">
                {lastSession.dose}g
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Clock className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(lastSession.startTime), { addSuffix: true })}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="mt-6 text-center text-white/40 text-sm">
            No previous sessions. Let's start your first!
          </div>
        )}
      </div>
    </motion.div>
  );
};