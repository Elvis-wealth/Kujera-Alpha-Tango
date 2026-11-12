# Dialog

A dialog asks for a decision that cannot wait, mostly before a money or access change.

- `surface-container-high`, radius `radius-xl`, padding `dialog-padding-*`, `elevation-3`, width 440px. Scrim `scrim` at `opacity-scrim`.
- Below 600px it becomes a bottom sheet, full width, top corners `radius-2xl`.
- Title `headline-small` as a question: "Reverse this payment?"
- Body says what will change in plain facts: the amount, the person, the date, and what happens to the plan.
- Reversals and rejections need a reason field. The reason goes into the audit row.
- Buttons on the right: a text button to back out ("Keep payment"), then the action ("Reverse payment") in danger or filled.
- Focus moves to the first field. Escape closes. Focus returns to the button that opened it.
