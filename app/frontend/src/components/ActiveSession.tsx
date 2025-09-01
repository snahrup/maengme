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
  Eye,
  Info,
  HelpCircle,
  X
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
  const [showHelp, setShowHelp] = useState(false);
  const [firstTimeUser, setFirstTimeUser] = useState(true);

  // Start analytics session when timer starts
  useEffect(() => {
    if (state === 'running' && elapsed === 0 && preset.product) {
      sessionAnalytics.startSession(
        preset.product.id || '',
        preset.dose,
        preset.product.ingestion === 'capsule' ? 'capsules' : 'grams'
      );
      
      // Show first-time help
      if (firstTimeUser) {
        setTimeout(() => {
          setCurrentInsight('Tap "Log Effect" to track how you\'re feeling at any time');
          setShowInsight(true);
          setFirstTimeUser(false);
        }, 3000);
      }
    }
  }, [state, elapsed, preset, firstTimeUser]);

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
    
    // Show encouraging feedback
    setCurrentInsight(strength === 0 
      ? 'Thanks for logging! It\'s normal not to feel effects yet'
      : `Effect logged: ${strength}/10. Your pattern is building!`
    );
    setShowInsight(true);
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
        'Alkaloids are binding to your receptors',
        'This is when most users feel the first effects'
      ],
      'peak': [
        'You\'re experiencing peak alkaloid activity',
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
      'pre-onset': 'Waiting for Effects',
      'onset': 'Effects Starting',
      'peak': 'Peak Effects',
      'tail': 'Winding Down',
      'after': 'Session Complete'
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
          aria-label="Go Home"
        >
          <Home className="w-5 h-5 text-white/80" />
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setShowHelp(true)}
            className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5 text-white/80" />
          </button>
          <button
            onClick={() => setShowVisualization(prev => 
              prev === 'alkaloid' ? 'wave' : 
              prev === 'wave' ? 'both' : 'alkaloid'
            )}
            className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
            aria-label="Toggle Visualization"
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

        {/* Visualization Area with Labels */}
        <div className="relative h-64 mb-8">
          {/* Visualization Label */}
          <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-xl rounded-lg px-3 py-1.5 border border-white/10">
            <p className="text-xs text-white/60">
              {showVisualization === 'alkaloid' && 'Alkaloid Activity'}
              {showVisualization === 'wave' && 'Your Effect Pattern'}
              {showVisualization === 'both' && 'Activity & Effects'}
            </p>
          </div>
          
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

        {/* Phase Progress Bar with Better Labels */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 px-4"
        >
          <div className="flex items-center justify-between mb-2 text-sm text-white/60">
            <span>{getPhaseLabel()}</span>
            {nextPhaseTime && (
              <span>Next phase in: {formatNextPhase(nextPhaseTime)}</span>
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

        {/* Quick Actions with Clearer Labels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-xs text-white/40 text-center mb-3">Quick Actions</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEffectTracker(true)}
              className="flex-1 py-3 px-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center gap-1 relative"
              aria-label="Log how you're feeling"
            >
              <Brain className="w-5 h-5 text-[#1DA1FF]" />
              <span className="text-white/80 text-xs">Log Effect</span>
              <span className="text-white/40 text-[10px]">How you feel</span>
              {effectHistory.length === 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1DA1FF] rounded-full animate-pulse" />
              )}
            </button>
            
            <button
              onClick={() => {
                handleLap('hydration', 'Stayed hydrated');
                setCurrentInsight('Great job staying hydrated! 💧');
                setShowInsight(true);
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center gap-1"
              aria-label="Log water intake"
            >
              <Droplet className="w-5 h-5 text-blue-400" />
              <span className="text-white/80 text-xs">Hydrate</span>
              <span className="text-white/40 text-[10px]">Log water</span>
            </button>
            
            <button
              onClick={() => {
                const note = prompt('Add a note about this session:');
                if (note) {
                  handleLap('note', note);
                  setCurrentInsight('Note added to your session');
                  setShowInsight(true);
                }
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center gap-1"
              aria-label="Add a note"
            >
              <MessageCircle className="w-5 h-5 text-purple-400" />
              <span className="text-white/80 text-xs">Note</span>
              <span className="text-white/40 text-[10px]">Add thought</span>
            </button>
          </div>
        </motion.div>

        {/* Bell Curve with Label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-xs text-white/40 text-center mb-3">Expected Timeline</p>
          <BellCurve
            preset={preset}
            currentTime={elapsed}
            markers={laps?.map(lap => ({ 
              time: lap.elapsed, 
              type: lap.type || 'onset',
              label: lap.notes
            })) || []}
          />
        </motion.div>

        {/* Lap List */}
        {laps && laps.length > 0 && (
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
                aria-label="End Session"
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
                aria-label="End Session"
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

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Session Guide</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Brain className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Log Effects</p>
                    <p className="text-white/60 text-xs">Track how you're feeling on a scale of 0-10</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Eye className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Visualizations</p>
                    <p className="text-white/60 text-xs">Particles show alkaloid activity, waves show your effects</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Session Phases</p>
                    <p className="text-white/60 text-xs">Waiting → Starting → Peak → Winding Down</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Smart Insights</p>
                    <p className="text-white/60 text-xs">Get helpful tips based on your session phase</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowHelp(false)}
                className="w-full mt-6 py-3 rounded-full bg-gradient-to-r from-[#1DA1FF] to-[#007AFF] text-white font-medium"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};