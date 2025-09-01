# Data Model Notes

- Sessions/laps: time fields immutable; **notes** editable.
- Calculations: onset = first 'Initial Onset' − start; peak = first 'Peak' − start; tail = 'No Effect' − 'Peak'.
- Export: JSON (all tables) + CSV (summary + per-lap).
