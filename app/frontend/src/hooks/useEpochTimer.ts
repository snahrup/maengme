import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerState } from '../types/timer';
import { toast } from 'react-hot-toast';

interface PauseResumePair {
  pausedAt: number;
  resumedAt?: number;
}

interface UseEpochTimerReturn {
  elapsed: number;
  state: TimerState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  epochStart: number | null;
  pauseHistory: PauseResumePair[];
}

export function useEpochTimer(): UseEpochTimerReturn {
  const [state, setState] = useState<TimerState>('idle');
  const [epochStart, setEpochStart] = useState<number | null>(null);
  const [pauseHistory, setPauseHistory] = useState<PauseResumePair[]>([]);
  const [elapsed, setElapsed] = useState(0);
  
  const rafRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const driftCheckRef = useRef<number>(0);
  
  // Calculate total paused duration
  const getPausedDuration = useCallback((): number => {
    return pauseHistory.reduce((total, pair) => {
      const pauseDuration = (pair.resumedAt || Date.now()) - pair.pausedAt;
      return total + pauseDuration;
    }, 0);
  }, [pauseHistory]);
  
  // Calculate elapsed time from epoch
  const calculateElapsed = useCallback((): number => {
    if (!epochStart) return 0;
    
    const now = Date.now();
    const totalElapsed = now - epochStart;
    const pausedDuration = getPausedDuration();
    
    return Math.max(0, totalElapsed - pausedDuration);
  }, [epochStart, getPausedDuration]);
  
  // Update loop with drift detection
  const update = useCallback(() => {
    if (state === 'running') {
      const now = performance.now();
      const newElapsed = calculateElapsed();
      
      // Drift detection - check every 5 seconds
      if (now - driftCheckRef.current > 5000) {
        driftCheckRef.current = now;
        
        // Compare with expected time based on last update
        const expectedDelta = now - lastUpdateRef.current;
        const actualDelta = newElapsed - elapsed;
        const drift = Math.abs(actualDelta - expectedDelta);
        
        // If drift > 1 second, we likely recovered from background
        if (drift > 1000 && lastUpdateRef.current > 0) {
          toast(`⏱️ Timer recovered from background (+${(drift / 1000).toFixed(1)}s)`, {
            duration: 3000,
            position: 'top-center',
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          });
        }
      }
      
      lastUpdateRef.current = now;
      setElapsed(newElapsed);
      rafRef.current = requestAnimationFrame(update);
    }
  }, [state, calculateElapsed, elapsed]);
  
  // Start the timer
  const start = useCallback(() => {
    const now = Date.now();
    setEpochStart(now);
    setPauseHistory([]);
    setState('running');
    lastUpdateRef.current = performance.now();
    driftCheckRef.current = performance.now();
  }, []);
  
  // Pause the timer
  const pause = useCallback(() => {
    if (state === 'running') {
      setState('paused');
      setPauseHistory(prev => [...prev, { pausedAt: Date.now() }]);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  }, [state]);
  
  // Resume the timer
  const resume = useCallback(() => {
    if (state === 'paused') {
      setState('running');
      setPauseHistory(prev => {
        const updated = [...prev];
        const lastPause = updated[updated.length - 1];
        if (lastPause && !lastPause.resumedAt) {
          lastPause.resumedAt = Date.now();
        }
        return updated;
      });
      lastUpdateRef.current = performance.now();
      driftCheckRef.current = performance.now();
    }
  }, [state]);
  
  // Stop the timer
  const stop = useCallback(() => {
    setState('completed');
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);
  
  // Reset the timer
  const reset = useCallback(() => {
    setState('idle');
    setEpochStart(null);
    setPauseHistory([]);
    setElapsed(0);
    lastUpdateRef.current = 0;
    driftCheckRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);
  
  // Start update loop when running
  useEffect(() => {
    if (state === 'running') {
      rafRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state, update]);
  
  // Persist timing data to localStorage for recovery
  useEffect(() => {
    if (epochStart && state !== 'idle') {
      const timingData = {
        epochStart,
        pauseHistory,
        state,
        lastSaved: Date.now()
      };
      localStorage.setItem('maengme_active_timing', JSON.stringify(timingData));
    } else if (state === 'idle') {
      localStorage.removeItem('maengme_active_timing');
    }
  }, [epochStart, pauseHistory, state]);
  
  // Check for recovery on mount
  useEffect(() => {
    const saved = localStorage.getItem('maengme_active_timing');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const timeSinceSave = Date.now() - data.lastSaved;
        
        // Only recover if less than 24 hours old
        if (timeSinceSave < 24 * 60 * 60 * 1000) {
          setEpochStart(data.epochStart);
          setPauseHistory(data.pauseHistory);
          setState(data.state === 'running' ? 'paused' : data.state);
          
          toast(`⏱️ Session recovered (paused after ${(timeSinceSave / 1000).toFixed(0)}s)`, {
            duration: 5000,
            position: 'top-center',
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          });
        }
      } catch (e) {
        console.error('Failed to recover timing data:', e);
      }
    }
  }, []);
  
  return {
    elapsed,
    state,
    start,
    pause,
    resume,
    stop,
    reset,
    epochStart,
    pauseHistory
  };
}
