# Portal Management System (PHP)

Original PHP + MySQL portal from [cursed-goblin/portal-management-system](https://github.com/cursed-goblin/portal-management-system), bundled with the Skillarium website.

The live static site uses browser-based portal pages under `public/portal/` (no PHP host required). Use this folder when you deploy on XAMPP/WAMP/cPanel with MySQL.

## Features

- Landing & registration for Teachers and Students
- Teacher ESS + Admin login
- Admin dashboard (teachers, students, activity logs)
- Activity logging on registration
- Secure PDO + password hashing

## Setup

1. Copy `portal-php/` to your PHP host (e.g. `htdocs/portal/`).
2. Import `database.sql` in MySQL.
3. Update `config/db.php` credentials if needed.
4. Open the folder URL in a browser.

Demo admin: `admin@portal.local` / `admin123`
