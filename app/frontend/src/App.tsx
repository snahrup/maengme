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
import { ActiveSessionSimple } from './components/ActiveSessionSimple';
import { HistoryView } from './components/HistoryView';
import { DebugPanel } from './components/DebugPanel';
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
  
  // Handle start session with preset - FIXED VERSION
  const handleStartWithPreset = useCallback((preset: ProductPreset) => {
    console.log('App: handleStartWithPreset called');
    console.log('App: Preset:', preset);
    console.log('App: Timer state before:', state);
    
    // Set both state values immediately
    setActivePreset(preset);
    setCurrentView('session');
    
    // Force timer to start after a brief delay to ensure render
    setTimeout(() => {
      console.log('App: Starting timer...');
      reset();
      setLaps([]);
      start();
      startTimeRef.current = Date.now();
      console.log('App: Timer state after start:', state);
    }, 100);
    
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
    
    console.log('App: Session should now be starting');
  }, [start, reset, state]);
  
  // Handle lap
  const handleLap = useCallback((type?: LapType, notes?: string) => {
    if (state !== 'running') return;
    
    const newLap: Lap = {
      id: Date.now().toString(),
      type: type || 'custom',
      elapsed,
      timestamp: Date.now(),
      note: notes
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
  
  // Debug logging - Enhanced
  useEffect(() => {
    console.log('=== App State Update ===');
    console.log('Current view:', currentView);
    console.log('Active preset:', activePreset ? 'Set' : 'Not set');
    console.log('Timer state:', state);
    
    if (currentView === 'session' && !activePreset) {
      console.error('ERROR: Session view but no activePreset!');
    }
  }, [currentView, activePreset, state]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0E1A2F] overflow-hidden">
      {/* Debug Panel - Always visible */}
      <DebugPanel 
        currentView={currentView}
        activePreset={activePreset}
        selectedProduct={selectedProduct}
        elapsed={elapsed}
        state={state}
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
          
          {currentView === 'session' && (
            <>
              {console.log('Session view active, activePreset:', activePreset)}
              {!activePreset ? (
                <div className="text-white p-8">
                  ERROR: No active preset set!
                  <button onClick={() => setCurrentView('home')} className="ml-4 p-2 bg-blue-500">
                    Go Home
                  </button>
                </div>
              ) : (
                <>
                  {console.log('Rendering ActiveSession:', { currentView, activePreset, state, elapsed })}
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
                </>
              )}
            </>
          )}
        </AnimatePresence>
        
        {/* History Modal */}
        <AnimatePresence>
          {showHistory && (
            <HistoryView
              onClose={() => setShowHistory(false)}
              onQuickStart={(session) => {
                // TODO: Implement quick start from history
                console.log('Quick start from:', session);
              }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Toaster for notifications */}
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;