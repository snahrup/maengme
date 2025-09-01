import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Play, Pause, Square, Home, TrendingUp, Brain, Activity, Zap,
  ChevronUp, Clock, Sparkles, Trophy, Users, Flame, Star,
  Target, Award, Hash, TrendingDown, Heart, Volume2
} from 'lucide-react';
import { BellCurve } from './BellCurve';
import { TimerDisplay } from './TimerDisplay';
import { LapChip } from './LapChip';
import { LapList } from './LapList';
import { ProductPreset } from '../types/product';
import { Lap, LapType } from '../types/timer';

interface ActiveSessionProps {
  preset: ProductPreset;
  elapsed: number;
  state: 'stopped' | 'running' | 'paused';
  laps: Lap[];
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  onLap: (type: LapType) => void;
  onUndo: (lapId: string) => void;
  onHome: () => void;
}

// Simulated real-time data (would come from server)
const LIVE_USERS = Math.floor(Math.random() * 500) + 200;
const STREAK_DAYS = 7;
const USER_XP = 2450;
const NEXT_LEVEL_XP = 3000;

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const achievements: Achievement[] = [
  { id: '1', title: 'First Timer', description: 'Complete your first session', icon: Trophy, unlocked: true },
  { id: '2', title: 'Week Warrior', description: '7 day streak', icon: Flame, unlocked: true },
  { id: '3', title: 'Precision Master', description: 'Log all phases within 2min of prediction', icon: Target, unlocked: false, progress: 3, maxProgress: 5 },
  { id: '4', title: 'Data Scientist', description: 'Track 50 sessions', icon: Brain, unlocked: false, progress: 23, maxProgress: 50 },
];

export const ActiveSessionEnhanced: React.FC<ActiveSessionProps> = ({
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
  const [currentPhase, setCurrentPhase] = useState<'pre-onset' | 'onset' | 'peak' | 'tail' | 'after'>('pre-onset');
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [showCommunity, setShowCommunity] = useState(true);
  const [userLevel, setUserLevel] = useState(Math.floor(USER_XP / 500));
  const [predictedNextPhase, setPredictedNextPhase] = useState<string>('');
  const controls = useAnimation();

  // Phase detection
  useEffect(() => {
    const minutes = elapsed / 60000;
    const expectedOnset = preset.expectedOnset || 10;
    const expectedPeak = preset.expectedPeak || 45;
    const expectedDuration = preset.expectedDuration || 120;

    if (minutes < expectedOnset * 0.8) {
      setCurrentPhase('pre-onset');
      setPredictedNextPhase(`Onset expected in ${Math.ceil(expectedOnset - minutes)} min`);
    } else if (minutes < expectedPeak * 0.8) {
      setCurrentPhase('onset');
      setPredictedNextPhase(`Peak approaching in ${Math.ceil(expectedPeak - minutes)} min`);
    } else if (minutes < expecte