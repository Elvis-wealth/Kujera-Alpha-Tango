---
trigger: model_decision
description: "What version one records for audit, Ask and cash, and how the success metrics are worked out."
---

# Logging and metrics

Job: what version one records for audit, Ask and cash, and how the success metrics are worked out.
Source: PRD v4 Sections 7.4, 8.9 and 12.

## Rules

- Write one AuditLog row, with the person, the action, and the before and after values, for every owner or desk action that changes money, access or prices. That covers FR-01 to FR-08, FR-11, FR-13, FR-14, FR-16 to FR-18 and every session revoke. Why: the owner must be able to trace who let someone in, took cash, confirmed a transfer or moved a price.
- Write the AuditLog row in the same transaction as the change it records. Why: a change with no audit row, or an audit row with no change, makes the trail useless.
- Name actions as `record.verb`, for example `payment.reverse`, `transfer.confirm`, `checkin.allow`. Why: the money view groups decisions by person and action.
- Never put a password, sign-in token, check-in secret or payment key in an AuditLog row. Audit invites sent, resent and accepted, space sign-ups and password resets by action name only. Record only that it changed. Why: the audit trail is read by the owner, and secrets must not leave their closed storage.
- Log every check-in result, including denials, as a CheckIn row. Why: M4, M8 and the TURNED_AWAY Ask question count them.
- Write one AskLog row per question, as `ai-ask.md` describes. Store the "Did this answer it?" tap in `AskLog.helpful`. Why: M7 runs on these rows.
- Save the owner's cash count as one CashCount row per Lagos day. Why: M5 compares counted cash with recorded cash.
- Work out M1 to M10 exactly as PRD Section 12 states. Do not build a metrics screen. Why: no FR asks for one, and the user runs these calculations outside the app.
