# Tabs

Tabs split one page into sections, such as the money view: Takings, Who owes, Transfers, Cash count, Reversals.

- Height `target-min`, text `label-large`.
- Selected: `primary` text, weight 600 and a 3px `primary` indicator.
- A count badge on a tab uses `error` only when items are overdue. Otherwise use `neutral-status`.
- Use `role="tablist"`, `role="tab"` and arrow-key movement.
- At most five tabs. Below 600px the row scrolls sideways.
