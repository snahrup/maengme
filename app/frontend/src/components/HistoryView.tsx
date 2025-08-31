import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { db } from '../store/database';
import { formatTime, formatLapTime } from '../utils/timeFormat';
import { Session } from '../types/timer';

interface HistoryViewProps {
  onClose: () => void;
  onSelectSession?: (session: Session) => void;
}

const lapLabels = {
  onset: 'Onset',
  peak: 'Peak', 
  tail: 'Tail',
  'no-effect': 'No Effect',
  custom: 'Custom'
};

export const HistoryView: React.FC<HistoryViewProps> = ({ onClose, onSelectSession }) => {
  const sessions = useLiveQuery(
    () => db.sessions.orderBy('createdAt').reverse().toArray()
  ) || [];
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-bg-start/95 backdrop-blur-lg z-50"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-glass-stroke/20">
          <h2 className="text-xl font-medium text-text-primary">History</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Done
          </button>
        </div>
        
        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {sessions.length === 0 ? (
            <div className="text-center text-text-secondary/60 mt-12">
              No sessions recorded yet
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => (
                <motion.div
                  key={session.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectSession?.(session)}                  className="bg-glass-tint/40 backdrop-blur-chip rounded-glass p-4 border border-glass-stroke/30 cursor-pointer hover:border-glass-stroke/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-text-primary font-medium">
                        {formatTime(session.totalElapsed)}
                      </div>
                      <div className="text-text-secondary/60 text-sm">
                        {formatDate(session.startTime)}
                        {session.productPreset && ` • ${session.productPreset}`}
                      </div>
                    </div>
                    <div className="text-text-secondary/40 text-sm">
                      {session.laps.length} laps
                    </div>
                  </div>
                  
                  {/* Lap summary */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {session.laps.slice(0, 4).map((lap, idx) => (
                      <div
                        key={idx}
                        className="text-xs px-2 py-1 bg-glass-tint/60 rounded-full text-text-secondary"
                      >
                        {lapLabels[lap.type]} {formatLapTime(lap.elapsed)}
                      </div>
                    ))}
                    {session.laps.length > 4 && (
                      <div className="text-xs px-2 py-1 text-text-secondary/40">
                        +{session.laps.length - 4} more
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};