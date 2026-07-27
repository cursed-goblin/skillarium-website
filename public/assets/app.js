/* Skillarium — shared front-end helpers (no build step, ES module) */

const CFG = window.SKILLARIUM || {};
export const ACADEMY = CFG.academy || {};

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

function loadFonts() {
  const pre = document.createElement("link");
  pre.rel = "preconnect"; pre.href = "https://" + "fonts.gstatic.com"; pre.crossOrigin = "";
  document.head.append(pre);
  const l = document.createElement("link");
  l.rel = "stylesheet"; l.href = "https://" + "fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
  document.head.append(l);
}

export function motion(root = document) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  $$(".acc-q", root).forEach((q) => {
    q.addEventListener("click", () => {
      const item = q.closest(".acc-item");
      const open = item.classList.contains("open");
      $$(".acc-item", item.parentElement).forEach((x) => x.classList.remove("open"));
      if (!open) item.classList.add("open");
      q.setAttribute("aria-expanded", String(!open));
    });
  });
  const steps = $$(".step", root);
  if (steps.length && !reduced) {
    const io3 = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle("on", e.isIntersecting));
    }, { rootMargin: "-40% 0px -40% 0px" });
    steps.forEach((el) => io3.observe(el));
  }
}

export function chrome(active) {
  loadFonts();
  const wa = ACADEMY.whatsapp || "";
  const links = [
    ["courses.html", "Courses"],
    ["faculty.html", "Faculty"],
    ["fees.html", "Fees & Batches"],
    ["about.html", "About"],
    ["status.html", "Check Status"],
    ["contact.html", "Contact"],
  ];
  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.prepend(bar);
  const top = document.createElement("div");
  top.className = "topbar";
  top.innerHTML = `<div class="wrap"><span>Admissions open \u2014 August 2026 batches, Thrissur campus</span><span class="tb-right"><span>Taught in English &amp; Malayalam</span><a href="tel:${esc((ACADEMY.phone || "").replace(/\s/g, ""))}">${esc(ACADEMY.phone || "")}</a></span></div>`;
  document.body.prepend(top);
  const head = document.createElement("header");
  head.className = "site";
  head.innerHTML = `<div class="wrap"><a class="brand" href="index.html"><span class="brand-mark">S</span><span>Skillarium<small>Academy of Technical Studies</small></span></a><nav class="nav-links">${links.map(([h, t]) => `<a href="${h}"${active === h ? ' class="active" aria-current="page"' : ""}>${t}</a>`).join("")}</nav><span class="nav-cta"><a class="btn btn-ghost btn-sm" href="apply-teacher.html">Teach with us</a><a class="btn btn-primary btn-sm" href="apply-student.html">Apply now <span class="arw">\u2192</span></a><button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button></span></div>`;
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
  foot.innerHTML = `<div class="wrap"><div class="foot-grid"><div><a class="brand" href="index.html"><span class="brand-mark">S</span><span>Skillarium</span></a><p style="margin:0 0 14px;max-width:32ch">A technical academy in Thrissur where every course ends in work you can show.</p><p style="margin:0;opacity:.72">${esc(ACADEMY.address || "")}</p></div><div><h5>Learn</h5><a href="courses.html">Courses</a><a href="fees.html">Fees &amp; batches</a><a href="apply-student.html">Apply as student</a><a href="status.html">Check application</a></div><div><h5>Academy</h5><a href="faculty.html">Faculty</a><a href="about.html">About</a><a href="apply-teacher.html">Teach with us</a><a href="${esc(ACADEMY.blogUrl || "#")}">Journal</a></div><div><h5>Contact</h5><a href="tel:${esc((ACADEMY.phone || "").replace(/\s/g, ""))}">${esc(ACADEMY.phone || "")}</a><a href="mailto:${esc(ACADEMY.email || "")}">${esc(ACADEMY.email || "")}</a><a href="contact.html">Visit the campus</a></div></div><div class="foot-bottom"><span>\u00a9 ${new Date().getFullYear()} Skillarium Academy of Technical Studies</span><span><a href="privacy.html">Privacy</a> &nbsp;&middot;&nbsp; <a href="admin.html">Staff login</a></span></div></div>`;
  document.body.append(foot);
  if (wa) {
    const a = document.createElement("a");
    a.className = "wa-fab";
    a.href = "https://" + "wa.me/" + wa + "?text=" + encodeURIComponent("Hi Skillarium, I would like to know more about your courses.");
    a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", "Chat on WhatsApp");
    a.innerHTML = `<svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1s-.8 1-.9 1.2c-.2.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-.9-2.2c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6 2.6 1 3.1.8 3.7.8.6 0 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5l-.5-.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7.2 3.9z"/></svg>`;
    document.body.append(a);
  }
  motion();
}

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
    if (el.type === "hidden" || el.classList