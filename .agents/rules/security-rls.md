---
trigger: always_on
description: "How the database keeps each organisation's and each member's rows apart."
---

# Row-level security

Job: how the database keeps each organisation's and each member's rows apart.
Source: PRD v4.1 Sections 8.3, 8.5 and 8.8; FR-17, FR-18, FR-20; Section 13 risks 1, 2 and 10.

## Groups

| Group | Tables | Member sees | Desk sees | Owner sees |
|---|---|---|---|---|
| Member-owned | Member (by `id`), Membership, MembershipEvent, CreditEntry, Booking, RoomOverrun, CheckIn, Invoice, PaymentAttempt, Payment, Receipt, TransferReport, AccountCredit, ContactConsent, OpeningPosition | Own rows only | Own organisation | Own organisation |
| Organisation-wide | Organisation (by `id`), Location, Plan, Room, InfoEntry, OpeningHours, WifiNetwork | Read only | Read only | Read and write |
| Owner-only | CashCount, SubscriptionInvoice, AskLog | Nothing | Nothing | Own organisation |
| Staff | Staff, AuditLog | Nothing | Own Staff row, no AuditLog | Own organisation |
| System-only | WebhookEvent | Nothing | Nothing | Nothing |
| Identity | User, Session, AuthToken | Own `User` row only | Own `User` row only | Own `User` row only |
| Closed | OrganisationSecret, SpaceSignup | Nothing | Nothing | Only through functions |

Session roles: MEMBER, DESK, OWNER, plus WEBHOOK and SYSTEM for server jobs.

## Rules

- Every table belongs to exactly one group above. Why: a table with no group has no policy, and anyone can read it.
- The app connects as `kujera_app`, which has NOSUPERUSER and NOBYPASSRLS. Why: a role that can bypass RLS makes every policy useless.
- `src/server/db.ts` is the only file that creates a Prisma client. It exports only the RLS-wrapped client and the calls to the SECURITY DEFINER functions. It never exports a plain client. Why: a plain client anywhere else is a query that skips RLS, which is how one member would see another's records.
- `src/server/session.ts` is the only file that reads the session cookie. It returns the user, organisation, member, staff and role, and every Route Handler gets them from there. Why: one source for "who is asking" means the member ID in every query comes from the same checked place.
- The lint config blocks value imports of `@prisma/client` in every file except `src/server/db.ts`, using `@typescript-eslint/no-restricted-imports` with `allowTypeImports: true`. If that rule is not available from the installed lint config, ask before adding `typescript-eslint`. Why: the build then fails the moment any file tries to open its own database connection. Type imports stay allowed so screens can use Prisma's types.
- The lint config blocks `$queryRawUnsafe` and `$executeRawUnsafe` everywhere, using `no-restricted-properties`. Use only the tagged-template `$queryRaw` and `$executeRaw`. Why: the unsafe forms build SQL from strings, which allows SQL injection and can read rows the query never meant to touch.
- Every request runs its queries through the RLS Prisma extension. The extension opens a transaction and sets `app.org_id`, `app.user_id`, `app.member_id` and `app.role` with `set_config(..., true)`. Why: `true` keeps the values inside that one transaction, so they cannot leak to the next request on a pooled connection.
- Owner-only and staff policies check `app.role`, not just `app.org_id`. Why: a desk helper shares the organisation with the owner but must not read the money view's tables.
- A webhook handler sets the role WEBHOOK, reads its secret through `org_webhook_secret()` (space route) or the environment (Kujera route), and checks the `verif-hash` header. It switches to SYSTEM only after the check passes. The daily job switches to SYSTEM only after its `CRON_SECRET` check passes. Why: SYSTEM reads every row in an organisation, and WEBHOOK can read only the webhook secret.
- Sign-up, sign-in, sessions, invites and password resets go only through the SECURITY DEFINER functions: `auth_session`, `auth_user_by_email`, `auth_create_session`, `auth_start_signup`, `auth_confirm_signup`, `auth_create_invite`, `auth_redeem_invite`, `auth_request_reset`, `auth_redeem_reset`. Why: they run before a session exists, so normal policies cannot apply.
- `auth_confirm_signup` is the only path that creates an Organisation. It creates the space, its first location, the owner's User and OWNER Staff row, and the trial subscription invoice in one transaction, then sets `app.org_id` for the new space. Why: a self sign-up has no session and no organisation yet, so nothing else may create one.
- `auth_create_invite` checks the caller's role from the session: OWNER for a DESK invite, OWNER or DESK for a member invite. It never accepts a role or organisation from the request. Why: an invite grants access, so it must follow the same rules as any other action.
- Read a space's payment key only through `org_payment_secret()` and its webhook secret only through `org_webhook_secret()`. Write both only through `org_set_payment_secret()`, which checks the OWNER role. Why: `OrganisationSecret` is closed to the app role.
- Members get room availability only from a SECURITY DEFINER function that returns room ID, start and end. Why: the Booking table holds other members' IDs.
- The Space info handler returns `WifiNetwork.password` to a member only when `effectiveStatus()` is ACTIVE or PROVISIONAL. Every other member gets the network name without the password. Why: the table is readable by every member of the space, so the handler is where the paying-members-only rule is kept (PRD A24).
- Desk screens get subscription status only from `org_subscription_status()`. Why: SubscriptionInvoice is owner-only, and the desk banner needs only a yes or no.
- Ask runs its prepared queries inside the owner's RLS transaction, never as SYSTEM. Why: an Ask query must not be able to return another organisation's rows, even through a bug.
- Write three release tests for the user to run: two members of one space cannot read each other's rows on any endpoint; a DESK session cannot read any owner-only table; every query with no session settings returns zero rows. Why: these are the PRD 8.5 release gate for risk 1 and the desk-mode guard for risk 5.
