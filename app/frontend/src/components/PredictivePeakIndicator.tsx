import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, Activity } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../store/database';

interface PredictivePeakIndicatorProps {
  currentTime: number; // Elapsed time in ms
  productId: string;
  expectedPeak?: number; // Default expected peak in minutes
  onPeakApproaching?: () => void;
  onPeakReached?: () => void;
}

interface PeakPrediction {
  predictedTime: number; // in ms
  confidence: number; // 0-1
  variance: number; // standard deviation in ms
  basedOnSessions: number;
}

export const PredictivePeakIndicator: React.FC<PredictivePeakIndicatorProps> = ({
  currentTime,
  productId,
  expectedPeak = 45,
  onPeakApproaching,
  onPeakReached
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasTriggeredApproaching, setHasTriggeredApproaching] = useState(false);
  const [hasTriggeredPeak, setHasTriggeredPeak] = useState(false);
  
  // Get historical sessions for this product
  const sessions = useLiveQuery(
    () => db.sessions
      .where('productName')
      .equals(productId)
      .reverse()
      .limit(10)
      .toArray(),
    [productId]
  ) || [];
  
  // Calculate peak prediction based on historical data
  const prediction = useMemo<PeakPrediction>(() => {
    if (sessions.length === 0) {
      // No history, use default
      return {
        predictedTime: expectedPeak * 60000,
        confidence: 0.3,
        variance: 10 * 60000, // 10 minutes variance
        basedOnSessions: 0
      };
    }
    
    // Extract peak times from lap data (look for peak-related laps)
    const peakTimes = sessions
      .map(session => {
        // Find laps that might indicate peak
        const peakLap = session.laps?.find(lap => 
          lap.type === 'peak' || 
          lap.note?.toLowerCase().includes('peak') ||
          lap.note?.toLowerCase().includes('strong')
        );
        
        if (peakLap) {
          return peakLap.elapsed;
        }
        
        // Fallback: estimate based on session duration
        // Assume peak is around 40% of total duration
        return session.duration * 0.4;
      })
      .filter(time => time > 0);
    
    if (peakTimes.length === 0) {
      return {
        predictedTime: expectedPeak * 60000,
        confidence: 0.3,
        variance: 10 * 60000,
        basedOnSessions: sessions.length
      };
    }
    
    // Calculate average and variance
    const avgPeak = peakTimes.reduce((a, b) => a + b, 0) / peakTimes.length;
    const variance = Math.sqrt(
      peakTimes.reduce((sum, time) => sum + Math.pow(time - avgPeak, 2), 0) / peakTimes.length
    );
    
    // Confidence based on number of sessions and consistency
    const sessionConfidence = Math.min(1, sessions.length / 5); // Max confidence at 5+ sessions
    const consistencyConfidence = Math.max(0, 1 - (variance / avgPeak)); // Lower variance = higher confidence
    const confidence = (sessionConfidence + consistencyConfidence) / 2;
    
    return {
      predictedTime: avgPeak,
      confidence,
      variance,
      basedOnSessions: sessions.length
    };
  }, [sessions, expectedPeak]);
  
  // Calculate progress and time remaining
  const progress = Math.min(1, currentTime / prediction.predictedTime);
  const timeRemaining = Math.max(0, prediction.predictedTime - currentTime);
  const minutesRemaining = Math.floor(timeRemaining / 60000);
  const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000);
  
  // Trigger callbacks
  useEffect(() => {
    if (progress >= 0.8 && !hasTriggeredApproaching) {
      setHasTriggeredApproaching(true);
      onPeakApproaching?.();
    }
    
    if (progress >= 0.95 && !hasTriggeredPeak) {
      setHasTriggeredPeak(true);
      setShowCelebration(true);
      onPeakReached?.();
      
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [progress, hasTriggeredApproaching, hasTriggeredPeak, onPeakApproaching, onPeakReached]);
  
  // Determine indicator color based on proximity to peak
  const getIndicatorColor = () => {
    if (progress < 0.5) return '#60A5FA'; // Blue - early
    if (progress < 0.8) return '#FCD34D'; // Yellow - approaching
    if (progress < 0.95) return '#FBBF24'; // Orange - very close
    return '#34D399'; // Green - at peak
  };
  
  const getGlowIntensity = () => {
    if (progress < 0.5) return 0.2;
    if (progress < 0.8) return 0.4;
    if (progress < 0.95) return 0.6;
    return 0.8;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="relative">
        {/* Main circular indicator */}
        <div className="relative w-32 h-32">
          {/* Background ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
              fill="none"
            />
            {/* Progress ring */}
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              stroke={getIndicatorColor()}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={364}
              initial={{ strokeDashoffset: 364 }}
              animate={{ strokeDashoffset: 364 - (364 * progress) }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 ${10 * getGlowIntensity()}px ${getIndicatorColor()})`
              }}
            />
            {/* Variance indicator (confidence interval) */}
            {prediction.confidence > 0.5 && (
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke={getIndicatorColor()}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * Math.min(1, (currentTime + prediction.variance) / prediction.predictedTime))}
                opacity={0.3}
              />
            )}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {progress < 0.95 ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-6 h-6 text-white/60 mb-1" />
                </motion.div>
                <div className="text-white text-lg font-mono font-bold">
                  {minutesRemaining}:{secondsRemaining.toString().padStart(2, '0')}
                </div>
                <div className="text-white/40 text-xs">to peak</div>
              </>
            ) : (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Zap className="w-8 h-8 text-green-400" />
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Confidence indicator */}
        {prediction.basedOnSessions > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1"
          >
            <Activity className="w-3 h-3 text-white/40" />
            <span className="text-white/40 text-xs">
              {Math.round(prediction.confidence * 100)}% confidence
            </span>
          </motion.div>
        )}
        
        {/* Learning mode indicator */}
        {prediction.basedOnSessions < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30"
          >
            <span className="text-yellow-400 text-xs">Learning your pattern</span>
          </motion.div>
        )}
        
        {/* Celebration animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="relative">
                {/* Burst effect */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full"
                    initial={{ x: 0, y: 0 }}
                    animate={{
                      x: Math.cos((i / 8) * Math.PI * 2) * 100,
                      y: Math.sin((i / 8) * Math.PI * 2) * 100,
                      opacity: 0
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                ))}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                  className="text-4xl"
                >
                  ✨
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};