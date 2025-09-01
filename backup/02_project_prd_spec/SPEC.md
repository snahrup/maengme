# Build Spec — Medication Stopwatch

## Stack
- **Frontend:** React 18 + Vite + TypeScript + Tailwind, Framer Motion, Dexie (IndexedDB), Day.js.
- **Backend:** FastAPI (future), pydantic models; in v1 backend not required; include stubs.
- **PWA:** manifest, service worker, add-to-home, offline support.

## Core Components
- `GlassPanel`, `GlassChip`, `GlassButton`, `Icon`.
- `TimerHero` — large time display, format switch rule at 60m.
- `ControlsBar` — Start/Pause/Resume, Lap, End.
- `LapChips` — categorical lap quick-select.
- `LapList` — list of laps with elapsed & timestamp; swipe actions.
- `LapDetailsDrawer` — label, intensity 1–5, tags, notes.
- `DoseStartModal` — preset select, capsules stepper, optional strength/notes.
- `PresetModal` (v2) — product image, brand/strain, effects, tabs: Overview, Effects, Interactions, Vendor.
- `HistoryView` — sessions list; detail page.
- `SettingsView` — milestone sets, privacy lock, export/import.

## State Machine
- `idle → running → paused → completed`
- Events: `START(session)`, `LAP(label)`, `PAUSE`, `RESUME`, `END`, `EDIT_LAP`, `DELETE_LAP`.
- Timer: high-res `performance.now()`; tick via `requestAnimationFrame`.

## Data Model (TS)
type UUID = string;
export type MilestoneLabel = "Initial Onset"|"Peak"|"Tail"|"No Effect"|string;
export interface DoseSession { id: UUID; medicationName?: string; capsulesTaken: number; strengthMgPerCap?: number; startTime: string; endTime?: string; notes?: string; }
export interface LapEvent { id: UUID; sessionId: UUID; label: MilestoneLabel; timestamp: string; elapsedMs: number; intensity?: number; tags?: string[]; notes?: string; }
export interface Settings { defaultMilestones: MilestoneLabel[]; customMilestones: MilestoneLabel[]; hapticsEnabled: boolean; privacyLock: boolean; }

## IndexedDB (Dexie)
- Tables: `sessions` (by `startTime`), `laps` (by `sessionId+timestamp`), `settings` (singleton).

## Accessibility
- Large hit targets; logical focus; ARIA labels; prefers-reduced-motion fallbacks.

## Acceptance Criteria
- Timer shows **m:ss:ms**; after 60m, **h:mm:ss**.
- Lap capture ≤ 1 tap from main screen; labeled chips visible.
- Lap edit: add notes and intensity; saved persistently.
- History shows session stats (time to onset/peak, tail length).
- Installable PWA; offline works for core flows.
- "Not medical advice" disclaimer present.
