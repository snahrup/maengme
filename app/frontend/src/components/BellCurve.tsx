import React from 'react';
import { motion } from 'framer-motion';
import { Lap } from '../types/timer';

interface BellCurveProps {
  elapsed: number;
  laps: Lap[];
  expectedOnset?: number;  // Expected times in ms
  expectedPeak?: number;
  expectedTail?: number;
}

export const BellCurve: React.FC<BellCurveProps> = ({ 
  elapsed, 
  laps,
  expectedOnset = 600000,   // 10 min default
  expectedPeak = 2700000,   // 45 min default  
  expectedTail = 5400000    // 90 min default
}) => {
  const maxTime = expectedTail * 1.2; // Add some buffer
  const currentPosition = (elapsed / maxTime) * 100;
  
  // Find actual lap times
  const actualOnset = laps.find(l => l.type === 'onset')?.elapsed;
  const actualPeak = laps.find(l => l.type === 'peak')?.elapsed;
  const actualTail = laps.find(l => l.type === 'tail')?.elapsed;
  
  // Calculate positions as percentages
  const onsetPos = (expectedOnset / maxTime) * 100;
  const peakPos = (expectedPeak / maxTime) * 100;
  const tailPos = (expectedTail / maxTime) * 100;
  
  // Bell curve path - using quadratic bezier curves
  const curvePath = `
    M 0,90
    Q ${onsetPos/2},85 ${onsetPos},70
    Q ${(onsetPos + peakPos)/2},20 ${peakPos},10
    Q ${(peakPos + tailPos)/2},20 ${tailPos},70
    Q ${(tailPos + 100)/2},85 100,90
  `;
  
  return (
    <div className="relative w-full h-48 mb-4">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Bell curve gradient fill */}
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(74, 222, 128, 0.3)" />
            <stop offset="100%" stopColor="rgba(74, 222, 128, 0)" />
          </linearGradient>
        </defs>
        
        {/* Bell curve */}
        <path
          d={curvePath}
          fill="none"
          stroke="rgba(74, 222, 128, 0.8)"
          strokeWidth="2"
        />
        
        {/* Fill under curve up to current position */}
        <clipPath id="progressClip">
          <rect x="0" y="0" width={currentPosition} height="100" />
        </clipPath>
        
        <path
          d={curvePath + ' L 100,100 L 0,100 Z'}
          fill="url(#curveGradient)"
          clipPath="url(#progressClip)"
        />        
        {/* Markers for expected times */}
        <line x1={onsetPos} y1="0" x2={onsetPos} y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2,2" />
        <line x1={peakPos} y1="0" x2={peakPos} y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2,2" />
        <line x1={tailPos} y1="0" x2={tailPos} y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Actual lap markers */}
        {actualOnset && (
          <circle cx={(actualOnset / maxTime) * 100} cy="70" r="3" fill="rgba(74, 222, 128, 1)" />
        )}
        {actualPeak && (
          <circle cx={(actualPeak / maxTime) * 100} cy="10" r="3" fill="rgba(29, 161, 255, 1)" />
        )}
        {actualTail && (
          <circle cx={(actualTail / maxTime) * 100} cy="70" r="3" fill="rgba(255, 184, 0, 1)" />
        )}
        
        {/* Current position indicator */}
        <motion.line
          x1={currentPosition}
          y1="0"
          x2={currentPosition}
          y2="100"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="2"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Current position dot on curve */}
        <motion.circle
          cx={currentPosition}
          cy={getCurrentY(currentPosition, onsetPos, peakPos, tailPos)}
          r="4"
          fill="rgba(255,255,255,1)"
          animate={{
            filter: [
              'drop-shadow(0 0 4px rgba(255,255,255,0.5))',
              'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
              'drop-shadow(0 0 4px rgba(255,255,255,0.5))'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
      
      {/* Labels */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          {/* Onset label */}
          <div 
            className="absolute text-white/70 text-tiny"
            style={{ left: `${onsetPos}%`, bottom: '20%', transform: 'translateX(-50%)' }}
          >
            Onset
          </div>
          
          {/* Peak label */}
          <div 
            className="absolute text-white/70 text-tiny"
            style={{ left: `${peakPos}%`, top: '20%', transform: 'translateX(-50%)' }}
          >
            Peak
          </div>
          
          {/* Tail label */}
          <div 
            className="absolute text-white/70 text-tiny"
            style={{ left: `${tailPos}%`, bottom: '20%', transform: 'translateX(-50%)' }}
          >
            Tail
          </div>
        </div>
      </div>
      
      {/* Title */}
      <div className="text-center mt-4">
        <p className="text-white/70 text-small">Session Curve</p>
      </div>
    </div>
  );
};

// Helper function to calculate Y position on curve
function getCurrentY(x: number, onsetPos: number, peakPos: number, tailPos: number): number {
  if (x <= onsetPos) {
    // Rising to onset
    return 90 - (20 * (x / onsetPos));
  } else if (x <= peakPos) {
    // Rising to peak
    const progress = (x - onsetPos) / (peakPos - onsetPos);
    return 70 - (60 * progress);
  } else if (x <= tailPos) {
    // Falling to tail
    const progress = (x - peakPos) / (tailPos - peakPos);
    return 10 + (60 * progress);
  } else {
    // After tail
    const progress = Math.min((x - tailPos) / (100 - tailPos), 1);
    return 70 + (20 * progress);
  }
}