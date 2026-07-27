/* Skillarium — site configuration.
   Everything the website needs to know that is not code lives here. */

// Paste the Apps Script web app URL here after deploying apps-script/Code.gs.
// It looks like: https://script.google.com/macros/s/AKfy.../exec
window.SKILLARIUM = {
  API_URL: "REPLACE_WITH_APPS_SCRIPT_WEB_APP_URL",

  // Where staff read applications. Used by the staff page only.
  sheetUrl: "REPLACE_WITH_GOOGLE_SHEET_URL",

  academy: {
    name: "Skillarium",
    tagline: "Your Path to Professional Excellence",
    address: "Crown Tower, Alappat Avenue, Sakthan Thampuran Nagar, Veliyannur, Thrissur, Kerala",
    phone: "+91 00000 00000",
    whatsapp: "910000000000",
    email: "info@skillarium.org",
    mapQuery: "Crown+Tower+Sakthan+Thampuran+Nagar+Thrissur",
    blogUrl: "https://blog.skillarium.org"
  }
};
