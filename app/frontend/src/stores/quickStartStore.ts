import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuickStartSettings {
  lastProductId: string | null;
  lastProductName: string | null;
  lastDose: number;
  lastMethod: string;
  lastUsed: number | null;
}

interface QuickStartState extends QuickStartSettings {
  setLastSession: (productId: string, productName: string, dose: number, method: string) => void;
  canQuickStart: () => boolean;
  getQuickStartData: () => QuickStartSettings | null;
  clearQuickStart: () => void;
}

const DEFAULT_STATE: QuickStartSettings = {
  lastProductId: null,
  lastProductName: null,
  lastDose: 3,
  lastMethod: 'toss-wash',
  lastUsed: null
};

export const useQuickStartStore = create<QuickStartState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setLastSession: (productId, productName, dose, method) => {
        set({
          lastProductId: productId,
          lastProductName: productName,
          lastDose: dose,
          lastMethod: method,
          lastUsed: Date.now()
        });
      },

      canQuickStart: () => {
        const { lastProductId, lastUsed } = get();
        if (!lastProductId || !lastUsed) return false;
        
        // Check if last session was within 7 days
        const daysSince = (Date.now() - lastUsed) / (1000 * 60 * 60 * 24);
        return daysSince <= 7;
      },

      getQuickStartData: () => {
        const state = get();
        if (!state.canQuickStart()) return null;
        
        return {
          lastProductId: state.lastProductId,
          lastProductName: state.lastProductName,
          lastDose: state.lastDose,
          lastMethod: state.lastMethod,
          lastUsed: state.lastUsed
        };
      },

      clearQuickStart: () => {
        set(DEFAULT_STATE);
      }
    }),
    {
      name: 'maengme-quickstart'
    }
  )
);