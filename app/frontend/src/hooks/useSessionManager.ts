import { useCallback } from 'react';
import { db } from '../store/database';
import { Session, Lap } from '../types/timer';

export function useSessionManager() {
  const saveSession = useCallback(async (
    startTime: number,
    endTime: number,
    elapsed: number,
    laps: Lap[],
    productPreset?: string,
    notes?: string
  ): Promise<string> => {
    const session: Session = {
      id: Date.now().toString(),
      startTime,
      endTime,
      totalElapsed: elapsed,
      laps,
      productPreset,
      notes,
      createdAt: Date.now()
    };
    
    await db.sessions.add(session);
    return session.id;
  }, []);
  
  const deleteSession = useCallback(async (sessionId: string) => {
    await db.sessions.delete(sessionId);
  }, []);
  
  const exportSessions = useCallback(async () => {
    const sessions = await db.sessions.toArray();
    const dataStr = JSON.stringify(sessions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `maengme-export-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }, []);
  
  const importSessions = useCallback(async (file: File) => {
    const text = await file.text();
    const sessions = JSON.parse(text) as Session[];
    
    // Validate and add sessions
    for (const session of sessions) {
      if (session.id && session.startTime && session.laps) {
        await db.sessions.add(session);
      }
    }
  }, []);
  
  return {
    saveSession,
    deleteSession,
    exportSessions,
    importSessions
  };
}