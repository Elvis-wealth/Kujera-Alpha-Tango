---
trigger: model_decision
description: "Who can sign up and sign in, how, and which actions owner, desk and member may take."
---

# Sign-in and roles

Job: who can sign up and sign in, how, and which actions owner, desk and member may take.
Source: PRD v4.1 Sections 4, 6.4, 8.3, FR-01, FR-13, FR-16, FR-17, FR-18, FR-20, FR-26.

## What each role may do

| Action | Member | Desk | Owner | System |
|---|---|---|---|---|
| Sign up a new space (FR-17) | Anyone, no session | Anyone, no session | Anyone, no session | No |
| Reset own password (FR-18) | Yes | Yes | Yes | No |
| Member features (FR-20 to FR-26) | Yes | No | No | No |
| Check members in, offline check-in (FR-04, FR-05) | No | Yes | Yes | No |
| Create members, sell plans and day passes (FR-01) | No | Yes | Yes | No |
| Send or resend member invites (FR-01) | No | Yes | Yes | No |
| Book rooms, hire rooms, record overruns and no-shows (FR-06) | No | Yes | Yes | No |
| Record cash (FR-07) | No | Yes | Yes | No |
| Confirm or reject transfer reports (FR-08) | No | Yes | Yes | No |
| Edit or cancel memberships (FR-01) | No | No | Yes | No |
| Approve opening positions (FR-02) | No | No | Yes | No |
| Plans, prices, rooms (FR-03) | No | No | Yes | No |
| Money view, cash count, reverse a payment (FR-11) | No | No | Yes | No |
| Ask (FR-12) | No | No | Yes | No |
| Helper logins, payment setup, Kujera subscription (FR-13 to FR-15) | No | No | Yes | No |
| Edit house rules, FAQ, Wi-Fi, opening hours (FR-16) | No | No | Yes | No |
| Read space info (FR-26) | Yes | Yes | Yes | No |
| Webhooks and the daily job (FR-30, FR-31) | No | No | No | Yes |

## Rules

- Check the role in the Route Handler before every owner or desk action, using the table above. Why: RLS decides which rows a role sees, not which actions it may take.
- `/owner` pages load only for OWNER. `/desk` pages load for OWNER and DESK. Why: the owner can cover the door, but a helper must never reach the money view.
- Everyone signs in with email and password. There is one `User` per email across Kujera. Why: one credential type means one set of screens, lockouts and tests to get right.
- Lower-case every email before storing or comparing it. Why: `Musa@Space.ng` and `musa@space.ng` must be one person.
- Every member has an email. The member form refuses to save without one. Why: the invite is the only way a member gets a login (PRD FR-01).
- A password has at least 10 characters and is hashed with argon2id. Five wrong passwords lock the account for 15 minutes. Why: a lock stops guessing, and a leak must not reveal passwords.
- Every sign-in link is single-use and stores only a hash of its token. Lifetimes: sign-up confirmation 24 hours, helper invite 72 hours, member invite 7 days, password reset 1 hour. Resending cancels the older link. Why: a database leak must not hand out working links, and a forwarded email must stop working once used.
- Sign-up creates nothing until the confirmation link is opened. The confirmed link creates the space, its first location, the owner's login, the OWNER staff row and the trial invoice in one SECURITY DEFINER call. Why: a half-created space breaks quietly, and unconfirmed sign-ups must cost nothing.
- Limit sign-up to 5 attempts per IP address per hour and 3 confirmation emails per address per day. Delete unconfirmed sign-ups after 7 days. Why: an open form attracts bots and email abuse.
- Sign-up, sign-in, "Forgot password" and invite screens give the same answer whether or not the email has a login. Why: an answer that differs tells strangers who is a member or owner.
- An invite to an email that already has a login adds the new role at the new space and asks for the existing password. It never sets a new password. Why: one person can be a member at one space and staff at another, and an invite must not take over an existing login.
- Only the owner invites helpers, always with role DESK. Owner and desk can invite and re-invite members. Why: desk access is the owner's decision. Members are added at the door.
- Setting `Staff.active` to false revokes all of that person's sessions at once. A password reset never restores a role a person no longer has. Why: a removed helper must lose access immediately.
- A password reset ends every other session for that person. Why: a reset usually means someone else may know the old password.
- Store phone numbers in E.164 format, for example `+2348031234567`. Phone is for door lookup, not sign-in. Why: one format means the desk finds the right person.
- Session cookies are httpOnly, Secure and SameSite=Lax, last 30 days, and renew on use. Why: the check-in pass must open offline, and a password cannot be checked offline.
- "Log out of this phone" clears the session, IndexedDB and the check-in secret. The owner can revoke all of a member's sessions, which also rotates the check-in secret. Why: a lost phone must stop working as a pass.

## Open

- Which email service sends sign-in emails (PRD Q9). Build no email call until it is chosen. Sign-up, invites and resets are blocked until then.
- Whether sign-up needs a CAPTCHA as well as rate limits (PRD Q10). Default: no CAPTCHA.
- How many helper logins a space may have (PRD Q8). Default: no limit.
- How a person who is both a member and staff picks a role. The PRD stores the choice in `Session.actingAs` but gives no screen.
