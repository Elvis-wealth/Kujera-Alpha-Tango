# Kujera

## Description

Kujera is a management app for a Nigerian coworking space owner, built as a PWA (a website that installs to the phone's home screen).
The owner uses it to track members, check-ins, room bookings and payments, so nobody walks in unpaid and no booked hour goes unbilled.
Members use a small part of the same app to show a check-in pass, pay, report a bank transfer, keep receipts, book rooms at their own space, and read the space's prices, house rules, FAQ, Wi-Fi and opening hours.
Kujera never receives, holds or settles members' money, takes only its own monthly fee from each space, and sends no messages except sign-in emails: sign-up confirmation, invites and password resets.

## Who uses it

- **Owner.** The main user. Signs the space up on the marketing page (FR-17), then runs it from `/owner`: members, plans, check-in, rooms, cash, transfers, online payments, the money view, Ask, helper logins, payment keys and Kujera's monthly fee. Build every screen, owner, desk and member, desktop-first for a laptop, then make it work down to a 360px Android phone.
- **Desk helper.** Not a separate user type. A login the owner creates in desk mode, at `/desk`. It can check members in, sell plans and day passes, record cash, book and hire rooms, record overruns and no-shows, and confirm or reject transfer reports. It cannot reverse payments, see the money view or Ask, or change memberships, prices, keys or staff. The full table is in `.agents/rules/roles-permissions.md`.
- **Member.** Uses the member screens on Chrome on a low-end Android phone. The data and load budgets are in `.agents/rules/offline-pwa.md`.
- **Walk-in.** A member like any other. Every member, walk-ins included, must have an email and gets an invite (FR-01).
- **Space.** Kujera's paying customer. Pays a monthly fee per location, by tier, from the owner screens (FR-15).

## One thing the agent must do well

Keep each member's private records away from every other member.

- In member requests, take the member ID only from the login session. Owner and desk requests may name a member, but the organisation ID always comes from the session, and RLS limits them to that organisation.
- Never send a record value to the language model. Never embed a record. Nothing is embedded in version one.
- Every table is covered by row-level security (RLS). A query run with no session settings must return zero rows. All database access goes through `src/server/db.ts`, the only file allowed to create a database client.
- Tables that hold one member's data carry a member ID and use the member-owned RLS policy. Do not create or change tables. If a change seems to need one, stop and ask.
- Room availability shown to a member must never include another member's ID or details.
- Store the space's payment secret key and webhook secret encrypted, in a table the app role cannot read. Never log it, return it to a phone, or select it in a member request. Rules are in `.agents/rules/security-rls.md`.

## Defined scope for the MVP

Owner features, FR-01 to FR-18:

1. **Members and plans:** FR-01, FR-02, FR-03.
2. **Check-in:** FR-04, FR-05.
3. **Rooms:** FR-06.
4. **Payments:** FR-07, FR-08, FR-09, FR-10.
5. **Money view and Ask:** FR-11, FR-12.
6. **Setup:** FR-13, FR-14, FR-15, FR-16 (space info).
7. **Sign-up and passwords:** FR-17 (space sign-up), FR-18 (passwords and reset, for everyone).

Desk mode uses only FR-01 (create and sell), FR-04 to FR-08, within the permissions table.

Member features, FR-20 to FR-26: invite and sign-in, check-in pass, plan and pay, report a transfer, receipts, book a room at their own space with credits, space info.

System work: payment webhooks (FR-30), daily job (FR-31), one effective status function (FR-32).

There are no other features. Version one launches with one space and one location. Every tenant table still carries an organisation ID.

Offline: the member's check-in pass, last known plan and invoices, and space info must open with no connection and show their "as of" time. Desk check-in must keep working when the space's internet is down (FR-05).

- **Release gate:** a release passes only with the two-member and no-settings RLS tests and the Ask test set gate (PRD 7.5).
- **Go-live gate:** go-live needs approved opening positions for every active member (FR-02) and a signed data processing agreement.

## Not in scope for the MVP

- Any AI assistant for members.
- Vector search and embeddings. Space info (FR-16, FR-26) is read as plain pages, never searched by meaning.
- Disputes, flags and the WhatsApp handoff.
- A public directory of spaces, "spaces near me", or booking at a space the member does not belong to.
- Members booking rooms by the hour without credits. The desk can still hire a room to anyone.
- Company admin and team plans, member dashboards, community feed and events.
- Any outbound message: SMS, WhatsApp, email or push notification. The only exception is sign-in emails (FR-17, FR-18, FR-20, FR-13).
- Members without an email address, and phone or PIN sign-in.
- Ask questions outside the fixed list in PRD 7.3, and free-text answers written by the model.
- Reading transfer screenshots automatically.
- Accounting software features and tax returns.
- Automatic card charging for Kujera's fee. The owner pays each monthly invoice.

## Stack

- Next.js with the App Router.
- TypeScript.
- Prisma ORM, version 6.x. Ask before using another major version.
- PostgreSQL, with the `btree_gist` extension for the booking overlap rule.
- pgvector is in the fixed stack but unused in version one (PRD Q17). Do not enable it, write a vector column or call an embedding model.
- Flutterwave for payments. Follow `.agents/rules/payments.md`. Keep these rules: one active payment reference per invoice, references never reused, every webhook's secret hash checked and every event stored once, amount checked against the invoice, and a re-check with the provider before showing Pay again. Member payments go to the space's own account. Kujera's fee goes to Kujera's own account, using Kujera's key from server configuration. Never mix the two. Write no live Flutterwave call until the "Confirm in sandbox" rows in `payments.md` are confirmed in test mode.
- Gemini free tier, for Ask question classification only. The model sees only the redacted question and the list of question IDs and periods. It never sees a record or a figure.
- The service worker is hand-written. Do not add a PWA framework. Do not add, remove or swap any framework. No email service is chosen yet (PRD Q9). Sign-up, invites and resets need one. Build no email call until `.agents/rules/roles-permissions.md` names it.

## Folder map

`AGENTS.md` (this file, in the project root), `kujera-prd-v4.md`, `kujera-design-tokens-v2.json`, `token.css`, `.agents/rules/`, `.agents/skills/` and `.agents/design-system/` are project files set by the user. Ask before creating a new top-level folder.

| Path | What it is |
|---|---|
| `kujera-prd-v4.md` | The PRD. It is the source of product facts. Earlier drafts are retired. |
| `.agents/rules/` | Detailed rules files. See "Where the detailed rules live". |
| `.agents/skills/` | Skills files set by the user. Only the user creates or edits them. |
| `sw.js` | The hand-written service worker. It caches the app shell, meaning the page code and styles with no member or business data. Ask where to place it before creating it. |
| `prisma/schema.prisma` | The Prisma schema. The agent creates it once, during scaffolding, copied word for word from PRD 8.7. After that, only the user changes it. |

Rows below that start with `/` are URL routes, not folders. Their files live in `src/app/`. Server-only helpers live in `src/server/`. The full layout is in `.agents/rules/code-conventions.md`.

| Route | What it is |
|---|---|
| `/owner` | Owner screens. Owner role only. |
| `/desk` | Door and desk screens. Owner and desk roles. |
| `/api` | Next.js Route Handlers. Every handler resolves the session first. |
| `/api/me/summary` | Plan, status and invoices for the session member. |
| `/`, `/signup`, `/invite/[token]`, `/reset` | Marketing home page, space sign-up, invite acceptance and password reset. No session needed. |
| `/api/ask` | Owner Ask questions (FR-12). Owner role only. |
| `/api/space-info` | Price list, opening hours, Wi-Fi, house rules and FAQ for the session's space (FR-26). |
| `/api/pay/initialize`, `/api/pay/status`, `/pay/return` | Online payment start, status check and return page. |
| `/api/desk/checkin` | Door check-in scan, online and offline sync. |
| `/api/jobs/daily` | Daily job (FR-31). |

Member pages and the `/owner` and `/desk` pages are separate route bundles. Member pages must never load the camera scanner code or any owner code. The two Flutterwave webhook routes are named in `.agents/rules/payments.md`.

## How to work in this codebase

- One change means one FR ID or one rules file. Stop after each change and wait for the user before starting the next.
- Ask before adding any package.
- Never touch the database. Do not write migration or SQL files, or run any command that connects to a database. The user applies migrations, the RLS SQL and the SECURITY DEFINER functions.
- During scaffolding only, create `prisma/schema.prisma` copied word for word from PRD 8.7, then run `prisma validate` and `prisma generate`, which do not connect to a database. After that, never edit the schema. If a change needs a schema change, stop and ask.
- When the PRD is silent, stop and ask. Do not guess.
- Name the FR ID or PRD section that each change implements.
- Use the Stack section of this file over the PRD. For everything else, the PRD is the source. If the PRD and a rules file disagree, stop and ask.
- Treat every PRD [ASSUMPTION] and every Section 14 default as unconfirmed. Ask before building on any question marked "Before build".
- End every response with a list headed "Assumptions". Write "None" if there are none.

Product rules that apply to every change:

- Store money as whole numbers in kobo. ₦1 is 100 kobo.
- Store instants in UTC and calendar dates as Africa/Lagos dates. Show both in Africa/Lagos time.
- The language model only picks an Ask question ID and period. The server computes every figure with a prepared query and fills a fixed sentence. Never show model output text to anyone.
- Every plan, credit, money and visit figure shown to anyone shows its source and when it was last updated.
- Invoices move from Unpaid to Pending confirmation to Paid. A plan activates only on Paid. Pending gives provisional access only.
- Only a server-side Flutterwave verify call or a staff confirmation (owner or desk) marks an invoice Paid. A webhook only triggers the verify call. A member's transfer report can only move it from Unpaid to Pending confirmation.
- Every membership status decision uses `effectiveStatus()` (FR-32). Never read the stored status column to decide access.
- Every owner or desk action that changes money, access or prices writes an audit row with the person's name, in the same transaction.
- An unpaid Kujera fee shows the banner on owner and desk screens only. It never blocks check-in, payments, bookings or member screens. Members never see subscription data.

## Where the detailed rules live

Only the user creates or edits files in `.agents/rules/`, `.agents/skills/` and `.agents/design-system/`, and `token.css`. If a needed file is missing, stop and ask. The schema lives in PRD Sections 8.7 and 8.8 until the agent creates `prisma/schema.prisma` during scaffolding. After that, the schema file is the record. All SQL, model names, prices, limits, thresholds and environment variable names live in these files. Every file below is in `.agents/rules/`, and each one names its PRD source at the top.

| File | Holds |
|---|---|
| `dependencies.md` | Every project: approved packages and exact versions |
| `env.md` | Every project: environment variable names, what each holds, which are secret |
| `security-baseline.md` | Every project: session checks, input validation, safe logs and error responses |
| `code-conventions.md` | Every project: TypeScript settings, naming, exports, the API error shape |
| `testing.md` | Every project: test tools, required tests, what "done" means |
| `git.md` | Every project: branches, commits, what is never committed |
| `data-model.md` | Prisma rules, money type, date columns, counters, payment field names |
| `security-rls.md` | RLS groups, session settings, SECURITY DEFINER functions, release tests |
| `roles-permissions.md` | Sign-in rules and which actions owner, desk and member may take |
| `payments.md` | Both Flutterwave flows, webhooks, references, transfers, cash, Flutterwave API details |
| `status-and-billing.md` | Effective status, provisional access, renewals, credits, subscription status, daily job |
| `ai-ask.md` | Owner Ask: redaction, question catalogue, prepared queries, fallback, test-set gate |
| `offline-pwa.md` | Data budgets, caching, check-in code, desk offline mode |
| `money-time-format.md` | How money, dates, times and room hours appear on screen |
| `design-tokens.md` | Colour, space, shape and icon tokens, and how status colours are shown |
| `typography.md` | Plus Jakarta Sans, the type scale, font loading |
| `data-protection.md` | What data leaves Kujera, consent, retention, go-live privacy checks |
| `logging-metrics.md` | Audit rows, Ask logs, cash counts, success metrics |

## Definitions

- **Tier:** the level of Kujera's monthly fee for a space, set by active member count when each subscription invoice is created: Starter, Growth or Large. **Subscription status:** active when a paid subscription invoice covers today, otherwise expired. Worked out by `subscriptionStatus()` (FR-15).
- **Trial:** the 30-day free period a new space gets at sign-up, stored as a zero-cost paid subscription invoice. **Desk mode:** the limited role a helper login has. Session role DESK. **Helper:** a person the owner invites to work the desk.
- **Plan:** what a member pays the space for: day pass, weekly, monthly, dedicated desk or private office.
- **Membership:** one member's plan for one period, with a start date and an end date.
- **Effective status:** the membership status worked out by `effectiveStatus()`: scheduled, active, provisional, expired or cancelled.
- **Provisional access:** time-limited entry access while a reported bank transfer waits for confirmation, granted once per invoice. It is not active, and it blocks booking. Rules are in `.agents/rules/status-and-billing.md`.
- **Private record:** any row that belongs to one member. The full list is the member-owned group in `.agents/rules/security-rls.md`.
- **Space info:** what members read about their space: a price list built from plan and room prices, opening hours, Wi-Fi details, house rules and FAQ. The owner edits all but the price list (FR-16).
- **Money view:** the owner-only screen with takings, who owes, transfer decisions, cash count and reversals (FR-11).
- **Ask:** the owner's question box (FR-12). **Ask question:** one entry in the fixed catalogue in PRD 7.3, with a prepared query and a fixed sentence. **Period:** today, this week, this month or last month.
- **Tenant table:** any table that holds one organisation's data. Every table except `User` is a tenant table.
- **Session settings:** the organisation, user, member and role values set at the start of every database transaction. See `.agents/rules/security-rls.md`.
- **Member-owned RLS policy:** a row is visible only when its organisation ID matches the session and either its member ID matches the session member or the session role is OWNER, DESK or SYSTEM.
- **Organisation:** one coworking space on the platform. **Location:** one physical site of an organisation. Rooms and check-ins belong to a location.
- **Room credits:** meeting room minutes that come with a plan. Kept as a ledger of entries.
- **Overrun:** room time used past a booking's end, recorded by owner or desk. **Desk hire:** a room hired to a walk-in by the hour, paid before use.
- **Transfer report:** a member's report of a bank transfer: sender name, amount and time, with an optional photo.
- **Opening position:** one member's plan, end date, amount owed and room minutes at cut-over, approved by the owner. **Cut-over:** the date the space stops using its old records and starts using Kujera.
- **Invite:** a single-use emailed link that lets a member or helper set their password, or adds a new role to an existing login. **Sign-in link:** any single-use emailed link: sign-up confirmation, invite or password reset. Only its hash is stored. **Check-in code:** a rotating code made on the member's phone from a per-member secret, using TOTP (time-based one-time password). It works offline.
- **RLS (row-level security):** a PostgreSQL feature that filters rows inside the database using session settings.
- **Kobo:** the unit for all money values. ₦1 is 100 kobo.
