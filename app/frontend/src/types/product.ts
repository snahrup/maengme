export interface Product {
  id: string;
  manufacturer: string;
  name: string;
  vein: 'red' | 'green' | 'white' | 'yellow' | 'mixed' | '';
  strain: string;
  ingestion: 'powder' | 'capsule' | 'extract' | 'tea' | 'tincture';
  image?: string;
  
  // Alkaloid profile (if known)
  mitragynine?: number; // percentage
  hydroxymitragynine?: number; // percentage
  
  // Timing expectations (in minutes)
  expectedOnset?: number;
  expectedPeak?: number;
  expectedDuration?: number;
  
  // User-specific data
  commonDoses?: {
    threshold: number;
    light: number;
    moderate: number;
    strong: number;
  };
  
  description?: string;
  effects?: string[];
  warnings?: string[];
}

export interface ProductPreset {
  id: string;
  productId: string;
  product?: Product;
  dose: number;
  doseUnit: 'g' | 'mg' | 'capsules' | 'ml';
  method: 'toss-wash' | 'tea' | 'capsule' | 'mixed' | 'other';
  notes?: string;
  lastUsed?: Date;
  useCount?: number;
  averageRating?: number;
}

export interface Session {
  id: string;
  presetId?: string;
  preset?: ProductPreset;
  startTime: Date;
  endTime?: Date;
  laps: SessionLap[];
  rating?: number;
  notes?: string;
  
  // Tracked metrics
  peakIntensity?: number; // 1-10
  duration?: number;
  sideEffects?: string[];
}

export interface SessionLap {
  id: string;
  elapsed: number;
  type: 'onset' | 'peak' | 'tail' | 'no-effect' | 'custom';
  notes?: string;
  intensity?: number; // 1-10
}
