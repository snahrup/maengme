import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from './hooks/useTimer';
import { usePrimeWindows } from './hooks/usePrimeWindows';
import { useSessionManager } from './hooks/useSessionManager';
import { soundManager } from './utils/soundManager';
import { SplashScreen } from './components/SplashScreen';
import { Dashboard } from './components/Dashboard';
import { TimerDisplay } from './components/TimerDisplay';
import { RadialTimeline } from './components/RadialTimeline';
import { LapChip } from './components/LapChip';
import { LapList } from './components/LapList';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { ProductsView } from './components/ProductsView';
import { AnimatedLogo } from './components/AnimatedLogo';
import { Lap, LapType } from './types/timer';
import './App.css';

const lapTypes: { type: LapType; label: string }[] = [
  { type: 'onset', label: 'Onset' },
  { type: 'peak', label: 'Peak' },
  { type: 'tail', label: 'Tail' },
  { type: 'no-effect', label: 'No Effect' }
];

type AppView = 'splash' | 'dashboard' | 'timer' | 'history' | 'settings' | 'products';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const { elapsed, state, start, pause, resume, stop, reset } = useTimer();
  const [laps, setLaps] = useState<Lap[]>([]);
  const [showRadial, setShowRadial] = useState(true);  const [config, setConfig] = useState({
    enablePrimeHints: true,
    soundEnabled: true,
    vibrationEnabled: false
  });
  
  // Set sound manager state
  useEffect(() => {
    soundManager.setEnabled(config.soundEnabled);
  }, [config.soundEnabled]);
  
  const startTimeRef = useRef<number>(0);
  const { saveSession } = useSessionManager();
  const primeWindows = usePrimeWindows(elapsed, 20);
  
  // Handle navigation
  const handleSplashComplete = useCallback(() => {
    setCurrentView('dashboard');
  }, []);
  
  const handleStartSession = useCallback(() => {
    setCurrentView('timer');
    start();
    startTimeRef.current = Date.now();
    setLaps([]);
    setShowRadial(true);
    soundManager.play('start');
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
    soundManager.play('tap');
    
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
    
    await saveSession(
      startTimeRef.current,
      endTime,
      elapsed,
      laps,
      selectedProduct?.manufacturer
    );
    
    soundManager.play('end');
    setShowRadial(false);
    setCurrentView('dashboard');
  }, [stop, elapsed, laps, selectedProduct, saveSession]);
  
  const handleBackToDashboard = useCallback(() => {
    if (state === 'running' || state === 'paused') {
      if (confirm('End current session?')) {
        handleEnd();
      }
    } else {
      reset();
      setCurrentView('dashboard');
    }
  }, [state, handleEnd, reset]);
  
  // Find next prime window
  const nextPrime = primeWindows.find(w => w.median > elapsed);
  const activePrime = primeWindows.find(w => w.isActive);  
  // Render based on current view
  if (currentView === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }
  
  if (currentView === 'dashboard') {
    return (
      <>
        <Dashboard
          onStartSession={handleStartSession}
          onViewHistory={() => setCurrentView('history')}
          onManageProducts={() => setCurrentView('products')}
          onSettings={() => setCurrentView('settings')}
        />
        
        <AnimatePresence>
          {currentView === 'history' && (
            <HistoryView 
              onClose={() => setCurrentView('dashboard')} 
              onSelectSession={(session) => {
                console.log('Selected session:', session);
                setCurrentView('dashboard');
              }}
            />
          )}
          
          {currentView === 'settings' && (
            <SettingsView
              onClose={() => setCurrentView('dashboard')}
              config={config}
              onConfigChange={setConfig}
            />
          )}
          
          {currentView === 'products' && (
            <ProductsView
              onClose={() => setCurrentView('dashboard')}
              onSelectProduct={(product) => {
                setSelectedProduct(product);
                setCurrentView('dashboard');
              }}
            />
          )}
        </AnimatePresence>
      </>
    );
  }  
  // Timer View
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-start to-bg-end">
      {/* Header with Logo */}
      <header className="flex justify-between items-center px-6 py-4">
        <button 
          onClick={handleBackToDashboard}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Back
        </button>
        
        <AnimatedLogo size={40} animate={false} />
        
        <button 
          onClick={() => setShowRadial(!showRadial)}
          className={`text-2xl transition-colors ${showRadial ? 'text-radial-glow' : 'text-text-secondary/40'}`}
        >
          ◉
        </button>
      </header>

      {/* Product Badge */}
      {selectedProduct && (
        <div className="px-6 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-glass-tint/40 backdrop-blur-chip rounded-full border border-glass-stroke/30">
            <span className="text-xs text-text-secondary">Using:</span>
            <span className="text-xs text-text-primary font-medium">
              {selectedProduct.manufacturer} {selectedProduct.strain}
            </span>
          </div>
        </div>
      )}      {/* Main Timer Content */}
      <main className="px-6 py-4 max-w-md mx-auto">
        {/* Timer Display */}
        <div className="mb-6">
          <TimerDisplay elapsed={elapsed} />
        </div>
        
        {/* Radial Timeline */}
        <AnimatePresence>
          {showRadial && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-6"
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
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center mb-3">
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
        
        {/* Control Buttons */}
        <div className="fixed bottom-8 left-0 right-0 px-6">
          <AnimatePresence mode="wait">
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
                  End Session
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
                key="return"
                onClick={() => setCurrentView('dashboard')}
                className="w-full py-4 bg-accent-primary rounded-glass-xl text-text-primary font-medium shadow-glass"
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                Return to Dashboard
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer disclaimer */}
        <div className="text-center text-text-secondary/40 text-xs mt-12 mb-24">
          Not medical advice
        </div>
      </main>
      
      {/* Overlays for Timer View */}
      <AnimatePresence>
        {currentView === 'history' && (
          <HistoryView 
            onClose={() => setCurrentView('timer')} 
            onSelectSession={(session) => {
              console.log('Selected session:', session);
              setCurrentView('timer');
            }}
          />
        )}
        
        {currentView === 'settings' && (
          <SettingsView
            onClose={() => setCurrentView('timer')}
            config={config}
            onConfigChange={setConfig}
          />
        )}
        
        {currentView === 'products' && (
          <ProductsView
            onClose={() => setCurrentView('timer')}
            onSelectProduct={(product) => {
              setSelectedProduct(product);
              setCurrentView('timer');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;