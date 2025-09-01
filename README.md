# MaengMe 🌿

> Precision kratom session tracking with stopwatch-style timing and real-time phase monitoring.

![MaengMe Home Screen](./docs/screenshot.png)

## What is MaengMe?

MaengMe is a React Progressive Web App (PWA) designed for tracking kratom sessions with scientific precision. It provides real-time timing, phase tracking, effect logging, and personalized insights to help users understand their experiences better.

### Key Features

- **⏱️ Precision Timing**: Stopwatch-style session tracking with phase monitoring
- **📊 Real-Time Visualization**: Live bell curve showing expected vs actual timeline
- **💊 Product Management**: Track different strains, brands, and preparations
- **📈 Effect Logging**: Log intensity and effects throughout your session
- **🎯 Personalized Insights**: Learn your patterns over time
- **📱 PWA Support**: Works offline, installable on any device
- **🔒 Privacy-First**: All data stored locally on your device

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Data**: Dexie.js (IndexedDB wrapper)
- **PWA**: Service Worker + Web App Manifest
- **Design**: Vision Pro-inspired glass morphism

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern browser with PWA support

### Installation

```bash
# Clone the repository
git clone https://github.com/snahrup/maengme.git
cd maengme

# Navigate to frontend
cd app/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Start a Session**: Click "Start New Session" from the home screen
2. **Select Product**: Choose from preset products or add custom ones
3. **Configure Dose**: Set amount and preparation method
4. **Track Session**: Monitor real-time phase progression
5. **Log Effects**: Tap to log intensity and effect types
6. **Review History**: Access past sessions for insights

## Project Structure

```
maengme/
├── app/
│   └── frontend/          # React PWA application
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── data/        # Product database
│       │   ├── design/      # Design tokens
│       │   ├── hooks/       # Custom React hooks
│       │   └── types/       # TypeScript types
│       └── public/         # Static assets
├── docs/                  # Documentation
│   ├── PRD.md            # Product requirements
│   ├── SPEC.md           # Technical specifications
│   └── handoff.md        # Session continuity log
└── README.md
```

## Design Philosophy

MaengMe uses a Vision Pro-inspired glass aesthetic with:
- 5-15% opacity white components
- Subtle backdrop blur effects
- Smooth animations and transitions
- High contrast for readability
- Accessibility-first approach

## Privacy & Data

- **Local-First**: All data stored in browser's IndexedDB
- **No Tracking**: No analytics or third-party services
- **Export/Import**: Full control over your data
- **Delete Anytime**: One-click data deletion

## Safety Notice

⚠️ **Informational Only**: This app is for informational purposes only. It is not medical advice. Always consult healthcare providers for medical decisions.

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/snahrup/maengme/issues)
- **Discussions**: [GitHub Discussions](https://github.com/snahrup/maengme/discussions)

## Roadmap

### Current Sprint (Q1 2025)
- [ ] Timer reliability improvements (epoch-based)
- [ ] Timer-tap logging interaction
- [ ] Phase ring visualization
- [ ] Age gate & consent flow

### Future Features
- [ ] Session Stories (shareable summaries)
- [ ] Confidence-based predictions
- [ ] Progressive disclosure onboarding
- [ ] Cloud sync (optional, E2E encrypted)

---

Built with 💚 by the MaengMe team