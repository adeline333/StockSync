#!/bin/bash
# Commits each modified/untracked file as a separate commit.
# Run from the repo root with Git Bash:  bash commit_each.sh

set -e

# ── Modified (tracked) files ──────────────────────────────────────────────────
git add backend/controllers/reportController.js
git commit -m "fix(reports): update report controller"

git add backend/controllers/transferController.js
git commit -m "fix(transfers): update transfer controller"

git add frontend/src/pages/MyTransfers.jsx
git commit -m "feat(frontend): update MyTransfers page"

# ── New (untracked) files ─────────────────────────────────────────────────────
git add backend/migrateReceivedQuantity.js
git commit -m "chore(db): add received quantity migration script"

git add backend/test_report.js
git commit -m "test(reports): add report test script"

git add frontend/fix.cjs
git commit -m "chore(frontend): add fix script"

git add frontend/fix2.cjs
git commit -m "chore(frontend): add fix2 script"

git add seq.jpg
git commit -m "docs: add sequence diagram image"

# ── Intentionally skipped ─────────────────────────────────────────────────────
# .swp  — vim swap file, should not be committed (add to .gitignore instead)

echo ""
echo "Done! All files committed individually."
git log --oneline -10
