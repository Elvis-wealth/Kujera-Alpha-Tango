---
trigger: model_decision
description: "How an owner's Ask question becomes a figure from a prepared query, or the list of questions Ask can answer."
---

# Ask

Job: how an owner's Ask question becomes a figure from a prepared query, or the list of questions Ask can answer.
Source: PRD v4 Section 7, FR-12.

## Rules

- Ask is for the OWNER role only. The Route Handler refuses DESK and MEMBER sessions. Why: Ask shows takings and who owes, which desk mode must not see.
- Allow 50 questions per owner per Lagos day. Why: protects the free model quota.
- Before any model call, replace digit groups with `[N]`, emails with `[EMAIL]` and URLs with `[URL]`. Why: numbers, emails and links are where personal data hides. The PRD names no token for URLs, so this file sets `[URL]`.
- Send the model only the redacted question, the list of question IDs from PRD 7.3 and the four periods. Never send a record, a figure or a member name. Why: the free tier lets Google use inputs, so nothing from the space's records may go there.
- Call the model with a 4-second timeout and ask for JSON with `question`, `period` and `confidence`. Accept only a `question` from the `AskQuestion` enum and a `period` from the `AskPeriod` enum. Treat confidence below 0.6 as UNKNOWN. Default the period to THIS_MONTH when the model gives none. Why: a slow or invented reply must never become an answer.
- On a timeout or HTTP 429, use the keyword matcher and log the outcome MODEL_UNAVAILABLE. If the matcher finds nothing, show the catalogue buttons. Why: Ask must still work when the free quota runs out.
- On UNKNOWN, reply "I can't answer that yet. Here are the questions I can answer." and show every catalogue question as a button. Log the outcome NOT_IN_LIST. Why: the owner can always reach an answer in one more tap.
- Each question ID has exactly one prepared query and one fixed sentence, kept together in one module under `src/server/ask/`. The query takes only the organisation from the session and the period's start and end. Why: one place per question makes each answer easy to check against its query.
- Work out period bounds in Lagos time: TODAY is the Lagos day, THIS_WEEK starts Monday, THIS_MONTH starts on the 1st, LAST_MONTH is the whole previous month. Why: a week or month that starts in UTC moves takings into the wrong period.
- Every membership count uses `effectiveStatus()` rules, not the stored status column. Why: Ask must agree with the members list and the door.
- Fill the sentence with values formatted by the shared money and time formatters, then add "From your records. Updated [time]." Never show model output text. Why: every figure must come from the database and show its age.
- Write one AskLog row per question: redacted question, question ID, period, confidence, outcome, model name, latency, and later the "Did this answer it?" tap. Why: the monthly review of NOT_IN_LIST questions decides what to add next.
- Adding a question ID needs a new enum value, so it is a schema change. Stop and ask. Why: AGENTS.md forbids schema changes without the user.
- A release passes only when the 150-question test set (PRD 7.5, at least 40 in Pidgin or mixed English) gets the right question ID and period 90% of the time or more. Why: this is the only proof the classifier picks the right query.
- Use the classification prompt the user approves, word for word. A change needs user approval and a new test-set run. Why: a small prompt change can move questions to the wrong query.

## Open

- Classification model ID (PRD Q18): the user fills it. Build no model call until it is filled.
- The classification prompt text. PRD v4 does not include one. Ask the user before writing it.
