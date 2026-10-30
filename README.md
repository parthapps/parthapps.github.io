# Library Map

Free study-library management app: seat map, students, fee passbook, WhatsApp reminders.
Works offline after the first open (PWA). All data stays on the owner's phone.

## Files
- `index.html` – the whole app
- `css/app.css` – compiled Tailwind styles (no CDN needed)
- `manifest.json`, `sw.js`, `icons/` – install + offline support
- `notice.json` – **broadcast notice (admin only)**. Edit this file on GitHub to show a popup to all users.
- `privacy.html` – Privacy Policy page (needed for Google Play)
- `.nojekyll` – tells GitHub Pages to publish every file as-is

## Sending a broadcast notice to all owners
1. Open `notice.json` on GitHub → pencil icon (Edit).
2. Change `title` and `message`, and **change `id`** (e.g. `holiday-2`). Each phone shows a notice once per `id`.
3. Set `"enabled": true` to show it, `false` to stop showing it. Commit changes.
