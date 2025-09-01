# API Contracts (v2/v3 Ready)

## v2 — Product Lookup (stub in v1)
GET /api/products/search?q=<string> → { items: [{ id, brand, name, strain, form, strengthPerCapMg, imageUrl }] }
GET /api/products/{id} → { id, brand, name, strain, effects: string[], useCases: string[], interactions?: string[], imageUrl }

## v3 — AI Assistant
Requires consent + profile:
GET /api/profile / PUT /api/profile
POST /api/ai/query → { answer, cites?: string[] }
Guardrails: never prescribe; provide ranges & public references; encourage clinician consult.
