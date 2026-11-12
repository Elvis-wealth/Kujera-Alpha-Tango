---
trigger: model_decision
description: "How money is taken and recorded, for member payments and for Kujera's subscription."
---

# Payments

Job: how money is taken and recorded, for member payments and for Kujera's subscription.
Source: PRD v4 FR-07 to FR-10, FR-14, FR-15, FR-22, FR-23, FR-30, Section 8.4; AGENTS.md Stack.

## Two flows

| Flow | Payer | Money goes to | Key |
|---|---|---|---|
| Member payment | Member or walk-in | The space's own Flutterwave account | That space's key, read through `org_payment_secret()` |
| Subscription | Space owner | Kujera's own Flutterwave account | `KUJERA_FLW_SECRET_KEY` |

## Rules

- Never use one flow's key for the other. Why: money would land in the wrong account.
- An invoice has at most one ACTIVE payment attempt. A payment reference is never reused. Why: a reused reference can mark the wrong payment as paid.
- Before showing Pay on an invoice that has an ACTIVE attempt, the server verifies that attempt with Flutterwave. Success marks the invoice Paid. Anything else marks the attempt ABANDONED and makes a new reference. Why: a member whose data dropped mid-payment must not pay twice.
- A later success on an ABANDONED reference still counts. An unpaid invoice becomes Paid. A paid invoice gets an AccountCredit for the owner to review. Why: bank-transfer payments can complete after the member has left the page.
- Check every webhook's `verif-hash` header against the stored secret with a constant-time compare, and discard the request when the header is missing or different. Store every event before processing it. A repeated event does nothing. Why: a forged or repeated webhook must never mark an invoice Paid, and Flutterwave says it may send the same event more than once.
- A webhook never marks an invoice Paid on its own. After the header check, call the verify endpoint and mark Paid only when `status` is `successful`, `tx_ref` matches the attempt, `currency` is `NGN` and `amount` equals the invoice amount. Why: Flutterwave says to always re-query its API before giving value.
- Return HTTP 200 from a webhook as soon as the event is stored. Why: Flutterwave times out after 60 seconds and retries, which creates duplicates.
- If the paid amount differs from the invoice amount, record AMOUNT_MISMATCH and do not mark the invoice Paid. Why: a part payment must not unlock a full plan.
- Convert kobo to the unit Flutterwave expects only at the API call, and back to kobo on the way in. Why: one wrong unit charges a member 100 times too much or too little.
- A transfer report needs sender name, amount and time. A photo is optional, and its size limit is in `offline-pwa.md`. Why: the desk can match a transfer from those three fields alone, so a member without a clear screenshot can still report one.
- Cash takes effect at once, shows "Recorded by [name]", and appears on the owner's money view. Owner and desk can record it. No partial payments. Why: a member paying cash cannot wait for the owner, and every naira needs a name on it.
- Owner and desk can confirm or reject a transfer report. A rejection needs a reason. Every decision appears on the money view with who made it. Why: the door must not wait for the owner, but the owner must see every decision.
- Only the owner can reverse a payment, with a reason. Why: a reversal undoes money and access, so it stays with the person accountable for both.
- The app shows no Flutterwave fee figures. Why: fees change, so the owner checks them on Flutterwave's pricing page (PRD 11.3).
- Provisional access rules live in `status-and-billing.md`. Why: they decide status, not payment.

## Flutterwave details

Taken from Flutterwave's v3 developer docs. Rows marked "Confirm in sandbox" are not stated in the docs. Test them in Flutterwave test mode before the first live payment.

| Item | Value |
|---|---|
| API version | v3 |
| Checkout call | `POST https://api.flutterwave.com/v3/payments` with `Authorization: Bearer <secret key>`. Body: `tx_ref`, `amount`, `currency: "NGN"`, `redirect_url`, `customer.email` (required), plus optional `customer.name` and `customer.phonenumber`. The response's `data.link` is the hosted payment page. |
| Redirect back | Query string carries `status`, `tx_ref` and `transaction_id` on success, and `status=failed` with `tx_ref` on a cancelled payment. Treat these as hints only. |
| Verify by transaction ID | `GET https://api.flutterwave.com/v3/transactions/{id}/verify`. Use after a redirect or webhook gives the ID. |
| Verify by reference | `GET https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref={reference}`. Use when re-checking an ACTIVE attempt before showing Pay, because the app may never have received an ID. |
| Webhook check | Header `verif-hash` must equal the secret hash set in that Flutterwave dashboard. It is a plain value, not an HMAC. |
| Amount unit | Major units: naira, not kobo. The docs' NGN example sends `amount: '7500'`. Confirm in sandbox. |
| Payment reference format | `KJ-{orgShort}-{invoiceNumber}-{random6}`, sent as `tx_ref` (PRD 8.4). |
| Customer email | Use the member's email. Every member has one (PRD FR-01). |
| Completed-charge event name | Confirm in sandbox. Process only events that carry a `tx_ref` matching a stored attempt. |
| Member payment webhook route | `/api/webhooks/flutterwave/space/[organisationId]`. Its secret is the space's `OrganisationSecret.webhookSecretEnc`. |
| Subscription webhook route | `/api/webhooks/flutterwave/kujera`. Its secret is `KUJERA_FLW_WEBHOOK_SECRET`. |

Write no live Flutterwave call until the "Confirm in sandbox" rows are confirmed in test mode. Why: a wrong amount unit or event name would charge or credit the wrong amount.
