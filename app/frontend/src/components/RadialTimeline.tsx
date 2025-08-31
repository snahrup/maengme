import React from 'react';
import { Lap } from '../types/timer';
import { motion } from 'framer-motion';

interface RadialTimelineProps {
  elapsed: number;
  maxTime?: number; // Default to 60 minutes
  laps: Lap[];
  nextPrime?: { type: string; timeRemaining: number; median: number };
}

const lapColors = {
  onset: '#34C759',
  peak: '#1DA1FF', 
  tail: '#A8C6FF',
  'no-effect': '#C8D0E0',
  custom: '#F5F7FB'
};

export const RadialTimeline: React.FC<RadialTimelineProps> = ({
  elapsed,
  maxTime = 3600000, // 60 minutes default
  laps,
  nextPrime
}) => {
  const radius = 120;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(elapsed / maxTime, 1);
  const strokeDashoffset = circumference - (progress * circumference);
  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 256 256"
      >
        {/* Background circle */}
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle with glow */}
        <motion.circle
          cx="128"
          cy="128"
          r={radius}
          stroke="url(#radialGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.1, ease: "linear" }}
          filter="url(#glow)"
        />
        {/* Lap segments */}
        {laps.map((lap, index) => {
          const lapProgress = lap.elapsed / maxTime;
          const lapAngle = lapProgress * 360;
          const x = 128 + radius * Math.cos((lapAngle - 90) * Math.PI / 180);
          const y = 128 + radius * Math.sin((lapAngle - 90) * Math.PI / 180);
          
          return (
            <circle
              key={lap.id}
              cx={x}
              cy={y}
              r="4"
              fill={lapColors[lap.type]}
              className="drop-shadow-lg"
            />
          );
        })}
        
        {/* SVG Definitions */}
        <defs>
          <linearGradient id="radialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1DA1FF" stopOpacity="1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {/* Center content - Prime hint */}
      {nextPrime && (
        <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-0">
          <div className="text-text-secondary text-sm">Next: {nextPrime.type}</div>
          <div className="text-3xl font-light text-text-primary">
            -{Math.floor(nextPrime.timeRemaining / 1000)}:{Math.floor(nextPrime.timeRemaining % 1000 / 10).toString().padStart(2, '0')}
          </div>
          <div className="text-text-secondary/60 text-xs mt-1">
            on track - median {Math.floor(nextPrime.median / 60000)}:{Math.floor(nextPrime.median % 60000 / 1000).toString().padStart(2, '0')}
          </div>
        </div>
      )}
    </div>
  );
};