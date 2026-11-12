---
trigger: glob
description: "How code is written and named, in every project."
globs: "src/**/*.ts, src/**/*.tsx, tsconfig.json"
---

# Code conventions

Job: how code is written and named, in every project.
Source: PRD v4 Section 8.1.

## Rules

- `tsconfig.json` sets `strict: true` and `noUncheckedIndexedAccess: true`. Why: the compiler then catches missing values before they reach a member.
- Never use `any`. Use `unknown` and narrow it. Why: `any` switches off the checks that protect money and IDs.
- Never use floating-point numbers for money. Why: floats round wrongly, and the storage rule in `data-model.md` depends on whole kobo.
- Use Server Components by default. Add `"use client"` only to a component that needs browser interaction. Why: every client component adds JavaScript to the phone's first load.
- API errors return `{ "error": { "code": string, "message": string } }` with a matching HTTP status. Why: every screen can then show errors the same way.
- Text shown to people uses the PRD's exact wording where the PRD gives it. Where it does not, the text says what happened and what to do next, in plain English. Why: members have nobody technical to help them.
- Use `camelCase` for variables and functions, `PascalCase` for components and types, and `kebab-case` for file names. Why: one style across sessions keeps searches and reviews simple.
- Use named exports. Use a default export only for `page.tsx`, `layout.tsx` and the other files Next.js requires it for. Route Handlers export named `GET`, `POST` and so on. Why: named exports are easier to search and rename.
- Comments explain why, not what. Why: the code already says what.
- All app code lives in `src/`. Pages and Route Handlers live in `src/app/`. Code that reads the database, secrets or the session lives in `src/server/`. Test-data builders live in `src/test/builders.ts`. Why: keeping app code apart from config and project files makes every change easy to find and lets lint rules target exact folders.
- Ask before adding any other folder under `src/`. Why: one agreed layout stops two sessions putting the same kind of code in two places.
