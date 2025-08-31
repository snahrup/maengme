import React from 'react';
import { formatTime } from '../utils/timeFormat';

interface TimerDisplayProps {
  elapsed: number;
  label?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ elapsed, label }) => {
  const timeString = formatTime(elapsed);
  const [main, sub] = timeString.includes(':') 
    ? timeString.split('.')
    : [timeString, ''];
  
  return (
    <div className="relative">
      {label && (
        <div className="text-text-secondary text-sm mb-2">{label}</div>
      )}
      
      {/* Glass background panel */}
      <div className="relative bg-glass-tint backdrop-blur-panel rounded-glass-xl px-8 py-6 shadow-glass border border-glass-stroke">
        <div className="flex items-baseline justify-center">
          <span className="text-6xl md:text-7xl font-light text-text-primary tracking-tight font-mono">
            {main}
          </span>
          {sub && (
            <span className="text-4xl md:text-5xl font-light text-text-primary/80 ml-1">
              .{sub}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};