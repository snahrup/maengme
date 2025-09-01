import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Home,
  TrendingUp,
  Brain,
  Activity,
  Zap,
  ChevronUp,
  Clock,
  Sparkles,
  Plus
} from 'lucide-react';
import { BellCurve } from './BellCurve';
import { TimerDisplay } from './TimerDisplay';
import { LapChip } from './LapChip';
import { LapList } from './LapList';
import { EffectTracker } from './EffectTracker';
import { ProductPreset } from '../types/product';
import { Lap, LapType } from '../types/timer';
import { sessionAnalytics } from '../services/sessionAnalytics';

interface ActiveSessionProps {
  preset: ProductPreset;
  elapsed: number;
  state: 'stopped' | 'running' | 'paused';
  laps: Lap[];
  onStart: () => void;
  onPause: () => void;  onResume: () => void;
  onEnd: () => void;
  onLap: (type?: LapType, notes?: string) => void;
  onUndo: () => void;
  onHome: () => void;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({
  preset,
  elapsed,
  state,
  laps,
  onStart,
  onPause,
  onResume,
  onEnd,
  onLap,
  onUndo,
  onHome
}) => {
  const [showInsights, setShowInsights] = useState(false);
  const [showEffectTracker, setShowEffectTracker] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'pre-onset' | 'onset' | 'peak' | 'tail' | 'after'>('pre-onset');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [metabolismRate, setMetabolismRate] = useState(0);
  const [nextPhaseTime, setNextPhaseTime] = useState<number | null>(null);

  // Start analytics session when timer starts
  useEffect(() => {
    if (state === 'running' && elapsed === 0 && preset.product) {
      sessionAnalytics.startSession(
        preset.product.id || '',
        preset.dose,
        preset.product.ingestion === 'capsule' ? 'capsules' : 'grams'
      );
    }
  }, [state, elapsed, preset]);

  // End analytics session when timer stops
  useEffect(() => {
    if (state === 'stopped' && elapsed > 0) {
      sessionAnalytics.endSession();
    }
  }, [state, elapsed]);

  // Log laps to analytics
  const handleLap = (type?: LapType, notes?: string) => {
    onLap(type, notes);
    if (state === 'running') {
      sessionAnalytics.logLap(notes);
    }
  };
  
  // Calculate current phase and progress
  useEffect(() => {
    const elapsedMin = elapsed / 60000;
    const { product } = preset;
    
    if (!product) return;
    
    const onset = product.expectedOnset || 10;
    const peak = product.expectedPeak || 45;
    const duration = product.expectedDuration || 120;
    
    if (elapsedMin < onset) {
      setCurrentPhase('pre-onset');
      setPhaseProgress((elapsedMin / onset) * 100);
      setNextPhaseTime(onset - elapsedMin);
    } else if (elapsedMin < peak) {
      setCurrentPhase('onset');
      setPhaseProgress(((elapsedMin - onset) / (peak - onset)) * 100);
      setNextPhaseTime(peak - elapsedMin);
    } else if (elapsedMin < duration) {
      setCurrentPhase('peak');
      setPhaseProgress(((elapsedMin - peak) / (duration - peak)) * 100);
      setNextPhaseTime(duration - elapsedMin);
    } else {
      setCurrentPhase('after');
      setPhaseProgress(100);
      setNextPhaseTime(null);
    }
    
    // Simulate metabolism rate
    const rate = Math.sin((elapsedMin / duration) * Math.PI) * 100;
    setMetabolismRate(Math.max(0, rate));
  }, [elapsed, preset]);
