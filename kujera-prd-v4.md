# Kujera: Product Requirements Document

Version 1, draft 4.1. 11 November 2026. Rewritten around the owner. Draft 3 centred on a member app and an AI assistant for members. That direction is retired. Draft 4.1 changes sign-in: spaces sign themselves up, and everyone signs in with email and password.

How to read this document:
- Money is stored in kobo, as whole numbers. ₦1 is 100 kobo.
- Instants are stored in UTC. Calendar dates are stored as Africa/Lagos dates. Everything is shown in Africa/Lagos time.
- Assumptions are marked inline as [ASSUMPTION An] and listed at the end.
- **Private records are fetched by exact member ID and never searched by meaning.**

---

## 1. Product Summary

Kujera is a management app for Nigerian coworking space owners. It tracks members, check-ins, room bookings and payments in one place, so nobody walks in unpaid and no booked hour goes unbilled. Members get a simple pass, a way to pay, their receipts, and room booking at their own space.

Kujera has two users:
- **Owner.** The main user. Signs the space up on the Kujera website and runs it from the owner screens. Can add helper logins in a limited desk mode for whoever runs the door.
- **Member.** Uses a small PWA (an installable website) to show a check-in pass, pay, report a bank transfer, keep receipts, book rooms, and read the space's prices, house rules, FAQ, Wi-Fi and opening hours.

Everyone signs in with email and password. A space signs itself up and gets a 30-day free trial. Owners add members, and each member gets an email invite to set a password.

Kujera never receives, holds or settles members' money. Member payments go straight to the space's own Flutterwave account. Kujera's only income is a monthly fee each space pays from the owner screens.

The owner can ask the app business questions, such as "How many members paid this month?". Answers come from a fixed list of questions. The server computes every number from the space's own records. The AI model only works out which question was asked.

Version one launches with one space and one location. Every tenant table carries an organisation ID so more spaces can join later.

---

## 2. Problem

A typical Abuja space runs on WhatsApp, an Excel sheet, bank alerts on the owner's phone and a busy front desk.

| Loss | What happens | Who pays |
|---|---|---|
| Unnoticed expiry | A plan expired two weeks ago. The member keeps coming in. | The owner loses desk revenue. Two weeks of an ₦85,000 monthly plan is about ₦40,000. |
| Unbilled room time | A one-hour booking runs two hours. An outsider hires a room and pays cash into a notebook, or not at all. | The owner loses the hourly room rate. |
| Unmatched transfers | A transfer arrives with the narration "desk". Nobody can tell whose it is. | A paid member is turned away. The owner spends time matching. |
| Untracked cash | Cash goes into a drawer and a notebook. | The owner cannot check staff. |
| No view of the business | The owner cannot say how many members paid this month or which room earns most without a spreadsheet afternoon. | The owner decides prices and staffing blind. |

These losses are hypotheses from founder conversations. The baseline week (Section 12) must count each one before go-live. If a loss does not show up, the feature built for it moves to "later".

---

## 3. Goals (include non-goals)

### Goals

| ID | Goal | Measured by |
|---|---|---|
| G1 | No paid member is turned away at the door. | M4 |
| G2 | No expired member gets in unnoticed. | M8 |
| G3 | Every transfer report is decided within one working day. | M2 |
| G4 | Every booked and overrun room hour is billed. | M1 |
| G5 | Cash recorded in Kujera matches cash counted. | M5 |
| G6 | The owner can answer common business questions in seconds. | M6, M7 |
| G7 | No member ever sees another member's private record. | M9 |
| G8 | The space recovers more than Kujera costs, and agrees to pay. | M1, M10 |

### Non-goals

- Kujera does not hold, route or settle members' money.
- Kujera sends no messages except sign-in emails: sign-up confirmation, invites and password resets. No reminders, receipts by email or marketing.
- No AI assistant for members.
- No public directory of spaces and no booking at spaces a member does not belong to.
- No accounting software and no tax returns.
- No reading of transfer screenshots by machine.

---

## 4. Users and Personas

### Owner (main user)

**Amaka, 38, owns a 60-desk space in Wuse 2, Abuja.**
- Found Kujera online and signed her space up herself.
- Runs the space herself most days. Hires one person to cover the door in the afternoons.
- Uses an Android phone and a laptop.
- Opens Kujera every morning to see who owes and who expires this week, and at month end to see what came in.
- What makes her pay for Kujera: fewer expired members slipping in, rooms billed properly, and no evening spent matching bank alerts.

### Desk helper (limited desk mode)

**Musa, front desk, afternoons.**
- Logs in with his own account, invited by the owner.
- Checks members in, sells day passes, records cash, confirms or rejects transfer reports, books rooms and records overruns.
- Cannot reverse payments, see the money view or Ask, or change prices, keys or staff.

### Member

**Tolu, 27, product designer on an ₦85,000 monthly hot desk.**
- Cheap Android phone, small data bundles, unreliable power.
- Opens the app at the door to show her pass, around month end to pay, once a month for a receipt, and once a week to book a room.

### Walk-in

The desk creates a member record with name, phone and email to sell a day pass or hire a room. Email is required for every member, so a walk-in also gets an invite and can use the pass on their next visit. [ASSUMPTION A1: walk-ins are members like any other, because email is required for everyone.]

### Desk setup

- The door uses one Android phone or laptop with a camera, on the space's Wi-Fi with mobile data as backup. [ASSUMPTION A2: one desk device.]
- Check-in keeps working when the space's internet is down (FR-05).

---

## 5. Scope (in scope, out of scope, later)

### In scope for version one

Owner:
1. Members and plans (FR-01, FR-02, FR-03)
2. Check-in at the door (FR-04, FR-05)
3. Room bookings (FR-06)
4. Payments: cash, transfers, online (FR-07, FR-08, FR-09, FR-10)
5. Money view (FR-11)
6. Ask (FR-12)
7. Helper logins (FR-13), payment setup (FR-14), Kujera subscription (FR-15)
8. Space info: house rules, FAQ, Wi-Fi and opening hours (FR-16)
9. Space sign-up (FR-17)
10. Passwords and reset, for everyone (FR-18)

Desk mode: FR-04 to FR-08, using only the actions in Section 6.4.

Member:
1. Sign in (FR-20)
2. Check-in pass (FR-21)
3. Plan and pay (FR-22)
4. Report a bank transfer (FR-23)
5. Receipts (FR-24)
6. Book a room at their own space (FR-25)
7. Space info: price list, house rules, FAQ, Wi-Fi and opening hours (FR-26)

### Out of scope for version one

- AI assistant for members
- Searching space info by meaning. Space info is read as plain pages.
- Public directory of spaces, "spaces near me", booking at another space
- Members booking rooms by the hour without credits [ASSUMPTION A3: member self-booking uses credits. The desk can still hire a room to anyone by the hour.]
- Company admin and team plans
- Member dashboards, community feed, events
- Any outbound message except sign-in emails (sign-up confirmation, invites, password resets)
- Members without an email address. Every member must have one.
- Automatic card charging for Kujera's fee

### Later (version two)

- "Find a space near you" directory, once enough spaces use Kujera
- Renewal reminders to members who consented
- AI questions beyond the fixed list
- A member assistant that answers from house rules and FAQ (needs pgvector, Q17)
- Pay-per-hour room booking by members
- Phone and PIN sign-in for members without email, if many members turn out to lack one
- A Kujera admin view for the Kujera team to manage spaces

---

## 6. Functional Requirements

### 6.1 Summary

| ID | Requirement | Who | Writes |
|---|---|---|---|
| FR-01 | Members and plans | Owner, desk (create only) | Member, User, AuthToken, Membership, Invoice, ContactConsent |
| FR-02 | Opening positions (cut-over import) | Owner | OpeningPosition, Membership, Invoice, CreditEntry |
| FR-03 | Plans, prices and rooms | Owner | Plan, Room |
| FR-04 | Check-in at the door | Owner, desk | CheckIn, Membership, Invoice, Payment, Receipt |
| FR-05 | Check-in while offline | Owner, desk | CheckIn (on sync) |
| FR-06 | Room calendar and bookings | Owner, desk | Booking, CreditEntry, RoomOverrun, Invoice |
| FR-07 | Record cash | Owner, desk | Payment, Receipt, Invoice, Membership |
| FR-08 | Confirm or reject transfer reports | Owner, desk | TransferReport, Payment, Receipt, Invoice, Membership |
| FR-09 | Online payments | Member, owner | PaymentAttempt, Payment, Receipt, Invoice, Membership |
| FR-10 | Invoices, receipts and renewals | System | Invoice, Receipt |
| FR-11 | Money view | Owner | CashCount, Payment (reversal) |
| FR-12 | Ask | Owner | AskLog |
| FR-13 | Helper logins | Owner | AuthToken, Staff, User |
| FR-14 | Payment setup | Owner | Organisation, OrganisationSecret |
| FR-15 | Kujera subscription and expired banner | Owner | SubscriptionInvoice |
| FR-16 | Space info | Owner | InfoEntry, OpeningHours, WifiNetwork |
| FR-17 | Space sign-up | New owner | SpaceSignup, Organisation, Location, User, Staff, SubscriptionInvoice |
| FR-18 | Passwords and reset | Owner, desk, member | User, AuthToken, Session |
| FR-20 | Member invite and sign-in | Member | User, Member, AuthToken, Session |
| FR-21 | Check-in pass | Member | none |
| FR-22 | Plan and pay | Member | PaymentAttempt |
| FR-23 | Report a bank transfer | Member | TransferReport, Invoice, Membership |
| FR-24 | Receipts | Member | none |
| FR-25 | Book a room at their own space | Member | Booking, CreditEntry |
| FR-26 | Space info | Member | none |
| FR-30 | Payment webhooks | System | WebhookEvent, then FR-09 writes |
| FR-31 | Daily job | System | Membership, Invoice, SubscriptionInvoice, CreditEntry |
| FR-32 | One effective status function | System | none |

### 6.2 Owner features

#### FR-01 Members and plans

- The owner sees every member with effective status: active, provisional, expiring this week, expired, no plan. Filters: status, plan, owes money.
- Create a member: full name, phone, email (required), plan (optional), and a yes or no to "Can the space message you about your plan?" Saving sends the member an invite email at once (FR-20). [ASSUMPTION A28: the invite goes out on save.]
- The member record shows the invite state: sent, accepted or expired. "Resend invite" sends a new link and cancels the old one. Owner and desk can resend.
- Changing a member's email before they accept cancels the old invite and sends a new one. After they accept, only the member changes their email.
- Sell a plan: picks a plan, creates the Membership and its invoice. Payment follows FR-07, FR-08 or FR-09.
- Desk mode can create members and sell plans. Only the owner can edit or cancel a membership.
- Given a phone or email already registered at this space, when someone enters it, then the screen opens that member instead of creating a duplicate.
- Given a member saved with `tolu@example.com`, then an invite email goes to that address and the record shows "Invite sent".
- Given a member whose plan ended yesterday, when the owner opens the list, then the member shows as expired using `effectiveStatus()` (FR-32).

#### FR-02 Opening positions

- Before go-live, the owner enters or imports one opening position per member: plan, end date, amount owed, room minutes left, and a note such as "Excel row 14".
- The owner approves each one. Approval creates the Membership, an OPENING_BALANCE invoice if money is owed, and an OPENING credit entry.
- Go-live is blocked until every active member has an approved opening position.
- Given 60 draft opening positions, when the owner approves 59, then go-live stays blocked and the screen names the one left.

#### FR-03 Plans, prices and rooms

- Plans: name, type (day pass, weekly, monthly, dedicated desk, private office), price, length in days, room minutes per period.
- Rooms: name, location, capacity, hourly rate, active.
- A price change applies to new invoices only.

#### FR-04 Check-in at the door

- Scan the member's pass code, or look up by the last four digits of the phone or by name.
- Results: ALLOWED (green), ALLOWED_PROVISIONAL (amber, "Transfer unconfirmed"), DENIED_EXPIRED (red, "Ended [date], owes [amount]"), DENIED_NO_PLAN (red).
- Every result is logged, including denials. From a denial, the screen offers "Sell day pass" and "Take payment".
- Every result uses `effectiveStatus()` (FR-32).
- If the server cannot be reached for 10 seconds, the screen switches to offline mode (FR-05).
- Given an expired member's code, when scanned, then the result is DENIED_EXPIRED and a CheckIn row with that result exists.

#### FR-05 Check-in while offline

- The door device keeps a roster cache: member code, name, last four phone digits, effective status, end date and provisional-until time. No secrets and no money values. It refreshes every 15 minutes while online.
- Offline, the screen decides from the cached status and marks the result "Offline". The scanned code is stored with its scan time.
- On reconnect, queued check-ins are sent. The server checks each code against its scan time. A failed code shows on the owner's money view.
- Offline mode works for 4 hours from the last refresh. After that the screen says "Roster too old. Check members by name and write them down." [ASSUMPTION A4: 4 hours.]

#### FR-06 Room calendar and bookings

- A day and week calendar per room, in 30-minute slots inside the location's opening hours (FR-16). [ASSUMPTION A5: 30-minute slots.]
- Book for a member with credits, or hire a room to a walk-in by the hour. A hire creates a ROOM_HIRE invoice, paid before use. [ASSUMPTION A6: walk-ins pay before use.]
- Record an overrun: extra minutes come from credits if the member has them. Otherwise a ROOM_OVERRUN invoice is created at the hourly rate, rounded up to 30 minutes.
- Mark a no-show. Minutes stay charged.
- Move or cancel a booking. Cancelling 2 hours or more before the start refunds credits. [ASSUMPTION A7: 2-hour cut-off.]
- No two confirmed bookings overlap in the same room, enforced by the database.
- Given Room B free from 2pm to 4pm, when the desk hires it to a walk-in for 2 hours at ₦5,000 an hour and records ₦10,000 cash, then the booking, a Paid invoice and a receipt exist, and members see 2pm to 4pm as taken.

#### FR-07 Record cash

- Pick an unpaid invoice and confirm the amount. No partial payments. [ASSUMPTION A8: no partial payments.]
- Takes effect at once and shows "Recorded by [name]" on the receipt.
- Given an unpaid ₦85,000 invoice, when the desk records ₦85,000 cash, then the invoice is Paid, a receipt exists, and the membership is extended.

#### FR-08 Confirm or reject transfer reports

- A list of pending reports, oldest first: member, sender name, amount, time, optional photo, and an "Amount differs" warning. Reports older than 24 hours turn red.
- Confirm creates the Payment and Receipt, marks the invoice Paid and turns provisional access into active.
- Reject needs a reason. The invoice returns to Unpaid and provisional access ends at once. The member sees "Transfer not confirmed: [reason]".
- Owner and desk mode can both confirm and reject. Every decision shows on the owner's money view with who made it.

#### FR-09 Online payments

- Uses Flutterwave Standard through the space's own Flutterwave account. Details are in Section 8.4.
- One active payment reference per invoice. A reference is never reused.
- Only a server-side Flutterwave verify call, or a staff confirmation (FR-07, FR-08), marks an invoice Paid. A webhook only triggers the verify call. The member's phone never decides.
- A later success on an abandoned reference still counts. An unpaid invoice becomes Paid. A paid invoice gets an AccountCredit for the owner to review.

#### FR-10 Invoices, receipts and renewals

- Invoice and receipt numbers come from per-space counters.
- A receipt shows space name, address, member, amount, method, date, and "Recorded by [name]" or the Flutterwave reference. It opens as a light HTML page the member can save as PDF.
- Renewal invoices: none for day passes, 2 days before the end date for weekly plans, 7 days before for monthly and longer. [ASSUMPTION A9: these lead times.]
- A renewal paid on or before the end date starts the next day. A renewal paid after expiry starts on the payment day.

#### FR-11 Money view

- Today and this month: money taken, split into cash, transfer and online.
- Who owes, with amounts and days overdue. Who expires this week.
- Pending transfer reports. Confirmations and rejections since the last review, grouped by who made them.
- Cash count: the owner enters the cash in the drawer. The screen shows counted minus recorded, by person.
- Reverse a payment (owner only): needs a reason. The invoice returns to Unpaid, the membership extension is rolled back, and an audit record is written.
- Offline check-ins whose code failed on sync.
- Desk mode cannot open this screen.

#### FR-12 Ask

See Section 7. Owner only.

#### FR-13 Helper logins

- The owner invites a helper by email. Kujera sends one invite email with a single-use link that expires after 72 hours and opens a set-password screen. [ASSUMPTION A10: 72 hours.]
- Helpers sign in with email and password (FR-18), in desk mode only.
- If the email already has a Kujera login, the invite adds the desk role at this space and asks them to sign in with their existing password.
- The owner removes a helper by deactivating them, which ends all their sessions at once.
- Given the owner invites `musa@example.com`, when Musa sets a password within 72 hours, then a DESK staff row exists and Musa is signed in to the door screen.

#### FR-14 Payment setup

- The owner enters the space's Flutterwave public key, secret key and webhook secret hash. The secret key and webhook secret are encrypted and stored in a table the app cannot read directly (Section 8.5).
- The screen shows the webhook URL to paste into the Flutterwave dashboard: `https://[app-domain]/api/webhooks/flutterwave/space/[organisationId]`.
- A "Test connection" button reports test mode or live mode.

#### FR-15 Kujera subscription and expired banner

- The owner sees the tier, active member count, paid period and next invoice, and pays into Kujera's own Flutterwave account.
- The daily job creates one subscription invoice per location per month, 7 days before the period ends. The tier is set from the active member count at that moment.
- When no paid subscription invoice covers today, owner and desk screens show "Kujera subscription expired. Pay to keep your records safe." The banner blocks nothing. [ASSUMPTION A12: banner only.]
- A new space gets a 30-day free trial from sign-up (FR-17), recorded as a zero-cost PAID subscription invoice marked as a trial, so no banner shows. The first paid invoice is created 7 days before the trial ends. [ASSUMPTION A26: 30 days.]
- Members never see subscription data.

#### FR-16 Space info

- The owner keeps four things members can read: house rules, FAQ, Wi-Fi details and opening hours. The price list is not entered here. It is built from plan and room prices (FR-03), so it is always current.
- House rules: a list of short rules, each with a heading of up to 120 characters and text of up to 600 characters, in the owner's order.
- FAQ: question and answer pairs, same limits, in the owner's order.
- At most 30 house rules and 30 FAQ entries per space. [ASSUMPTION A22: these limits keep the member download small.]
- Wi-Fi: network name, password and an optional note, per location.
- Opening hours: open and close time for each day of the week, or "Closed", per location. Room booking (FR-06, FR-25) uses these hours.
- Changes show to members at once. There is no draft or approval step. [ASSUMPTION A23: the owner is the only editor, so approval adds nothing.]
- Only the owner edits. Every change writes an audit record.
- Given the owner changes the Wi-Fi password, when a member opens Space info, then the new password shows with "Updated [time]".

#### FR-17 Space sign-up

- From the marketing page, a new owner enters: space name, their full name, email and password, and ticks "I agree to the Terms and the data processing agreement". The first location takes the space's name and can be renamed later.
- Kujera emails a confirmation link that works once and lasts 24 hours. Nothing is created until the link is opened. [ASSUMPTION A30: 24 hours.]
- Opening the link creates, in one transaction through one SECURITY DEFINER function: the Organisation with a unique short name (`slug`) made from the space name, its first Location, the owner's User with the email marked verified, an OWNER Staff row, the trial subscription invoice (FR-15), `dpaSignedAt`, and an audit row. The owner is then signed in.
- The owner's Today screen shows a setup checklist until each step is done: plans and rooms, Flutterwave keys, members or opening positions, space info. The go-live rule in FR-02 still applies.
- Every sign-up answer looks the same: "Check your email to confirm your space." If the email already has a Kujera login, that email says so and links to log in and reset. No screen reveals whether an email is registered.
- Limits: 5 sign-up attempts per IP address per hour, and 3 confirmation emails per address per day. Unconfirmed sign-ups are deleted after 7 days. [ASSUMPTION A29: these limits. ASSUMPTION A31: 7 days.]
- Given Amaka signs up "Wuse Hub" and opens the link within 24 hours, then the space, its location, her OWNER login and a 30-day trial invoice exist, she is signed in, and no subscription banner shows.

#### FR-18 Passwords and reset

- Owners, helpers and members all sign in with email and password. Emails are lower-cased before storing or comparing.
- Passwords have at least 10 characters and are hashed with argon2id. Five wrong tries lock the account for 15 minutes. [ASSUMPTION A11: 10 characters.]
- "Forgot password" asks for an email and always answers "If that email has a Kujera login, we've sent a reset link." The link works once and lasts 1 hour. Setting a new password ends every other session for that person. [ASSUMPTION A27: 1 hour.]
- A reset never restores access a person no longer has. A removed helper can reset a password but cannot open the desk.
- Given a member requests a reset and sets a new password within 1 hour, then her old sessions on other phones end and she is signed in on this one.

### 6.3 Member features

#### FR-20 Member invite and sign-in

- The invite email (FR-01) holds a single-use link that lasts 7 days and opens a set-password screen with the member's name filled in. Setting the password marks the email verified, links the member to their login, and signs them in to their pass. [ASSUMPTION A25: 7 days.]
- If the email already has a Kujera login, for example a member of two spaces, the invite adds this space and asks them to sign in with their existing password.
- An expired or used link shows "This invite has expired. Ask the desk to send a new one."
- Members sign in with email and password (FR-18). Sessions last 30 days and renew on use. "Log out of this phone" clears the session and everything stored on the phone.
- Given Tolu opens her invite within 7 days and sets a password, then her member record shows "Invite accepted" and her pass opens.

#### FR-21 Check-in pass

- A QR code and a 6-character code that change every 30 seconds, made on the phone from a per-member secret (TOTP, the method authenticator apps use). It works with no data.
- The pass shows the member's name and plan status from the last sync, with its "as of" time.
- If scanning fails: "If scanning fails, give the desk your phone number."

#### FR-22 Plan and pay

- One screen: plan status, end date, room hours left, amount owed, with "Updated [time]".
- Pay opens Flutterwave's hosted payment page. Before showing Pay on an invoice with an active attempt, the server verifies that attempt (FR-09).
- The last known status and invoices stay on the phone for offline viewing, marked "Offline. As of [time]".

#### FR-23 Report a bank transfer

- Fields: sender name, amount, transfer time. A photo is optional and compressed on the phone to 150 KB or less.
- Submitting sets the invoice to Pending confirmation.
- If the membership has expired or ends within 24 hours, the member gets 24 hours of provisional access. Provisional access is granted once per invoice, and not for 30 days after a rejected report. [ASSUMPTION A13: one window per invoice and a 30-day block, so false reports cannot give free access.]
- Provisional access blocks room booking.

#### FR-24 Receipts

- A list of past receipts. Each opens as the FR-10 receipt page.

#### FR-25 Book a room at their own space

- Members see free and taken slots for rooms at the space they belong to. They never see who booked a slot.
- Booking uses room credits. Cancelling 2 hours or more before the start refunds them.
- Members with an expired plan, provisional access or no credits cannot book. They see the hourly rate and "Ask the desk to book for you."
- Bookings may be made up to 14 days ahead and never past the plan end date. [ASSUMPTION A14: 14 days.]
- Given a member with 3 hours of credit and Room B free at 2pm Thursday, when she books 2pm to 3pm, then the booking is confirmed and her credit shows 2 hours.

#### FR-26 Space info

- One screen with five sections: Prices, Opening hours, Wi-Fi, House rules, FAQ.
- Prices list every active plan with its price and length, and every active room with its hourly rate and capacity. Each section shows "Updated [time]".
- The Wi-Fi password shows only when the member's effective status is ACTIVE or PROVISIONAL. Otherwise the section says "Wi-Fi details show when your plan is active." [ASSUMPTION A24: the password is for paying members only.]
- The last copy stays on the phone for offline reading, marked "Offline. As of [time]". The server returns "not changed" when nothing has changed since the phone's copy, so a repeat visit costs almost no data.
- Space info is read, never searched by meaning. No AI is involved.
- Given an expired member, when she opens Space info, then she sees prices, hours, rules and FAQ, and no Wi-Fi password.

### 6.4 Desk mode permissions

| Action | Owner | Desk |
|---|---|---|
| Check members in, offline check-in | Yes | Yes |
| Create members, sell plans and day passes | Yes | Yes |
| Send or resend member invites | Yes | Yes |
| Book rooms, hire rooms, record overruns and no-shows | Yes | Yes |
| Record cash | Yes | Yes |
| Confirm or reject transfer reports | Yes | Yes |
| Edit or cancel memberships | Yes | No |
| Reverse payments, cash count | Yes | No |
| Money view and Ask | Yes | No |
| Plans, prices, rooms | Yes | No |
| Helper logins, payment setup, subscription | Yes | No |
| Edit house rules, FAQ, Wi-Fi, opening hours | Yes | No |
| Approve opening positions | Yes | No |

### 6.5 System requirements

#### FR-30 Payment webhooks

- Two routes: `/api/webhooks/flutterwave/space/[organisationId]` for member payments, and `/api/webhooks/flutterwave/kujera` for subscription payments.
- Check the `verif-hash` header against the right secret with a constant-time compare. Store every event before processing. A repeated event does nothing. Return HTTP 200 as soon as the event is stored.
- After the check, call the verify endpoint and mark Paid only when status, reference, currency and amount all match (Section 8.4).

#### FR-31 Daily job

Runs at 00:10 Lagos time. Gives the same result if run twice. Sends no messages. In order: write cached statuses, create renewal invoices, create subscription invoices, forfeit unused credits unless the space allows rollover.

#### FR-32 One effective status function

`effectiveStatus(membership, organisation, now)` decides status everywhere, in this order: CANCELLED stays CANCELLED; before the start date is SCHEDULED; on or before the end date plus grace days is ACTIVE; provisional-until after now is PROVISIONAL; otherwise EXPIRED. Dates compare as Lagos calendar days. A plan ending 30 Nov is ACTIVE at 11:59pm on 30 Nov and EXPIRED at 12:00am on 1 Dec.

---

## 7. AI and AI-Related Tools and Solutions

### 7.1 The design rule

The owner types a question. The AI model only picks which question from a fixed list was asked, and for which period. The server runs a prepared query for that question on the space's own records and fills a fixed sentence. The model never writes a number and never sees a record.

### 7.2 What the model sees and never sees

| The model sees | The model never sees |
|---|---|
| The owner's question, with digit groups replaced by `[N]` and emails by `[EMAIL]` | Any record, figure or member detail |
| The list of question IDs and periods | Other spaces' anything |

Because question text goes to Google, the privacy notice must say so, and the owner signs a data processing agreement before go-live.

### 7.3 Question catalogue

Each question works for TODAY, THIS_WEEK, THIS_MONTH and LAST_MONTH. Default period: THIS_MONTH.

| ID | Question | Computed from |
|---|---|---|
| TAKINGS | How much did we take? Split into cash, transfer and online. | Payment |
| MEMBERS_PAID | How many members paid? | Payment |
| WHO_OWES | Who owes money, and how much in total? | Invoice |
| PENDING_TRANSFERS | How much is waiting for transfer confirmation? | TransferReport |
| CASH_MATCH | Does recorded cash match the cash count? | Payment, CashCount |
| ACTIVE_MEMBERS | How many active members do we have? | Membership |
| EXPIRING_SOON | Whose plans expire this week? | Membership |
| NEW_MEMBERS | How many new members joined? | Member, Membership |
| TOP_PLAN | Which plan sells most? | Membership, Plan |
| QUIET_MEMBERS | Which active members have not checked in for two weeks? | CheckIn, Membership |
| TOP_ROOM | Which room is booked most? | Booking, Room |
| BUSY_HOURS | What are the busiest booking hours? | Booking |
| OVERRUN_HOURS | How many overrun hours did we bill? | RoomOverrun, Invoice |
| NO_SHOWS | How many bookings were no-shows? | Booking |
| CHECKINS | How many check-ins, and what is the busiest day? | CheckIn |
| TURNED_AWAY | How many people were turned away as expired? | CheckIn |
| KUJERA_FEE | When is our Kujera fee due, and is it paid? | SubscriptionInvoice |

### 7.4 Flow

1. Rate limit: 50 questions per owner per day. [ASSUMPTION A15]
2. Redact the question.
3. Call Gemini with the classification prompt and a 4-second timeout. Ask for JSON: question ID, period, confidence.
4. Accept only an ID and period from the catalogue. Confidence below 0.6 counts as UNKNOWN.
5. UNKNOWN: reply "I can't answer that yet. Here are the questions I can answer." and show the catalogue as tappable buttons.
6. On timeout or HTTP 429, use a keyword matcher. If it finds nothing, show the buttons.
7. Run the prepared query inside the owner's RLS transaction. Fill the fixed sentence. Show "From your records. Updated [time]."
8. Write one AskLog row: redacted question, ID, period, outcome, latency, and the owner's "Did this answer it?" tap.

Questions marked UNKNOWN are reviewed monthly to decide what to add next.

### 7.5 Release gate

Before go-live, label 150 realistic owner questions, at least 40 in Nigerian Pidgin or mixed English. A release passes when 90% or more get the right ID and period. [ASSUMPTION A16]

### 7.6 Tools

| Tool | Use | Note |
|---|---|---|
| Gemini, free tier | Question classification | Free-tier inputs may be used by Google to improve its products, which is why the model sees only the redacted question. Model ID to be chosen. |
| Keyword matcher (own code) | Fallback | No external call |

---

## 8. Technical Architecture (including a complete Prisma data model)

### 8.1 Components

| Component | Built with |
|---|---|
| Owner and desk screens | Next.js App Router, TypeScript, routes under `/owner` and `/desk` |
| Member PWA | Same app, member routes, hand-written service worker |
| API | Next.js Route Handlers. Every handler resolves the session first. |
| Data access | Prisma 6 through one RLS-wrapped client in `src/server/db.ts` |
| Database | PostgreSQL with `btree_gist` for the booking overlap rule |
| Payments | Flutterwave v3, per space and for Kujera |
| AI | Gemini free tier, classification only |
| Daily job | Host cron calling `/api/jobs/daily` with a secret header |

pgvector is not used in version one. Nothing is embedded. See Q17.

### 8.2 Hosting

Build and test on free tiers. A paying space needs a commercial host, because Vercel's free Hobby plan is non-commercial. [ASSUMPTION A17: Vercel Pro and Neon, as in draft 3.]

### 8.3 Sign-in

| User | Credential | Created by |
|---|---|---|
| Owner | Email and password | Space sign-up with email confirmation (FR-17) |
| Desk helper | Email and password | Invite from the owner (FR-13) |
| Member | Email and password | Invite sent when the member is added (FR-01, FR-20) |

One login per email across Kujera. A person can be a member at one space and staff at another. All sessions are httpOnly, Secure, SameSite=Lax cookies. Every sign-in link (sign-up confirmation, invite, reset) is single-use, and only a hash of its token is stored.

### 8.4 Online payment flow

1. The member taps Pay. The server loads the invoice by the session member ID.
2. If an active attempt exists, the server calls `GET /v3/transactions/verify_by_reference?tx_ref=…`. Success marks Paid. Anything else marks the attempt ABANDONED.
3. The server creates a PaymentAttempt with reference `KJ-{orgShort}-{invoiceNumber}-{random6}`.
4. The server calls `POST /v3/payments` with the space's secret key: `tx_ref`, amount, `currency: "NGN"`, `redirect_url`, `customer.email`. Every member has an email (FR-01).
5. The member pays on Flutterwave's hosted page.
6. Flutterwave calls the webhook (FR-30). The server checks `verif-hash`, stores the event, calls verify, and marks Paid only when status is `successful`, `tx_ref` matches, currency is `NGN` and amount equals the invoice.
7. The return page polls the status for up to 60 seconds, then shows the receipt.

Flutterwave amounts are in naira, not kobo. Convert only at the API call. Confirm this and the completed-charge event name in test mode before going live.

### 8.5 Row-level security

- The app connects as `kujera_app`, which cannot bypass RLS.
- Every request runs inside a transaction that sets `app.org_id`, `app.user_id`, `app.member_id` and `app.role` with `set_config(..., true)`.
- `src/server/db.ts` is the only file that creates a Prisma client. Lint blocks direct database imports anywhere else.
- Sign-up, sign-in, sessions, invites and password resets go through SECURITY DEFINER functions.
- A webhook handler sets the role WEBHOOK to read only the webhook secret, checks the header, then switches to SYSTEM.

| Group | Tables | Member sees | Desk sees | Owner sees |
|---|---|---|---|---|
| Member-owned | Member, Membership, MembershipEvent, CreditEntry, Booking, RoomOverrun, CheckIn, Invoice, PaymentAttempt, Payment, Receipt, TransferReport, AccountCredit, ContactConsent, OpeningPosition | Own rows | Own space | Own space |
| Space-wide | Organisation, Location, Plan, Room, InfoEntry, OpeningHours, WifiNetwork | Read | Read | Read and write |
| Owner-only | CashCount, SubscriptionInvoice, AskLog | Nothing | Nothing | Own space |
| Staff | Staff, AuditLog | Nothing | Own staff row | Own space |
| System-only | WebhookEvent | Nothing | Nothing | Nothing |
| Identity | User, Session, AuthToken | Own User row | Own User row | Own User row |
| Closed | OrganisationSecret, SpaceSignup | Nothing | Nothing | Through functions only |

Members get room availability only from a SECURITY DEFINER function that returns room, start and end, never who booked.

The Space info handler leaves out the Wi-Fi password unless the session member's effective status is ACTIVE or PROVISIONAL.

Release tests: two members of one space cannot read each other's rows on any endpoint, and every query with no session settings returns zero rows.

### 8.6 Offline and data budget

- Member first load: 500 KB or less of compressed JavaScript and CSS. System fonts.
- The service worker caches the app shell only, never API responses.
- The phone keeps the plan summary, latest 12 invoices, the check-in secret and the last Space info response, each with an "as of" time. Logout clears all of it.

### 8.7 Prisma data model

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  directUrl  = env("DIRECT_URL")
  extensions = [btree_gist]
}

// ---------- Enums ----------

enum SessionRole {
  MEMBER
  DESK
  OWNER
}

enum StaffRole {
  OWNER
  DESK
}

enum PlanType {
  DAY_PASS
  WEEKLY
  MONTHLY
  DEDICATED_DESK
  PRIVATE_OFFICE
}

enum MembershipStatus {
  SCHEDULED
  ACTIVE
  PROVISIONAL
  EXPIRED
  CANCELLED
}

enum MembershipEventType {
  CREATED
  RENEWED
  PLAN_CHANGED
  PROVISIONAL_STARTED
  PROVISIONAL_ENDED
  EXPIRED
  CANCELLED
  REVERSED
}

enum CreditEntryType {
  OPENING
  GRANT
  BOOKING_DEBIT
  BOOKING_REFUND
  OVERRUN_DEBIT
  FORFEIT
  ADJUSTMENT
}

enum BookingSource {
  MEMBER_CREDITS
  DESK_HIRE
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

enum CheckInMethod {
  CODE_SCAN
  PHONE_LOOKUP
}

enum CheckInResult {
  ALLOWED
  ALLOWED_PROVISIONAL
  DENIED_EXPIRED
  DENIED_NO_PLAN
}

enum InvoiceKind {
  PLAN
  DAY_PASS
  ROOM_OVERRUN
  ROOM_HIRE
  OPENING_BALANCE
}

enum InvoiceStatus {
  UNPAID
  PENDING_CONFIRMATION
  PAID
  VOID
}

enum PaymentMethod {
  FLUTTERWAVE
  TRANSFER
  CASH
}

enum PaymentStatus {
  CONFIRMED
  REVERSED
}

enum PaymentAttemptStatus {
  ACTIVE
  SUCCEEDED
  FAILED
  ABANDONED
}

enum TransferReportStatus {
  PENDING
  CONFIRMED
  REJECTED
}

enum AccountCreditStatus {
  OPEN
  APPLIED
  REFUNDED
}

enum OpeningStatus {
  DRAFT
  APPROVED
  REJECTED
}

enum ContactChannel {
  WHATSAPP
  SMS
  PHONE_CALL
  EMAIL
}

enum ConsentSource {
  DESK
  MEMBER_APP
}

enum AuthTokenPurpose {
  MEMBER_INVITE
  STAFF_INVITE
  PASSWORD_RESET
}

enum InfoKind {
  HOUSE_RULE
  FAQ
}

enum AskQuestion {
  TAKINGS
  MEMBERS_PAID
  WHO_OWES
  PENDING_TRANSFERS
  CASH_MATCH
  ACTIVE_MEMBERS
  EXPIRING_SOON
  NEW_MEMBERS
  TOP_PLAN
  QUIET_MEMBERS
  TOP_ROOM
  BUSY_HOURS
  OVERRUN_HOURS
  NO_SHOWS
  CHECKINS
  TURNED_AWAY
  KUJERA_FEE
  UNKNOWN
}

enum AskPeriod {
  TODAY
  THIS_WEEK
  THIS_MONTH
  LAST_MONTH
}

enum AskOutcome {
  ANSWERED
  NOT_IN_LIST
  MODEL_UNAVAILABLE
}

enum WebhookResult {
  PROCESSED
  DUPLICATE
  BAD_SIGNATURE
  AMOUNT_MISMATCH
  UNKNOWN_REFERENCE
  ALREADY_PAID
}

enum SubscriptionTier {
  STARTER
  GROWTH
  LARGE
}

enum SubscriptionInvoiceStatus {
  UNPAID
  PAID
  VOID
}

// ---------- Tenancy ----------

model Organisation {
  id                 String    @id @default(cuid())
  name               String
  slug               String    @unique
  logoUrl            String?
  address            String?
  timezone           String    @default("Africa/Lagos")
  cutoverDate        DateTime? @db.Date
  goLiveAt           DateTime?
  vatRegistered      Boolean   @default(false)
  vatRateBasisPoints Int       @default(0) // 750 = 7.5%
  paymentPublicKey   String? // the space's Flutterwave public key
  graceDays          Int       @default(0)
  creditsRollOver    Boolean   @default(false)
  nextInvoiceNumber  Int       @default(1)
  nextReceiptNumber  Int       @default(1)
  dpaSignedAt        DateTime?
  createdAt          DateTime  @default(now())

  secret               OrganisationSecret?
  locations            Location[]
  sessions             Session[]
  authTokens           AuthToken[]
  members              Member[]
  staff                Staff[]
  consents             ContactConsent[]
  plans                Plan[]
  rooms                Room[]
  infoEntries          InfoEntry[]
  openingHours         OpeningHours[]
  wifiNetworks         WifiNetwork[]
  memberships          Membership[]
  membershipEvents     MembershipEvent[]
  creditEntries        CreditEntry[]
  bookings             Booking[]
  roomOverruns         RoomOverrun[]
  checkIns             CheckIn[]
  invoices             Invoice[]
  paymentAttempts      PaymentAttempt[]
  payments             Payment[]
  receipts             Receipt[]
  transferReports      TransferReport[]
  accountCredits       AccountCredit[]
  openingPositions     OpeningPosition[]
  cashCounts           CashCount[]
  subscriptionInvoices SubscriptionInvoice[]
  askLogs              AskLog[]
  webhookEvents        WebhookEvent[]
  auditLogs            AuditLog[]
}

// Closed to the app role. Read and written only through SECURITY DEFINER functions.
model OrganisationSecret {
  organisationId      String       @id
  organisation        Organisation @relation(fields: [organisationId], references: [id])
  paymentSecretKeyEnc String // AES-256-GCM
  webhookSecretEnc    String? // AES-256-GCM
  updatedAt           DateTime     @updatedAt
}

model Location {
  id             String       @id @default(cuid())
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id])
  name           String
  address        String?
  createdAt      DateTime     @default(now())

  rooms                Room[]
  checkIns             CheckIn[]
  subscriptionInvoices SubscriptionInvoice[]
  openingHours         OpeningHours[]
  wifiNetworks         WifiNetwork[]

  @@index([organisationId])
}

// ---------- Identity ----------

// Global: one login per person across spaces.
model User {
  id                  String    @id @default(cuid())
  email               String    @unique // lower-cased
  emailVerifiedAt     DateTime?
  passwordHash        String? // argon2id. Null until an invite is accepted.
  failedPasswordCount Int       @default(0)
  lockedUntil         DateTime?
  createdAt           DateTime  @default(now())

  members    Member[]
  staff      Staff[]
  sessions   Session[]
  authTokens AuthToken[]
}

model Session {
  id             String       @id @default(cuid())
  tokenHash      String       @unique
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id])
  actingAs       SessionRole
  memberId       String?
  staffId        String?
  createdAt      DateTime     @default(now())
  lastSeenAt     DateTime     @default(now())
  expiresAt      DateTime
  revokedAt      DateTime?

  @@index([userId])
  @@index([organisationId])
}

// Single-use links: member invites, helper invites, password resets. Only the hash is stored.
model AuthToken {
  id               String           @id @default(cuid())
  purpose          AuthTokenPurpose
  organisationId   String? // null for password resets
  organisation     Organisation?    @relation(fields: [organisationId], references: [id])
  userId           String? // set once the email has a login
  user             User?            @relation(fields: [userId], references: [id])
  email            String // lower-cased
  memberId         String? // MEMBER_INVITE
  staffRole        StaffRole? // STAFF_INVITE
  tokenHash        String           @unique
  expiresAt        DateTime
  usedAt           DateTime?
  cancelledAt      DateTime?
  createdByStaffId String?
  createdAt        DateTime         @default(now())

  @@index([email, purpose])
  @@index([organisationId, purpose])
}

// Pending self sign-up (FR-17). Global, like User. Closed to the app role.
model SpaceSignup {
  id                String    @id @default(cuid())
  spaceName         String    @db.VarChar(120)
  ownerName         String    @db.VarChar(120)
  email             String // lower-cased
  passwordHash      String // argon2id
  dpaAcceptedAt     DateTime
  tokenHash         String    @unique
  expiresAt         DateTime
  confirmedAt       DateTime?
  organisationId    String? // set when confirmed
  ipHash            String? // for sign-up rate limits
  createdAt         DateTime  @default(now())

  @@index([email, createdAt])
}

model Member {
  id                      String          @id @default(cuid())
  organisationId          String
  organisation            Organisation    @relation(fields: [organisationId], references: [id])
  userId                  String? // null until the invite is accepted
  user                    User?           @relation(fields: [userId], references: [id])
  fullName                String
  email                   String // lower-cased, required for every member
  phone                   String // E.164, for door lookup
  memberCode              String // short code shown at the desk, e.g. "K0142"
  checkInSecretEnc        String? // encrypted TOTP secret
  preferredChannel        ContactChannel?
  provisionalBlockedUntil DateTime? // 30 days after a rejected transfer report
  createdByStaffId        String?
  createdAt               DateTime        @default(now())

  memberships      Membership[]
  membershipEvents MembershipEvent[]
  creditEntries    CreditEntry[]
  bookings         Booking[]
  roomOverruns     RoomOverrun[]
  checkIns         CheckIn[]
  invoices         Invoice[]
  paymentAttempts  PaymentAttempt[]
  payments         Payment[]
  receipts         Receipt[]
  transferReports  TransferReport[]
  accountCredits   AccountCredit[]
  consents         ContactConsent[]
  openingPositions OpeningPosition[]

  @@unique([organisationId, phone])
  @@unique([organisationId, email])
  @@unique([organisationId, memberCode])
  @@unique([organisationId, userId])
}

model Staff {
  id             String       @id @default(cuid())
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id])
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  displayName    String
  role           StaffRole
  active         Boolean      @default(true)
  createdAt      DateTime     @default(now())

  @@unique([organisationId, userId])
}

// Append-only. Latest row per member and channel wins. Nothing is sent in version one.
model ContactConsent {
  id                String         @id @default(cuid())
  organisationId    String
  organisation      Organisation   @relation(fields: [organisationId], references: [id])
  memberId          String
  member            Member         @relation(fields: [memberId], references: [id])
  channel           ContactChannel
  consented         Boolean
  source            ConsentSource
  recordedByStaffId String?
  recordedAt        DateTime       @default(now())

  @@index([organisationId, memberId, channel, recordedAt])
}

// ---------- Plans, rooms, memberships ----------

model Plan {
  id                   String       @id @default(cuid())
  organisationId       String
  organisation         Organisation @relation(fields: [organisationId], references: [id])
  name                 String
  type                 PlanType
  priceKobo            Int
  durationDays         Int
  roomMinutesPerPeriod Int          @default(0)
  active               Boolean      @default(true)
  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  memberships      Membership[]
  openingPositions OpeningPosition[]

  @@index([organisationId, active])
}

model Room {
  id             String       @id @default(cuid())
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id])
  locationId     String
  location       Location     @relation(fields: [locationId], references: [id])
  name           String
  capacity       Int
  hourlyRateKobo Int
  active         Boolean      @default(true)

  bookings Booking[]

  @@index([organisationId])
}

// ---------- Space info (FR-16, FR-26) ----------

model InfoEntry {
  id               String       @id @default(cuid())
  organisationId   String
  organisation     Organisation @relation(fields: [organisationId], references: [id])
  kind             InfoKind
  title            String       @db.VarChar(120) // rule heading or FAQ question
  body             String       @db.VarChar(600)
  sortOrder        Int          @default(0)
  active           Boolean      @default(true)
  updatedByStaffId String
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  @@index([organisationId, kind, active, sortOrder])
}

model OpeningHours {
  id             String       @id @default(cuid())
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id])
  locationId     String
  location       Location     @relation(fields: [locationId], references: [id])
  dayOfWeek      Int // 1 Monday to 7 Sunday
  closed         Boolean      @default(false)
  opensAtMinute  Int? // minutes after Lagos midnight, null when closed
  closesAtMinute Int?
  updatedAt      DateTime     @updatedAt

  @@unique([locationId, dayOfWeek])
  @@index([organisationId])
}

model WifiNetwork {
  id             String       @id @default(cuid())
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id])
  locationId     String
  location       Location     @relation(fields: [locationId], references: [id])
  networkName    String       @db.VarChar(64)
  password       String       @db.VarChar(64) // shown only to ACTIVE or PROVISIONAL members
  note           String?      @db.VarChar(200)
  active         Boolean      @default(true)
  updatedAt      DateTime     @updatedAt

  @@index([organisationId, locationId])
}

model Membership {
  id                   String           @id @default(cuid())
  organisationId       String
  organisation         Organisation     @relation(fields: [organisationId], references: [id])
  memberId             String
  member               Member           @relation(fields: [memberId], references: [id])
  planId               String
  plan                 Plan             @relation(fields: [planId], references: [id])
  startDate            DateTime         @db.Date // Lagos calendar date
  endDate              DateTime         @db.Date // last full day of access
  status               MembershipStatus @default(SCHEDULED) // cache only, see FR-32
  provisionalUntil     DateTime?
  previousMembershipId String?
  createdAt            DateTime         @default(now())

  invoices      Invoice[]
  creditEntries CreditEntry[]
  bookings      Booking[]
  checkIns      CheckIn[]
  events        MembershipEvent[]

  @@index([organisationId, memberId, endDate])
  @@index([organisationId, status, endDate])
}

model MembershipEvent {
  id             String              @id @default(cuid())
  organisationId String
  organisation   Organisation        @relation(fields: [organisationId], references: [id])
  membershipId   String
  membership     Membership          @relation(fields: [membershipId], references: [id])
  memberId       String
  member         Member              @relation(fields: [memberId], references: [id])
  type           MembershipEventType
  fromPlanId     String?
  toPlanId       String?
  actorStaffId   String?
  at             DateTime            @default(now())

  @@index([organisationId, memberId, at])
}

model CreditEntry {
  id               String          @id @default(cuid())
  organisationId   String
  organisation     Organisation    @relation(fields: [organisationId], references: [id])
  memberId         String
  member           Member          @relation(fields: [memberId], references: [id])
  membershipId     String
  membership       Membership      @relation(fields: [membershipId], references: [id])
  type             CreditEntryType
  minutes          Int // positive adds, negative removes
  bookingId        String?
  booking          Booking?        @relation(fields: [bookingId], references: [id])
  note             String?
  createdByStaffId String?
  createdAt        DateTime        @default(now())

  @@index([organisationId, memberId, membershipId])
}

model Booking {
  id                    String        @id @default(cuid())
  organisationId        String
  organisation          Organisation  @relation(fields: [organisationId], references: [id])
  memberId              String
  member                Member        @relation(fields: [memberId], references: [id])
  roomId                String
  room                  Room          @relation(fields: [roomId], references: [id])
  source                BookingSource @default(MEMBER_CREDITS)
  membershipId          String? // null for DESK_HIRE
  membership            Membership?   @relation(fields: [membershipId], references: [id])
  invoiceId             String? // set for DESK_HIRE
  startAt               DateTime
  endAt                 DateTime
  status                BookingStatus @default(CONFIRMED)
  minutesCharged        Int
  cancelledAt           DateTime?
  createdByStaffId      String? // null when the member booked
  noShowMarkedByStaffId String?
  createdAt             DateTime      @default(now())

  creditEntries CreditEntry[]
  overruns      RoomOverrun[]

  @@index([organisationId, roomId, startAt])
  @@index([organisationId, memberId, startAt])
}

model RoomOverrun {
  id                String       @id @default(cuid())
  organisationId    String
  organisation      Organisation @relation(fields: [organisationId], references: [id])
  bookingId         String
  booking           Booking      @relation(fields: [bookingId], references: [id])
  memberId          String
  member            Member       @relation(fields: [memberId], references: [id])
  extraMinutes      Int
  recordedByStaffId String
  creditEntryId     String?
  invoiceId         String?
  createdAt         DateTime     @default(now())

  @@index([organisationId, createdAt])
}

model CheckIn {
  id                String        @id @default(cuid())
  organisationId    String
  organisation      Organisation  @relation(fields: [organisationId], references: [id])
  memberId          String
  member            Member        @relation(fields: [memberId], references: [id])
  membershipId      String?
  membership        Membership?   @relation(fields: [membershipId], references: [id])
  locationId        String
  location          Location      @relation(fields: [locationId], references: [id])
  method            CheckInMethod
  result            CheckInResult
  recordedOffline   Boolean       @default(false)
  codeCheckFailed   Boolean       @default(false)
  recordedByStaffId String
  at                DateTime      @default(now())

  @@index([organisationId, memberId, at])
  @@index([organisationId, at])
}

// ---------- Money ----------

model Invoice {
  id                String        @id @default(cuid())
  organisationId    String
  organisation      Organisation  @relation(fields: [organisationId], references: [id])
  memberId          String
  member            Member        @relation(fields: [memberId], references: [id])
  membershipId      String?
  membership        Membership?   @relation(fields: [membershipId], references: [id])
  kind              InvoiceKind
  number            String // from Organisation.nextInvoiceNumber
  description       String
  amountKobo        Int // at most 2,000,000,000 kobo (₦20m)
  vatKobo           Int           @default(0)
  status            InvoiceStatus @default(UNPAID)
  dueDate           DateTime      @db.Date
  pendingSince      DateTime?
  provisionalUsedAt DateTime? // one provisional window per invoice
  paidAt            DateTime?
  voidedAt          DateTime?
  voidedByStaffId   String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  attempts        PaymentAttempt[]
  payments        Payment[]
  transferReports TransferReport[]

  @@unique([organisationId, number])
  @@index([organisationId, memberId, status])
  @@index([organisationId, status, dueDate])
}

model PaymentAttempt {
  id               String               @id @default(cuid())
  organisationId   String
  organisation     Organisation         @relation(fields: [organisationId], references: [id])
  invoiceId        String
  invoice          Invoice              @relation(fields: [invoiceId], references: [id])
  memberId         String
  member           Member               @relation(fields: [memberId], references: [id])
  reference        String               @unique // Flutterwave tx_ref, never reused
  amountKobo       Int
  status           PaymentAttemptStatus @default(ACTIVE)
  checkoutLink     String?
  createdAt        DateTime             @default(now())
  lastVerifiedAt   DateTime?

  @@index([invoiceId, status])
}

model Payment {
  id                    String        @id @default(cuid())
  organisationId        String
  organisation          Organisation  @relation(fields: [organisationId], references: [id])
  invoiceId             String
  invoice               Invoice       @relation(fields: [invoiceId], references: [id])
  memberId              String
  member                Member        @relation(fields: [memberId], references: [id])
  method                PaymentMethod
  amountKobo            Int
  providerReference     String?       @unique // Flutterwave tx_ref
  providerTransactionId String?       @unique // Flutterwave transaction id
  providerFeeKobo       Int?
  status                PaymentStatus @default(CONFIRMED)
  paidAt                DateTime
  recordedByStaffId     String? // null for Flutterwave payments
  recordedAt            DateTime      @default(now())
  reversedAt            DateTime?
  reversedByStaffId     String?
  reversalReason        String?

  receipt        Receipt?
  transferReport TransferReport?
  accountCredit  AccountCredit?

  @@index([organisationId, recordedAt])
  @@index([organisationId, memberId, paidAt])
}

model Receipt {
  id             String       @id @default(cuid())
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id])
  paymentId      String       @unique
  payment        Payment      @relation(fields: [paymentId], references: [id])
  memberId       String
  member         Member       @relation(fields: [memberId], references: [id])
  number         String // from Organisation.nextReceiptNumber
  issuedAt       DateTime     @default(now())

  @@unique([organisationId, number])
}

model TransferReport {
  id               String               @id @default(cuid())
  organisationId   String
  organisation     Organisation         @relation(fields: [organisationId], references: [id])
  invoiceId        String
  invoice          Invoice              @relation(fields: [invoiceId], references: [id])
  memberId         String
  member           Member               @relation(fields: [memberId], references: [id])
  senderName       String               @db.VarChar(80)
  amountKobo       Int
  transferredAt    DateTime
  photo            Bytes? // 150 KB maximum
  photoSizeBytes   Int?
  status           TransferReportStatus @default(PENDING)
  decidedByStaffId String?
  decidedAt        DateTime?
  rejectReason     String?
  paymentId        String?              @unique
  payment          Payment?             @relation(fields: [paymentId], references: [id])
  createdAt        DateTime             @default(now())

  @@index([organisationId, status, createdAt])
}

model AccountCredit {
  id                String              @id @default(cuid())
  organisationId    String
  organisation      Organisation        @relation(fields: [organisationId], references: [id])
  memberId          String
  member            Member              @relation(fields: [memberId], references: [id])
  sourcePaymentId   String              @unique
  sourcePayment     Payment             @relation(fields: [sourcePaymentId], references: [id])
  amountKobo        Int
  status            AccountCreditStatus @default(OPEN)
  resolvedByStaffId String?
  resolvedAt        DateTime?
  note              String?
  createdAt         DateTime            @default(now())
}

model OpeningPosition {
  id                String        @id @default(cuid())
  organisationId    String
  organisation      Organisation  @relation(fields: [organisationId], references: [id])
  memberId          String
  member            Member        @relation(fields: [memberId], references: [id])
  planId            String
  plan              Plan          @relation(fields: [planId], references: [id])
  endDate           DateTime      @db.Date
  amountOwedKobo    Int           @default(0)
  roomMinutesLeft   Int           @default(0)
  sourceNote        String?
  status            OpeningStatus @default(DRAFT)
  draftedByStaffId  String
  approvedByStaffId String?
  decidedAt         DateTime?
  createdAt         DateTime      @default(now())

  @@unique([organisationId, memberId])
}

model CashCount {
  id               String       @id @default(cuid())
  organisationId   String
  organisation     Organisation @relation(fields: [organisationId], references: [id])
  day              DateTime     @db.Date
  countedKobo      Int
  enteredByStaffId String
  createdAt        DateTime     @default(now())

  @@unique([organisationId, day])
}

model SubscriptionInvoice {
  id                String                    @id @default(cuid())
  organisationId    String
  organisation      Organisation              @relation(fields: [organisationId], references: [id])
  locationId        String
  location          Location                  @relation(fields: [locationId], references: [id])
  tier              SubscriptionTier
  activeMemberCount Int
  periodStart       DateTime                  @db.Date
  periodEnd         DateTime                  @db.Date
  amountKobo        Int
  status            SubscriptionInvoiceStatus @default(UNPAID)
  isTrial           Boolean                   @default(false)
  providerReference String?                   @unique
  paidAt            DateTime?
  createdAt         DateTime                  @default(now())

  @@unique([locationId, periodStart])
  @@index([organisationId, status])
}

// ---------- Ask and system ----------

model AskLog {
  id               String       @id @default(cuid())
  organisationId   String
  organisation     Organisation @relation(fields: [organisationId], references: [id])
  staffId          String
  questionRedacted String       @db.VarChar(500)
  question         AskQuestion
  period           AskPeriod?
  confidence       Float?
  outcome          AskOutcome
  modelName        String?
  latencyMs        Int?
  helpful          Boolean?
  createdAt        DateTime     @default(now())

  @@index([organisationId, createdAt])
  @@index([organisationId, outcome, createdAt])
}

model WebhookEvent {
  id             String         @id @default(cuid())
  organisationId String?        // null for Kujera's own subscription webhook
  organisation   Organisation?  @relation(fields: [organisationId], references: [id])
  route          String // "space" or "kujera"
  event          String
  reference      String?
  signatureValid Boolean
  payload        Json
  result         WebhookResult?
  receivedAt     DateTime       @default(now())
  processedAt    DateTime?

  @@unique([route, event, reference])
}

model AuditLog {
  id             String       @id @default(cuid())
  organisationId String
  organisation   Organisation @relation(fields: [organisationId], references: [id])
  actorStaffId   String?
  actorUserId    String?
  action         String // e.g. "payment.reverse", "transfer.confirm"
  recordType     String
  recordId       String
  before         Json?
  after          Json?
  at             DateTime     @default(now())

  @@index([organisationId, at])
  @@index([organisationId, recordType, recordId])
}
```

### 8.8 Constraints added by raw SQL

- No two confirmed bookings overlap in the same room (exclusion constraint with `btree_gist`).
- At most one ACTIVE payment attempt per invoice (partial unique index).
- Every money amount is greater than 0 and at most 2,000,000,000 kobo, except a trial subscription invoice, which is 0.
- Every email column holds lower-case text.
- A member booking has a membership. A desk hire has an invoice.
- A transfer photo is at most 150 KB.
- Opening hours: `dayOfWeek` is 1 to 7. When `closed` is true, both times are null. Otherwise both are set, between 0 and 1440, and close is after open.
- At most 30 active InfoEntry rows per organisation and kind (checked in the handler, since a CHECK cannot count rows).
- The app role has no grant on `OrganisationSecret` or `SpaceSignup`.

### 8.9 Audit records

Every action by owner or desk that changes money, access or prices writes an AuditLog row, with before and after values, in the same transaction. No password, sign-in token or key ever goes into an audit row.

---

## 9. Vector Database Architecture and Design

Not used in version one. Nothing is embedded. Ask answers from prepared queries over structured records, which need no search by meaning. See Q17 for whether pgvector stays in the stack.

## 10. Vector Database Model

Not used in version one.

---

## 11. Business Model

### 11.1 Kujera's revenue

A flat monthly fee per location, tiered by active member count, paid in the app (FR-15).

| Tier | Active members | Monthly fee per location |
|---|---|---|
| Starter | Up to 40 | ₦20,000 |
| Growth | 41 to 120 | ₦45,000 |
| Large | 121 to 300 | ₦80,000 |

[ASSUMPTION A18: these prices.] Optional onboarding to import Excel records: ₦50,000 up to 150 rows, ₦100,000 above. [ASSUMPTION A19] Every new space gets a 30-day free trial, recorded as a paid zero-cost invoice so no banner shows (FR-15). [ASSUMPTION A20]

### 11.2 Running cost and break-even

| Cost | When | Monthly |
|---|---|---|
| Commercial host | Before the first paying space | About $20, roughly ₦30,000 [ASSUMPTION A21] |
| Database | Past the free limits | $5 minimum plus usage |
| Gemini paid tier | Only if free limits block use | Usage based |

One Growth space or two Starter spaces cover the host.

### 11.3 Flutterwave costs to the space

The space pays Flutterwave's fees on member payments. The app shows no fee figures, because fees change. The owner confirms current fees from Flutterwave's pricing page.

---

## 12. Success Metrics

Baseline: the 7 days before go-live. Target: 8 weeks after.

| ID | Metric | 8-week target | How it is calculated |
|---|---|---|---|
| M1 | Money recovered per month | At least ₦90,000 | Payments on ROOM_OVERRUN and ROOM_HIRE invoices, plus renewals paid within 3 days of a DENIED_EXPIRED check-in |
| M2 | Transfer reports not decided within 24 hours | 2 or fewer per week | TransferReport decidedAt minus createdAt |
| M3 | Median days late on renewal | Cut by half | Renewal paidAt minus previous endDate |
| M4 | Paid members turned away | 0 | DENIED_EXPIRED check-ins where the renewal was already paid |
| M5 | Cash variance | ₦0 in 6 of 8 weeks | CashCount minus recorded cash |
| M6 | Owner active days | 5 or more days a week | Days with an owner session that used the money view, Ask or members list |
| M7 | Ask answer rate | 85% answered, "No" on under 15% | AskLog outcome and helpful |
| M8 | Door record completeness | 0 people present with no check-in | Two spot counts in week 8 |
| M9 | Cross-member exposure | 0, always | Release tests and incidents |
| M10 | Pilot conversion | The owner agrees to pay from week 9 | Yes or no at the week 8 review |

---

## 13. Risks

| Rank | Risk | Guard |
|---|---|---|
| 1 | A member sees another member's records | RLS on every table, one database client, member ID only from the session, two release tests |
| 2 | A space's payment key is stolen | Encrypted, in a closed table, read only through functions, never logged or sent to a phone |
| 3 | A wrong money figure in the money view or Ask | The model never writes numbers. Prepared queries. Source and time on every figure. One status function. |
| 4 | False transfer reports for free access | One provisional window per invoice, 30-day block after rejection, no booking while provisional |
| 5 | A helper misuses desk mode | Personal logins, no reversals, every action audited with the helper's name, cash count by person |
| 6 | The space's internet goes down | Offline check-in for 4 hours, member pass works offline |
| 7 | Data protection failure | Privacy notice names Google, Flutterwave and the email service. Data processing agreement accepted at sign-up |
| 8 | A stolen member phone | Phone screen lock, "Log out of this phone", owner can revoke sessions |
| 9 | Free tier changes | Ask falls back to buttons. Every other feature works without the model. |
| 10 | Fake or abusive space sign-ups | Email confirmation before anything is created, rate limits, unconfirmed sign-ups deleted after 7 days |
| 11 | Sign-in emails land in spam or never arrive | A reputable email service with a verified sending domain, "Resend" on every invite, the desk can see invite state |
| 12 | Members give fake or mistyped emails | Invite state on the member record, resend with a corrected email before acceptance |

---

## 14. Open Questions

| # | Question | Needed by | Default |
|---|---|---|---|
| Q1 | Which real space is first, how many members, which plans and prices? | Before build | One space, about 60 members, Growth tier |
| Q2 | Where does each record live today? | Before build | Excel and bank alerts |
| Q3 | Does the space have a Flutterwave account, and is it CAC-registered? | Before go-live | Yes |
| Q4 | Does the space absorb Flutterwave fees or pass them on? | Before go-live | Absorbs |
| Q5 | Is there a grace period after expiry? | Before go-live | 0 days |
| Q6 | Do unused room hours roll over? | Before go-live | No |
| Q7 | Does the space charge VAT? | Before go-live | No |
| Q8 | How many helper logins does a space need? | Before go-live | No limit |
| Q9 | Which email service sends sign-in emails? Sign-up, invites and resets cannot work without one. | Before build | Not chosen |
| Q10 | Should sign-up also need a CAPTCHA, or are rate limits and email confirmation enough? | Before build | Rate limits and email confirmation only |
| Q11 | What happens to a space that signs up but never goes live? | Before go-live | It stays in trial, then the banner shows. Nothing is deleted. |
| Q12 | Are the Kujera prices acceptable to the first space? | Before go-live | As listed |
| Q13 | Which host serves the first paying space? | Before go-live | Vercel Pro |
| Q14 | Does the desk have a device with a camera, and how often does internet fail? | Before build | One device, outages under 4 hours |
| Q15 | Does anyone pay more than ₦20m on one invoice? | Before build | No |
| Q16 | Will the owner sign a data processing agreement? | Before go-live | Yes |
| Q17 | pgvector is in the fixed stack but unused. Keep it enabled for version two, or remove it? | Before build | Remove from version one, add back when needed |
| Q18 | Which Gemini model ID classifies Ask questions? | Before build | Not chosen |
| Q19 | Which Ask questions matter most to owners? | Before go-live | The 17 in Section 7.3 |

### Rule conflicts and how this draft resolves them

| # | Conflict | Resolution |
|---|---|---|
| C1 | The fixed stack includes pgvector, but nothing needs vector search now. | Unused in version one. Q17 decides. |
| C2 | "Kujera sends no messages" and sign-in by email. | Sign-in emails (confirmation, invites, resets) are the only messages. |
| C3 | Members want rooms at nearby spaces, but version one has one space. | Members book only at their own space. The directory is version two. |
| C4 | Members need house rules and FAQ, but member AI and vector search were cut. | Space info is plain pages (FR-16, FR-26). No search by meaning. |

---

## Assumptions Added

| ID | Assumption | Section |
|---|---|---|
| A1 | Walk-ins are members like any other, with an email | 4 |
| A2 | One desk device per space | 4 |
| A3 | Member self-booking uses credits only | 5 |
| A4 | Offline check-in works for 4 hours | FR-05 |
| A5 | 30-minute booking slots | FR-06 |
| A6 | Walk-ins pay for a room before use | FR-06 |
| A7 | 2-hour cancellation cut-off | FR-06 |
| A8 | No partial payments | FR-07 |
| A9 | Renewal lead times by plan type | FR-10 |
| A10 | Invite links expire after 72 hours | FR-13 |
| A11 | Passwords have at least 10 characters | FR-18 |
| A12 | An unpaid Kujera fee shows a banner and blocks nothing | FR-15 |
| A13 | One provisional window per invoice, 30-day block after rejection | FR-23 |
| A14 | Members book up to 14 days ahead | FR-25 |
| A15 | 50 Ask questions per owner per day | 7.4 |
| A16 | 150-question test set with a 90% gate | 7.5 |
| A17 | Vercel Pro and Neon for paid hosting | 8.2 |
| A18 | Tier prices ₦20,000, ₦45,000 and ₦80,000 | 11.1 |
| A19 | Onboarding fees ₦50,000 and ₦100,000 | 11.1 |
| A20 | Free trial recorded as a zero-cost paid invoice | 11.1 |
| A21 | Host cost about ₦30,000 a month | 11.2 |
| A22 | At most 30 house rules and 30 FAQ entries, 600 characters each | FR-16 |
| A23 | Space info changes need no approval | FR-16 |
| A24 | Wi-Fi password shown only to active and provisional members | FR-26 |
| A25 | Member invite links last 7 days | FR-20 |
| A26 | 30-day free trial for every new space | FR-15 |
| A27 | Password reset links last 1 hour | FR-18 |
| A28 | The member invite goes out when the member is saved | FR-01 |
| A29 | 5 sign-up attempts per IP per hour, 3 confirmation emails per address per day | FR-17 |
| A30 | Sign-up confirmation links last 24 hours | FR-17 |
| A31 | Unconfirmed sign-ups are deleted after 7 days | FR-17 |
