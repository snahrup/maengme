import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';
import { Package, History, Settings, ChartBar, Sparkles } from 'lucide-react';
import { QuickStartHero } from './home/QuickStartHero';
import { StatsGrid } from './home/StatsGrid';
import { InsightsPanel } from './home/InsightsPanel';
import { StreakWidget } from './home/StreakWidget';
import { RecentActivity } from './home/RecentActivity';

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
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 px-4 py-6 pb-20">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{greeting}</h1>
              <p className="text-white/50 text-sm">
                {sessionsCount > 0 
                  ? `${sessionsCount} sessions tracked`
                  : 'Ready to start tracking'
                }
              </p>
            </div>
            <Logo size={48} animate={true} />
          </div>
        </motion.div>

        {/* Quick Start Hero */}
        <div className="mb-6">
          <QuickStartHero 
            onStartSession={onStartSession}
            onSelectProduct={onSelectProduct}
          />
        </div>

        {/* Stats Grid */}
        <div className="mb-6">
          <StatsGrid />
        </div>

        {/* Streak Widget */}
        <div className="mb-6">
          <StreakWidget />
        </div>

        {/* Insights and Recent Activity */}
        <div className="grid gap-6">
          <InsightsPanel />
          <RecentActivity />
        </div>

        {/* Bottom Navigation */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 p-4"
          style={{
            background: 'linear-gradient(to top, rgba(17, 24, 39, 0.95) 0%, transparent 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            <motion.button
              onClick={onSelectProduct}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Package className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-white/70">Products</span>
            </motion.button>

            <motion.button
              onClick={onViewHistory}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <History className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-white/70">History</span>
            </motion.button>

            <motion.button
              onClick={onViewPresets}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ChartBar className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-white/70">Stats</span>
            </motion.button>

            <motion.button
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-white/70">Settings</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Footer disclaimer */}
      <div className="absolute bottom-24 left-0 right-0 text-center">
        <p className="text-white/20 text-xs">Not medical advice</p>
      </div>
    </div>
  );
};