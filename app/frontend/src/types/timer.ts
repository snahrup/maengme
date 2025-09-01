// Core timer types
export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export type LapType = 'onset' | 'peak' | 'tail' | 'no-effect' | 'custom' | 'hydration' | 'note';

export interface Lap {
  id: string;
  type: LapType;
  elapsed: number; // milliseconds
  timestamp: number; // Date.now()
  note?: string;
}

export interface Session {
  id: string;
  startTime: number;
  endTime?: number;
  totalElapsed: number;
  laps: Lap[];
  productPreset?: string;
  notes?: string;
  createdAt: number;
}

export interface PrimeWindow {
  type: LapType;
  median: number; // median time from history
  isActive: boolean; // within ±20% window
  confidence: number; // 0-1 based on sample size
}

export interface TimerConfig {
  enablePrimeHints: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  primeWindowThreshold: number; // default 0.2 (20%)
  minHistoryForPrime: number; // default 20
}