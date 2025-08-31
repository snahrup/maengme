# Data Model (TypeScript)
type MilestoneLabel = 'Initial Onset'|'Peak'|'Tail'|'No Effect'|string;
interface DoseSession { id: string; medicationName?: string; capsulesTaken: number; strengthMgPerCap?: number; startTime: string; endTime?: string; notes?: string; }
interface LapEvent { id: string; sessionId: string; label: MilestoneLabel; timestamp: string; elapsedMs: number; intensity?: number; tags?: string[]; notes?: string; }
interface Settings { defaultMilestones: MilestoneLabel[]; customMilestones: MilestoneLabel[]; hapticsEnabled: boolean; privacyLock: boolean; enableRadial: boolean; enablePrime: boolean; }
