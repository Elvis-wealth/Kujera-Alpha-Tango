# Navigation

How people move between the main sections.

## Owner and desk, 840px and wider

- Sidebar `sidebar-width` (240px) on `surface-container-low`, radius `radius-large`.
- Top: logo mark, "Kujera" and the space name.
- Items: Today, Members, Check-in, Rooms, Money, Ask, Space info. Settings sits at the bottom.
- Desk logins see only what desk mode allows: Door, Members, Rooms, Transfers. No Money view, Ask or Settings.
- Item height `target-min`, radius `radius-full`, icon `icon-medium`. Current item: `secondary-container` with weight 600 and `aria-current="page"`.
- A count sits on the right of an item when something waits, such as transfers to confirm.

## Below 840px

- Owner: a top bar with the space name and a menu button that opens the same list as a sheet.
- Member: a bottom bar with four tabs: Pass, Plan, Book, Info. Tab height `target-min`. The current tab gets a `secondary-container` pill behind its icon.
- Member screens never load owner or desk code.
