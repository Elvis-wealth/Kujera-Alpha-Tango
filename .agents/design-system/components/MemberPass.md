# MemberPass

The member's check-in pass on their phone (FR-21).

- Card `surface-container-lowest`, radius `radius-2xl`, padding `spacing-300`, centred.
- Top: space name in `label-medium` capitals, member name in `headline-small`.
- Status badge with the end date: "Active · Ends 30 Nov".
- QR code, 200px, dark modules in `on-surface` on `surface-container-lowest`. It holds `KJ:{memberCode}:{code}`.
- The 6-character code under it in `headline-medium`, `tabular-nums`, grouped in threes. A thin `primary` bar shows time left in the 30-second step.
- Freshness line: "Offline. As of 9:14am." when read from the cache.
- When a scan fails: "If scanning fails, give the desk your phone number."
- Works with no connection. Raise screen brightness while open where the browser allows.
- Never show money, other members or owner data here.
