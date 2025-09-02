# Energized Glass Theme - Design Direction

## Core Concept
Keep the sophisticated glass aesthetic while adding strategic green energy accents for moments of action and vitality.

## Visual Hierarchy

### 1. Foundation (Unchanged)
- **Glass panels**: `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(18px)`
- **Dark gradient background**: `#0B1220` to `#0E1A2F`
- **Clean, medical-grade feel**: Maintains trust and professionalism

### 2. Energy Accents (New)
- **Primary green**: `#00FF41` - Electric green for CTAs and active states
- **Green glow**: `box-shadow: 0 0 20px rgba(0, 255, 65, 0.3)`
- **Pulse animations**: 2-second gentle pulse for active elements

## Where Green Energy Appears

### High Energy (Full Green)
- ✅ Start Session button (primary CTA)
- ✅ Active timer display
- ✅ Progress rings during session
- ✅ Success confirmations

### Medium Energy (Green Accents)
- ✅ Active status indicators (small dots)
- ✅ Today's count in stats
- ✅ Selected/active navigation items
- ✅ Input field focus states

### Low Energy (Subtle Green)
- ✅ Hover states on glass panels
- ✅ Border highlights on hover
- ✅ Very subtle underglow on active cards

## What Stays Glass-Only
- ❌ Headers and titles (stay white)
- ❌ Product cards (glass until hovered)
- ❌ Navigation panels
- ❌ History items
- ❌ Settings screens

## Animation Principles
- **Subtle**: No lightning bolts or chaotic effects
- **Purposeful**: Green pulse = active/waiting
- **Smooth**: 300-500ms transitions
- **Restrained**: Max 2 animated elements at once

## Example CSS Classes
```css
/* Primary action - full green energy */
.btn-start-session {
  background: linear-gradient(135deg, #00FF41, #00D837);
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
}

/* Active timer - green with glow */
.timer-active {
  color: #00FF41;
  text-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
}

/* Glass panel with hover - subtle green */
.panel:hover {
  border-color: rgba(0, 255, 65, 0.3);
  box-shadow: 0 0 30px rgba(0, 255, 65, 0.1);
}
```

## Benefits
1. **Visual Interest**: Green adds energy without chaos
2. **Clear Hierarchy**: Users know what's actionable
3. **Brand Identity**: Unique but not overwhelming
4. **Accessibility**: Green on dark = good contrast
5. **Professional**: Maintains medical-grade trust

## Implementation Priority
1. Update Start Session button to green gradient
2. Add green glow to active timer
3. Update focus states on inputs
4. Add subtle hover effects to cards
5. Implement pulse animation for active states

This approach gives us the "energy" feel you liked from the neon concept while maintaining the clean, trustworthy glass aesthetic that works well for a wellness tracking app.