import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IntensityLog {
  timestamp: number;
  value: number;
}

export interface Session {
  id: string;
  productId: string;
  productName?: string;
  dose: number;
  method: string;
  startTime: number;
  endTime?: number;
  intensityLogs?: IntensityLog[];
  notes?: string;
  peakIntensity?: number;
  totalDuration?: number;
}

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  setCurrentSession: (session: Session | null) => void;
  getLastSession: () => Session | null;
  getSessionsByDate: (date: Date) => Session[];
  clearAllSessions: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,

      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),

      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, ...updates } : session
          ),
        })),

      deleteSession: (id) =>
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== id),
        })),

      setCurrentSession: (session) =>
        set({ currentSession: session }),

      getLastSession: () => {
        const { sessions } = get();
        if (sessions.length === 0) return null;
        return [...sessions].sort(
          (a, b) => b.startTime - a.startTime
        )[0];
      },

      getSessionsByDate: (date) => {
        const { sessions } = get();
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return sessions.filter(
          (session) =>
            session.startTime >= startOfDay.getTime() &&
            session.startTime <= endOfDay.getTime()
        );
      },

      clearAllSessions: () => set({ sessions: [], currentSession: null }),
    }),
    {
      name: 'maengme-sessions',
    }
  )
);