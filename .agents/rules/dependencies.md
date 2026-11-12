---
trigger: glob
description: "List the packages the agent may install, and how to ask for any other."
globs: "package.json"
---

# Dependencies

Job: list the packages the agent may install, and how to ask for any other.
Source: AGENTS.md Stack and "Ask before adding any package"; PRD v4 Section 8.1.

## Rules

- Install only packages in the Approved table whose Version cell holds an exact version. Why: a row without a version is a proposal, not an approval, and AGENTS.md makes every unapproved package a question.
- Pin exact versions in `package.json`, with no `^` or `~`. Why: a silent upgrade can change behaviour between two sessions.
- Never add a UI framework, CSS framework, PWA framework, second ORM or auth library. Why: each one breaks the first-load budget in `offline-pwa.md` or replaces part of the locked stack.
- To ask for a package, give its name, exact version, the FR it serves, and its compressed size. Why: the user can approve or refuse in one reply.

## Approved

| Package | Version | Use |
|---|---|---|
| `next` | | App framework |
| `react`, `react-dom` | | Required by Next.js |
| `typescript` | | Language |
| `prisma`, `@prisma/client` | 6.x (exact version to fill) | ORM, per AGENTS.md Stack |
| `zod` | | Input validation (`security-baseline.md`) |
| `server-only` | | Build fails if a server module reaches the browser (`security-baseline.md`) |
| `argon2` | | Password hashing (`roles-permissions.md`) |
| QR code generator (name to fill) | | Check-in pass QR (FR-21) |
| TOTP library (name to fill) | | Check-in code (FR-21, FR-04) |
| QR scanner for the door camera (name to fill) | | Door check-in scan, `/desk` only (FR-04) |
| `lucide-react` | | Icons, imported by name (`design-tokens.md`) |
| `@fontsource-variable/plus-jakarta-sans` | | Self-hosted font files, Latin and Latin Extended (`typography.md`) |
| `vitest` | | Unit tests (`testing.md`) |
| `@playwright/test` | | Browser tests (`testing.md`) |
| `eslint`, `eslint-config-next` | | Lint (`testing.md`) |

Every Version cell is empty until the user fills it. Until then, every row is a proposal.

## Commands the agent may run

| Command | When |
|---|---|
| `prisma validate` | After creating `prisma/schema.prisma` during scaffolding |
| `prisma generate` | After `prisma validate` passes, and whenever the Prisma client needs rebuilding |
| `next build`, type-check, lint, non-database tests | Any time (`testing.md`) |

Every other `prisma` command is banned (`data-model.md`). Why: the two above read only the schema file and never open a database connection.
