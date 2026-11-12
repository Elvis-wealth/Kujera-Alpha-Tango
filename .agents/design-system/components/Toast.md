# Toast

A toast confirms an action that just worked.

- `inverse-surface` with `inverse-on-surface` text and `inverse-primary` for its one action. Radius `radius-medium`, `elevation-3`.
- Bottom centre on phones, bottom left of the content area on desktop. Above the member bottom bar.
- Stays 4 seconds, or 8 with an action. Pauses on hover and focus.
- One line where possible: "Amaka Obi checked in."
- Never for errors that need a decision, and never as the only record of a money action. The audit row and receipt are the record.
- Use `role="status"`.
