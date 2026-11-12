# Button

Buttons start an action, such as taking a payment, confirming a transfer or booking a room.

## Variants

| Variant | Use | Tokens |
|---|---|---|
| Filled | The one main action on a screen or dialog: "Take payment", "Book room", "Start free trial". | `primary`, `on-primary` |
| Outlined | A second action next to a filled one, or a row action in a list: "Resend invite", "Confirm". | `outline`, `primary` |
| Text | Low-weight actions: "View receipt", "Keep payment", "Open". | `primary` |
| Danger | Actions that undo money or access: "Reverse payment", "Reject transfer". Always inside a dialog that asks for a reason. | `error`, `on-error` |

## Sizes

- Default height is `control-height-expanded` (40px) from 840px wide and `control-height-compact` (48px) below it.
- Small (`control-height-small`, 32px) is only for row actions in tables and chips on desktop. Keep a 48px hit area with padding around it.
- Side padding `spacing-300`. Icon gap `spacing-100`. Radius `radius-medium`.

## States

- Hover: a state layer of the content colour at `opacity-state-hover`.
- Pressed: `opacity-state-pressed`.
- Focus: a `focus-ring-width` ring in `primary`, offset by `focus-ring-offset`. Show it for keyboard focus only.
- Disabled: content at `opacity-disabled-content`, container at `opacity-disabled-container`. Prefer explaining why an action is unavailable over disabling it.
- Loading: keep the label, add a spinner before it, and block a second tap. Money actions must never send twice.

## Content

- Start with a verb and name the thing: "Take payment", not "Submit".
- One filled button per view.
- Put the main action on the right in dialogs and on the left of a page header.

## Accessibility

- Text is `label-large` (14/20, weight 500). Every pair passes 4.5:1.
- Icon-only buttons need an `aria-label`.
