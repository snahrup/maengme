// Session Analytics Types for collecting real timing data

export interface SessionDataPoint {
  sessionId: string;
  productId: string;
  timestamp: number;
  eventType: 'session_start' | 'lap' | 'phase_change' | 'session_end' | 'effect_noted';
  metadata?: {
    phase?: 'pre-onset' | 'onset' | 'peak' | 'tail';
    effectStrength?: number; // 1-10 scale
    notes?: string;
    doseAmount?: number;
    doseUnit?: 'grams' | 'capsules';
    lastMeal?: number; // minutes since last meal
    tolerance?: 'none' | 'low' | 'moderate' | 'high';
  };
}

export interface ProductTimingData {
  productId: string;
  sessions: SessionDataPoint[][];
  aggregatedStats: {
    averageOnset: number;
    onsetStdDev: number;
    averagePeak: number;
    peakStdDev: number;
    averageDuration: number;
    durationStdDev: number;
    sampleSize: number;
    lastUpdated: number;
  };
}

export interface UserProfile {
  userId: string;
  metabolismRate: 'slow' | 'normal' | 'fast';
  toleranceLevel: 'none' | 'low' | 'moderate' | 'high';
  preferredDoseRange: {
    min: number;
    max: number;
    unit: 'grams' | 'capsules';
  };
  sessionHistory: SessionDataPoint[][];
  createdAt: number;
  lastSessionAt: number;
}

export interface EffectMarker {
  timestamp: number;
  phase: 'pre-onset' | 'onset' | 'peak' | 'tail';
  strength: number; // 1-10
  effects: string[];
  notes?: string;
}
