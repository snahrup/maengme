import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Clock, TrendingUp, Calendar, Target } from 'lucide-react';
import { useSessionStore } from '../../stores/sessionStore';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  delay: number;
  isActive?: boolean;
}

export const StatsGrid: React.FC = () => {
  const { sessions } = useSessionStore();

  // Calculate stats
  const totalSessions = sessions.length;
  
  // Check if there are sessions today
  const hasSessionsToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sessions.some(session => {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
  };
  
  // Calculate current streak (consecutive days with sessions)
  const calculateStreak = () => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedSessions.length - 1; i++) {
      const currentDate = new Date(sortedSessions[i].startTime);
      const nextDate = new Date(sortedSessions[i + 1].startTime);
      currentDate.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);
      
      const dayDiff = (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Calculate average duration
  const calculateAvgDuration = () => {
    if (sessions.length === 0) return '0m';
    
    const totalDuration = sessions.reduce((acc, session) => {
      if (session.endTime) {
        return acc + (new Date(session.endTime).getTime() - new Date(session.startTime).getTime());
      }
      return acc;
    }, 0);
    
    const avgMs = totalDuration / sessions.filter(s => s.endTime).length;
    const avgMinutes = Math.round(avgMs / (1000 * 60));
    
    if (avgMinutes < 60) return `${avgMinutes}m`;
    const hours = Math.floor(avgMinutes / 60);
    const mins = avgMinutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get today's session count
  const getTodaysCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysSessions = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
    
    return todaysSessions.length;
  };

  const todayCount = getTodaysCount();
  const currentStreak = calculateStreak();

  const stats: StatCard[] = [
    {
      label: 'Today',
      value: todayCount,
      icon: Calendar,
      delay: 0,
      isActive: todayCount > 0
    },
    {
      label: 'Streak',
      value: `${currentStreak} days`,
      icon: Flame,
      delay: 0.1,
      isActive: currentStreak > 0 && hasSessionsToday()
    },
    {
      label: 'Total',
      value: totalSessions,
      icon: Activity,
      delay: 0.2
    },
    {
      label: 'Avg Duration',
      value: calculateAvgDuration(),
      icon: Clock,
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: stat.delay, duration: 0.4 }}
          className="relative group"
        >
          {/* Content */}
          <div 
            className="relative rounded-2xl p-4 overflow-hidden transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: stat.isActive 
                ? '1px solid rgba(0, 255, 65, 0.3)' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: stat.isActive 
                ? '0 0 20px rgba(0, 255, 65, 0.15)' 
                : 'none'
            }}
          >
            {/* Active pulse effect */}
            {stat.isActive && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'radial-gradient(circle at center, rgba(0, 255, 65, 0.1) 0%, transparent 70%)'
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            
            <div className="relative z-10">
              <stat.icon 
                className="w-5 h-5 mb-2" 
                style={{ 
                  color: stat.isActive ? '#00FF41' : 'rgba(255, 255, 255, 0.6)'
                }}
              />
              <div 
                className="text-2xl font-bold"
                style={{
                  color: stat.isActive ? '#00FF41' : '#FFFFFF',
                  textShadow: stat.isActive ? '0 0 20px rgba(0, 255, 65, 0.5)' : 'none'
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-white/60">{stat.label}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};