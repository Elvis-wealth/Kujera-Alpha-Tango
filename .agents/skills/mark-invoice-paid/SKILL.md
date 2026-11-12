---
name: mark-invoice-paid
description: Use when any confirmed payment must settle a Kujera invoice, from a Flutterwave verify call, cash recorded by owner or desk, or a confirmed transfer report (FR-07, FR-08, FR-09, FR-15, FR-30). Covers member invoices and subscription invoices.
---

# Mark an invoice paid

## Before you start

1. Name the source: online payment, cash or confirmed transfer report.
2. Name the invoice type: member invoice or subscription invoice.
3. For an online payment, confirm every "Confirm in sandbox" row in `.agents/rules/payments.md` is confirmed. If one is not, stop and ask.

## Steps

1. For an online payment, choose the key for this flow from the two-flows table in `.agents/rules/payments.md`. Run the verify call and its checks. Stop on any failed check.
2. Use the transaction the caller already opened. If there is none, as in a webhook, open one with the RLS client from `src/server/db.ts`.
3. Re-read the invoice inside the transaction. If it is already Paid, create an AccountCredit, commit and stop.
4. Create the Payment with the owner or desk recorder for cash and transfers, or the provider reference for online payments.
5. Take the next receipt number from the Organisation counter. Create the Receipt. Set the invoice to Paid.
6. For a member invoice only, start or extend the membership using the renewal start rules in `.agents/rules/status-and-billing.md`. Write the GRANT credit entry and the MembershipEvent. For a ROOM_HIRE invoice, confirm the booking instead.
7. For cash and transfers, write the AuditLog row.
8. If you opened the transaction in step 2, commit it. Return the receipt.

## Stop and ask when

- The paid amount and the invoice amount differ in a way `.agents/rules/payments.md` does not cover.
- The invoice belongs to a different organisation than the session or webhook route.

## Done when

- One transaction contains every write from steps 3 to 7.
- Tests exist for a first payment, a double payment and a late success on an abandoned reference.
- The `testing.md` definition of done passes.
