import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Droplets } from 'lucide-react';
import { useSessionStore } from '../../stores/sessionStore';
import { formatDistanceToNow } from 'date-fns';

export const RecentActivity: React.FC = () => {
  const { sessions } = useSessionStore();
  
  // Get last 3 sessions
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 3);

  if (recentSessions.length === 0) {
    return (
      <motion.div
        className="rounded-2xl p-6 text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white/40 text-sm">No recent activity. Start your first session!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">
        Recent Activity
      </h3>
      
      <div className="space-y-3">
        {recentSessions.map((session, index) => {
          const duration = session.endTime 
            ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))
            : null;
          
          const peakIntensity = Math.max(...(session.intensityLogs?.map(log => log.value) || [0]));
          
          return (
            <motion.div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.03)'
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white font-medium text-sm">
                    {session.productName || 'Session'}
                  </h4>
                  <span className="text-white/30 text-xs">
                    {session.dose}g
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/50 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
                  </span>
                  {duration && (
                    <span>{duration}m</span>
                  )}
                  {peakIntensity > 0 && (
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {peakIntensity}/10
                    </span>
                  )}
                </div>
              </div>
              
              {/* Visual indicator */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(from 180deg, rgba(16, 185, 129, ${peakIntensity / 10}) 0deg, rgba(255, 255, 255, 0.05) 360deg)`
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{peakIntensity || '—'}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};