import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from './hooks/useTimer';
import { usePrimeWindows } from './hooks/usePrimeWindows';
import { useSessionManager } from './hooks/useSessionManager';
import { TimerDisplay } from './components/TimerDisplay';
import { RadialTimeline } from './components/RadialTimeline';
import { LapChip } from './components/LapChip';
import { LapList } from './components/LapList';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { Lap, LapType } from './types/timer';
import './App.css';

const lapTypes: { type: LapType; label: string }[] = [
  { type: 'onset', label: 'Onset' },
  { type: 'peak', label: 'Peak' },
  { type: 'tail', label: 'Tail' },
  { type: 'no-effect', label: 'No Effect' }
];

function App() {
  const { elapsed, state, start, pause, resume, stop, reset } = useTimer();
  const [laps, setLaps] = useState<Lap[]>([]);
  const [showRadial, setShowRadial] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState({
    enablePrimeHints: true,
    soundEnabled: false,
    vibrationEnabled: false
  });  
  const startTimeRef = useRef<number>(0);
  const { saveSession } = useSessionManager();
  const primeWindows = usePrimeWindows(elapsed, 20);
  
  const handleStart = useCallback(() => {
    start();
    startTimeRef.current = Date.now();
    setLaps([]);
    setShowRadial(true); // Auto-show radial on start
  }, [start]);
  
  const handleLap = useCallback((type: LapType) => {
    if (state !== 'running') return;
    
    const newLap: Lap = {
      id: Date.now().toString(),
      type,
      elapsed,
      timestamp: Date.now()
    };
    
    setLaps(prev => [...prev, newLap]);
    
    // Haptic feedback if enabled
    if (config.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [state, elapsed, config.vibrationEnabled]);
  
  const handleUndo = useCallback((lapId: string) => {
    setLaps(prev => prev.filter(lap => lap.id !== lapId));
  }, []);  
  const handleEnd = useCallback(async () => {
    stop();
    const endTime = Date.now();
    
    // Save session to database
    await saveSession(
      startTimeRef.current,
      endTime,
      elapsed,
      laps
    );
    
    setShowRadial(false);
  }, [stop, elapsed, laps, saveSession]);
  
  // Find next prime window
  const nextPrime = primeWindows.find(w => w.median > elapsed);
  const activePrime = primeWindows.find(w => w.isActive);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-start to-bg-end">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <button 
          onClick={() => setShowSettings(true)}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          {state === 'idle' ? 'Settings' : 'Preset'}
        </button>
        
        <button 
          onClick={() => setShowRadial(!showRadial)}
          className={`text-2xl transition-colors ${showRadial ? 'text-radial-glow' : 'text-text-secondary/40'}`}
        >
          ◉
        </button>        
        <button 
          onClick={() => setShowHistory(true)}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          History
        </button>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-md mx-auto">
        {/* Timer Display */}
        <div className="mb-8">
          <TimerDisplay elapsed={elapsed} />
        </div>
        
        {/* Radial Timeline */}
        <AnimatePresence>
          {showRadial && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-8"
            >
              <RadialTimeline 
                elapsed={elapsed}
                laps={laps}
                nextPrime={nextPrime ? {
                  type: nextPrime.type,
                  timeRemaining: nextPrime.median - elapsed,
                  median: nextPrime.median
                } : undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>        
        {/* Lap Chips */}
        {state === 'running' && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {lapTypes.map(({ type, label }) => {
                const window = primeWindows.find(w => w.type === type);
                const isPrimed = config.enablePrimeHints && window?.isActive;
                
                return (
                  <LapChip
                    key={type}
                    type={type}
                    label={label}
                    onTap={() => handleLap(type)}
                    isHighlighted={isPrimed}
                    isPrimed={isPrimed}
                  />
                );
              })}
            </div>
            
            {/* Prime suggestion text */}
            {config.enablePrimeHints && activePrime && (
              <p className="text-text-secondary/60 text-sm text-center">
                Prime suggestion based on your averages
              </p>
            )}
          </div>
        )}
        
        {/* Lap List */}
        {laps.length > 0 && (
          <div className="mb-8">
            <LapList laps={laps} onUndo={handleUndo} />
          </div>
        )}        
        {/* Control Button */}
        <div className="fixed bottom-8 left-0 right-0 px-6">
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.button
                key="start"
                onClick={handleStart}
                className="w-full py-4 bg-accent-primary rounded-glass-xl text-text-primary font-medium shadow-glass"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                Start Dose
              </motion.button>
            )}
            
            {state === 'running' && (
              <motion.div
                key="running"
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <button
                  onClick={pause}
                  className="flex-1 py-4 bg-glass-tint backdrop-blur-panel rounded-glass-xl text-text-primary font-medium border border-glass-stroke"
                >
                  Pause
                </button>
                <button
                  onClick={handleEnd}
                  className="flex-1 py-4 bg-accent-alert/20 backdrop-blur-panel rounded-glass-xl text-accent-alert font-medium border border-accent-alert/30"
                >
                  End
                </button>
              </motion.div>
            )}            
            {state === 'paused' && (
              <motion.button
                key="resume"
                onClick={resume}
                className="w-full py-4 bg-accent-success rounded-glass-xl text-text-primary font-medium shadow-glass"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                Resume
              </motion.button>
            )}
            
            {state === 'completed' && (
              <motion.button
                key="reset"
                onClick={reset}
                className="w-full py-4 bg-accent-primary rounded-glass-xl text-text-primary font-medium shadow-glass"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                New Session
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer disclaimer */}
        <div className="text-center text-text-secondary/40 text-xs mt-12 mb-24">
          Not medical advice
        </div>
      </main>      
      {/* Overlays */}
      <AnimatePresence>
        {showHistory && (
          <HistoryView 
            onClose={() => setShowHistory(false)} 
            onSelectSession={(session) => {
              console.log('Selected session:', session);
              setShowHistory(false);
            }}
          />
        )}
        
        {showSettings && (
          <SettingsView
            onClose={() => setShowSettings(false)}
            config={config}
            onConfigChange={setConfig}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;