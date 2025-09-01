import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';

interface InteractiveTimerProps {
  elapsed: number;
  state: 'stopped' | 'running' | 'paused';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onLogIntensity: (intensity: number) => void;
  onLogDetail?: () => void;
  className?: string;
  phaseInfo?: {
    current: 'pre-onset' | 'onset' | 'peak' | 'tail' | 'after';
    progress: number; // 0-1 for current phase
    times: {
      onset: number;
      peak: number;
      tail: number;
    };
  };
}

export const InteractiveTimer: React.FC<InteractiveTimerProps> = ({
  elapsed,
  state,
  onStart,
  onPause,
  onResume,
  onStop,
  onLogIntensity,
  onLogDetail,
  className = '',
  phaseInfo
}) => {
  const [showRadial, setShowRadial] = useState(false);
  const [intensity, setIntensity] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>();
  const tapStartTime = useRef<number>(0);
  
  // Format time display
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle timer tap for logging
  const handleTimerTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (state !== 'running') return;
    
    tapStartTime.current = Date.now();
    
    // Set up long press detection (500ms)
    longPressTimer.current = setTimeout(() => {
      if (onLogDetail) {
        onLogDetail();
        setShowRadial(false);
      }
    }, 500);
    
    e.preventDefault();
  }, [state, onLogDetail]);
  
  const handleTimerTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    const tapDuration = Date.now() - tapStartTime.current;
    
    // Short tap - show radial intensity slider
    if (tapDuration < 500 && state === 'running') {
      setShowRadial(true);
      e.preventDefault();
    }
  }, [state]);
  
  // Handle radial slider interaction
  const handleRadialMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!showRadial || !timerRef.current) return;
    
    const rect = timerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const angle = Math.atan2(dy, dx);
    const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
    const newIntensity = Math.round(normalizedAngle * 10);
    
    setIntensity(Math.max(1, Math.min(10, newIntensity)));
    setIsDragging(true);
  }, [showRadial]);
  
  const handleRadialEnd = useCallback(() => {
    if (showRadial && isDragging) {
      onLogIntensity(intensity);
      setShowRadial(false);
      setIsDragging(false);
    }
  }, [showRadial, isDragging, intensity, onLogIntensity]);
  
  // Dismiss radial on outside tap
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (showRadial && timerRef.current && !timerRef.current.contains(e.target as Node)) {
        setShowRadial(false);
        setIsDragging(false);
      }
    };
    
    if (showRadial) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showRadial]);
  
  // Calculate phase ring segments
  const getPhaseSegments = () => {
    if (!phaseInfo) return null;
    
    const { current, progress, times } = phaseInfo;
    const totalDuration = times.tail;
    
    const onsetEnd = (times.onset / totalDuration) * 360;
    const peakEnd = (times.peak / totalDuration) * 360;
    
    return {
      onset: { start: 0, end: onsetEnd },
      peak: { start: onsetEnd, end: peakEnd },
      tail: { start: peakEnd, end: 360 }
    };
  };
  
  const phaseSegments = getPhaseSegments();
  
  return (
    <div className={`relative ${className}`}>
      {/* Phase Ring */}
      {phaseSegments && (
        <svg 
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 200 200"
        >
          {/* Onset segment */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
            strokeDasharray={`${phaseSegments.onset.end * (2 * Math.PI * 95) / 360} ${2 * Math.PI * 95}`}
            className={phaseInfo?.current === 'onset' ? 'animate-pulse' : ''}
          />
          
          {/* Peak segment */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke="rgba(168, 85, 247, 0.4)"
            strokeWidth="2"
            strokeDasharray={`${(phaseSegments.peak.end - phaseSegments.peak.start) * (2 * Math.PI * 95) / 360} ${2 * Math.PI * 95}`}
            strokeDashoffset={`${-phaseSegments.peak.start * (2 * Math.PI * 95) / 360}`}
            className={phaseInfo?.current === 'peak' ? 'animate-pulse' : ''}
          />
          
          {/* Tail segment */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke="rgba(34, 197, 94, 0.3)"
            strokeWidth="2"
            strokeDasharray={`${(360 - phaseSegments.tail.start) * (2 * Math.PI * 95) / 360} ${2 * Math.PI * 95}`}
            strokeDashoffset={`${-phaseSegments.tail.start * (2 * Math.PI * 95) / 360}`}
            className={phaseInfo?.current === 'tail' ? 'animate-pulse' : ''}
          />
          
          {/* Current position indicator */}
          {phaseInfo && (
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="4"
              strokeDasharray="2 8"
              strokeDashoffset={`${-(elapsed / phaseInfo.times.tail) * 2 * Math.PI * 95}`}
              className="animate-spin-slow"
            />
          )}
        </svg>
      )}
      
      {/* Timer Display */}
      <motion.div
        ref={timerRef}
        className="relative z-10 select-none cursor-pointer"
        onTouchStart={handleTimerTouchStart}
        onTouchEnd={handleTimerTouchEnd}
        onMouseDown={handleTimerTouchStart}
        onMouseUp={handleTimerTouchEnd}
        whileTap={{ scale: 0.98 }}
      >
        <div className="text-center p-12">
          <div className="text-7xl font-display font-extralight text-white tabular-nums tracking-tight">
            {formatTime(elapsed)}
          </div>
          
          {/* Small hint text */}
          {state === 'running' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="text-xs text-white/60 mt-2"
            >
              Tap to log • Hold for details
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Radial Intensity Slider */}
      <AnimatePresence>
        {showRadial && (
          <motion.div
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchMove={handleRadialMove}
            onTouchEnd={handleRadialEnd}
            onMouseMove={handleRadialMove}
            onMouseUp={handleRadialEnd}
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {/* Intensity segments */}
              {[...Array(10)].map((_, i) => {
                const angle = (i * 36) - 90;
                const isActive = i < intensity;
                const color = i < 3 ? 'rgb(34, 197, 94)' : 
                             i < 7 ? 'rgb(251, 191, 36)' : 
                             'rgb(239, 68, 68)';
                
                return (
                  <g key={i}>
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke={isActive ? color : 'rgba(255, 255, 255, 0.1)'}
                      strokeWidth="20"
                      strokeDasharray={`${30 * Math.PI * 80 / 180} ${2 * Math.PI * 80}`}
                      strokeDashoffset={`${-i * 36 * Math.PI * 80 / 180}`}
                      opacity={isActive ? 0.8 : 0.3}
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}
              
              {/* Center intensity number */}
              <text
                x="100"
                y="100"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-5xl font-bold fill-white"
              >
                {intensity}
              </text>
              
              <text
                x="100"
                y="125"
                textAnchor="middle"
                className="text-xs fill-white/60"
              >
                Intensity
              </text>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        {state === 'stopped' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
          >
            <Play className="w-6 h-6 text-white" />
          </motion.button>
        )}
        
        {state === 'running' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
          >
            <Pause className="w-6 h-6 text-white" />
          </motion.button>
        )}
        
        {state === 'paused' && (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onResume}
              className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            >
              <Play className="w-6 h-6 text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onStop}
              className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            >
              <Square className="w-6 h-6 text-white" />
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
};
