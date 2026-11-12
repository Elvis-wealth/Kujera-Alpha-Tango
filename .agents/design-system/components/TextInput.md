# TextInput

Text fields collect names, emails, phone numbers and amounts.

## Anatomy

- Label above the field, always visible, `label-large` in `on-surface`. No floating labels.
- Field: `surface-container-lowest`, a `border-hairline` in `outline`, radius `radius-medium`, height as Button.
- Input text `body-large` (16px). 16px stops phones zooming in on focus.
- Helper or error text below, `body-small`.
- Optional leading icon (search) or prefix (₦).

## States

| State | Border | Note |
|---|---|---|
| Rest | `border-hairline` `outline` | |
| Focus | `border-strong` `primary` | |
| Error | `border-strong` `error` | Error text in `error` with a circle-x icon. Set `aria-invalid` and link the text with `aria-describedby`. |
| Disabled | `opacity-disabled-container` | Text at `opacity-disabled-content`. |

## Money fields

- Show a fixed ₦ prefix. The member types naira, the server stores kobo.
- Use `inputmode="numeric"` and `tabular-nums`. Add thousands separators as they type.

## Content

- Labels are nouns: "Email", "Amount sent".
- Error text says how to fix it: "Enter a full email address, like name@example.com."
- Validate on blur and on submit, never on every keystroke.
