// Skillarium shared JS (classic script — works on Render static)
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  function hideLoader() {
    const el = $('#loader');
    if (el) el.classList.add('done');
  }
  window.addEventListener('load', function () { setTimeout(hideLoader, 700); });
  setTimeout(hideLoader, 2000); // hard fallback

  window.Skillarium = window.Skillarium || {};

  window.Skillarium.boot = function (active) {
    active = active || '';
    if (document.querySelector('header.nav')) return; // already booted

    const nav = document.createElement('header');
    nav.className = 'nav';
    nav.innerHTML =
      '<div class="wrap inner">' +
      '<a class="logo" href="/index.html">Skillarium</a>' +
      '<nav class="nav-links" id="navLinks">' +
      '<a href="/index.html" data-p="home">Home</a>' +
      '<a href="/about.html" data-p="about">About</a>' +
      '<a href="/students.html" data-p="students">Students</a>' +
      '<a href="/admissions.html" data-p="admissions">Admissions</a>' +
      '<a href="/portal/index.html" data-p="portal">Portal</a>' +
      '<a href="/contact.html" data-p="contact">Contact</a>' +
      '<a class="btn btn-gold" href="/portal/login.html">Portal Login</a>' +
      '</nav>' +
      '<button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '</div>';
    document.body.insertBefore(nav, document.body.firstChild);

    const links = $('#navLinks');
    $$('a[data-p]', links).forEach(function (a) {
      if (a.getAttribute('data-p') === active) a.classList.add('active');
    });
    const burger = $('#burger');
    if (burger) burger.addEventListener('click', function () { links.classList.toggle('open'); });

    function onScroll() { nav.classList.toggle('on', window.scrollY > 24); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const year = new Date().getFullYear();
    const foot = document.createElement('footer');
    foot.innerHTML =
      '<div class="wrap">' +
      '<div class="foot-grid">' +
      '<div><a class="logo" href="/index.html">Skillarium</a><p>Your path to professional excellence. Crown Tower, Thrissur.</p></div>' +
      '<div><h4>Explore</h4><a href="/about.html">About</a><a href="/students.html">Students</a><a href="/admissions.html">Admissions</a></div>' +
      '<div><h4>Portal</h4><a href="/portal/index.html">Register</a><a href="/portal/login.html">Login</a><a href="/portal/dashboard.html">Dashboard</a></div>' +
      '<div><h4>Contact</h4><a href="tel:+919400138652">+91 94001 38652</a><a href="mailto:info@skillarium.org">info@skillarium.org</a><a href="/contact.html">Visit us</a></div>' +
      '</div>' +
      '<div class="foot-bottom"><span>© ' + year + ' Skillarium Academy</span><span>Thrissur, Kerala</span></div>' +
      '</div>';
    document.body.appendChild(foot);

    const io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
  };

  window.Skillarium.alertBox = function (el, kind, msg) {
    if (!el) return;
    el.className = 'alert show ' + kind;
    el.textContent = msg;
  };
})();
