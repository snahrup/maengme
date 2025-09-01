# MaengMe Design Decisions Document

> Captured from audit review session - January 2025
> Status: Reviewed and refined, not yet implemented

## Core Architecture Decisions

### Timer System (P0 - LOCKED)
- **Decision**: Epoch-based math with `pausedAt[]`/`resumedAt[]` arrays
- **Implementation**: Persist `epochStart`, compute elapsed as `Date.now() - epochStart - pausedDuration`
- **Recovery**: Show toast if drift > 1s: "Recovered from background (+X.Xs)"
- **Rationale**: UI timers are unreliable when backgrounded; epoch math ensures accuracy

### Logging Interaction (P0 - LOCKED)
- **Decision**: Timer itself is the logging trigger
- **Tap timer**: Radial intensity slider appears as ring around it
- **Long-press timer**: Opens detailed log (effects/tags/notes)
- **Accessibility**: Small "Log" text button below timer for VoiceOver
- **While logging**: Lock scroll with pointer-capture, dismiss on release/tap-out
- **Rationale**: Zero reach issues, zero extra chrome, natural focus point

### Safety & Legal (P0 - LOCKED)
- **Decision**: Age gate, consent flow, harm-reduction cards required
- **Implementation**: First-run consent, "Not medical advice" in Settings + footer
- **Safety cards**: Hydration reminders, redose spacing warnings, adverse signs
- **Cool-down**: Warning if redose < N minutes since peak
- **Rationale**: Legal requirement for this category

### Performance & Particles
- **Decision**: Minimal particles by default (24-36), no connection lines
- **Cinematic Mode**: Toggle for full particle effects (off by default)
- **Adaptive throttle**: If FPS < 48 for >2s, reduce particles 40-60%
- **Glass aesthetic**: Keep but tune light
- **Rationale**: Preserve brand identity without burning performance budget

### Ghost Curve & Personalization
- **Decision**: Percentile bands (P25-P75) with thin median line
- **Confidence scoring**: Weight by recency, time-of-day, dose match, product match
- **UI**: Show Low/Medium/High confidence only
- **Personalization**: Only after enough like-for-like sessions
- **Rationale**: Avoid false precision; be honest about uncertainty

### Redose Visualization
- **Decision**: Main curve + vertical dose markers + subtle additive shading
- **Depth on demand**: Tap marker for per-dose curve preview
- **Long-press**: Pin individual dose curves
- **Rationale**: Avoid clutter while providing detailed info when needed

### Phase Ring (P0 - NEW)
- **Decision**: Radial phase indicator around timer
- **Segments**: Visual distinction for Onset/Peak/Tail
- **Linear timeline**: Remains as expandable detail view
- **Rationale**: More scannable and thumb-reachable than linear bar

### Progressive Disclosure
- **Decision**: Simple Mode for first 3 sessions
- **Features**: Timer + quick log + minimal hints
- **Unlock**: Gradually reveal viz features
- **Override**: "Show everything" switch available anytime
- **Rationale**: Reduce cognitive load for new users

### Data & Privacy (LOCKED)
- **Decision**: On-device by default, optional E2E sync
- **Implementation**: Append-only event stream + periodic snapshots
- **Export**: One-tap CSV/PDF export
- **Delete**: "Delete all data" with hold-to-confirm
- **Rationale**: Privacy-first, user owns their data

## Priority Adjustments

### Promoted to P0
- Home IA with obvious Quick Start
- Phase Ring implementation
- Timer-tap logging interaction

### Promoted to P1
- Session Stories share cards (retention driver)

## Implementation Order

### Sprint 1: Core Safety & Timer
1. Epoch-based timer with pause/resume
2. Background recovery with drift detection
3. Timer-tap → radial slider interaction
4. Age gate & consent flow

### Sprint 2: Visualization & Personalization
1. Phase ring around timer
2. Percentile bands with confidence
3. Redose markers + additive shading
4. Simple Mode for onboarding

### Sprint 3: Performance & Polish
1. Particle system (24-36, no lines)
2. Cinematic Mode toggle
3. Service worker offline queue
4. Crash recovery via event stream

### Sprint 4: Retention & Share
1. Session Stories share cards
2. Export (CSV/PDF)
3. Presets & quick dose
4. Home IA reorganization

## Confidence Algorithm

```javascript
confidenceScore = (
  recencyWeight * 0.4 +      // exp decay over 30 days
  timeOfDayMatch * 0.3 +     // ±90min window
  doseMatch * 0.2 +          // exact=1, ±20%=0.5, else=0
  productMatch * 0.1         // exact=1, brand=0.5, strain=0.3
)
// Buckets: <0.3=Low, 0.3-0.7=Medium, >0.7=High
```

## Metrics to Track
- North star: % of sessions with ≥3 logs
- Time-to-first-log
- Median logs/session
- 7-day return rate
- Cancel rate on radial slider

## Technical Guardrails
- Use epoch math for all timing
- Batch Dexie writes during rapid logs (250-500ms flush)
- Feature-flag blur and connection lines
- Consider OffscreenCanvas + Worker for heavy viz
- Cache gradients, reuse canvas buffers

## QA Test Scenarios
1. Lock screen mid-session → resume accuracy
2. Redose at T+45 → combined curves
3. Time-zone change → session integrity
4. Low-GPU device → graceful degradation
5. Airplane mode → offline functionality
6. Rapid logs → UI responsiveness
7. prefers-reduced-motion → simplified animations
8. Color-blind simulation → readable UI
9. Long session (>4h) → memory bounded
10. Hard refresh → recovery via timestamps
11. VoiceOver/TalkBack → full accessibility
12. Export & delete → data integrity

## Status
- **Documented**: January 2025
- **Reviewed**: Yes
- **Implemented**: Not yet
- **Next Step**: Fix current console errors, then begin Sprint 1