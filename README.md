# Skillarium — static website + Google Sheets backend

A complete website for Skillarium Academy of Technical Studies, Thrissur.

## Architecture

- **Frontend**: Static HTML/CSS/JS (no build step, no npm install)
- **Backend**: Google Apps Script (free, runs on Google servers)
- **Database**: Google Sheets (free, familiar, shareable)
- **File storage**: Google Drive (resumes, private folder)
- **Email**: Gmail / Google Workspace (built into Apps Script)

## Files

```
public/                 deploy this folder to any static host
  index.html            home page
  courses.html          course catalog
  course.html           single course detail
  faculty.html          faculty profiles
  fees.html             fees + batch schedule
  apply-student.html    student application form
  apply-teacher.html    teacher application form
  status.html           check application status
  contact.html          enquiry form + map
  about.html            about page
  privacy.html          privacy notice
  admin.html            staff guide (links to Google Sheet)
  assets/config.js      << your settings go here
  assets/styles.css     design system
  assets/app.js         shared helpers, forms, API client
apps-script/
  Code.gs               Google Apps Script backend (complete)
```

## Setup (5 minutes)

1. **Create a Google Sheet**
   - Go to [sheets.google.com](https://sheets.google.com) and create a new blank sheet
   - Name it "Skillarium Applications"
   - Copy the sheet URL (you'll need it for `config.js`)

2. **Add the Apps Script backend**
   - Open the Sheet → **Extensions** → **Apps Script**
   - Delete the default `myFunction` and paste the entire contents of `apps-script/Code.gs`
   - Click **Save** (disk icon)
   - Run `setup()` once from the script editor (select `setup` in the dropdown, click ▶️)
   - Authorize the script when prompted (click through permissions)

3. **Deploy the web app**
   - In the Apps Script editor, click **Deploy** → **New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the `/exec` URL

4. **Configure the website**
   - Open `public/assets/config.js`
   - Paste the Apps Script URL into `API_URL`
   - Paste the Google Sheet URL into `sheetUrl`
   - Update the phone, WhatsApp, email, and address with real values

5. **Deploy the website**
   - Upload the `public/` folder to any static host:
     - **Vercel**: `npx vercel deploy public --prod`
     - **Netlify**: `npx netlify deploy --dir public --prod`
     - **Cloudflare Pages**: Drag and drop `public/` folder
     - **GitHub Pages**: Push `public/` to a repo, enable Pages
   - Or use the repo `cursed-goblin/skillarium-website` and import it into Vercel

## How it works

- **Visitors** see courses, faculty, and batches pulled live from the Google Sheet
- **Students** apply on `apply-student.html` — form submits to Apps Script, gets a reference number like `SKL-26-01042`
- **Teachers** apply on `apply-teacher.html` — same flow
- **Staff** manage everything in the Google Sheet (no separate dashboard needed)
- **Applicants** check status on `status.html` with their reference number + last 4 digits of phone

## Sheet tabs (created automatically by `setup()`)

| Tab | Purpose |
|-----|---------|
| Applications | All student + teacher applications |
| Leads | Contact form enquiries |
| Courses | Course catalog (drives the website) |
| Faculty | Instructor profiles (drives the website) |
| Batches | Batch dates, seats, status (drives the website) |
| Notes | Staff notes on applications |

## Staff workflow

1. Open the Google Sheet → **Applications** tab
2. Edit the `status` column: `new`, `shortlisted`, `interview`, `accepted`, `rejected`, `withdrawn`
3. Select a row, then run **Skillarium → Email applicant about current status** from the menu
4. The applicant gets an email update automatically

## Customising content

Edit the Google Sheet directly — changes appear on the website instantly. No redeploy needed.

- **Courses**: Add rows to the `Courses` tab, set `is_published` to `yes`
- **Faculty**: Add rows to the `Faculty` tab, set `is_published` to `yes`
- **Batches**: Add rows to the `Batches` tab, update `seats_left` as enrolments come in

## What you still need to supply

| Item | Where |
|------|-------|
| Real office phone + WhatsApp | `assets/config.js` |
| Real faculty names, photos, bios | `Faculty` sheet tab |
| Final course list, fees, durations | `Courses` sheet tab |
| Real batch dates and seat counts | `Batches` sheet tab |
| Campus and classroom photos | Add to `index.html`, `about.html` |

## Phase 2 ideas

- Razorpay fee payment with instalment tracking
- Certificate generator with public verification
- Malayalam language toggle
- Public student project showcase
