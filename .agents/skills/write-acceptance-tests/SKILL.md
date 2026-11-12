---
name: write-acceptance-tests
description: Use after building or changing any Kujera FR that has Given / When / Then acceptance lines in the PRD, to turn each line into a test.
---

# Write acceptance tests

## Before you start

1. Name the FR ID.
2. Copy every Given / When / Then line for that FR from `kujera-prd-v4.md` into a working list.

## Steps

1. Create the test file next to the code it tests, using the naming in `.agents/rules/testing.md`.
2. Write one test per line on your list. Use the line, word for word, as the test name.
3. Build each "Given" state only from the builders in `src/test/builders.ts`. If a builder is missing, add it there first.
4. Replace every outside service the code calls with a mock: Flutterwave, Gemini and the email service.
5. Mark each test that needs a database as a database test.
6. If the FR touches who can see which rows, add or update the three release tests named in `.agents/rules/security-rls.md`.
7. Run every test that is not a database test.
8. List every database test by name at the end of your response, for the user to run.

## Stop and ask when

- A line cannot be tested as written.
- A test can only pass by loosening what the line says.

## Done when

- Every line on your working list has a test with the same name.
- Every non-database test passes.
- Your response lists the database tests for the user.
