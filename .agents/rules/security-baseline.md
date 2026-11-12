---
trigger: glob
description: "App-level security rules that hold in every project."
globs: "src/**/*.ts, src/**/*.tsx"
---

# Security baseline

Job: app-level security rules that hold in every project.
Source: PRD v4 Sections 8.1 and 8.5.

## Rules

- Every Route Handler and Server Action resolves the session before any other work, and returns 401 when there is none. Why: an action that runs before the session check can act for nobody, or for anybody.
- Validate every request body, query string and route parameter with `zod`, and reject unknown fields. Why: an unchecked field is how a forged member or organisation ID gets in.
- Never take an organisation ID, member ID or role from the request. Take them from the session. Why: the client controls the request, so it can send any ID it likes.
- Never log request bodies, passwords, sign-in tokens or links, check-in secrets, payment keys or private record values. Why: logs are copied to more places than the database and have no row-level security.
- Error responses never include stack traces, SQL or other records' IDs. Why: they show an attacker how the system is built.
- Start every module that reads secrets or the database with `import "server-only"`. Why: the build then fails before such a module can reach the browser.
- State-changing requests use POST, PUT, PATCH or DELETE, never GET. Why: SameSite cookies do not protect GET requests from cross-site use.
