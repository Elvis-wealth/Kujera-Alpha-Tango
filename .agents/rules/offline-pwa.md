---
trigger: glob
description: "Data budgets, caching, the check-in code and desk offline mode."
globs: "src/app/**/*.tsx, **/sw.js"
---

# Offline and PWA

Job: data budgets, caching, the check-in code and desk offline mode.
Source: PRD v4.1 FR-05, FR-21, FR-22, FR-23, FR-26, Section 8.6; founder font decision of 11 November 2026.

## Rules

- Member routes load 500 KB or less of compressed JavaScript and CSS on first visit, as reported by `next build`. Why: members buy small data bundles, and a slow first screen is a reason to stop using the app.
- Member routes import nothing from `/owner` or `/desk`, including the camera scanner. Why: owner code would break the member budget.
- The member summary response is 3 KB or less, checked by a test on the JSON byte length. Why: it runs on every open.
- `/api/space-info` sends an `ETag` built from the latest `updatedAt` across plans, rooms, info entries, hours and Wi-Fi, and answers `304 Not Modified` when the phone's copy matches. Why: space info changes rarely, so a repeat visit should cost almost no data.
- Compress a transfer photo on the phone to 150 KB or less before upload, and refuse larger files. Why: a full-size photo costs more data than the rest of the app.
- Use one self-hosted font, Plus Jakarta Sans variable, weights 400 to 600, as two woff2 files: Latin and Latin Extended with their `unicode-range` (`typography.md`). Together they stay under 50 KB. Use one SVG logo and no other images in the app shell. Why: one small font is affordable, but more fonts and images break the first-load budget.
- The service worker caches the app shell only, never an API response. Why: API responses hold private data that must not outlive a logout.
- On a member phone, IndexedDB holds the summary snapshot, the latest 12 invoices, the check-in secret and the last space info response, each with `fetchedAt`. Logout clears all of it. Why: the member needs their plan and pass with no signal, and nobody else may see them after logout.
- Owner screens are online only. Do not cache money view or Ask data. Why: business figures must never show stale on a phone that someone else may pick up.
- The check-in code is TOTP with 30-second steps. The door accepts one step either side. The QR holds `KJ:{memberCode}:{code}`, and the screen also shows the 6-character code. Why: a rotating code cannot be passed on as a screenshot.
- When the door scan fails, the pass screen shows "If scanning fails, give the desk your phone number." Why: a phone clock that is off must not lock a member out.
- The door roster cache holds member code, name, last 4 phone digits, effective status, `endDate` and `provisionalUntil`, with no secrets and no money. It refreshes every 15 minutes and works offline for 4 hours after the last refresh. After that the screen says "Roster too old. Check members by name and write them down." Why: an older roster can let an expired member in.
- The door switches to offline mode when the server cannot be reached for 10 seconds. Why: a member must not wait at the door for a timeout.
- Offline check-ins are queued with their scan time and sent on reconnect. The server checks each code against its scan time, and failed codes show on the owner's money view. Why: offline entry is accepted on trust, so it must be checked later.
