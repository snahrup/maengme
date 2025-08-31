# SPEC
Stack: React 18 + Vite + TS + Tailwind + Framer Motion + Dexie; Day.js optional.
Components: TimerHero, ControlsBar, LapChips, RadialTimeline, LapList,
DoseStartSheet (tiny), HistoryView, SettingsView.
State: idle→running→paused→completed (RAF timer).
Acceptance: Lap ≤1 tap; PWA offline; a11y; Liquid Glass tokens; RadialTimeline smooth at 60fps.
