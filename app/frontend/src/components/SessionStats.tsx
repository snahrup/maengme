import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Session } from '../types/timer';
import { formatTime } from '../utils/timeFormat';

interface SessionStatsProps {
  sessions: Session[];
}

export const SessionStats: React.FC<SessionStatsProps> = ({ sessions }) => {
  const stats = useMemo(() => {
    if (sessions.length === 0) return null;
    
    // Calculate streaks
    const sortedSessions = [...sessions].sort((a, b) => b.startTime - a.startTime);
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate: Date | null = null;
    
    sortedSessions.forEach(session => {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      
      if (!lastDate) {
        currentStreak = 1;
        longestStreak = 1;
      } else {
        const dayDiff = Math.floor((lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else if (dayDiff > 1) {
          currentStreak = 1;
        }
      }
      lastDate = sessionDate;
    });    
    // Calculate lap time distributions
    const lapTimes: { [key: string]: number[] } = {
      onset: [],
      peak: [],
      tail: []
    };
    
    sessions.forEach(session => {
      session.laps.forEach(lap => {
        if (lap.type !== 'no-effect' && lap.type !== 'custom') {
          lapTimes[lap.type].push(lap.elapsed);
        }
      });
    });
    
    // Calculate weekly patterns
    const weeklyActivity = new Array(7).fill(0);
    sessions.forEach(session => {
      const day = new Date(session.startTime).getDay();
      weeklyActivity[day]++;
    });
    
    const peakDay = weeklyActivity.indexOf(Math.max(...weeklyActivity));
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return {
      totalSessions: sessions.length,
      currentStreak,
      longestStreak,
      avgSessionTime: sessions.reduce((acc, s) => acc + s.totalElapsed, 0) / sessions.length,
      lapTimes,
      weeklyActivity,
      peakDay: dayNames[peakDay],
      totalTime: sessions.reduce((acc, s) => acc + s.totalElapsed, 0)
    };
  }, [sessions]);  
  if (!stats) return null;
  
  const maxActivity = Math.max(...stats.weeklyActivity);
  
  return (
    <div className="space-y-6">
      {/* Streak Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 backdrop-blur-panel rounded-glass p-4 border border-accent-primary/30"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl mb-1">🔥</div>
          <div className="text-2xl font-light text-text-primary">{stats.currentStreak}</div>
          <div className="text-text-secondary/60 text-sm">Current Streak</div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-accent-success/20 to-accent-success/5 backdrop-blur-panel rounded-glass p-4 border border-accent-success/30"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-2xl font-light text-text-primary">{stats.longestStreak}</div>
          <div className="text-text-secondary/60 text-sm">Best Streak</div>
        </motion.div>
      </div>
      
      {/* Weekly Activity Chart */}
      <div className="bg-glass-tint/40 backdrop-blur-panel rounded-glass p-4 border border-glass-stroke/30">
        <h3 className="text-text-primary mb-3">Weekly Activity</h3>
        <div className="flex items-end justify-between h-20 gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={day} className="flex-1 flex flex-col items-center">
              <motion.div 
                className="w-full bg-accent-primary/30 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${(stats.weeklyActivity[index] / maxActivity) * 100}%` }}
                transition={{ delay: index * 0.05 }}
              />
              <div className={`text-xs mt-1 ${index === new Date().getDay() ? 'text-accent-primary' : 'text-text-secondary/60'}`}>
                {day}
              </div>
            </div>
          ))}
        </div>
        <div className="text-text-secondary/60 text-xs mt-2 text-center">
          Most active on {stats.peakDay}
        </div>
      </div>
    </div>
  );
};