import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Award, Target } from 'lucide-react';
import { useSessionStore } from '../../stores/sessionStore';

export const StreakWidget: React.FC = () => {
  const { sessions } = useSessionStore();

  // Calculate current streak
  const calculateStreak = () => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if there's a session today
    const lastSessionDate = new Date(sortedSessions[0].startTime);
    lastSessionDate.setHours(0, 0, 0, 0);
    
    const daysSinceLastSession = Math.floor((today.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastSession > 1) return 0; // Streak broken
    
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

  const streak = calculateStreak();
  const nextMilestone = streak < 7 ? 7 : streak < 30 ? 30 : streak < 100 ? 100 : 365;
  const progress = (streak / nextMilestone) * 100;

  return (
    <motion.div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(251, 146, 60, ${0.1 - i * 0.02}) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-400" />
            <h3 className="text-white font-semibold text-lg">
              {streak} Day Streak
            </h3>
          </div>
          
          {streak >= 7 && (
            <Award className="w-5 h-5 text-yellow-400" />
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1">
            <span>Next milestone</span>
            <span>{nextMilestone} days</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Achievement badges */}
        <div className="flex gap-2">
          {streak >= 7 && (
            <div className="px-2 py-1 rounded-lg bg-yellow-400/20 text-yellow-400 text-xs font-medium">
              Week Warrior
            </div>
          )}
          {streak >= 30 && (
            <div className="px-2 py-1 rounded-lg bg-purple-400/20 text-purple-400 text-xs font-medium">
              Monthly Master
            </div>
          )}
          {streak >= 100 && (
            <div className="px-2 py-1 rounded-lg bg-blue-400/20 text-blue-400 text-xs font-medium">
              Century Club
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};