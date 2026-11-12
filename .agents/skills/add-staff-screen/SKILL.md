---
name: add-staff-screen
description: Use when building or changing an owner screen under /owner or a door and desk screen under /desk in Kujera (FR-01 to FR-16).
---

# Add an owner or desk screen

## Before you start

1. Name the FR ID you are building. It must be FR-01 to FR-16. If it is not, stop and ask.
2. Find the roles allowed for this screen in `.agents/rules/roles-permissions.md`. If the action is not in the table, stop and ask.
3. Choose the route: `/desk` when DESK is allowed, otherwise `/owner`.
4. Confirm the Route Handler this screen calls exists. If it does not, run the `add-route-handler` skill first.

## Steps

1. Create the page under `src/app/` in the route you chose. Check the session role on the server before rendering.
2. Keep every import inside the owner and desk bundles. Import nothing from member pages, and import nothing from `/owner` into `/desk`.
3. Show the subscription banner from `org_subscription_status()` at the top. It blocks nothing.
4. Put the member lookup the FR names first on the screen, by code scan, last four phone digits or name.
5. Place the FR's action directly after the lookup, with no extra screens between them.
6. Submit the action to the screen's Route Handler.
7. After success, show "Recorded by [name]" on every record the action created.
8. Show every status with the status colour, icon and label from `.agents/rules/design-tokens.md`.
9. Add the error states written in the FR.

## Stop and ask when

- The FR names an action the roles table does not cover.
- A desk screen would need money view, Ask or owner-only data.

## Done when

- A `/owner` page refuses a DESK session, and a `/desk` page loads for OWNER and DESK only.
- The page shows the banner when subscription status is expired.
- The `testing.md` definition of done passes.
