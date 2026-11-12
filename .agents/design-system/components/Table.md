# Table

Tables list members, invoices and payments on screens 840px and wider.

- Wrapper: `surface-container-lowest`, `border-hairline` `outline-variant`, radius `radius-large`.
- Header row `surface-container-low`, `label-medium` in `on-surface-variant`.
- Cells pad `table-cell-padding-y-expanded` by `table-cell-padding-x-expanded`. Text `body-medium`.
- Money and counts right-aligned in `tabular-nums`. Dates left-aligned.
- One row action, as a small text button on the far right. The row opens the record.
- Hover tints the row with `on-surface` at 4%.
- Footer shows the source line and the count: "3 of 64 members".
- Below 840px a table becomes a list of rows: name and status on top, plan and amount below.
- Show room hours as "3 of 10" or "2.5 of 10".
