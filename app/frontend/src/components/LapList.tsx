import React from 'react';
import { Lap } from '../types/timer';
import { formatLapTime } from '../utils/timeFormat';

interface LapListProps {
  laps: Lap[];
  onUndo?: (lapId: string) => void;
}

const lapLabels = {
  onset: 'Onset',
  peak: 'Peak',
  tail: 'Tail',
  'no-effect': 'No Effect',
  custom: 'Custom'
};

export const LapList: React.FC<LapListProps> = ({ laps, onUndo }) => {
  return (
    <div className="space-y-2">
      {laps.map((lap, index) => {
        const time = new Date(lap.timestamp);
        const timeString = time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        
        return (
          <div 
            key={lap.id}
            className="flex items-center justify-between px-4 py-3 bg-glass-tint/40 backdrop-blur-chip rounded-glass border border-glass-stroke/30"
          >            <div className="flex items-center gap-4">
              <span className="text-text-secondary/60 text-sm w-8">
                [{index + 1}]
              </span>
              <span className="text-text-primary font-medium">
                {lapLabels[lap.type]}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-text-primary font-mono">
                {formatLapTime(lap.elapsed)}
              </span>
              <span className="text-text-secondary/60 text-sm">
                {timeString}
              </span>
              {onUndo && (
                <button
                  onClick={() => onUndo(lap.id)}
                  className="text-text-secondary/40 hover:text-accent-alert transition-colors text-sm"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};