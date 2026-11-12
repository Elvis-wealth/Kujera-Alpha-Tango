---
trigger: glob
description: 'What every change must be tested with, and what "done" means, in every project.'
globs: "**/*.test.ts, **/*.test.tsx, src/test/**"
---

# Testing

Job: what every change must be tested with, and what "done" means, in every project.
Source: AGENTS.md; PRD v4 Section 6.

## Rules

- Use `vitest` for unit tests and `@playwright/test` for browser tests, once `dependencies.md` approves them. Why: one runner per kind of test, and no package without approval.
- Put each test file next to the code it tests, named `*.test.ts` or `*.test.tsx`. Why: a missing test is then easy to spot.
- Never run a test that needs a database. The user runs those tests. Why: AGENTS.md forbids any command that connects to a database.
- Mock every paid or rate-limited outside service in tests. Never call the real service. Why: real calls can move real money and use up free quotas.
- Build test data only through the shared test-data builders in `src/test/builders.ts`. When a test needs a new kind of record, add a builder there instead of building the record inside the test. Why: when the data model changes, one module changes instead of every test.
- Never skip, delete or loosen a failing test to make a change pass. Why: that hides the bug instead of fixing it.
- A change is done when type-check, lint and all non-database tests pass, every Given / When / Then has a test, and the response ends with its Assumptions list. Why: "done" then has one checkable meaning.
