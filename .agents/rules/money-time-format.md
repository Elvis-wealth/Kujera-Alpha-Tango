---
trigger: glob
description: "How money, dates, times and room hours look on screen."
globs: "src/**/*.tsx"
---

# Money and time format

Job: how money, dates, times and room hours look on screen.
Source: PRD v4 FR-10, FR-11, FR-22, Sections 7.4 and 8.6.

## Rules

- Format money and time only through one shared money formatter and one shared time formatter. Why: the same figure must never look different on two screens.
- Show money as `₦` with thousands separators and no decimals when the kobo part is zero: `₦85,000`. Show two decimals only when it is not: `₦91,375.50`. Why: most prices are whole naira, but VAT can leave kobo.
- Show every date and time in Africa/Lagos using `Intl.DateTimeFormat` with `timeZone: "Africa/Lagos"`. Why: the server runs in UTC and owners and members live in Lagos time.
- Dates look like `30 Nov`. Add the year only when it is not the current year: `30 Nov 2027`. Times look like `9:14am`. Why: these match the PRD's examples.
- Freshness lines read `Updated 9:14am` when online and `Offline. As of 9:14am` from the cache. Why: owner and member must always know how old a number is.
- Show room hours to one decimal place, and drop a trailing `.0`: `3 of 10`, `2.5 of 10`. Why: the PRD asks for one decimal place, but its examples show whole hours without `.0`.
- Opening hours look like `Mon 8:00am to 8:00pm`, and a closed day reads `Sun Closed`. Store them as minutes after Lagos midnight and format them only through the shared time formatter. Why: one shape for hours on the space info screen and the booking calendar.
- Use one helper, `lagosDate(instant)`, to turn a UTC instant into a Lagos calendar date. Why: status, check-ins, Ask periods and rate limits all count by Lagos day and must agree.
