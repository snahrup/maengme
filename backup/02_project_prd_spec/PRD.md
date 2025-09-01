# PRD — Medication Stopwatch (Liquid Glass)

## Problem
Users need a **simple, reliable stopwatch** to track medication sessions (e.g., kratom), capturing dose start, **lap-based milestones** (Initial Onset → Peak → Tail → No Effect), and **notes** for what was experienced.

## Goals (v1)
- Start a dose with **medication preset** (brand/strain optional) and **capsules count**.
- Primary timer supports **m:ss:ms**; switches to **h:mm:ss** after 60 minutes.
- **Lap categories**: Initial Onset, Peak, Tail, No Effect (+Custom).
- **Notes** per lap; edit anytime. Session ends at No Effect or manual End.
- **History** view of past sessions with summary stats.
- **Local-first** (no account required). Share/export JSON/CSV.
- **Liquid Glass** visual system (Apple-style).

## Future (v2)
- Product search API: given brand/strain/sku, fetch **image + effects + use cases** and display a **Preset Modal** (Overview, Effects, Interactions, Vendor tabs).

## Future (v3)
- AI assistant for: personal trends, safe-use guidance, interactions, suggestions.
- **Consent-gated** enhanced profile (conditions, other meds). Strong disclaimers.

## Non-Goals
- Medical advice. The app provides **informational logs** only.
- Cloud sync in v1 (can be added later).

## Personas
- **Self-tracker** wants to understand timing & intensity.
- **Vendor/Practitioner** may request exported history.

## Success Metrics
- Time to first successful session < 30s.
- 80%+ sessions record at least one milestone.
- A11y: WCAG AA colors; VoiceOver friendly.
