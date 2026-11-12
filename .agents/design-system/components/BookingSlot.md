# BookingSlot

The room day view where members and the desk pick a time (FR-06, FR-25).

| Slot | Colours | Label |
|---|---|---|
| Free | `surface-container-lowest`, `outline-variant` hairline | "Free" |
| Booked | `surface-container-highest` | "Booked" |
| Yours | `primary-container`, `on-primary-container` | "Yours" |
| Selected | `primary`, `on-primary` | check icon |
| Closed | striped `surface-container` and `surface-container-high` | "Closed" |

- One slot is 30 minutes. Height `target-min`, radius `radius-small`, gap `spacing-50`.
- "Booked" never shows who booked it. A member sees no other member's name or ID.
- Closed comes from the space's opening hours for that Lagos day.
- Under the grid, a summary card names the room and time and the credit cost: "Uses 1 of your 7 room hours left." with its source line.
- Members with an expired plan, provisional access or no credits cannot book. Show the hourly rate and "Ask the desk to book for you."
- Below 600px show one room at a time as a vertical list of slots.
