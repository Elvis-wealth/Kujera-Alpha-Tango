---
name: add-member-screen
description: Use when building or changing a member-facing screen in the Kujera PWA (FR-20 to FR-26). Covers offline cache, freshness lines and figure formatting.
---

# Add a member screen

## Before you start

1. Name the FR ID you are building. It must be FR-20 to FR-26. If it is not, stop and ask.
2. Confirm the Route Handler this screen reads from exists. If it does not, run the `add-route-handler` skill first.
3. List every figure the screen shows: plan, credits, money or visits.

## Steps

1. Create the page under `src/app/` as a Server Component, outside the `/owner` and `/desk` routes.
2. Move only the parts that need taps or browser storage into a client component.
3. Import nothing from `/owner` or `/desk` code.
4. Fetch the screen's data from its one Route Handler.
5. After a successful fetch, save to IndexedDB only the items `.agents/rules/offline-pwa.md` allows, each with `fetchedAt`.
6. When the fetch fails, render from IndexedDB and show the offline freshness line.
7. Pass every figure on your list through the shared money and time formatters, with its source and freshness line.
8. Add the empty state and the error state written in the FR.

## Stop and ask when

- The FR shows a figure with no source record named.
- The screen needs data that IndexedDB is not allowed to hold.
- The screen would show anything about another member, including who booked a room.

## Done when

- `next build` reports the member route inside the first-load budget in `.agents/rules/offline-pwa.md`.
- With the network switched off in the browser, the screen opens from cache and shows the offline freshness line.
- Every figure on your list has a source and freshness line.
- The `testing.md` definition of done passes.
