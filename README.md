# Kujera

Kujera is a management app for Nigerian coworking space owners, built as a PWA. The owner uses it to track members, check-ins, room bookings and payments, so nobody walks in unpaid and no booked hour goes unbilled. Members use a small part of the same app to show a check-in pass, pay, report a bank transfer, keep receipts, book rooms and read their space's info.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Prisma ORM 6.x** + **PostgreSQL** (with the `btree_gist` extension)
- **Flutterwave** for payments
- **Gemini** (free tier) for Ask question classification only
- Hand-written service worker (`sw.js`) — no PWA framework

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

   Then fill in the values in `.env`. See `.env.example` for the full list (database, encryption, Flutterwave, Gemini, cron, app URL, email, rate limiting).

3. Prepare the database:

   Apply the Prisma schema and the row-level security (RLS) policies and SECURITY DEFINER functions described in `.agents/rules/security-rls.md`. Migrations and the RLS SQL are applied by the project maintainer; the agent does not run them.

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

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

## License

Private.
