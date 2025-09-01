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
  Plus,
  Droplet,
  Target,
  MessageCircle,
  Eye
} from 'lucide-react';
import { BellCurve } from './BellCurve';
import { TimerDisplay } from './TimerDisplay';
import { LapChip } from './LapChip';
import { LapList } from './LapList';
import { EffectTracker } from './EffectTracker';
import { AlkaloidVisualizer } from './AlkaloidVisualizer';
import { EffectWave } from './EffectWave';
import { SessionInsights } from './SessionInsights';
import { ProductPreset } from '../types/product';
import { Lap, LapType } from '../types/timer';
import { sessionAnalytics } from '../services/sessionAnalytics';

interface ActiveSessionProps {
  preset: ProductPreset;
  elapsed: number;
  state: 'stopped' | 'running' | 'paused';
  laps: Lap[];
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
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
  const [showEffectTracker, setShowEffectTracker] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'pre-onset' | 'onset' | 'peak' | 'tail' | 'after'>('pre-onset');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [metabolismRate, setMetabolismRate] = useState(0);
  const [nextPhaseTime, setNextPhaseTime] = useState<number | null>(null);
  const [showInsight, setShowInsight] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<string>('');
  const [effectHistory, setEffectHistory] = useState<Array<{ time: number; strength: number }>>([]);
  const [showVisualization, setShowVisualization] = useState<'alkaloid' | 'wave' | 'both'>('both');

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

  const handleEffectLog = (strength: number, notes?: string) => {
    setEffectHistory(prev => [...prev, { time: elapsed, strength }]);
    sessionAnalytics.logEffect(strength, notes);
    setShowEffectTracker(false);
  };
  
  // Calculate current phase and progress
  useEffect(() => {
    const elapsedMin = elapsed / 60000;
    const { product } = preset;
    
    if (!product) return;
    
    const onset = product.expectedOnset || 10;
    const peak = product.expectedPeak || 45;
    const duration = product.expectedDuration || 120;
    
    let phase: typeof currentPhase;
    let progress: number;
    let nextTime: number | null = null;
    
    if (elapsedMin < onset) {
      phase = 'pre-onset';
      progress = (elapsedMin / onset) * 100;
      nextTime = onset - elapsedMin;
    } else if (elapsedMin < peak) {
      phase = 'onset';
      progress = ((elapsedMin - onset) / (peak - onset)) * 100;
      nextTime = peak - elapsedMin;
    } else if (elapsedMin < peak + 30) {
      phase = 'peak';
      progress = ((elapsedMin - peak) / 30) * 100;
      nextTime = (peak + 30) - elapsedMin;
    } else if (elapsedMin < duration) {
      phase = 'tail';
      progress = ((elapsedMin - peak - 30) / (duration - peak - 30)) * 100;
      nextTime = duration - elapsedMin;
    } else {
      phase = 'after';
      progress = 100;
      nextTime = null;
    }
    
    setCurrentPhase(phase);
    setPhaseProgress(progress);
    setNextPhaseTime(nextTime);
    
    // Calculate metabolism rate based on phase
    let rate = 0;
    if (phase === 'pre-onset') rate = progress * 0.3;
    else if (phase === 'onset') rate = 30 + progress * 0.5;
    else if (phase === 'peak') rate = 80 + progress * 0.2;
    else if (phase === 'tail') rate = 100 - progress * 0.5;
    else rate = 50 - Math.min(50, (elapsedMin - duration) * 2);
    
    setMetabolismRate(Math.max(0, Math.min(100, rate)));
  }, [elapsed, preset, currentPhase]);

  // Generate contextual insights
  useEffect(() => {
    const elapsedMin = elapsed / 60000;
    const { product } = preset;
    if (!product) return;

    // Generate phase-specific insights
    const insights: Record<typeof currentPhase, string[]> = {
      'pre-onset': [
        `${product.name} typically begins in ${Math.ceil(nextPhaseTime || 0)} minutes`,
        'Your body is beginning to absorb the alkaloids',
        'Stay hydrated - it helps with absorption'
      ],
      'onset': [
        `Approaching peak in ${Math.ceil(nextPhaseTime || 0)} minutes`,
        'Mitragynine is binding to your opioid receptors',
        'This is when most users feel the first effects'
      ],
      'peak': [
        'You\'re experiencing peak alkaloid saturation',
        `This intensity typically lasts ${Math.ceil(nextPhaseTime || 0)} more minutes`,
        'Your receptors are maximally engaged'
      ],
      'tail': [
        'Effects are gradually tapering',
        `About ${Math.ceil(nextPhaseTime || 0)} minutes remaining`,
        'Your body is metabolizing the alkaloids'
      ],
      'after': [
        'Session complete - effects should be minimal',
        'Consider logging your overall experience',
        'Your tolerance may be slightly elevated for 4-6 hours'
      ]
    };

    // Show insight at phase transitions and key moments
    if (phaseProgress < 5 || (phaseProgress > 45 && phaseProgress < 55)) {
      const phaseInsights = insights[currentPhase];
      const randomInsight = phaseInsights[Math.floor(Math.random() * phaseInsights.length)];
      setCurrentInsight(randomInsight);
      setShowInsight(true);
      setTimeout(() => setShowInsight(false), 5000);
    }
  }, [currentPhase, phaseProgress, elapsed, preset, nextPhaseTime]);

  const formatNextPhase = (minutes: number | null) => {
    if (!minutes) return '';
    if (minutes < 1) return 'Less than a minute';
    return `${Math.ceil(minutes)} min`;
  };

  const getPhaseLabel = () => {
    const labels = {
      'pre-onset': 'Absorption',
      'onset': 'Rising',
      'peak': 'Peak',
      'tail': 'Tapering',
      'after': 'Afterglow'
    };
    return labels[currentPhase];
  };

  const getPhaseIcon = () => {
    const icons = {
      'pre-onset': <Clock className="w-4 h-4" />,
      'onset': <TrendingUp className="w-4 h-4" />,
      'peak': <Zap className="w-4 h-4" />,
      'tail': <Activity className="w-4 h-4" />,
      'after': <Sparkles className="w-4 h-4" />
    };
    return icons[currentPhase];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0E1A2F] relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 flex items-center justify-between p-6"
      >
        <button
          onClick={onHome}
          className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Home className="w-5 h-5 text-white/80" />
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setShowVisualization(prev => 
              prev === 'alkaloid' ? 'wave' : 
              prev === 'wave' ? 'both' : 'alkaloid'
            )}
            className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Eye className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-semibold text-white mb-2">
            {preset.product?.name || preset.name}
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/60">
            <span>{preset.dose} {preset.product?.ingestion === 'capsule' ? 'capsules' : 'g'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {getPhaseIcon()}
              {getPhaseLabel()}
            </span>
          </div>
        </motion.div>

        {/* Visualization Area */}
        <div className="relative h-64 mb-8">
          <AnimatePresence>
            {(showVisualization === 'alkaloid' || showVisualization === 'both') && (
              <motion.div
                key="alkaloid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={showVisualization === 'both' ? 'absolute inset-0' : ''}
              >
                <AlkaloidVisualizer
                  phase={currentPhase}
                  metabolismRate={metabolismRate}
                  alkaloids={preset.product?.alkaloids || {}}
                />
              </motion.div>
            )}
            
            {(showVisualization === 'wave' || showVisualization === 'both') && (
              <motion.div
                key="wave"
                initial={{ opacity: 0 }}
                animate={{ opacity: showVisualization === 'both' ? 0.7 : 1 }}
                exit={{ opacity: 0 }}
                className={showVisualization === 'both' ? 'absolute inset-0' : ''}
              >
                <EffectWave
                  effectHistory={effectHistory}
                  currentTime={elapsed}
                  expectedPeak={preset.product?.expectedPeak || 45}
                  expectedDuration={preset.product?.expectedDuration || 120}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Timer Display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <TimerDisplay 
            elapsed={elapsed} 
            size="lg"
            showMillis={state === 'running'}
          />
        </motion.div>

        {/* Phase Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 px-4"
        >
          <div className="flex items-center justify-between mb-2 text-sm text-white/60">
            <span>{getPhaseLabel()}</span>
            {nextPhaseTime && (
              <span>Next: {formatNextPhase(nextPhaseTime)}</span>
            )}
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-xl">
            <motion.div
              className="h-full bg-gradient-to-r from-[#1DA1FF] to-[#007AFF]"
              initial={{ width: 0 }}
              animate={{ width: `${phaseProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Contextual Insights */}
        <AnimatePresence>
          {showInsight && (
            <SessionInsights
              insight={currentInsight}
              phase={currentPhase}
              onDismiss={() => setShowInsight(false)}
            />
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-8"
        >
          <button
            onClick={() => setShowEffectTracker(true)}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4 text-[#1DA1FF]" />
            <span className="text-white/80 text-sm">Log Effect</span>
          </button>
          
          <button
            onClick={() => handleLap('hydration')}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Droplet className="w-4 h-4 text-blue-400" />
            <span className="text-white/80 text-sm">Hydrate</span>
          </button>
          
          <button
            onClick={() => handleLap('note')}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-purple-400" />
            <span className="text-white/80 text-sm">Note</span>
          </button>
        </motion.div>

        {/* Bell Curve */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <BellCurve
            preset={preset}
            currentTime={elapsed}
            markers={laps.map(lap => ({ 
              time: lap.elapsed, 
              type: lap.type || 'onset',
              label: lap.notes
            }))}
          />
        </motion.div>

        {/* Lap List */}
        {laps.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <LapList laps={laps} onUndo={onUndo} />
          </motion.div>
        )}
      </div>

      {/* Control Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-xl"
      >
        <div className="flex gap-4 max-w-md mx-auto">
          {state === 'stopped' ? (
            <button
              onClick={onStart}
              className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#1DA1FF] to-[#007AFF] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Start Session</span>
            </button>
          ) : state === 'running' ? (
            <>
              <button
                onClick={onPause}
                className="flex-1 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <Pause className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Pause</span>
              </button>
              <button
                onClick={onEnd}
                className="py-4 px-6 rounded-full bg-red-500/20 backdrop-blur-xl border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                <Square className="w-5 h-5 text-red-400" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onResume}
                className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#1DA1FF] to-[#007AFF] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Resume</span>
              </button>
              <button
                onClick={onEnd}
                className="py-4 px-6 rounded-full bg-red-500/20 backdrop-blur-xl border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                <Square className="w-5 h-5 text-red-400" />
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Effect Tracker Modal */}
      <AnimatePresence>
        {showEffectTracker && (
          <EffectTracker
            onLog={handleEffectLog}
            onClose={() => setShowEffectTracker(false)}
            currentPhase={currentPhase}
          />
        )}
      </AnimatePresence>
    </div>
  );
};