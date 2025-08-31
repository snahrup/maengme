import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../store/database';
import { formatTime } from '../utils/timeFormat';
import { SessionStats } from './SessionStats';
import { Achievements } from './Achievements';

interface DashboardProps {
  onStartSession: () => void;
  onViewHistory: () => void;
  onManageProducts: () => void;
  onSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartSession,
  onViewHistory,
  onManageProducts,
  onSettings
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'achievements'>('overview');
  
  // Get stats from database
  const sessions = useLiveQuery(() => db.sessions.toArray()) || [];
  const recentSessions = sessions.slice(0, 3);
  
  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((acc, s) => acc + s.totalElapsed, 0);
  const avgSessionTime = totalSessions > 0 ? totalTime / totalSessions : 0;
  
  // Calculate most common lap times
  const lapStats = {
    onset: [] as number[],
    peak: [] as number[],
    tail: [] as number[]
  };
  
  sessions.forEach(session => {
    session.laps.forEach(lap => {
      if (lap.type === 'onset') lapStats.onset.push(lap.elapsed);
      if (lap.type === 'peak') lapStats.peak.push(lap.elapsed);
      if (lap.type === 'tail') lapStats.tail.push(lap.elapsed);
    });
  });
  const avgOnset = lapStats.onset.length > 0 
    ? lapStats.onset.reduce((a, b) => a + b, 0) / lapStats.onset.length 
    : 0;
  const avgPeak = lapStats.peak.length > 0
    ? lapStats.peak.reduce((a, b) => a + b, 0) / lapStats.peak.length
    : 0;
    
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-start to-bg-end">
      {/* Header with Logo */}
      <header className="px-6 py-6 flex justify-between items-center">
        <div className="w-8" /> {/* Spacer */}
        <img 
          src="/icon-192.png" 
          alt="MaengMe" 
          className="w-12 h-12"
        />
        <button 
          onClick={onSettings}
          className="w-8 h-8 flex items-center justify-center text-text-secondary"
        >
          ⚙️
        </button>
      </header>
      
      {/* Main Content */}
      <main className="px-6 pb-32">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {(['overview', 'stats', 'achievements'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-accent-primary text-white'
                  : 'bg-glass-tint/40 text-text-secondary border border-glass-stroke/30'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-light text-text-primary mb-2">
                  Welcome Back
                </h1>
                <p className="text-text-secondary">
                  {totalSessions} sessions tracked
                </p>
              </div>        
        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-glass-tint/40 backdrop-blur-panel rounded-glass p-4 border border-glass-stroke/30">
            <div className="text-text-secondary/60 text-sm mb-1">Total Time</div>
            <div className="text-xl font-light text-text-primary">
              {formatTime(totalTime)}
            </div>
          </div>
          
          <div className="bg-glass-tint/40 backdrop-blur-panel rounded-glass p-4 border border-glass-stroke/30">
            <div className="text-text-secondary/60 text-sm mb-1">Avg Session</div>
            <div className="text-xl font-light text-text-primary">
              {formatTime(avgSessionTime)}
            </div>
          </div>
          
          {avgOnset > 0 && (
            <div className="bg-glass-tint/40 backdrop-blur-panel rounded-glass p-4 border border-glass-stroke/30">
              <div className="text-text-secondary/60 text-sm mb-1">Avg Onset</div>
              <div className="text-xl font-light text-accent-success">
                {formatTime(avgOnset)}
              </div>
            </div>
          )}
          
          {avgPeak > 0 && (
            <div className="bg-glass-tint/40 backdrop-blur-panel rounded-glass p-4 border border-glass-stroke/30">
              <div className="text-text-secondary/60 text-sm mb-1">Avg Peak</div>
              <div className="text-xl font-light text-accent-primary">
                {formatTime(avgPeak)}
              </div>
            </div>
          )}
        </motion.div>        
        {/* Quick Actions */}
        <motion.div 
          className="space-y-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={onViewHistory}
            className="w-full px-4 py-3 bg-glass-tint/40 backdrop-blur-panel rounded-glass text-left border border-glass-stroke/30 flex items-center justify-between group hover:border-glass-stroke/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-text-primary">Session History</div>
                <div className="text-text-secondary/60 text-sm">
                  {recentSessions.length > 0 
                    ? `Last: ${new Date(recentSessions[0].startTime).toLocaleDateString()}`
                    : 'No sessions yet'}
                </div>
              </div>
            </div>
            <span className="text-text-secondary/40 group-hover:text-text-secondary transition-colors">→</span>
          </button>
          
          <button
            onClick={onManageProducts}
            className="w-full px-4 py-3 bg-glass-tint/40 backdrop-blur-panel rounded-glass text-left border border-glass-stroke/30 flex items-center justify-between group hover:border-glass-stroke/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💊</span>
              <div>
                <div className="text-text-primary">Products</div>
                <div className="text-text-secondary/60 text-sm">Manage your presets</div>
              </div>
            </div>
            <span className="text-text-secondary/40 group-hover:text-text-secondary transition-colors">→</span>
          </button>
        </motion.div>        
        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-text-secondary text-sm mb-3">Recent Sessions</h2>
            <div className="space-y-2">
              {recentSessions.map(session => (
                <div 
                  key={session.id}
                  className="bg-glass-tint/30 backdrop-blur-chip rounded-glass p-3 border border-glass-stroke/20"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-text-primary">
                        {formatTime(session.totalElapsed)}
                      </div>
                      <div className="text-text-secondary/60 text-xs">
                        {new Date(session.startTime).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-text-secondary/40 text-sm">
                      {session.laps.length} laps
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
            </motion.div>
          )}
          
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <SessionStats sessions={sessions} />
            </motion.div>
          )}
          
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Achievements sessions={sessions} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-end to-transparent">
        <motion.button
          onClick={onStartSession}
          className="w-full py-4 bg-accent-primary rounded-glass-xl text-text-primary font-medium shadow-glass text-lg flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl">⏱️</span>
          Start New Session
        </motion.button>
      </div>
    </div>
  );
};