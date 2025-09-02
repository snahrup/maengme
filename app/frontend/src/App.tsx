import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { Toaster } from 'react-hot-toast';
import { db } from './store/database';
import { useEpochTimer } from './hooks/useEpochTimer';
import { usePrimeWindows } from './hooks/usePrimeWindows';
import { useSessionManager } from './hooks/useSessionManager';
import { useQuickStartStore } from './stores/quickStartStore';
import { SplashScreen } from './components/SplashScreen';
import { StartScreen } from './components/StartScreen';
import { StatsPage } from './components/StatsPage';
import { ProductSelector } from './components/ProductSelector';
import { ProductDetails } from './components/ProductDetails';
import { ActiveSession } from './components/ActiveSession';
import { HistoryView } from './components/HistoryView';
import { Lap, LapType } from './types/timer';
import { Product, ProductPreset } from './types/product';
import './App.css';

type AppView = 'splash' | 'home' | 'stats' | 'product-select' | 'product-details' | 'session' | 'history' | 'preset';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activePreset, setActivePreset] = useState<ProductPreset | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const { elapsed, state, start, pause, resume, stop, reset } = useEpochTimer();
  const [laps, setLaps] = useState<Lap[]>([]);  
  const startTimeRef = useRef<number>(0);
  const { saveSession } = useSessionManager();
  
  // Get sessions for stats
  const sessions = useLiveQuery(() => db.sessions.toArray()) || [];
  const lastSession = sessions[0];
  
  // Calculate session counts
  const now = Date.now();
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
  
  const todaySessions = sessions.filter(s => s.startTime >= todayStart).length;
  const weekSessions = sessions.filter(s => s.startTime >= weekAgo).length;
  const totalSessions = sessions.length;
  
  // Handle splash complete
  const handleSplashComplete = useCallback(() => {
    setCurrentView('home');
  }, []);
  
  // Handle product selection from home
  const handleSelectProduct = useCallback(() => {
    setCurrentView('product-select');
  }, []);
  
  // Handle product selected
  const handleProductSelected = useCallback((product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
  }, []);
  
  // Handle start session with preset
  const handleStartWithPreset = useCallback((preset: ProductPreset) => {
    setActivePreset(preset);
    setCurrentView('session');
    reset();
    setLaps([]);
    start();
    startTimeRef.current = Date.now();
    
    // Save for quick start
    const { setLastSession } = useQuickStartStore.getState();
    if (preset.product) {
      setLastSession(
        preset.productId,
        preset.product.name,
        preset.dose,
        preset.method
      );
    }
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
      activePreset?.product?.name || 'Session'
    );
    
    // Reset and go home
    setCurrentView('home');
    reset();
    setLaps([]);
    setActivePreset(null);
    setSelectedProduct(null);
  }, [stop, reset, elapsed, laps, saveSession, activePreset]);  
  // Handle back navigation
  const handleBackToHome = useCallback(() => {
    if (state === 'running' || state === 'paused') {
      if (confirm('End current session and return home?')) {
        handleEnd();
      }
    } else {
      setCurrentView('home');
      setSelectedProduct(null);
    }
  }, [state, handleEnd]);
  
  const handleBackToProductSelect = useCallback(() => {
    setCurrentView('product-select');
    setSelectedProduct(null);
  }, []);
  
  // Quick start with last preset or route to product selection
  const handleQuickStart = useCallback(() => {
    const { getQuickStartData } = useQuickStartStore.getState();
    const quickStartData = getQuickStartData();
    
    if (quickStartData) {
      // Create preset from quick start data
      const quickPreset: ProductPreset = {
        id: `quick-${Date.now()}`,
        productId: quickStartData.lastProductId!,
        product: { name: quickStartData.lastProductName! } as Product,
        dose: quickStartData.lastDose,
        doseUnit: 'g',
        method: quickStartData.lastMethod as any
      };
      
      setActivePreset(quickPreset);
      setCurrentView('session');
      reset();
      setLaps([]);
      start();
      startTimeRef.current = Date.now();
    } else {
      // No quick start data, go to product selection
      setCurrentView('product-select');
    }
  }, [start, reset]);
  
  return (
    <div className="min-h-screen bg-gradient-primary overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />      
      {/* Main Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'splash' && (
            <SplashScreen key="splash" onComplete={handleSplashComplete} />
          )}
          
          {currentView === 'home' && (
            <StartScreen
              key="home"
              onStartSession={handleSelectProduct}
              onViewStats={() => setCurrentView('stats')}
              onViewHistory={() => setShowHistory(true)}
              todayCount={todaySessions}
              weekCount={weekSessions}
              totalCount={totalSessions}
            />
          )}
          
          {currentView === 'stats' && (
            <StatsPage
              key="stats"
              onBack={() => setCurrentView('home')}
            />
          )}
          
          {currentView === 'product-select' && (
            <ProductSelector
              key="product-select"
              onSelectProduct={handleProductSelected}
              onClose={handleBackToHome}
            />
          )}
          
          {currentView === 'product-details' && selectedProduct && (
            <ProductDetails
              key="product-details"
              product={selectedProduct}
              onStartSession={handleStartWithPreset}
              onBack={handleBackToProductSelect}
            />
          )}
          
          {currentView === 'session' && activePreset && (
            <ActiveSession
              key="session"
              preset={activePreset}
              elapsed={elapsed}
              state={state === 'idle' || state === 'completed' ? 'stopped' : state}
              laps={laps}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onEnd={handleEnd}
              onLap={handleLap}
              onUndo={() => handleUndo(laps[laps.length - 1]?.id)}
              onHome={handleBackToHome}
            />
          )}          
          {/* Fallback for session without preset (quick start) */}
          {currentView === 'session' && !activePreset && (
            <ActiveSession
              key="session-quick"
              preset={{
                id: 'quick',
                productId: 'unknown',
                dose: 3,
                doseUnit: 'g',
                method: 'toss-wash'
              }}
              elapsed={elapsed}
              state={state === 'idle' || state === 'completed' ? 'stopped' : state}
              laps={laps}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onEnd={handleEnd}
              onLap={handleLap}
              onUndo={() => handleUndo(laps[laps.length - 1]?.id)}
              onHome={handleBackToHome}
            />
          )}
        </AnimatePresence>
        
        {/* History Modal */}
        <AnimatePresence>
          {showHistory && (
            <HistoryView onClose={() => setShowHistory(false)} />
          )}
        </AnimatePresence>
        
        {/* Toast Notifications */}
        <Toaster position="top-center" />
      </div>
    </div>
  );
}

export default App;