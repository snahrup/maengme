import { useState, useEffect } from 'react';

interface FirstRunState {
  hasSeenSessionCoach: boolean;
  hasSeenIntensityGuide: boolean;
  hasCompletedFirstSession: boolean;
}

const STORAGE_KEY = 'maengme-first-run';

export const useFirstRun = () => {
  const [state, setState] = useState<FirstRunState>({
    hasSeenSessionCoach: false,
    hasSeenIntensityGuide: false,
    hasCompletedFirstSession: false
  });

  useEffect(() => {
    // Load state from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse first run state:', e);
      }
    }
  }, []);

  const markSeen = (key: keyof FirstRunState) => {
    const newState = { ...state, [key]: true };
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const resetAll = () => {
    const newState = {
      hasSeenSessionCoach: false,
      hasSeenIntensityGuide: false,
      hasCompletedFirstSession: false
    };
    setState(newState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    isFirstRun: !state.hasSeenSessionCoach,
    ...state,
    markSeen,
    resetAll
  };
};