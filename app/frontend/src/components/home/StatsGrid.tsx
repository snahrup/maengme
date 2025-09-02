import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Clock, TrendingUp, Calendar, Target } from 'lucide-react';
import { useSessionStore } from '../../stores/sessionStore';

interface StatCard {
  label: string;
  value: string | number;
  gradient: string;
  icon: React.ElementType;
  delay: number;
}

export const StatsGrid: React.FC = () => {
  const { sessions } = useSessionStore();

  // Calculate stats
  const totalSessions = sessions.length;
  
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

  // Get today's peak intensity
  const getTodaysPeak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysSessions = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
    
    if (todaysSessions.length === 0) return '—';
    
    const maxIntensity = Math.max(...todaysSessions.flatMap(s => 
      s.intensityLogs?.map(log => log.value) || [0]
    ));
    
    return maxIntensity > 0 ? `${maxIntensity}/10` : '—';
  };

  const stats: StatCard[] = [
    {
      label: 'Total Sessions',
      value: totalSessions,
      gradient: 'from-purple-500 to-indigo-600',
      icon: Activity,
      delay: 0
    },
    {
      label: 'Current Streak',
      value: `${calculateStreak()} days`,
      gradient: 'from-orange-500 to-red-600',
      icon: Flame,
      delay: 0.1
    },
    {
      label: 'Avg Duration',
      value: calculateAvgDuration(),
      gradient: 'from-cyan-500 to-blue-600',
      icon: Clock,
      delay: 0.2
    },
    {
      label: 'Peak Today',
      value: getTodaysPeak(),
      gradient: 'from-green-500 to-emerald-600',
      icon: TrendingUp,
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
          {/* Gradient border */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} p-[1px]`}>
            <div className="h-full w-full rounded-2xl bg-gray-900" />
          </div>
          
          {/* Content */}
          <div className="relative rounded-2xl p-4 overflow-hidden">
            {/* Glass effect background */}
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            />
            
            {/* Hover gradient */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <stat.icon className="w-5 h-5 text-white/60 mb-2" />
              <div className="text-2xl font-bold text-white">
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