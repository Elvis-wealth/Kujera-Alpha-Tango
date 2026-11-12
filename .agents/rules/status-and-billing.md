---
trigger: model_decision
description: "How membership status, provisional access, credits, renewals and subscription status change over time, and what the daily job does."
---

# Status and billing

Job: how membership status, provisional access, credits, renewals and subscription status change over time, and what the daily job does.
Source: PRD v4.1 FR-06, FR-10, FR-15, FR-16, FR-17, FR-23, FR-25, FR-31, FR-32.

## Rules

- `effectiveStatus(membership, organisation, now)` applies these checks in order: CANCELLED stays CANCELLED; before `startDate` is SCHEDULED; on or before `endDate` plus `graceDays` is ACTIVE; `provisionalUntil` after now is PROVISIONAL; otherwise EXPIRED. Why: one function stops the owner list, the desk and the member screen from disagreeing.
- Compare dates as Africa/Lagos calendar days using the helper in `money-time-format.md`. `endDate` is the last full day of access. Why: UTC dates move the end of a plan by a day.
- Unit tests for `effectiveStatus()` cover each check and the midnight edge: a plan ending 30 Nov is ACTIVE at 11:59pm on 30 Nov and EXPIRED at 12:00am on 1 Dec. Why: midnight is where date bugs hide.
- Provisional access starts when a member reports a transfer on a membership that has expired or ends within 24 hours. It lasts 24 hours and blocks booking. Why: a late-evening transfer must not lock a member out, but an unconfirmed payment must not use a room.
- Provisional access is granted once per invoice (`Invoice.provisionalUsedAt`), and not at all for 30 days after a rejected transfer report (`Member.provisionalBlockedUntil`). Why: otherwise a false report each day gives free access.
- Rejecting a transfer report ends provisional access at once. Why: a rejected payment must not keep the door open for the rest of the window.
- Renewal invoices: none for day passes, 2 days before `endDate` for weekly plans, 7 days before `endDate` for monthly and longer plans. Why: a weekly member is not billed on the day their week starts.
- A renewal paid on or before `endDate` starts the next day as SCHEDULED. A renewal paid after expiry starts on the payment day. A renewal writes a GRANT credit entry for the plan's room minutes. Why: paying early must not shorten the current period.
- A payment reversal (owner only) returns the invoice to Unpaid, rolls back the membership extension and the GRANT credit entry, and writes a REVERSED MembershipEvent. Why: undoing money must undo the access it bought.
- Room credits are a ledger. The balance is the sum of entries for the membership. Why: a ledger shows how every hour was used.
- Cancelling 2 hours or more before the start refunds the minutes. Later cancellations and no-shows refund nothing. Why: a room cancelled at the last minute is lost to other members.
- An overrun uses credits when the member has them. Otherwise it creates a ROOM_OVERRUN invoice at the room's hourly rate, rounded up to 30 minutes. Why: unbilled room time is one of the losses Kujera exists to stop.
- Every booking, by member or desk, sits inside the location's opening hours for that Lagos day. A closed day takes no bookings. Why: a room cannot be used when the space is shut (FR-16).
- A desk hire creates a ROOM_HIRE invoice at the hourly rate times the booked hours. The booking is confirmed only when that invoice is Paid. Why: walk-ins pay before use (PRD A6).
- Unused credits are forfeited at period end unless `creditsRollOver` is true. Why: the default is set by the space and can change without code.
- Subscription invoices are created 7 days before the current period ends, one per location, with the tier set from the count of members whose effective status is ACTIVE at that moment. Why: a bill must not change after it is sent.
- A new space's trial is one zero-cost PAID SubscriptionInvoice with `isTrial` true, covering 30 days from sign-up. The daily job creates the first paid invoice 7 days before the trial ends, with the tier set then. Why: the trial then needs no special case in `subscriptionStatus()`.
- `subscriptionStatus(organisation, now)` is ACTIVE when a PAID SubscriptionInvoice covers today, otherwise EXPIRED. Why: one function drives the owner and desk banner.
- The daily job runs at 00:10 Lagos time and gives the same result if run twice. Order: write cached statuses, create renewal invoices, create subscription invoices, write forfeits. It sends no messages. Why: a retried or doubled run must not bill twice.
