---
trigger: model_decision
description: "What personal data leaves Kujera, how consent is kept, and how long data is kept."
---

# Data protection

Job: what personal data leaves Kujera, how consent is kept, and how long data is kept.
Source: PRD v4.1 Sections 7.2, 13 risk 7, FR-01, FR-13, FR-17, FR-18, FR-20; Nigeria Data Protection Act 2023.

## Rules

- Only these leave Kujera: the owner's redacted Ask question goes to Google; payment details go to Flutterwave through its own checkout; the email service gets the recipient's email address, name and the space's name, only to send sign-in emails (sign-up confirmation, invites, password resets). Why: the privacy notice must name every place data goes, so code must not add new ones.
- No member record, figure or name ever goes to Google. Why: Ask sends only the question, and the free tier lets Google use inputs.
- Kujera never sees or stores card details. Why: Flutterwave's checkout collects them, which keeps card data out of Kujera's database.
- ContactConsent is append-only. The latest row per member and channel wins. Version one sends nothing, whatever consent says. Why: version two needs a dated record of every yes and no.
- Delete nothing in version one. AskLog rows are kept for 24 months and must be deleted after that by a job built in version two. Why: the privacy notice promises a 24-month limit.
- Sign-in emails carry only the link and what the person needs to act on it. Never a plan, amount, status or any other record value. Why: email is copied to more places than the app.
- Go-live needs `Organisation.dpaSignedAt`, set when the owner ticks the agreement at sign-up (FR-17), and a privacy notice that names Google, Flutterwave and the email service. Why: under the Act, the space is the controller and must tell members and helpers who processes their data.
- Never put real member data in tests, fixtures, seed files or commits. Why: copies outside the database have no row-level security.

## Open

- How a member asks to see or delete their data. The PRD does not say.
