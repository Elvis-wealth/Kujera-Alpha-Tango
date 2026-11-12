---
trigger: glob
description: "How code reads and writes data through Prisma."
globs: "src/server/**/*.ts, prisma/**"
---

# Data model

Job: how code reads and writes data through Prisma.
Source: PRD v4 Sections 8.7 and 8.8.

## Rules

- The schema of record is PRD v4 Sections 8.7 and 8.8 until `prisma/schema.prisma` exists. After that, the schema file is the record. Why: one source of truth stops two versions of a table drifting apart.
- During scaffolding, create `prisma/schema.prisma` by copying the PRD 8.7 code block exactly, with no added, removed or renamed model, field, enum or attribute. Then run `prisma validate` and `prisma generate`. Report both results. Why: a copy can be checked line by line against the PRD, and both commands work without a database.
- Do not enable pgvector or add the `vector` extension to the schema (PRD Q17). Why: version one embeds nothing, so the extension would be unused.
- After scaffolding, never edit `prisma/schema.prisma`. A needed change means stopping to ask the user. Why: every schema change needs a migration, and only the user runs migrations.
- Never write the raw SQL from PRD 8.8 or the RLS policies and functions from `security-rls.md` into a file, and never run `prisma migrate`, `prisma db push`, `prisma db pull`, `prisma studio` or any seed command. Why: those connect to the database or define who can read which rows, and the user applies and checks them.
- Store money as `Int` in kobo, at most 2,000,000,000 kobo (₦20m). Why: whole numbers never round wrongly, and the database rejects anything larger.
- Every tenant table carries `organisationId`. `User` is the only global table. Why: a person has one login across spaces, but everything a space owns must be filtered by space.
- Columns typed `@db.Date` hold Africa/Lagos calendar dates. `DateTime` columns hold UTC instants. Why: mixing the two moves a plan's end date by a day around midnight.
- Take invoice and receipt numbers from the Organisation counters with one atomic `UPDATE ... RETURNING`. Why: two staff saving at the same moment must never get the same number.
- Use Prisma Client for normal reads and writes. Use `$queryRaw` and `$executeRaw` only for session settings, the counter `UPDATE ... RETURNING`, and Ask aggregate queries that Prisma cannot express. Why: everything else stays type-checked by Prisma.
- Write every record for one action in one transaction, for example a booking and its credit debit. Why: a half-finished action leaves credits or money wrong.
- Payment fields use provider-neutral names from PRD v4 Section 8.7: `paymentPublicKey`, `paymentSecretKeyEnc`, `webhookSecretEnc`, `providerReference`, `providerTransactionId`, `providerFeeKobo`, and the `FLUTTERWAVE` payment method. Never reintroduce a `paystack` name. Why: the stack uses Flutterwave, and names that say Paystack would send the agent to the wrong API.
