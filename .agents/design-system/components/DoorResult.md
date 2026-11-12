# DoorResult

The panel the desk sees after scanning a member's pass (FR-04, FR-05).

| Result | Colour | Icon | Verdict | Detail |
|---|---|---|---|---|
| ALLOWED | `success` | circle-check | "Allowed" | Plan and end date |
| ALLOWED_PROVISIONAL | `pending` | clock | "Allowed" | "Transfer unconfirmed" and when access ends |
| DENIED_EXPIRED | `error` | circle-x | "Not allowed" | "Ended [date], owes [amount]" |
| DENIED_NO_PLAN | `error` | circle-x | "Not allowed" | "No plan" |

- Uses the solid role colours, not containers, so it reads from across the desk.
- Verdict `headline-large`, name `title-large`, detail `body-large`. Icon 48px.
- Radius `radius-xl`, padding `spacing-300`.
- Denied results offer the next step: "Take payment" or "Sell a day pass".
- Offline results carry an "Offline" tag with the wifi-off icon. The decision came from the cached roster.
- Use `role="alert"` for denials and `role="status"` for the rest.
- Every result, denials too, is saved as a CheckIn row.
