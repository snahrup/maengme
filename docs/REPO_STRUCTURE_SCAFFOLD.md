# Repo Structure Scaffold (for Claude)

Target monorepo structure:

```
app/
  frontend/               # Vite + React + TS + Tailwind + Dexie
    public/
      products/           # product images (from 06_products/images)
    src/
      data/products.json  # from 06_products/products.json
      design/tokens.json  # from DESIGN_TOKENS.json
      components/         # TimerHero, ControlsBar, LapChips, RadialTimeline, LapList
      store/              # session state (RAF timer), Dexie db
      utils/              # time/prime/csv helpers
  backend/                # FastAPI stubs
docs/
  PRD.md, SPEC.md, API_CONTRACTS.md, DATA_MODEL.md, UX_COPY.md, TASKS.md
  prompts/ (CLAUDE_PASTE_BLOCK.txt, VEO_PROMPT_RADIAL.txt)
  addons/ (RADIAL_PRIME.md)
  team/ (BMAD docs)
design/
  reference_mocks/        # UI mock images
```

Use `REPO_FILE_PLAN.json` to move each file from this upload into its destination.
