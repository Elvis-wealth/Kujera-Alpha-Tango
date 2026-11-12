---
trigger: model_decision
description: "Name every environment variable, what it holds, and whether it is a secret."
---

# Environment variables

Job: name every environment variable, what it holds, and whether it is a secret.
Source: PRD v4 Sections 8.1, 8.2, 8.5, FR-13, FR-14, FR-15, FR-31.

The user confirms these names before first use.

| Name | Holds | Secret |
|---|---|---|
| `DATABASE_URL` | Pooled connection as the `kujera_app` role | Yes |
| `DIRECT_URL` | Direct connection as the owner role. Used only by the user for migrations. | Yes |
| `ENCRYPTION_KEY` | Key for AES-256-GCM encryption of space payment keys and check-in secrets | Yes |
| `KUJERA_FLW_SECRET_KEY` | Kujera's own Flutterwave secret key, for subscription payments only | Yes |
| `KUJERA_FLW_WEBHOOK_SECRET` | The secret hash set in Kujera's own Flutterwave dashboard | Yes |
| `GEMINI_API_KEY` | Gemini API key, for Ask classification only | Yes |
| `CRON_SECRET` | Secret that the host's cron sends to `/api/jobs/daily` | Yes |
| `APP_URL` | Public base URL of the app, used in sign-in links and webhook URLs | No |
| `EMAIL_API_KEY` | Key for the email service that sends sign-in emails. Unused until PRD Q9 is answered. | Yes |
| `EMAIL_FROM` | The address sign-in emails are sent from, on a verified domain | No |
| `RATE_LIMIT_SALT` | Secret used to hash IP addresses for sign-up rate limits, so raw IPs are never stored | Yes |

## Rules

- Never prefix a secret with `NEXT_PUBLIC_`. Why: Next.js copies `NEXT_PUBLIC_` values into the browser bundle, where anyone can read them.
- Read every variable in one module and validate them all at startup. Why: a missing key then fails at boot, not halfway through a payment.
- Keep `.env.example` with every name above and empty values. Why: a new setup then knows every variable without anyone seeing a value.
- A space's own Flutterwave keys are never environment variables. Why: they belong to one space, so they live encrypted per space in `OrganisationSecret`.
- `/api/jobs/daily` rejects any request without the header the host's cron sends with `CRON_SECRET`. Why: anyone who finds the URL could otherwise run billing.
- Never log a variable's value. Why: logs are read by more people and tools than the server.
