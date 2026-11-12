---
name: add-route-handler
description: Use when building or changing a Next.js Route Handler for a signed-in owner, desk helper or member in Kujera (FR-01 to FR-18, FR-20 to FR-26). Not for webhooks, the daily job or the invite link screen.
---

# Add a route handler

## Before you start

1. Name the FR ID you are building.
2. Find the route path for that FR in the `AGENTS.md` route table. If the route is not listed, stop and ask.
3. Find the roles allowed for this action in `.agents/rules/roles-permissions.md`. If the action is not in the table, stop and ask.

## Steps

1. Create the handler file under `src/app/` at the route path. Export one named function per HTTP method.
2. Call the session helper from `src/server/session.ts` as the first line of the handler.
3. Write one `zod` schema for the body, query string and route parameters together. Parse the request with it.
4. Check the session role against the roles you found. Refuse every other role with the error shape from `.agents/rules/code-conventions.md`.
5. For a member request, take the member ID from the session only, never from the request.
6. Open one transaction with the RLS client from `src/server/db.ts`. Do every read and write for this action inside it.
7. Check whether this FR is on the audit list in `.agents/rules/logging-metrics.md`. If it is, write the AuditLog row inside the same transaction.
8. Return the success body, or the error shape from `.agents/rules/code-conventions.md`.
9. Run the `write-acceptance-tests` skill for this FR.

## Stop and ask when

- The action needs a table, column or SQL function that does not exist.
- The FR does not say what the handler returns.

## Done when

- The handler file exists at the route path from `AGENTS.md`.
- A test shows every role outside the table is refused.
- Lint passes. This proves the handler opens no database client of its own.
- The `testing.md` definition of done passes.
- Your response names the FR ID.
