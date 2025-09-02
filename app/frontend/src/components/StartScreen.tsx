import React from 'react';
import { motion } from 'framer-motion';
import { Play, BarChart3, History, Settings } from 'lucide-react';
import { Logo } from './Logo';

interface StartScreenProps {
  onStartSession: () => void;
  onViewStats: () => void;
  onViewHistory: () => void;
  onSettings?: () => void;
  todayCount?: number;
  weekCount?: number;
  totalCount?: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartSession,
  onViewStats,
  onViewHistory,
  onSettings,
  todayCount = 0,
  weekCount = 0,
  totalCount = 0
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0E1A2F] relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Top Navigation */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <Logo size={48} animate={true} />
          <div>
            <h1 className="text-2xl font-bold text-white">MaengMe</h1>
            <p className="text-white/60 text-sm">Track your sessions</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onViewHistory}
            className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="View History"
          >
            <History className="w-5 h-5 text-white/80" />
          </button>
          <button
            onClick={onViewStats}
            className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="View Stats"
          >
            <BarChart3 className="w-5 h-5 text-white/80" />
          </button>
          {onSettings && (
            <button
              onClick={onSettings}
              className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-white/80" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        {/* Animated Radial Ring */}
        <motion.div
          className="relative w-80 h-80"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Outer Ring */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 320 320"
          >
            <defs>
              <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1DA1FF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#007AFF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0055FF" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            
            {/* Background Ring */}
            <circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="4"
            />
            
            {/* Animated Progress Ring */}
            <motion.circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="url(#ring-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="942.5"
              initial={{ strokeDashoffset: 942.5 }}
              animate={{ 
                strokeDashoffset: [942.5, 0, 942.5],
                rotate: [0, 360]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ transformOrigin: 'center' }}
            />
            
            {/* Inner Pulse Ring */}
            <motion.circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke="rgba(29, 161, 255, 0.2)"
              strokeWidth="2"
              animate={{
                r: [140, 145, 140],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.svg>

          {/* Center Button */}
          <motion.button
            onClick={onStartSession}
            className="absolute inset-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:from-white/15 hover:to-white/10 transition-all group overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#1DA1FF]/20 to-[#007AFF]/20"
              animate={{
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <motion.div
                className="mb-4 p-4 rounded-full bg-white/10"
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Play className="w-12 h-12 text-white" />
              </motion.div>
              <span className="text-white text-2xl font-semibold mb-1">Start Session</span>
              <span className="text-white/60 text-sm">Tap to begin tracking</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex gap-8"
        >
          <div className="text-center">
            <p className="text-white/40 text-sm mb-1">Today</p>
            <p className="text-white text-2xl font-bold">{todayCount}</p>
            <p className="text-white/60 text-xs">sessions</p>
          </div>
          <div className="text-center">
            <p className="text-white/40 text-sm mb-1">This Week</p>
            <p className="text-white text-2xl font-bold">{weekCount}</p>
            <p className="text-white/60 text-xs">sessions</p>
          </div>
          <div className="text-center">
            <p className="text-white/40 text-sm mb-1">Total</p>
            <p className="text-white text-2xl font-bold">{totalCount}</p>
            <p className="text-white/60 text-xs">sessions</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};