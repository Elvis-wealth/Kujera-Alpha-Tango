# Card

Cards group one subject: a figure, a list of transfers, a plan.

- `surface-container-lowest` on `surface`, a `border-hairline` in `outline-variant`, radius `radius-large`. Flat at rest, no shadow.
- Padding `card-padding-expanded` (20px) from 840px, `card-padding-compact` (16px) below. Gap between cards `card-gap-*`.

## Stat card

- Label `label-large` in `on-surface-variant`, figure `headline-medium` in `tabular-nums`, then a source line.
- Every plan, credit, money and visit figure shows its source and when it was updated, in `body-small`: "From your records. Updated 9:14am." Offline: "Offline. As of 9:14am."

## List card

- Title `title-medium` in the card padding. Rows are separated by a hairline and padded `list-row-padding-y-*`.
- Amounts are right-aligned, weight 600, `tabular-nums`. One row action at the far right.
