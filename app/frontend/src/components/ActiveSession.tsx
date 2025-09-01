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
  Sparkles
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

export const ActiveSession: React.FC<ActiveSessionProps> = ({  preset,
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
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [metabolismRate, setMetabolismRate] = useState(0);
  const [nextPhaseTime, setNextPhaseTime] = useState<number | null>(null);
  
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
      setNextPhaseTime(onset - elapsedMin);    } else if (elapsedMin < peak) {
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
    
    // Calculate metabolism rate (simulated)
    const rate = Math.sin((elapsedMin / duration) * Math.PI) * 100;
    setMetabolismRate(Math.max(0, rate));
  }, [elapsed, preset]);
  
  // Get phase color
  const getPhaseColor = () => {
    switch(currentPhase) {
      case 'pre-onset': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'onset': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'peak': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'tail': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'after': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
    }
  };
    
  const lapTypes: { type: LapType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'onset', label: 'Onset', icon: TrendingUp },
    { type: 'peak', label: 'Peak', icon: Zap },
    { type: 'tail', label: 'Tail', icon: Activity }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass-panel border-b border-white/10">
        <div className="p-4 flex items-center justify-between">
          <button onClick={onHome} className="glass-button-secondary">
            <Home className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-white/60">
              {preset.product?.manufacturer} {preset.product?.name}
            </div>
            <div className="px-2 py-1 rounded-full text-xs bg-green-500/20 border border-green-500/30 text-green-300">
              {preset.dose}{preset.doseUnit}
            </div>
          </div>
          
          <button 
            onClick={() => setShowInsights(!showInsights)}
            className="glass-button-secondary"
          >
            <Brain className="w-4 h-4" />
          </button>        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Current Phase Indicator */}
        <motion.div 
          className={`glass-panel p-4 mb-6 border-2 ${getPhaseColor()}`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  className="w-12 h-12 rounded-full bg-current opacity-20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Activity className="w-6 h-6 absolute top-3 left-3" />
              </div>
              <div>
                <div className="text-lg font-light capitalize">{currentPhase.replace('-', ' ')} Phase</div>
                <div className="text-sm opacity-70">
                  {nextPhaseTime && `Next phase in ${Math.ceil(nextPhaseTime)} min`}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-light">{phaseProgress.toFixed(0)}%</div>
              <div className="text-xs opacity-70">Progress</div>            </div>
          </div>
          
          {/* Phase Progress Bar */}
          <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-current"
              initial={{ width: 0 }}
              animate={{ width: `${phaseProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
        
        {/* Timer Display */}
        <div className="text-center mb-6">
          <TimerDisplay 
            elapsed={elapsed} 
            state={state}
            size="large"
          />
        </div>
        
        {/* Molecular Metabolism Visualization */}
        <AnimatePresence>
          {showInsights && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-panel p-6 mb-6 overflow-hidden"
            >
              <h3 className="text-lg font-light text-white mb-4 flex items-center gap-2">                <Sparkles className="w-5 h-5 text-green-400" />
                Live Molecular Activity
              </h3>
              
              {/* Animated Molecules */}
              <div className="relative h-32 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-8 h-8"
                    initial={{ 
                      left: `${20 + i * 15}%`,
                      top: '50%'
                    }}
                    animate={{
                      left: [`${20 + i * 15}%`, `${30 + i * 15}%`, `${20 + i * 15}%`],
                      top: ['50%', '20%', '50%'],
                      rotate: [0, 360, 720],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 opacity-60 blur-sm" />
                  </motion.div>
                ))}
              </div>
              
              {/* Metabolism Rate */}
              <div className="grid grid-cols-3 gap-4 text-center">                <div>
                  <div className="text-2xl font-light text-green-400">
                    {metabolismRate.toFixed(0)}%
                  </div>
                  <div className="text-xs text-white/60">Absorption Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-yellow-400">
                    {(preset.product?.mitragynine || 0) * (metabolismRate / 100)}%
                  </div>
                  <div className="text-xs text-white/60">Active MIT</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-purple-400">
                    {Math.max(0, 100 - metabolismRate).toFixed(0)}%
                  </div>
                  <div className="text-xs text-white/60">Remaining</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Bell Curve */}
        <div className="glass-panel p-6 mb-6">
          <BellCurve 
            elapsed={elapsed}
            laps={laps}
            expectedOnset={(preset.product?.expectedOnset || 10) * 60000}
            expectedPeak={(preset.product?.expectedPeak || 45) * 60000}
            expectedTail={(preset.product?.expectedDuration || 120) * 60000}
          />        </div>
        
        {/* Lap Chips with Smart Suggestions */}
        <div className="glass-panel p-6 mb-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {lapTypes.map(({ type, label, icon: Icon }) => {
              const hasLap = laps.some(l => l.type === type);
              const isRecommended = 
                (type === 'onset' && currentPhase === 'onset' && !hasLap) ||
                (type === 'peak' && currentPhase === 'peak' && !hasLap) ||
                (type === 'tail' && currentPhase === 'tail' && !hasLap);
              
              return (
                <motion.div
                  key={type}
                  animate={isRecommended ? {
                    scale: [1, 1.05, 1],
                    boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0)', '0 0 0 10px rgba(34, 197, 94, 0.3)', '0 0 0 0 rgba(34, 197, 94, 0)']
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <LapChip
                    type={type}
                    label={label}
                    onClick={() => onLap(type)}
                    disabled={hasLap || state !== 'running'}
                    hasLap={hasLap}
                  />
                  {isRecommended && (
                    <div className="text-xs text-green-400 text-center mt-1">
                      <ChevronUp className="w-3 h-3 inline-block animate-bounce" />
                      Suggested                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Lap List */}
        {laps.length > 0 && (
          <div className="glass-panel p-6 mb-6">
            <LapList laps={laps} onUndo={onUndo} />
          </div>
        )}
        
        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          {state === 'stopped' ? (
            <button
              onClick={onStart}
              className="glass-button-primary px-8 py-3"
            >
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          ) : state === 'running' ? (
            <>
              <button
                onClick={onPause}
                className="glass-button-secondary px-8 py-3"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>              <button
                onClick={onEnd}
                className="glass-button px-8 py-3 bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
              >
                <Square className="w-5 h-5" />
                <span>End</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onResume}
                className="glass-button-primary px-8 py-3"
              >
                <Play className="w-5 h-5" />
                <span>Resume</span>
              </button>
              <button
                onClick={onEnd}
                className="glass-button px-8 py-3 bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
              >
                <Square className="w-5 h-5" />
                <span>End</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};