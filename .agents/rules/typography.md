---
trigger: glob
description: "The typeface, type scale and font loading every screen uses."
globs: "src/**/*.tsx, src/**/*.css"
---

# Typography

Job: the typeface, type scale and font loading every screen uses.
Source: founder decision of 11 November 2026 (Plus Jakarta Sans, scale locked). Full values: `kujera-design-tokens-v2.json`. Font loading budget: `offline-pwa.md`.

## Rules

- Use one typeface, Plus Jakarta Sans, with the stack `"Plus Jakarta Sans", system-ui, sans-serif`. Why: one family keeps the first load small and the screens consistent.
- Self-host the variable font (weights 400 to 600) as woff2. Never load it from Google Fonts or another CDN. Why: a third-party font request costs a connection on slow networks and sends member traffic to another company.
- Ship two files with their `unicode-range`: the Latin subset and the Latin Extended subset. Why: the ₦ sign (U+20A6) is only in Latin Extended. Without it, every naira amount falls back to another font.
- Use `font-display: swap` and preload only the Latin file. Why: text shows at once in the fallback font, and the second file loads only when ₦ appears.
- Use only the 15 styles below, through one class or token per style. Never set a font size, weight or line height by hand. Why: a one-off size breaks the scale and the line grid.
- Below 600px wide, use the compact sizes for display and headline. Why: 56px headings do not fit a 360px phone.
- Show every money, count, date and code in `font-variant-numeric: tabular-nums`. Why: figures then line up in tables and do not jump when they change.
- Body text is never under 14px. Form inputs are 16px. Why: smaller text is hard to read on cheap screens, and phones zoom into inputs under 16px.
- Never write text in all capitals except the space name on the member pass, set in `label-medium`. Why: capitals are slower to read.

## Scale

| Style | Size / line (px) | Weight | Tracking (px) | Compact, under 600px | Use |
|---|---|---|---|---|---|
| `display-large` | 56 / 64 | 600 | -1.0 | 40 / 48 | Marketing hero |
| `display-medium` | 44 / 52 | 600 | -0.8 | 36 / 44 | Marketing sections |
| `display-small` | 36 / 44 | 600 | -0.5 | 32 / 40 | Big owner figures |
| `headline-large` | 32 / 40 | 600 | -0.4 | 28 / 36 | Page titles, door verdict |
| `headline-medium` | 28 / 36 | 600 | -0.3 | 24 / 32 | Stat card figures, pass code |
| `headline-small` | 24 / 32 | 600 | -0.2 | 22 / 28 | Section and dialog titles |
| `title-large` | 20 / 28 | 600 | 0 | | Door member name |
| `title-medium` | 16 / 24 | 600 | 0 | | Card titles |
| `title-small` | 14 / 20 | 600 | 0 | | List row titles |
| `body-large` | 16 / 24 | 400 | 0 | | Inputs, long text |
| `body-medium` | 14 / 20 | 400 | 0 | | Default body, table cells |
| `body-small` | 12 / 16 | 400 | +0.1 | | Source lines, helper text |
| `label-large` | 14 / 20 | 500 | +0.1 | | Buttons, field labels, tabs |
| `label-medium` | 12 / 16 | 500 | +0.2 | | Badges, table headers |
| `label-small` | 11 / 16 | 500 | +0.3 | | Bottom bar labels only |

## Open

- Which package or folder supplies the two woff2 files. `@fontsource-variable/plus-jakarta-sans` holds both subsets but is not approved in `dependencies.md`.
