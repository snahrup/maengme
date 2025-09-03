import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Home,
  Plus,
  Clock,
  Info,
  X
} from 'lucide-react';
import { BellCurve } from './BellCurve';
import { InteractiveTimer } from './InteractiveTimer';
import { AdaptiveParticles } from './AdaptiveParticles';
import { BreathingGlow } from './BreathingGlow';
import { NeuralSynapseNetwork } from './NeuralSynapseNetwork';
import { PredictivePeakIndicator } from './PredictivePeakIndicator';
import { ProductPreset } from '../types/product';
import { Lap, LapType } from '../types/timer';
import { toast } from 'react-hot-toast';

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
  const [currentPhase, setCurrentPhase] = useState<'waiting' | 'onset' | 'peak' | 'comedown'>('waiting');
  const [doseCount, setDoseCount] = useState(1); // Track number of doses
  const [totalDose, setTotalDose] = useState(preset.dose);
  const [showInfo, setShowInfo] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [synapseActive, setSynapseActive] = useState(false);

  // Add dose
  const handleAddDose = useCallback(() => {
    const newCount = doseCount + 1;
    const newTotal = totalDose + preset.dose;
    setDoseCount(newCount);
    setTotalDose(newTotal);
    
    // Log as a lap
    onLap('custom', `Added dose #${newCount}: ${preset.dose}${preset.doseUnit} (Total: ${newTotal}${preset.doseUnit})`);
    
    toast.success(`Dose #${newCount} added`, {
      duration: 2000,
      position: 'top-center',
      style: {
        background: 'rgba(34, 197, 94, 0.2)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
      },
      icon: '✨',
    });
  }, [doseCount, totalDose, preset, onLap]);

  // Handle end session with confirmation
  const handleEndSession = useCallback(() => {
    setShowEndConfirm(true);
  }, []);

  const confirmEndSession = useCallback(() => {
    setShowEndConfirm(false);
    onEnd();
    toast.success('Session saved successfully!', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: 'rgba(34, 197, 94, 0.2)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
      },
      icon: '✅',
    });
  }, [onEnd]);

  // Calculate current phase based on elapsed time
  useEffect(() => {
    const elapsedMin = elapsed / 60000;
    const onset = preset?.product?.expectedOnset || 10;
    const peak = preset?.product?.expectedPeak || 45;
    const duration = preset?.product?.expectedDuration || 120;

    if (elapsedMin < onset) {
      setCurrentPhase('waiting');
      setSynapseActive(false);
    } else if (elapsedMin < peak) {
      setCurrentPhase('onset');
      setSynapseActive(true);
    } else if (elapsedMin < peak + 30) {
      setCurrentPhase('peak');
      setSynapseActive(true);
    } else {
      setCurrentPhase('comedown');
      setSynapseActive(elapsedMin < peak + 45); // Fade out synapses
    }
  }, [elapsed, preset]);

  // Calculate intensity (0-1) based on proximity to peak
  const intensity = useMemo(() => {
    const elapsedMin = elapsed / 60000;
    const onset = preset?.product?.expectedOnset || 10;
    const peak = preset?.product?.expectedPeak || 45;
    const duration = preset?.product?.expectedDuration || 120;

    if (elapsedMin < onset) {
      // Building up slowly during waiting
      return Math.min(0.3, elapsedMin / onset * 0.3);
    } else if (elapsedMin < peak) {
      // Ramping up during onset
      const progress = (elapsedMin - onset) / (peak - onset);
      return 0.3 + progress * 0.5; // 0.3 to 0.8
    } else if (elapsedMin < peak + 30) {
      // Peak intensity
      const peakProgress = (elapsedMin - peak) / 30;
      return 0.8 + (1 - Math.abs(peakProgress - 0.5) * 2) * 0.2; // 0.8 to 1.0 with slight fade
    } else {
      // Comedown
      const comedownProgress = Math.min(1, (elapsedMin - (peak + 30)) / (duration - (peak + 30)));
      return Math.max(0.2, 0.8 - comedownProgress * 0.6); // 0.8 to 0.2
    }
  }, [elapsed, preset]);

  // Handle peak approaching/reached
  const handlePeakApproaching = useCallback(() => {
    toast('Peak approaching! 🚀', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: 'rgba(251, 191, 36, 0.2)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
      },
      icon: '⚡',
    });
  }, []);

  const handlePeakReached = useCallback(() => {
    onLap('peak', 'Peak effects reached');
    toast('Peak reached! 🎯', {
      duration: 4000,
      position: 'top-center',
      style: {
        background: 'rgba(52, 211, 153, 0.2)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(52, 211, 153, 0.3)',
      },
      icon: '✨',
    });
  }, [onLap]);

  // Format elapsed time
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'waiting': return 'text-blue-400';
      case 'onset': return 'text-yellow-400';
      case 'peak': return 'text-green-400';
      case 'comedown': return 'text-purple-400';
      default: return 'text-white';
    }
  };

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'waiting': return 'Waiting for effects...';
      case 'onset': return 'Effects starting';
      case 'peak': return 'Peak effects';
      case 'comedown': return 'Winding down';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0E1A2F] relative">
      {/* Ambient Background Animations */}
      <BreathingGlow phase={currentPhase} intensity={intensity} />
      <AdaptiveParticles 
        phase={currentPhase} 
        intensity={intensity}
        historicalPeakTime={preset?.product?.expectedPeak ? preset.product.expectedPeak * 60000 : undefined}
        currentTime={elapsed}
      />
      
      {/* Neural Synapse Network - Phase 2 */}
      <NeuralSynapseNetwork
        phase={currentPhase}
        intensity={intensity}
        isActive={synapseActive && state === 'running'}
      />
      
      {/* Predictive Peak Indicator - Phase 2 */}
      {state === 'running' && (
        <PredictivePeakIndicator
          currentTime={elapsed}
          productId={preset.productId}
          expectedPeak={preset?.product?.expectedPeak}
          onPeakApproaching={handlePeakApproaching}
          onPeakReached={handlePeakReached}
        />
      )}

      {/* Navigation Bar */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={onHome}
          className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Go Home"
        >
          <Home className="w-5 h-5 text-white/80" />
        </button>

        <button
          onClick={() => setShowInfo(true)}
          className="p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Session Info"
        >
          <Info className="w-5 h-5 text-white/80" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {preset.product?.name || preset.name || 'Session'}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="text-white/60">
              {totalDose} {preset.doseUnit || 'g'} total
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white/60">
              {doseCount} {doseCount === 1 ? 'dose' : 'doses'}
            </span>
          </div>
        </motion.div>

        {/* Timer Display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12"
        >
          <div className="text-center">
            <div className="text-7xl font-mono font-bold text-white mb-4">
              {formatTime(elapsed)}
            </div>
            <div className={`text-lg font-medium ${getPhaseColor()}`}>
              {getPhaseLabel()}
            </div>
          </div>
        </motion.div>

        {/* Add Dose Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={handleAddDose}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30 hover:from-green-500/30 hover:to-green-600/30 transition-all flex items-center justify-center gap-3"
            disabled={state === 'stopped'}
          >
            <Plus className="w-6 h-6 text-green-400" />
            <span className="text-white text-lg font-medium">
              Add {preset.dose} {preset.doseUnit || 'g'} Dose
            </span>
          </button>
        </motion.div>

        {/* Bell Curve */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-xs text-white/40 text-center mb-3">Expected Timeline</div>
          <BellCurve
            elapsed={elapsed}
            laps={laps || []}
            expectedOnset={(preset?.product?.expectedOnset || 10) * 60000}
            expectedPeak={(preset?.product?.expectedPeak || 45) * 60000}
            expectedTail={(preset?.product?.expectedDuration || 120) * 60000}
          />
        </motion.div>

        {/* Dose History */}
        {laps && laps.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="text-xs text-white/40 text-center mb-3">Session Events</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {laps.slice().reverse().map((lap) => (
                <div
                  key={lap.id}
                  className="py-2 px-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">
                      {lap.note || lap.type}
                    </span>
                    <span className="text-white/40 text-xs">
                      {formatTime(lap.elapsed)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
                onClick={handleEndSession}
                className="py-4 px-6 rounded-full bg-red-500/20 backdrop-blur-xl border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                aria-label="End Session"
              >
                <Square className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">End</span>
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
                onClick={handleEndSession}
                className="py-4 px-6 rounded-full bg-red-500/20 backdrop-blur-xl border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                aria-label="End Session"
              >
                <Square className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">End</span>
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Session Details</h2>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Product</p>
                  <p className="text-white font-medium">
                    {preset.product?.name || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <p className="text-white/60 text-sm mb-1">Total Consumed</p>
                  <p className="text-white font-medium">
                    {totalDose} {preset.doseUnit || 'g'} ({doseCount} {doseCount === 1 ? 'dose' : 'doses'})
                  </p>
                </div>
                
                <div>
                  <p className="text-white/60 text-sm mb-1">Session Time</p>
                  <p className="text-white font-medium">
                    {formatTime(elapsed)}
                  </p>
                </div>
                
                <div>
                  <p className="text-white/60 text-sm mb-1">Current Phase</p>
                  <p className={`font-medium ${getPhaseColor()}`}>
                    {getPhaseLabel()}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowInfo(false)}
                className="w-full mt-6 py-3 rounded-full bg-gradient-to-r from-[#1DA1FF] to-[#007AFF] text-white font-medium"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End Session Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={() => setShowEndConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">End Session?</h3>
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-sm mb-1">Session Duration</p>
                  <p className="text-white text-lg font-medium">
                    {formatTime(elapsed)}
                  </p>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-sm mb-1">Total Consumed</p>
                  <p className="text-white text-lg font-medium">
                    {totalDose} {preset.doseUnit || 'g'} ({doseCount} {doseCount === 1 ? 'dose' : 'doses'})
                  </p>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-sm mb-1">Product</p>
                  <p className="text-white text-lg font-medium">
                    {preset.product?.name || 'Unknown'}
                  </p>
                </div>
              </div>
              
              <p className="text-white/60 text-sm text-center mb-6">
                This will save your session to history. This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-colors text-white font-medium"
                >
                  Continue Session
                </button>
                <button
                  onClick={confirmEndSession}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  End Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};