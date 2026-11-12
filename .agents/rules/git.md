---
trigger: model_decision
description: "How changes are committed, in every project."
---

# Git

Job: how changes are committed, in every project.
Source: AGENTS.md ("one change at a time").

## Rules

- One requirement or one rules file per commit. Message format: `FR-05: short description`. Why: matches the change unit in AGENTS.md, so each commit can be reviewed or reverted alone.
- Work on a branch named after the change, for example `fr-05-book-room`. Never commit to `main`. Why: `main` stays releasable.
- Commit only after the user approves the change. Never push. Why: AGENTS.md says stop after each change and wait, and the user decides what leaves the machine.
- Never commit `.env` files or any key. Why: git history keeps them forever.
- Never force-push or rewrite history. Why: it destroys work that cannot be recovered.
