import React from 'react';
import { motion } from 'framer-motion';
import { Session } from '../types/timer';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface AchievementsProps {
  sessions: Session[];
}

export const Achievements: React.FC<AchievementsProps> = ({ sessions }) => {
  const achievements: Achievement[] = [
    {
      id: 'first-session',
      name: 'First Steps',
      description: 'Complete your first session',
      icon: '🎯',
      unlocked: sessions.length >= 1,
      progress: Math.min(sessions.length, 1),
      target: 1
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Track 7 days in a row',
      icon: '📅',
      unlocked: false, // Calculate streak logic
      progress: 0,
      target: 7
    },
    {
      id: 'century',
      name: 'Century',
      description: 'Complete 100 sessions',
      icon: '💯',
      unlocked: sessions.length >= 100,
      progress: sessions.length,
      target: 100
    },
    {
      id: 'data-master',
      name: 'Data Master',
      description: 'Log 500 total laps',
      icon: '📊',
      unlocked: sessions.reduce((acc, s) => acc + s.laps.length, 0) >= 500,
      progress: sessions.reduce((acc, s) => acc + s.laps.length, 0),
      target: 500
    },
    {
      id: 'consistency',
      name: 'Consistency King',
      description: '30 day streak',
      icon: '👑',
      unlocked: false,
      progress: 0,
      target: 30
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Start 10 sessions before 9 AM',
      icon: '🌅',
      unlocked: sessions.filter(s => new Date(s.startTime).getHours() < 9).length >= 10,
      progress: sessions.filter(s => new Date(s.startTime).getHours() < 9).length,
      target: 10
    }
  ];  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-text-primary text-lg">Achievements</h3>
        <span className="text-text-secondary/60 text-sm">
          {unlockedCount}/{achievements.length} Unlocked
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              relative p-3 rounded-glass border backdrop-blur-chip
              ${achievement.unlocked 
                ? 'bg-gradient-to-br from-accent-primary/20 to-accent-success/10 border-accent-primary/30' 
                : 'bg-glass-tint/20 border-glass-stroke/20'
              }
            `}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-2">
              <div className={`text-2xl ${!achievement.unlocked && 'opacity-30 grayscale'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${achievement.unlocked ? 'text-text-primary' : 'text-text-secondary/40'}`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-text-secondary/40 mt-0.5">
                  {achievement.description}
                </div>
                
                {achievement.target && (
                  <div className="mt-2">
                    <div className="h-1 bg-glass-tint/40 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-accent-primary to-accent-success"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((achievement.progress || 0) / achievement.target * 100, 100)}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      />
                    </div>
                    <div className="text-xs text-text-secondary/40 mt-0.5">
                      {achievement.progress}/{achievement.target}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {achievement.unlocked && (
              <motion.div 
                className="absolute top-1 right-1"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: index * 0.05 + 0.3 }}
              >
                <span className="text-xs">✓</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};