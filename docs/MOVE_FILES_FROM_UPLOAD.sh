#!/usr/bin/env bash
# Usage: bash MOVE_FILES_FROM_UPLOAD.sh /path/to/uploaded_bundle /path/to/repo_root
set -euo pipefail
UPLOAD_DIR="${1:-.}"
REPO_DIR="${2:-./app_repo}"

echo "→ Moving files from $UPLOAD_DIR into $REPO_DIR"

mkdir -p "$REPO_DIR/app/frontend/public/products"
mkdir -p "$REPO_DIR/app/frontend/src/data"
mkdir -p "$REPO_DIR/app/frontend/src/design"
mkdir -p "$REPO_DIR/docs/prompts" "$REPO_DIR/docs/addons" "$REPO_DIR/docs/team"
mkdir -p "$REPO_DIR/design/reference_mocks"
mkdir -p "$REPO_DIR/backend"

# Docs
cp -v "$UPLOAD_DIR/02_project_prd_spec/PRD.md" "$REPO_DIR/docs/PRD.md"
cp -v "$UPLOAD_DIR/02_project_prd_spec/SPEC.md" "$REPO_DIR/docs/SPEC.md"
cp -v "$UPLOAD_DIR/02_project_prd_spec/API_CONTRACTS.md" "$REPO_DIR/docs/API_CONTRACTS.md"
cp -v "$UPLOAD_DIR/02_project_prd_spec/DATA_MODEL.md" "$REPO_DIR/docs/DATA_MODEL.md"
cp -v "$UPLOAD_DIR/02_project_prd_spec/UX_COPY.md" "$REPO_DIR/docs/UX_COPY.md"
cp -v "$UPLOAD_DIR/02_project_prd_spec/TASKS.md" "$REPO_DIR/docs/TASKS.md"

# Tokens
cp -v "$UPLOAD_DIR/02_project_prd_spec/DESIGN_TOKENS.json" "$REPO_DIR/app/frontend/src/design/tokens.json"

# Prompts/Addons
cp -v "$UPLOAD_DIR/03_opening_prompt/CLAUDE_PASTE_BLOCK.txt" "$REPO_DIR/docs/prompts/CLAUDE_PASTE_BLOCK.txt"
cp -v "$UPLOAD_DIR/03_opening_prompt/CLAUDE_START_HERE.md" "$REPO_DIR/docs/prompts/CLAUDE_START_HERE.md"
cp -v "$UPLOAD_DIR/05_veo_prompts/VEO_PROMPT_RADIAL.txt" "$REPO_DIR/docs/prompts/VEO_PROMPT_RADIAL.txt"
cp -v "$UPLOAD_DIR/04_addons/ADDON_SPEC.md" "$REPO_DIR/docs/addons/RADIAL_PRIME.md"

# Products
cp -v "$UPLOAD_DIR/06_products/products.json" "$REPO_DIR/app/frontend/src/data/products.json"
cp -vr "$UPLOAD_DIR/06_products/images" "$REPO_DIR/app/frontend/public/products"

# BMAD team docs
cp -vr "$UPLOAD_DIR/01_generic_bundle/." "$REPO_DIR/docs/team/"

# Design assets
cp -vr "$UPLOAD_DIR/assets" "$REPO_DIR/design/reference_mocks"

echo "✅ Done. Now run the app's setup per README."
