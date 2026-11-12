# Banner

A banner is a page-wide message that stays until its cause is fixed.

| Kind | Colours | Icon | Where |
|---|---|---|---|
| Subscription expired | `error-container`, `on-error-container` | triangle-alert | Owner and desk screens only. Never on member screens. Blocks nothing (FR-15). |
| Provisional access | `pending-container`, `on-pending-container` | clock | Member pass and plan, while a transfer waits. |
| Offline | `surface-container-high`, `on-surface` | wifi-off | Any screen showing cached data. Reads "Offline. As of 9:14am." |
| Setup and info | `surface-container-high` | info | Owner setup steps, such as go-live checks. |

- Sits under the page header, full content width, radius `radius-medium`, padding `spacing-150` by `spacing-200`.
- One action at most, on the right, small button.
- Lead with the fact in bold, then what to do.
- Use `role="status"`. Do not move focus to it.
- Show at most two banners at once. Subscription first, then offline.
