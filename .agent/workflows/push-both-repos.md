---
description: Push changes to both GitHub repositories with 2 commits for 2 contributions
---

After completing any code changes, run these two sets of commands:

**Step 1 - Commit and push to origin (mukesh_portfolio):**
```bash
git add .
git commit -m "Your commit message here"
git push origin main
```

**Step 2 - Empty commit and push to frutiger (Frutiger-portfolio):**
```bash
git commit --allow-empty -m "Sync update"
git push frutiger main
```

This creates 2 separate commits with different SHAs, giving 2 GitHub contributions.
