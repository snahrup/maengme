import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './store/database';
import { useTimer } from './hooks/useTimer';
import { usePrimeWindows } from './hooks/usePrimeWindows';
import { useSessionManager } from './hooks/useSessionManager';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { TimerDisplay } from './components/TimerDisplay';
import { BellCurve } from './components/BellCurve';
import { LapChip } from './components/LapChip';
import { LapList } from './components/LapList';
import { Logo } from './components/Logo';
import { Lap, LapType } from './types/timer';
import './App.css';

const lapTypes: { type: LapType; label: string }[] = [
  { type: 'onset', label: 'Onset' },
  { type: 'peak', label: 'Peak' },
  { type: 'tail', label: 'Tail' }
];

type AppView = 'splash' | 'home' | 'timer' | 'history' | 'preset';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [showHistory, setShowHistory] = useState(false);
  const [showPreset, setShowPreset] = useState(false);
  
  const { elapsed, state, start, pause, resume, stop, reset } = useTimer();
  const [laps, setLaps] = useState<Lap[]>([]);
  
  const startTimeRef = useRef<number>(0);
  const { saveSession } = useSessionManager();
  const primeWindows = usePrimeWindows(elapsed, 20);
  
  // Get sessions for stats
  const sessions = useLiveQuery(() => db.sessions.toArray()) || [];
  const lastSession = sessions[0];
  
  // Handle splash complete - go to HOME, not timer
  const handleSplashComplete = useCallback(() => {
    setCurrentView('home');
  }, []);
  
  // Handle start session from home
  const handleStartSession = useCallback(() => {
    setCurrentView('timer');
    reset();
    setLaps([]);
    start();
    startTimeRef.current = Date.now();
  }, [start, reset]);  
  // Handle lap
  const handleLap = useCallback((type: LapType) => {
    if (state !== 'running') return;
    
    const newLap: Lap = {
      id: Date.now().toString(),
      type,
      elapsed,
      timestamp: Date.now()
    };
    
    setLaps(prev => [...prev, newLap]);
  }, [state, elapsed]);
  
  // Handle undo
  const handleUndo = useCallback((lapId: string) => {
    setLaps(prev => prev.filter(lap => lap.id !== lapId));
  }, []);
  
  // Handle end session
  const handleEnd = useCallback(async () => {
    stop();
    const endTime = Date.now();
    
    await saveSession(
      startTimeRef.current,
      endTime,
      elapsed,
      laps,
      'Session'
    );
    
    // Go back to home
    setCurrentView('home');
    reset();
    setLaps([]);
  }, [stop, reset, elapsed, laps, saveSession]);
  
  // Handle back to home
  const handleBackToHome = useCallback(() => {
    if (state === 'running' || state === 'paused') {
      if (confirm('End current session and return home?')) {
        handleEnd();
      }
    } else {
      setCurrentView('home');
    }
  }, [state, handleEnd]);
  
  // Check for prime windows
  const activePrime = primeWindows.find(w => w.isActive);
  
  // Render splash screen
  if (currentView === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  
  // Render home screen
  if (currentView === 'home') {
    return (
      <HomeScreen
        onStartSession={handleStartSession}
        onViewHistory={() => setShowHistory(true)}
        onViewPresets={() => setShowPreset(true)}
        sessionsCount={sessions.length}
        lastSessionDate={lastSession ? new Date(lastSession.startTime).toLocaleDateString() : undefined}
      />
    );
  }  
  // Main timer view
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
        {/* Main Glass Panel Container */}
        <motion.div 
          className="glass-panel w-full max-w-md mx-auto p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setShowPreset(true)}
              className="text-white/70 hover:text-white transition-colors text-body"
            >
              Preset
            </button>
            
            <div className="flex flex-col items-center">
              <Logo size={32} className="opacity-70 mb-1" />
              <span className="text-white/50 text-tiny">MaengMe</span>
            </div>
            
            <button
              onClick={() => setShowHistory(true)}
              className="text-white/70 hover:text-white transition-colors text-body"
            >
              History
            </button>
          </div>
          
          {/* Timer Display with rounded background */}
          <div className="mb-6 py-4 px-6 bg-glass-10 rounded-glass-xl">
            <TimerDisplay elapsed={elapsed} />
          </div>
          
          {/* Bell Curve Visualization */}
          <div className="mb-6">
            <BellCurve 
              elapsed={elapsed}
              laps={laps}
              expectedOnset={600000}   // 10 min
              expectedPeak={2700000}   // 45 min
              expectedTail={5400000}   // 90 min
            />
          </div>
          
          {/* Lap Chips */}
          {state === 'running' && (
            <div className="mb-6">
              <div className="flex gap-3 justify-center">
                {lapTypes.map(({ type, label }) => {
                  const window = primeWindows.find(w => w.type === type);
                  const isPrimed = window?.isActive;
                  const hasLogged = laps.some(l => l.type === type);
                  
                  return (
                    <LapChip
                      key={type}
                      type={type}
                      label={label}
                      onTap={() => handleLap(type)}
                      isHighlighted={isPrimed && !hasLogged}
                    />
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Lap List */}
          {laps.length > 0 && (
            <div className="mb-6 max-h-32 overflow-y-auto">
              <LapList laps={laps} onUndo={handleUndo} />
            </div>
          )}
          
          {/* Control Buttons */}
          <div className="flex gap-3">
            {state === 'idle' ? (
              <motion.button
                onClick={handleBackToHome}
                className="w-full py-3 glass-button rounded-glass-lg text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ← Back to Home
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={state === 'running' ? pause : resume}
                  className="flex-1 py-3 glass-button rounded-glass-lg text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {state === 'running' ? 'Pause' : 'Resume'}
                </motion.button>
                
                <motion.button
                  onClick={handleEnd}
                  className="py-3 px-6 glass-button rounded-glass-lg text-white/70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  End
                </motion.button>
              </>
            )}
          </div>
          
          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-white/30 text-tiny">Not medical advice</p>
          </div>
        </motion.div>
      </div>
      
      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center p-6 z-50"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-title text-white">History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-white/50 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-white/50">Session history will appear here</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Preset Modal */}
      <AnimatePresence>
        {showPreset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center p-6 z-50"
            onClick={() => setShowPreset(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-title text-white">Preset</h2>
                <button
                  onClick={() => setShowPreset(false)}
                  className="text-white/50 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-white/50">Product presets will appear here</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;