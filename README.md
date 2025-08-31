# MaengMe Timer

Precision dose tracking with radial timeline visualization and predictive lap hints.

## Features

- **Precision Timer** - RAF-based millisecond accuracy (m:ss.mmm format)
- **Lap Tracking** - Quick-tap chips for Onset, Peak, Tail, No Effect
- **Radial Timeline** - Visual progress ring with lap markers
- **Prime Hints** - AI-powered predictions based on your history (±20% window)
- **Session History** - Browse past sessions with detailed lap data
- **Data Export/Import** - Backup and restore your tracking data
- **PWA Support** - Works offline as a Progressive Web App
- **Liquid Glass UI** - Beautiful glassmorphism design with smooth animations

## Quick Start

```bash
cd app/frontend
npm install
npm run dev
```

Visit http://localhost:5173/

## Build & Deploy

```bash
npm run build    # Production build
npm run preview  # Preview production build
npm test         # Run unit tests
```

## Tech Stack

- React 18 + TypeScript
- Vite + PWA Plugin
- Tailwind CSS (Liquid Glass theme)
- Framer Motion (animations)
- Dexie (IndexedDB wrapper)
- Vitest (testing)

## Project Structure

```
app/frontend/
├── src/
│   ├── components/     # UI components
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript definitions
│   ├── store/          # Database layer
│   └── utils/          # Helper functions
├── public/
│   └── products/       # Product images
└── design/
    └── reference_mocks/ # UI mockups
```

## Key Components

- **TimerDisplay** - Large time display with glass morphism
- **RadialTimeline** - SVG ring visualization with lap segments
- **LapChip** - Tap-to-log lap type buttons
- **LapList** - Scrollable list of logged laps
- **HistoryView** - Browse past sessions
- **SettingsView** - Configure prime hints and export data

## Disclaimer

This app is for informational purposes only. Not medical advice.

## License

Proprietary - All rights reserved