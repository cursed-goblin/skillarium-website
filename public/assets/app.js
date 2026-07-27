/* Skillarium — shared front-end helpers (no build step, ES module) */

const CFG = window.SKILLARIUM || {};
export const ACADEMY = CFG.academy || {};

// The backend is a Google Apps Script web app that reads and writes one
// Google Sheet. Until API_URL is filled in, every page renders demo content
// and the forms explain that they are not connected yet.
const API_URL = String(CFG.API_URL || "");
const CONFIGURED = Boolean(API_URL) && !API_URL.startsWith("REPLACE");

export const isConfigured = () => CONFIGURED;
export const isLive = () => CONFIGURED;

function requireApi() {
  if (!CONFIGURED) {
    throw new Error(
      "The backend is not connected yet. Paste your Apps Script web app URL into assets/config.js."
    );
  }
}

async function apiGet(params) {
  requireApi();
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(API_URL + (API_URL.indexOf("?") > -1 ? "&" : "?") + qs, {
    method: "GET",
    redirect: "follow",
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

async function apiPost(payload) {
  requireApi();
  // text/plain keeps this a simple request, so the browser skips the CORS
  // preflight that Apps Script cannot answer.
  const res = await fetch(API_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

/* ---------- tiny DOM helpers ---------- */
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
export const money = (n) =>
  n == null ? "On request" : "₹" + Number(n).toLocaleString("en-IN");
export const day = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export function alertBox(el, kind, msg) {
  if (!el) return;
  el.className = "alert alert-" + kind + " show";
  el.textContent = msg;
  el.scrollIntoView({ block: "center", behavior: "smooth" });
}

/* ---------- fonts ---------- */
function loadFonts() {
  const pre = document.createElement("link");
  pre.rel = "preconnect"; pre.href = "https://" + "fonts.gstatic.com"; pre.crossOrigin = "";
  document.head.append(pre);
  const l = document.createElement("link");
  l.rel = "stylesheet"; l.href = "https://" + "fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
  document.head.append(l);
}

/* ---------- motion engine (no libraries) ---------- */
export function motion(root = document) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // stagger children of [data-stagger]
  $$("[data-stagger]", root).forEach((group) => {
    const step = Number(group.dataset.stagger) || 90;
    [...group.children].forEach((child, k) => {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "");
      child.style.setProperty("--d", (k * step) + "ms");
    });
  });

  const items = $$("[data-reveal]", root);
  if (reduced) {
    items.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  }

  // number count-up
  const nums = $$("[data-count]", root);
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    if (reduced) { el.textContent = prefix + target.toLocaleString("en-IN") + suffix; return; }
    const dur = 1500, t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(target * eased);
      el.textContent = prefix + v.toLocaleString("en-IN") + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (nums.length) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        runCount(e.target);
        io2.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    nums.forEach((el) => io2.observe(el));
  }

  // accordions
  $$(".acc-q", root).forEach((q) => {
    q.addEventListener("click", () => {
      const item = q.closest(".acc-item");
      const open = item.classList.contains("open");
      $$(".acc-item", item.parentElement).forEach((x) => x.classList.remove("open"));
      if (!open) item.classList.add("open");
      q.setAttribute("aria-expanded", String(!open));
    });
  });

  // step highlighting on scroll
  const steps = $$(".step", root);
  if (steps.length && !reduced) {
    const io3 = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle("on", e.isIntersecting));
    }, { rootMargin: "-40% 0px -40% 0px" });
    steps.forEach((el) => io3.observe(el));
  }
}

/* ---------- header / footer / whatsapp ---------- */
export function chrome(active) {
  loadFonts();
  const wa = ACADEMY.whatsapp || "";
  // Support pages nested under /portal/ without breaking relative links.
  const inPortal = /\/portal\//.test(location.pathname) || /portal\//.test(active || "");
  const base = inPortal ? "../" : "";
  const href = (p) => base + p;
  const links = [
    ["courses.html", "Courses"],
    ["faculty.html", "Faculty"],
    ["fees.html", "Fees & Batches"],
    ["about.html", "About"],
    ["portal/index.html", "Portal"],
    ["status.html", "Check Status"],
    ["contact.html", "Contact"],
  ];

  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.prepend(bar);

  const top = document.createElement("div");
  top.className = "topbar";
  top.innerHTML = `<div class="wrap">
    <span>Admissions open \u2014 August 2026 batches, Thrissur campus</span>
    <span class="tb-right">
      <span>Taught in English &amp; Malayalam</span>
      <a href="tel:${esc((ACADEMY.phone || "").replace(/\s/g, ""))}">${esc(ACADEMY.phone || "")}</a>
    </span>
  </div>`;
  document.body.prepend(top);

  const head = document.createElement("header");
  head.className = "site";
  head.innerHTML = `<div class="wrap">
    <a class="brand" href="${href("index.html")}">
      <span class="brand-mark">S</span>
      <span>Skillarium<small>Academy of Technical Studies</small></span>
    </a>
    <nav class="nav-links">
      ${links.map(([h, t]) => `<a href="${href(h)}"${active === h ? ' class="active" aria-current="page"' : ""}>${t}</a>`).join("")}
    </nav>
    <span class="nav-cta">
      <a class="btn btn-ghost btn-sm" href="${href("apply-teacher.html")}">Teach with us</a>
      <a class="btn btn-primary btn-sm" href="${href("apply-student.html")}">Apply now <span class="arw">\u2192</span></a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </span>
  </div>`;
  document.body.insertBefore(head, top.nextSibling);

  const btn = head.querySelector(".nav-toggle");
  const menu = head.querySelector(".nav-links");
  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  });

  const onScroll = () => {
    head.classList.toggle("scrolled", window.scrollY > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const foot = document.createElement("footer");
  foot.className = "site";
  foot.innerHTML = `<div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="${href("index.html")}"><span class="brand-mark">S</span><span>Skillarium</span></a>
        <p style="margin:0 0 14px;max-width:32ch">A technical academy in Thrissur where every course ends in work you can show.</p>
        <p style="margin:0;opacity:.72">${esc(ACADEMY.address || "")}</p>
      </div>
      <div><h5>Learn</h5>
        <a href="${href("courses.html")}">Courses</a><a href="${href("fees.html")}">Fees &amp; batches</a>
        <a href="${href("apply-student.html")}">Apply as student</a><a href="${href("status.html")}">Check application</a>
        <a href="${href("portal/index.html")}">Portal</a></div>
      <div><h5>Academy</h5>
        <a href="${href("faculty.html")}">Faculty</a><a href="${href("about.html")}">About</a>
        <a href="${href("apply-teacher.html")}">Teach with us</a><a href="${esc(ACADEMY.blogUrl || "#")}">Journal</a>
        <a href="${href("portal/login.html")}">Portal login</a></div>
      <div><h5>Contact</h5>
        <a href="tel:${esc((ACADEMY.phone || "").replace(/\s/g, ""))}">${esc(ACADEMY.phone || "")}</a>
        <a href="mailto:${esc(ACADEMY.email || "")}">${esc(ACADEMY.email || "")}</a>
        <a href="${href("contact.html")}">Visit the campus</a></div>
    </div>
    <div class="foot-bottom">
      <span>\u00a9 ${new Date().getFullYear()} Skillarium Academy of Technical Studies</span>
      <span><a href="${href("privacy.html")}">Privacy</a> &nbsp;&middot;&nbsp; <a href="${href("admin.html")}">Staff login</a> &nbsp;&middot;&nbsp; <a href="${href("portal/index.html")}">Portal</a></span>
    </div>
  </div>`;
  document.body.append(foot);

  if (wa) {
    const a = document.createElement("a");
    a.className = "wa-fab";
    a.href = "https://" + "wa.me/" + wa + "?text=" + encodeURIComponent("Hi Skillarium, I would like to know more about your courses.");
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Chat on WhatsApp");
    a.innerHTML = `<svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1s-.8 1-.9 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-.9-2.2c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6 2.6 1 3.1.8 3.7.8.6 0 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5l-.5-.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7.2 3.9z"/></svg>`;
    document.body.append(a);
  }

  motion();
}

/* ---------- validation ---------- */
export function showErr(input, msg) {
  const box = input.parentElement.querySelector(".err");
  input.setAttribute("aria-invalid", "true");
  if (box) { box.textContent = msg; box.classList.add("show"); }
}
export function clearErr(input) {
  input.removeAttribute("aria-invalid");
  const box = input.parentElement.querySelector(".err");
  if (box) box.classList.remove("show");
}
export function validate(form) {
  let ok = true, first = null;
  $$("input,select,textarea", form).forEach((el) => {
    if (el.type === "hidden" || el.classList.contains("hp")) return;
    clearErr(el);
    const v = (el.value || "").trim();
    if (el.required && (el.type === "checkbox" ? !el.checked : !v)) {
      showErr(el, "This field is required."); ok = false; first ||= el; return;
    }
    if (!v) return;
    if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      showErr(el, "Enter a valid email address."); ok = false; first ||= el;
    }
    if (el.type === "tel" && v.replace(/\D/g, "").length < 10) {
      showErr(el, "Enter a valid 10-digit phone number."); ok = false; first ||= el;
    }
  });
  if (first) first.focus();
  return ok;
}

/* ---------- resume upload widget ---------- */
export function resumeField(dropId, inputId) {
  const drop = document.getElementById(dropId);
  const input = document.getElementById(inputId);
  if (!drop || !input) return () => null;
  const label = drop.querySelector("strong");
  const base = label.textContent;
  const set = (f) => { label.textContent = f ? f.name : base; };
  drop.addEventListener("click", () => input.click());
  drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("over"));
  drop.addEventListener("drop", (e) => {
    e.preventDefault(); drop.classList.remove("over");
    if (e.dataTransfer.files[0]) { input.files = e.dataTransfer.files; set(input.files[0]); }
  });
  input.addEventListener("change", () => set(input.files[0]));
  return () => input.files[0] || null;
}

const OK_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.readAsDataURL(file);
  });
}

/**
 * Turns the chosen resume into a payload the Apps Script can save to Drive.
 * Returns null when no file was chosen.
 */
export async function uploadResume(file) {
  if (!file) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error("Resume must be under 5 MB.");
  if (!OK_TYPES.includes(file.type)) throw new Error("Resume must be a PDF or Word document.");
  return { name: file.name, mime: file.type, data: await fileToBase64(file) };
}

/* ---------- submit an application ---------- */
export async function submitApplication(payload) {
  const data = await apiPost({ action: "apply", ...payload });
  return data.ref_no;
}

/* ---------- contact form ---------- */
export async function submitLead(payload) {
  return apiPost({ action: "lead", ...payload });
}

/* ---------- application status ---------- */
export async function checkStatus(ref, phoneLast4) {
  return apiGet({ action: "status", ref, p4: phoneLast4 });
}

/* ---------- content loaders ---------- */
let _content = null;

async function content() {
  if (_content) return _content;
  if (!CONFIGURED) return (_content = DEMO);
  try {
    const data = await apiGet({ action: "content" });
    const c = data.content || {};
    const courses = c.courses && c.courses.length ? c.courses : DEMO.courses;
    const bySlug = Object.fromEntries(courses.map((x) => [x.slug, x]));
    const batches = (c.batches || []).map((b) => ({
      ...b,
      skl_courses: bySlug[b.course_slug]
        ? { title: bySlug[b.course_slug].title, slug: b.course_slug }
        : { title: b.course_slug || "", slug: b.course_slug || "" },
    }));
    _content = {
      courses,
      faculty: c.faculty && c.faculty.length ? c.faculty : DEMO.faculty,
      batches: batches.length ? batches : DEMO.batches,
    };
  } catch (e) {
    console.warn("Falling back to demo content", e);
    _content = DEMO;
  }
  return _content;
}

export async function getCourses() { return (await content()).courses; }
export async function getFaculty() { return (await content()).faculty; }
export async function getBatches() { return (await content()).batches; }

/* Demo content so every page renders before the Sheet is wired up. */
export const DEMO = {
  courses: [
    { id: "d1", slug: "python-foundations", title: "Python Foundations", tagline: "Write real programs from week one.",
      description: "A hands-on introduction to programming with Python. Variables, logic, functions, files and a final mini-project. No prior coding experience needed.",
      level: "Beginner", mode: "Offline", duration: "8 weeks · 2 sessions/week", fee_amount: 8000,
      fee_note: "Includes course material and certificate.",
      outcomes: ["Read and write clean Python", "Build a working command-line project", "Debug your own code confidently"] },
    { id: "d2", slug: "ai-60-projects", title: "60 Hours, 60 AI Projects", tagline: "One hour. One project. Sixty times.",
      description: "Our flagship build-first programme. Sixty guided AI and data projects across Medicine, Agriculture, Law, Arts, Sports and Day-to-Day Life — delivered in English and Malayalam.",
      level: "Intermediate", mode: "Hybrid", duration: "60 hours · 12 weeks", fee_amount: 24000,
      fee_note: "Instalment options available.",
      outcomes: ["A 60-project public portfolio", "Practical ML, vision and NLP skills", "Domain fluency across six real-world sectors"] },
    { id: "d3", slug: "web-development", title: "Full-Stack Web Development", tagline: "Ship a live site, not a certificate.",
      description: "HTML, CSS, JavaScript, then a real backend with databases, auth and deployment. Every student launches a production site.",
      level: "Intermediate", mode: "Offline", duration: "16 weeks · 3 sessions/week", fee_amount: 32000,
      fee_note: "Laptop required.",
      outcomes: ["Front-end fundamentals done properly", "A deployed full-stack application", "Version control and team workflow"] },
    { id: "d4", slug: "school-stem", title: "School STEM & Coding (Class 6–12)", tagline: "After-school technical training for students.",
      description: "Weekend and evening batches aligned to school schedules. Robotics basics, coding, science projects and exhibition preparation.",
      level: "Beginner", mode: "Offline", duration: "Rolling · weekends", fee_amount: 6000,
      fee_note: "Per term. Sibling discount available.",
      outcomes: ["Science-fair ready projects", "Early programming confidence", "Structured lab exposure"] },
  ],
  faculty: [
    { id: "f1", name: "Add your lead instructor", role: "Lead Instructor — Programming", subjects: ["Python", "Data Structures"],
      bio: "Replace this placeholder from the admin panel. Real names and photos are the single biggest trust signal on an academy website." },
    { id: "f2", name: "Add your AI instructor", role: "Instructor — AI & Data", subjects: ["Machine Learning", "Computer Vision"],
      bio: "Replace this placeholder from the admin panel." },
  ],
  batches: [
    { id: "b1", name: "August 2026 — Evening", start_date: "2026-08-10", schedule: "Mon/Wed · 6:00–8:00 PM", mode: "Offline",
      seats_total: 24, seats_left: 9, status: "filling", skl_courses: { title: "Python Foundations", slug: "python-foundations" } },
    { id: "b2", name: "August 2026 — Weekend", start_date: "2026-08-16", schedule: "Sat/Sun · 10:00 AM–1:00 PM", mode: "Hybrid",
      seats_total: 30, seats_left: 21, status: "open", skl_courses: { title: "60 Hours, 60 AI Projects", slug: "ai-60-projects" } },
    { id: "b3", name: "September 2026 — Full-time", start_date: "2026-09-01", schedule: "Mon–Wed–Fri · 9:30 AM–12:30 PM", mode: "Offline",
      seats_total: 20, seats_left: 20, status: "open", skl_courses: { title: "Full-Stack Web Development", slug: "web-development" } },
  ],
};
