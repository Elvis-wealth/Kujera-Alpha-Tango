---
name: add-ask-question
description: Use when building or changing the prepared query and fixed sentence for one Ask question ID in Kujera (FR-12, PRD 7.3). Not for adding a new question ID, which is a schema change.
---

# Add an Ask question

## Before you start

1. Name the question ID from the `AskQuestion` enum. If it is not in PRD 7.3, stop and ask.
2. Copy the question's wording and its "Computed from" tables from PRD 7.3.
3. Write the fixed sentence for it and show it to the user before building. The PRD gives the question, not the answer sentence.

## Steps

1. Create one module for the question under `src/server/ask/`, named after the ID in kebab case, for example `members-paid.ts`.
2. Export one function that takes the RLS transaction and the period's start and end, and nothing else.
3. Work out the period bounds in Lagos time, exactly as `.agents/rules/ai-ask.md` defines them, in one shared helper used by every question.
4. Write the query with Prisma Client. Use tagged-template `$queryRaw` only when Prisma cannot express the aggregate.
5. Use `effectiveStatus()` rules for any membership count. Never filter on the stored status column.
6. Return the values, then fill the fixed sentence through the shared money and time formatters.
7. Add the keyword matcher entries for this question in the same module.
8. Register the module in the question catalogue so the buttons list shows it.
9. Add at least 8 labelled questions for this ID to the test set, 2 or more in Pidgin or mixed English.

## Stop and ask when

- The answer needs a table or column that does not exist.
- The PRD wording could mean two different numbers, for example "members paid" as people or as payments.

## Done when

- A test builds a known set of records with `src/test/builders.ts` and checks the filled sentence for each of the four periods.
- A test shows a record from another organisation is never counted.
- The `testing.md` definition of done passes.
