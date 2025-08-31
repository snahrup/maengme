import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lap } from '../types/timer';
import { formatTime } from '../utils/timeFormat';

interface LapListProps {
  laps: Lap[];
  onUndo?: (lapId: string) => void;
}

export const LapList: React.FC<LapListProps> = ({ laps, onUndo }) => {
  const sortedLaps = [...laps].sort((a, b) => b.timestamp - a.timestamp);
  
  // Format lap type for display
  const formatLapType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {sortedLaps.map((lap, index) => (
          <motion.div
            key={lap.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="relative group"
          >
            <div className="flex items-center justify-between p-3 bg-glass-5 backdrop-blur-sm border border-glass-10 rounded-glass">
              {/* Index and Type */}
              <div className="flex items-center gap-4">
                <span className="text-white/30 text-small w-8">
                  [{sortedLaps.length - index}]
                </span>
                <span className="text-white/90 text-body">
                  {formatLapType(lap.type)}
                </span>
              </div>
              
              {/* Time and Timestamp */}
              <div className="flex items-center gap-6">
                <span className="text-white text-body tabular-nums">
                  {formatTime(lap.elapsed)}
                </span>
                <span className="text-white/50 text-small">
                  {formatTimestamp(lap.timestamp)}
                </span>
                
                {/* Undo button */}
                {onUndo && (
                  <motion.button
                    onClick={() => onUndo(lap.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/30 hover:text-white/60"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};