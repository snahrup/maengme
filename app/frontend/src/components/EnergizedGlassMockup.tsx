import React from 'react';
import { motion } from 'framer-motion';
import { Timer, TrendingUp, Calendar, Sparkles } from 'lucide-react';

export const EnergizedGlassMockup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] to-[#0E1A2F] p-6">
      {/* Header - unchanged glass */}
      <div className="mb-8">
        <div className="backdrop-blur-lg bg-white/5 rounded-3xl p-6 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">MaengMe</h1>
          <p className="text-white/60">Track your kratom sessions</p>
        </div>
      </div>

      {/* Quick Start - Green Energy Focus */}
      <motion.div 
        className="mb-8"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <button className="w-full backdrop-blur-lg bg-white/5 rounded-3xl p-8 border-2 border-[#00FF41] relative overflow-hidden group">
          {/* Subtle green glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF41]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <Timer className="w-12 h-12 text-[#00FF41] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#00FF41] mb-2">Start Session</h2>
            <p className="text-white/60">Onyx • 2 caps • ETA 15m</p>
          </div>

          {/* Animated pulse ring */}
          <motion.div
            className="absolute inset-4 border-2 border-[#00FF41]/30 rounded-3xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </button>
      </motion.div>

      {/* Stats Grid - Glass with green accents for active items */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Today's Sessions - Active */}
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 border border-[#00FF41]/30">
          <Calendar className="w-6 h-6 text-[#00FF41] mb-2" />
          <p className="text-white/60 text-sm">Today</p>
          <p className="text-2xl font-bold text-[#00FF41]">3</p>
        </div>

        {/* Streak - Normal glass */}
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 border border-white/20">
          <TrendingUp className="w-6 h-6 text-white/60 mb-2" />
          <p className="text-white/60 text-sm">Streak</p>
          <p className="text-2xl font-bold text-white">7 days</p>
        </div>
      </div>

      {/* Product Cards - Glass with green hover */}
      <div className="space-y-4">
        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 border border-white/20 hover:border-[#00FF41]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Green Maeng Da</h3>
              <p className="text-white/60 text-sm">Last: 2 hours ago</p>
            </div>
            <div className="w-2 h-2 bg-[#00FF41] rounded-full shadow-[0_0_10px_rgba(0,255,65,0.6)]" />
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-4 border border-white/20 hover:border-[#00FF41]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Red Borneo</h3>
              <p className="text-white/60 text-sm">Last: Yesterday</p>
            </div>
            <Sparkles className="w-5 h-5 text-white/40" />
          </div>
        </div>
      </div>

      {/* Active Timer Example */}
      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm mb-2">Session Active</p>
        <p className="text-5xl font-bold text-[#00FF41] animate-pulse" style={{
          textShadow: '0 0 20px rgba(0, 255, 65, 0.5)'
        }}>
          12:34
        </p>
      </div>
    </div>
  );
};