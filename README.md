# Kujera

Kujera is a management app for Nigerian coworking space owners, built as a PWA (a website that installs to the phone's home screen). The owner uses it to track members, check-ins, room bookings and payments, so nobody walks in unpaid and no booked hour goes unbilled. Members use a small part of the same app to show a check-in pass, pay, report a bank transfer, keep receipts, book rooms and read their space's info.

## What's built so far

- **Marketing home page** (`/`) — hero, features, pricing, and a responsive header with a mobile drawer and a "back to home" / auth navigation.
- **Authentication** (`/auth`) — a single page with three conditional views rendered by the `view` query parameter:
  - Sign up (`/auth?view=signup`)
  - Log in (`/auth?view=login`)
  - Forgot password (`/auth?view=forgot`)

The auth forms are client-side UI only for now — no email service or backend calls are wired up yet.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **React 18**
- **Prisma ORM 6.x** + **PostgreSQL** (with the `btree_gist` extension)
- **Flutterwave** for payments
- **Gemini** (free tier) for Ask question classification only
- Hand-written service worker (`sw.js`) — no PWA framework
- **Lucide** icons
- **Vitest** for tests

## Prerequisites

- Node.js 18+
- PostgreSQL (with `btree_gist` enabled)
- A Flutterwave account (for payments)
- A Gemini API key (for Ask)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Then fill in the values in `.env` (see the table below and `.env.example`).

3. Prepare the database:

   Apply the Prisma schema and the row-level security (RLS) policies and SECURITY DEFINER functions described in `.agents/rules/security-rls.md`. Migrations and the RLS SQL are applied by the project maintainer; the agent does not run them.

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_URL` | Direct PostgreSQL connection (for migrations) |
| `ENCRYPTION_KEY` | 32-byte hex key for AES-256-GCM (encrypts secrets) |
| `KUJERA_FLW_SECRET_KEY` | Flutterwave secret key (Kujera platform account) |
| `KUJERA_FLW_WEBHOOK_SECRET` | Flutterwave webhook secret |
| `GEMINI_API_KEY` | Gemini API key (Ask question classification) |
| `CRON_SECRET` | Secret for the daily job |
| `APP_URL` | Public base URL (sign-in links, webhooks) |
| `EMAIL_API_KEY` | Email service key (unused until the service is chosen) |
| `EMAIL_FROM` | The sender address for sign-in emails |
| `RATE_LIMIT_SALT` | Salt for rate limiting |

## Scripts

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start the Next.js development server  |
| `npm run build` | Production build                      |
| `npm run start` | Run the production build              |
| `npm run lint`  | Lint the codebase                     |
| `npm test`      | Run the test suite (Vitest)           |

## Project structure

| Path                         | What it is                                          |
| ---------------------------- | --------------------------------------------------- |
| `src/app/`                   | Pages and Route Handlers (App Router)               |
| `src/app/auth/`              | The authentication page (signup, login, forgot)     |
| `src/server/`                | Server-only helpers (database, session, env, formatting) |
| `src/test/`                  | Test-data builders                                  |
| `prisma/schema.prisma`       | The Prisma schema                                   |
| `sw.js`                      | Hand-written service worker                         |
| `.agents/rules/`             | Detailed product and engineering rules              |
| `.agents/design-system/`     | Component specs and design tokens                   |
| `kujera-prd-v4.md`           | The PRD — source of product truth                   |

## Conventions

The source of product truth is `kujera-prd-v4.md`. Detailed rules live in `.agents/rules/` and the design system in `.agents/design-system/`. See `AGENTS.md` for how work is organised.

- Money is stored as whole numbers in **kobo** (₦1 = 100 kobo).
- Instants are stored in UTC; dates are Africa/Lagos.
- All database access goes through `src/server/db.ts`.
- Every table is covered by row-level security (RLS).
- Never commit `.env` files or any key.
- One requirement (or one rules file) per commit; work on a named branch, never `main`.

## License

Private.
