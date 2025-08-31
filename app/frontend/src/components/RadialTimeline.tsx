import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { Lap } from '../types/timer';

interface RadialTimelineProps {
  elapsed: number;
  laps: Lap[];
  maxTime?: number;
}

export const RadialTimeline: React.FC<RadialTimelineProps> = ({ 
  elapsed, 
  laps,
  maxTime = 300000 // 5 minutes default
}) => {
  const radius = 120;
  const strokeWidth = 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate progress
  const progress = Math.min(elapsed / maxTime, 1);
  const strokeDashoffset = circumference - (progress * circumference);
  
  // Calculate lap positions
  const lapAngles = laps.map(lap => ({
    angle: (lap.elapsed / maxTime) * 360 - 90,
    type: lap.type
  }));
  
  return (
    <div className="relative w-72 h-72 mx-auto">
      {/* Logo in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Logo size={96} animate={true} />
      </div>
      
      {/* SVG Ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 300 300"
      >
        {/* Background ring */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress ring */}
        <motion.circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.1, ease: "linear" }}
          style={{
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
          }}
        />
        
        {/* Lap markers */}
        {lapAngles.map((lap, index) => (
          <g key={index} transform={`rotate(${lap.angle} 150 150)`}>
            <circle
              cx="150"
              cy="30"
              r="4"
              fill="rgba(255, 255, 255, 0.8)"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
              }}
            />
            <circle
              cx="150"
              cy="30"
              r="6"
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
            />
          </g>
        ))}
        
        {/* Current position indicator */}
        <g transform={`rotate(${(progress * 360) - 90} 150 150)`}>
          <circle
            cx="150"
            cy="30"
            r="6"
            fill="rgba(255, 255, 255, 1)"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))'
            }}
          />
        </g>
      </svg>
      
      {/* Title below */}
      <div className="absolute -bottom-8 left-0 right-0 text-center">
        <p className="text-white/70 text-small">Radial Session Timeline</p>
      </div>
    </div>
  );
};