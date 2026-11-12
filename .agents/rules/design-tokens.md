---
trigger: glob
description: "The colour, space, shape and motion tokens every screen uses, and how status colours are shown."
globs: "src/**/*.tsx, src/**/*.css"
---

# Design tokens

Job: the colour, space, shape and motion tokens every screen uses, and how status colours are shown.
Source: founder decisions of 11 November 2026 (indigo monochromatic, primary seed `#3D4DB7`, Material 3). Full values: `kujera-design-tokens-v2.json`, compiled by the user into `token.css`. Component specs: `.agents/design-system/`. Type is in `typography.md`.

## Rules

- Every token is declared once, as a CSS custom property on `:root`, in `token.css` in the project root. The root layout (`src/app/layout.tsx`) imports it once. Never declare a token anywhere else. Why: one file then controls every value.
- Only the user changes `token.css`. If a token you need is missing, or its name does not match `kujera-design-tokens-v2.json`, stop and ask. Why: the file is compiled from the design tokens, and a hand edit would drift from them.
- Name each property exactly as the token: `--primary`, `--on-primary`, `--spacing-200`, `--radius-medium`. Why: names then match the design files and the component specs.
- Never write a hex value, pixel spacing or radius in a component. Use the custom properties. Why: a raw value drifts from the system and cannot be changed in one place.
- Use role tokens in components, never palette tones such as `--primary-40` or `--neutral-96`. Why: tones are for checking contrast and adding roles. Roles carry meaning.
- Pair every role with its `on-` token for text and icons on it, for example `--on-primary` on `--primary`. Why: every pair below is checked to pass WCAG AA 4.5:1, and a mixed pair is not.
- Light mode only in version one. Do not add dark values or a `prefers-color-scheme` block. Why: the founder moved dark mode to later.
- Status colours never change with a space's branding. Why: the owner and the door read them at a glance, and they must mean the same thing in every space.
- Show every status with an icon and a word as well as its colour. Why: some people cannot tell red from green, and cheap screens in bright light wash colour out.
- Use the error role only for expired, denied and failed states, and for transfer reports waiting over 24 hours (FR-08). Never for decoration or emphasis. Why: red must keep one meaning.
- Badges use the container pair (`--success-container` with `--on-success-container`). The door result uses the solid role (`--success` with `--on-success`). Why: the door must read from across the desk, and a list of badges must not shout.
- Touch targets are never under `--target-min` (48px). Why: members and helpers tap with one thumb, often standing.
- Cards are flat with a `--border-hairline` in `--outline-variant`. Shadows (`--elevation-1` to `--elevation-3`) are only for things that float: menus, toasts, dialogs. Why: borders cost less to draw on low-end phones and keep dense owner screens calm.

## Brand roles

Every role keeps the indigo hue. Only chroma and tone change.

| Token | Value | Tone |
|---|---|---|
| `primary` | `#4454BE` | primary 40 |
| `on-primary` | `#FFFFFF` | primary 100 |
| `primary-container` | `#DFE0FF` | primary 90 |
| `on-primary-container` | `#000D60` | primary 10 |
| `secondary` | `#5B5D72` | secondary 40 |
| `on-secondary` | `#FFFFFF` | secondary 100 |
| `secondary-container` | `#E0E1F9` | secondary 90 |
| `on-secondary-container` | `#181A2C` | secondary 10 |
| `tertiary` | `#545B8B` | tertiary 40 |
| `on-tertiary` | `#FFFFFF` | tertiary 100 |
| `tertiary-container` | `#DFE0FF` | tertiary 90 |
| `on-tertiary-container` | `#101744` | tertiary 10 |

- Primary: the main action, the current place and the focus ring.
- Secondary: selected chips, the current nav item, quiet containers.
- Tertiary: charts and rare accents.

## Surfaces and outlines

Neutrals sit on the indigo hue at chroma 2 (neutral) and chroma 4 (neutral variant).

| Token | Value | Use |
|---|---|---|
| `surface` | `#FCF8FA` | Page background |
| `on-surface` | `#1C1B1D` | Body text |
| `on-surface-variant` | `#47464A` | Secondary text, labels, source lines |
| `surface-container-lowest` | `#FFFFFF` | Cards, tables, fields, the member pass |
| `surface-container-low` | `#F6F3F4` | Sidebar, table header |
| `surface-container` | `#F0EDEF` | Member bottom bar |
| `surface-container-high` | `#EBE7E9` | Dialogs, info and offline banners |
| `surface-container-highest` | `#E5E1E3` | Booked room slots, progress tracks |
| `surface-dim` | `#DCD9DB` | Behind the scrim |
| `surface-variant` | `#E4E1E6` | Rarely; prefer the container ladder |
| `outline` | `#78767A` | Field and outlined-button borders |
| `outline-variant` | `#C8C5CA` | Card borders, dividers |
| `inverse-surface` | `#313032` | Toasts |
| `inverse-on-surface` | `#F3F0F1` | Text on toasts |
| `inverse-primary` | `#BBC3FF` | The action on a toast |
| `scrim` | `#000000` | Under dialogs, at `--opacity-scrim` |

## Status

| Meaning | Role | Container pair | Icon (Lucide) |
|---|---|---|---|
| Active, Paid, Allowed, Invite accepted | `success` `#1E7B3A` | `success-container` `#C5FFC8`, `on-success-container` `#003914` | check, circle-check |
| Provisional, Pending confirmation, Expiring this week, Amount differs | `pending` `#8A6100` | `pending-container` `#FFEED8`, `on-pending-container` `#422C00` | clock, calendar, triangle-alert |
| Expired, Denied, Payment failed, Transfer waiting over 24 hours | `error` `#B22154` | `error-container` `#FFECEE`, `on-error-container` `#66002A` | x, circle-x, triangle-alert |
| Scheduled, Cancelled, No plan, Unpaid, Invite expired | `neutral-status` `#5F5E62` | `neutral-status-container` `#E4E1E6`, `on-neutral-status-container` `#1B1B1F` | minus, calendar |

Every solid status role takes `#FFFFFF` text (`on-success` 5.32:1, `on-pending` 5.54:1).

## Charts

Use `--chart-1` to `--chart-5` in order: `#4B57A9`, `#008392`, `#9776B9`, `#90909A`, `#7E87CA`. Each passes 3:1 on `--surface`. Label every series in text as well.

## Space, size and shape

| Group | Tokens |
|---|---|
| Spacing steps | `spacing-0` 0, `spacing-25` 2, `spacing-50` 4, `spacing-100` 8, `spacing-150` 12, `spacing-200` 16, `spacing-250` 20, `spacing-300` 24, `spacing-400` 32, `spacing-500` 40, `spacing-600` 48, `spacing-800` 64, `spacing-1000` 80, `spacing-1200` 96 (px) |
| Layout roles, compact / expanded | `page-margin` 16 / 32, `section-gap` 24 / 32, `card-padding` 16 / 20, `card-gap` 12 / 16, `table-cell-padding-x` 12 / 16, `marketing-section-gap` 64 / 80. Same in both: `stack-gap` 8, `inline-gap` 8, `tight-gap` 4, `list-row-padding-y` 12, `table-cell-padding-y` 12, `form-gap` 16, `dialog-padding` 24 |
| Sizes | `target-min` 48, `control-height-compact` 48, `control-height-expanded` 40, `control-height-small` 32, `icon-small` 16, `icon-medium` 20, `icon-large` 24, `avatar` 40, `sidebar-width` 240, `content-max-width` 1200 |
| Radius | `radius-none` 0, `radius-small` 4, `radius-medium` 8, `radius-large` 12, `radius-xl` 16, `radius-2xl` 24, `radius-full` 9999 |
| Breakpoints | `breakpoint-compact` 0, `breakpoint-medium` 600, `breakpoint-expanded` 840, `breakpoint-large` 1200 |
| Border and focus | `border-hairline` 1, `border-strong` 2, `focus-ring-width` 2, `focus-ring-offset` 2, in `--primary` |
| Opacity | `opacity-state-hover` 0.08, `opacity-state-focus` 0.10, `opacity-state-pressed` 0.10, `opacity-state-dragged` 0.16, `opacity-disabled-content` 0.38, `opacity-disabled-container` 0.12, `opacity-scrim` 0.32 |
| Elevation | `elevation-1` 0 1px 3px black 8%, `elevation-2` 0 2px 8px 10%, `elevation-3` 0 8px 24px 14% |
| Motion | 100ms state, 200ms enter, 300ms sheets and dialogs, easing `cubic-bezier(0.2, 0, 0, 1)`. Respect `prefers-reduced-motion`. |

- Compact roles apply below 840px. Expanded roles apply from 840px. Why: the owner works on a laptop first, and members on a phone.
- Radius by part: fields and buttons `radius-medium`, cards and tables `radius-large`, dialogs `radius-xl`, the member pass `radius-2xl`, badges and nav items `radius-full`, room slots `radius-small`. Why: one radius per part keeps screens consistent.

## Icons

- Use Lucide icons at `--icon-small`, `--icon-medium` or `--icon-large`, stroke 2. Import each icon by name so only used icons ship. Why: Lucide is the founder's choice, and named imports keep the member bundle small.
- An icon sits beside a word. An icon-only button needs an `aria-label`. Why: icons alone are guessed at.
