import React from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertCircle, TrendingUp, Droplets, Moon } from 'lucide-react';
import { useSessionStore } from '../../stores/sessionStore';

interface Insight {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

export const InsightsPanel: React.FC = () => {
  const { sessions } = useSessionStore();

  // Generate dynamic insights based on session data
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];
    
    // Time-based insights
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      insights.push({
        icon: TrendingUp,
        title: 'Morning Session',
        description: 'Great time for energizing strains',
        color: 'text-yellow-400'
      });
    } else if (hour >= 20 || hour < 5) {
      insights.push({
        icon: Moon,
        title: 'Evening Wind-Down',
        description: 'Consider a relaxing red vein',
        color: 'text-indigo-400'
      });
    }

    // Hydration reminder
    const lastSession = sessions[sessions.length - 1];
    if (lastSession) {
      const hoursSinceLastSession = (Date.now() - new Date(lastSession.startTime).getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastSession < 4) {
        insights.push({
          icon: Droplets,
          title: 'Stay Hydrated',
          description: 'Remember to drink water between sessions',
          color: 'text-cyan-400'
        });
      }
    }

    // Pattern insights
    if (sessions.length > 5) {
      insights.push({
        icon: Brain,
        title: 'Building Patterns',
        description: `You've tracked ${sessions.length} sessions`,
        color: 'text-purple-400'
      });
    }

    // Default insight if none generated
    if (insights.length === 0) {
      insights.push({
        icon: AlertCircle,
        title: 'Track More Sessions',
        description: 'Build your pattern library',
        color: 'text-emerald-400'
      });
    }

    return insights.slice(0, 3); // Max 3 insights
  };

  const insights = generateInsights();

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
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <h3 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">
        Insights
      </h3>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className={`mt-1 ${insight.color}`}>
              <insight.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium text-sm">{insight.title}</h4>
              <p className="text-white/50 text-xs mt-1">{insight.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};