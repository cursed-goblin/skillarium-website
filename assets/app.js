// Skillarium shared JS
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

window.addEventListener('load', () => setTimeout(() => $('#loader')?.classList.add('done'), 900));

export function boot(active=''){
  const nav = document.createElement('header');
  nav.className = 'nav';
  nav.innerHTML = `<div class="wrap inner">
    <a class="logo" href="/index.html">Skillarium</a>
    <nav class="nav-links" id="navLinks">
      <a href="/index.html" data-p="home">Home</a>
      <a href="/about.html" data-p="about">About</a>
      <a href="/students.html" data-p="students">Students</a>
      <a href="/admissions.html" data-p="admissions">Admissions</a>
      <a href="/portal/index.html" data-p="portal">Portal</a>
      <a href="/contact.html" data-p="contact">Contact</a>
      <a class="btn btn-gold" href="/portal/login.html">Portal Login</a>
    </nav>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>`;
  document.body.prepend(nav);
  const links = $('#navLinks');
  $$('a[data-p]', links).forEach(a => { if (a.dataset.p === active) a.classList.add('active'); });
  $('#burger')?.addEventListener('click', () => links.classList.toggle('open'));
  const onScroll = () => nav.classList.toggle('on', scrollY > 24);
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const foot = document.createElement('footer');
  foot.innerHTML = `<div class="wrap">
    <div class="foot-grid">
      <div><a class="logo" href="/index.html">Skillarium</a><p>Your path to professional excellence. Crown Tower, Thrissur.</p></div>
      <div><h4>Explore</h4><a href="/about.html">About</a><a href="/students.html">Students</a><a href="/admissions.html">Admissions</a></div>
      <div><h4>Portal</h4><a href="/portal/index.html">Register</a><a href="/portal/login.html">Login</a><a href="/portal/dashboard.html">Dashboard</a></div>
      <div><h4>Contact</h4><a href="tel:+919400138652">+91 94001 38652</a><a href="mailto:info@skillarium.org">info@skillarium.org</a><a href="/contact.html">Visit us</a></div>
    </div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} Skillarium Academy</span><span>Thrissur, Kerala</span></div>
  </div>`;
  document.body.append(foot);

  const io = new IntersectionObserver((ents)=>ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }), {threshold:.12, rootMargin:'0px 0px -8% 0px'});
  $$('[data-reveal]').forEach(el => io.observe(el));
}

export function alertBox(el, kind, msg){
  if(!el) return; el.className = 'alert show ' + kind; el.textContent = msg;
}
