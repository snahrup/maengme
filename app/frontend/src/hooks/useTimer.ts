import { useState, useRef, useCallback, useEffect } from 'react';
import { TimerState } from '../types/timer';

interface UseTimerReturn {
  elapsed: number;
  state: TimerState;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

export function useTimer(): UseTimerReturn {
  const [elapsed, setElapsed] = useState(0);
  const [state, setState] = useState<TimerState>('idle');
  
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const rafRef = useRef<number>();
  
  const update = useCallback(() => {
    if (state === 'running') {
      const now = performance.now();
      setElapsed(Math.floor(now - startTimeRef.current + pausedTimeRef.current));
      rafRef.current = requestAnimationFrame(update);
    }
  }, [state]);
  const start = useCallback(() => {
    setState('running');
    startTimeRef.current = performance.now();
    pausedTimeRef.current = 0;
    setElapsed(0);
  }, []);
  
  const pause = useCallback(() => {
    if (state === 'running') {
      setState('paused');
      pausedTimeRef.current = elapsed;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  }, [state, elapsed]);
  
  const resume = useCallback(() => {
    if (state === 'paused') {
      setState('running');
      startTimeRef.current = performance.now();
    }
  }, [state]);
  
  const stop = useCallback(() => {
    setState('completed');
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);
  
  const reset = useCallback(() => {
    setState('idle');
    setElapsed(0);
    pausedTimeRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);
  useEffect(() => {
    if (state === 'running') {
      rafRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state, update]);
  
  return {
    elapsed,
    state,
    start,
    pause,
    resume,
    stop,
    reset
  };
}