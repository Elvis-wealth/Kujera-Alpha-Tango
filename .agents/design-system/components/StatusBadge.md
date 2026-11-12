# StatusBadge

A badge shows the state of a membership, invoice, transfer report or invite.

## Rule

Every status shows a colour, an icon and a word. Never colour alone. Status colours never change with a space's branding.

## Mapping

| Status | Role | Icon | Example label |
|---|---|---|---|
| Active, Paid, Invite accepted | success | check | "Active" |
| Provisional, Pending confirmation, Waiting | pending | clock | "Provisional" |
| Expiring this week | pending | calendar | "Ends in 3 days" |
| Expired, Payment failed | error | x | "Expired" |
| Transfer report over 24 hours old | error | triangle-alert | "Waiting over 24 hours" |
| Amount differs | pending | triangle-alert | "Amount differs" |
| Scheduled | neutral-status | calendar | "Starts 1 Dec" |
| Cancelled, No plan, Unpaid, Invite expired | neutral-status | minus | "No plan" |
| Invite sent | primary | clock | "Invite sent" |

- Membership status always comes from `effectiveStatus()`. Never read the stored column.
- Badges use the container pair: `success-container` with `on-success-container`, and so on. Solid roles are kept for the door result.

## Spec

- Height 24px, radius `radius-full`, text `label-medium`, icon 14px, gap `tight-gap-expanded`.
- The error role means expired, denied or failed only. Never use it for emphasis.
