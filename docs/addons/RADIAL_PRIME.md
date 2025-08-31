# Add-On — Radial Timeline & Prime Chips
RadialTimeline: SVG ring with segments per lap; 0° at top (rotate -90°). Colors: Onset #1DA1FF, Peak #34C759, Tail #A8C6FF, No Effect #C8D0E0.
Prime heuristic: median of last N=20 per (medication, milestone). If |elapsed - median[next]| ≤ 20% of median[next], highlight `next` chip (inner glow + scale 1.04). Toggle in Settings.
