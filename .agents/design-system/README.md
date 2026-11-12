# Kujera design system

Source: the Kujera Design System artifact, exported 11 November 2026. Values live in `token.css`. Colour rules are in `.agents/rules/design-tokens.md` and type rules in `.agents/rules/typography.md`. If this folder and a rules file disagree, stop and ask.

Component specs are in `components/`, one file per component: Banner, BookingSlot, Button, Card, Chip, Dialog, DoorResult, MemberPass, Navigation, Select, StatusBadge, Table, Tabs, TextInput, Toast.


Calm, exact and quick to read. Kujera helps a coworking space owner in Nigeria see who has paid, who is in and what is owed, so the interface stays out of the way and lets the figures speak.

## Who it serves

- **Owner.** Runs the space from a laptop first and an Android phone second. Reads figures, confirms money, answers "who owes me?"
- **Desk helper.** Stands at the door with a phone or tablet. Needs a yes or no in under a second.
- **Member.** Opens a pass on a low-end Android phone, often on a small data bundle and sometimes with no signal.

## Principles

1. **Figures first.** Money, dates and counts are the largest thing on a screen. They use `tabular-nums` so columns line up.
2. **Every figure says where it came from.** Plan, credit, money and visit figures carry a source line: "From your records. Updated 9:14am."
3. **Status is never colour alone.** Every status is a colour, an icon and a word.
4. **Desktop first, phone ready.** Layouts are designed at 1440px and adapt down to 360px.
5. **Light and cheap.** One font file, no images in the app shell, native controls where they work.

## Colour

Indigo monochromatic, built in Material 3's HCT colour model. Primary seed `#3D4DB7`. The primary role is tone 40, `#4454BE`.

- **Primary** is for the main action, the current place and focus. Use it sparingly so it keeps meaning.
- **Secondary** (same hue, chroma 16) fills selected chips, nav items and quiet containers.
- **Tertiary** (same hue, chroma 32) is held for charts and rare accents.
- **Neutrals** sit on the indigo hue at chroma 2 (neutral) and 4 (neutral variant), so greys read clean, not tinted.
- **Status colours are fixed**: success `#1E7B3A`, pending `#8A6100`, error `#B22154`, and a neutral status grey. They never change with a space's branding. Error means expired, denied or failed only.
- Always pair a role with its `on-` token. Every text pair passes WCAG AA 4.5:1. Every chart colour passes 3:1 against the surface.
- Use role tokens in components. Palette tones (`primary-40`, `neutral-96`) are for checking and for adding roles.

### Surface ladder

| Token | Tone | Use |
|---|---|---|
| `surface` | neutral 98 | Page background |
| `surface-container-lowest` | 100 | Cards, tables, fields |
| `surface-container-low` | 96 | Sidebar, table header |
| `surface-container` | 94 | Bottom bar |
| `surface-container-high` | 92 | Dialogs, info banners |
| `surface-container-highest` | 90 | Booked slots, tracks |

Dark mode comes later. Do not add dark values yet.

## Type

Plus Jakarta Sans, one variable font file, weights 400 to 600.

- Display and headline: weight 600 with slight negative tracking.
- Titles: 600. Body: 400. Labels: 500 with slight positive tracking.
- Below 600px wide, display and headline sizes step down (the `-compact` styles).
- Body text is never under 14px, and form inputs are 16px so phones do not zoom.
- Figures use `font-variant-numeric: tabular-nums`.
- The ₦ sign (U+20A6) is in the font's Latin Extended subset. Ship both the Latin and Latin Extended files with their `unicode-range`, or ₦ falls back to another font.

## Space and shape

- A 4px grid with a 2px half-step: `spacing-25` (2px) to `spacing-1200` (96px).
- Layout roles come in two sizes: compact below 840px and expanded from 840px. Page margin is 16px or 32px.
- Touch targets are never under 48px (`target-min`).
- Radius: fields and buttons `radius-medium` (8px), cards `radius-large` (12px), dialogs `radius-xl` (16px), the member pass `radius-2xl` (24px), badges and nav items `radius-full`.
- Cards are flat with a hairline border. Shadows are for things that float: menus, toasts, dialogs.

## Icons

Lucide, 2px stroke, at 16, 20 or 24px. Icons sit beside a word. An icon alone needs an `aria-label`.

## Motion

100ms for state changes, 200ms for things entering, 300ms for sheets and dialogs. Easing `cubic-bezier(0.2, 0, 0, 1)`. Respect `prefers-reduced-motion`.

## Voice

Short sentences, active voice, plain words. Name the person and the amount: "Ifeoma Eze owes ₦85,000." Buttons start with a verb. Errors say how to fix the problem. No em dashes.

## Formats

- Money: `₦85,000`, with kobo only when not zero: `₦91,375.50`.
- Dates: `30 Nov`, with the year only when it is not this year.
- Times: `9:14am`, always in Africa/Lagos time.
- Room hours: `3 of 10`, `2.5 of 10`.
- Opening hours: `Mon 8:00am to 8:00pm`, `Sun Closed`.
