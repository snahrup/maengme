import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  ArrowLeft,
  Clock,
  TrendingUp,
  Calendar,
  BarChart3,
  Activity,
  Filter
} from 'lucide-react';
import { db } from '../store/database';
import { Session } from '../types/timer';

interface StatsPageProps {
  onBack: () => void;
}

export const StatsPage: React.FC<StatsPageProps> = ({ onBack }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  
  // Fetch sessions from Dexie
  const sessions = useLiveQuery(() => db.sessions.toArray()) || [];
  
  // Calculate stats
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalTime: 0,
    averageTime: 0,
    longestSession: 0,
    streakDays: 0,
    todaySessions: 0,
    weekSessions: 0,
    monthSessions: 0
  });

  useEffect(() => {
    if (!sessions.length) return;

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekAgo = now - (7 * dayMs);
    const monthAgo = now - (30 * dayMs);
    const todayStart = new Date().setHours(0, 0, 0, 0);

    // Filter sessions by time range
    const todaySessionsList = sessions.filter(s => s.startTime >= todayStart);
    const weekSessionsList = sessions.filter(s => s.startTime >= weekAgo);
    const monthSessionsList = sessions.filter(s => s.startTime >= monthAgo);

    // Calculate stats
    const totalTime = sessions.reduce((sum, s) => sum + s.totalElapsed, 0);
    const averageTime = totalTime / sessions.length;
    const longestSession = Math.max(...sessions.map(s => s.totalElapsed));

    // Calculate streak (simplified - days with sessions)
    const sessionDays = new Set(
      sessions.map(s => new Date(s.startTime).toDateString())
    );
    
    setStats({
      totalSessions: sessions.length,
      totalTime,
      averageTime,
      longestSession,
      streakDays: sessionDays.size,
      todaySessions: todaySessionsList.length,
      weekSessions: weekSessionsList.length,
      monthSessions: monthSessionsList.length
    });
  }, [sessions]);

  // Format time helper
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Get filtered sessions based on time range
  const getFilteredSessions = () => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    switch (timeRange) {
      case 'week':
        return sessions.filter(s => s.startTime >= now - (7 * dayMs));
      case 'month':
        return sessions.filter(s => s.startTime >= now - (30 * dayMs));
      default:
        return sessions;
    }
  };

  const filteredSessions = getFilteredSessions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0E1A2F] relative">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={onBack}
          className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/80" />
        </button>
        
        <h1 className="text-xl font-semibold text-white">Statistics</h1>
        
        <div className="w-11" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-8">
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {(['week', 'month', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                timeRange === range
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-white/60 border border-white/10'
              }`}
            >
              {range === 'week' && 'Week'}
              {range === 'month' && 'Month'}
              {range === 'all' && 'All Time'}
            </button>
          ))}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-white/60 text-sm">Total Sessions</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {timeRange === 'week' ? stats.weekSessions : 
               timeRange === 'month' ? stats.monthSessions : 
               stats.totalSessions}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Clock className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-white/60 text-sm">Avg Duration</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatTime(stats.averageTime)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-white/60 text-sm">Longest Session</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatTime(stats.longestSession)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Calendar className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-white/60 text-sm">Active Days</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.streakDays}
            </p>
          </motion.div>
        </div>

        {/* Session List */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Sessions</h2>
          
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">No sessions in this time period</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSessions.slice(0, 10).map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">
                      {session.productPreset || 'Session'}
                    </span>
                    <span className="text-white/40 text-sm">
                      {new Date(session.startTime).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">
                      Duration: {formatTime(session.totalElapsed)}
                    </span>
                    <span className="text-white/60 text-sm">
                      {session.laps?.length || 0} events
                    </span>
                  </div>
                  {session.notes && (
                    <p className="text-white/40 text-xs mt-2">{session.notes}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Total Time Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10"
        >
          <p className="text-white/60 text-sm mb-1">Total Time Tracked</p>
          <p className="text-3xl font-bold text-white">
            {formatTime(stats.totalTime)}
          </p>
        </motion.div>
      </div>
    </div>
  );
};