# Skillarium Website (Vercel-ready)

Clean static rebuild inspired by [skillarium.org](https://www.skillarium.org/), plus an animated **Portal Management** module (register / login / dashboard).

## Deploy on Vercel
1. Import `cursed-goblin/skillarium-website`
2. Framework Preset: **Other**
3. Root Directory: leave **empty** (site files are at repo root)
4. Build Command: leave empty
5. Output Directory: leave empty
6. Deploy

If you previously set Root Directory to `public`, clear it — this rebuild lives at the repo root.

## Pages
- `/` Home
- `/about` About
- `/students` Students
- `/admissions` Admissions
- `/contact` Contact
- `/portal` Register
- `/portal/login` Login
- `/portal/dashboard` Dashboard

## Portal demo admin
- Email: `admin@portal.local`
- Password: `admin123`

Portal data is stored in the browser (localStorage) so it works on pure static hosting.
