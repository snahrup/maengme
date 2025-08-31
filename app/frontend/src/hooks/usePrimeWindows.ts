import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../store/database';
import { Session, LapType, PrimeWindow } from '../types/timer';

interface PrimeStats {
  onset: number[];
  peak: number[];
  tail: number[];
  'no-effect': number[];
}

/**
 * Calculate median of an array of numbers
 */
function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Hook to calculate prime windows from session history
 */
export function usePrimeWindows(currentElapsed: number, minSessions = 20): PrimeWindow[] {
  // Get last N sessions from database
  const sessions = useLiveQuery(
    () => db.sessions.orderBy('createdAt').reverse().limit(50).toArray(),
    []
  ) || [];
  // Collect lap times by type
  const stats: PrimeStats = {
    onset: [],
    peak: [],
    tail: [],
    'no-effect': []
  };
  
  sessions.forEach(session => {
    session.laps.forEach(lap => {
      if (lap.type !== 'custom') {
        stats[lap.type].push(lap.elapsed);
      }
    });
  });
  
  // Calculate prime windows
  const windows: PrimeWindow[] = [];
  const threshold = 0.2; // ±20% window
  
  (['onset', 'peak', 'tail', 'no-effect'] as LapType[]).forEach(type => {
    if (type === 'custom') return;
    
    const times = stats[type];
    if (times.length >= minSessions) {
      const median = calculateMedian(times);
      const isActive = Math.abs(currentElapsed - median) <= median * threshold;
      
      windows.push({
        type,
        median,
        isActive,
        confidence: Math.min(times.length / minSessions, 1)
      });
    }
  });
  
  return windows.sort((a, b) => a.median - b.median);
}