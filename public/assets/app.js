/* Skillarium Animation Engine */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Loader */
window.addEventListener('load', () => {
  setTimeout(() => $('#loader')?.classList.add('done'), 1800);
});

/* Scroll animations */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

$$('[data-animate], [data-stagger]').forEach(el => observer.observe(el));

/* Parallax */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      $$('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
});

/* Navbar */
const navbar = $('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 50);
});

/* Mobile menu */
$('.mobile-toggle')?.addEventListener('click', () => {
  $('.nav-links')?.classList.toggle('open');
});

/* Counter animation */
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.counter);
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
$$('[data-counter]').forEach(el => countObserver.observe(el));

/* Typewriter effect */
$$('[data-typewriter]').forEach(el => {
  const text = el.textContent;
  el.textContent = '';
  el.style.width = '0';
  let i = 0;
  const type = () => {
    if (i < text.length) { el.textContent += text[i++]; setTimeout(type, 50); }
  };
  setTimeout(type, 800);
});

/* Newsletter form */
$('#newsletter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = $('#newsletter-btn');
  const msg = $('#newsletter-msg');
  btn.disabled = true; btn.textContent = 'Subscribing...';
  setTimeout(() => {
    btn.textContent = 'Subscribed!';
    msg.style.display = 'block';
    msg.style.animation = 'fadeInUp 0.5s ease-out';
    $('#newsletter-email').value = '';
  }, 1500);
});

/* Contact form */
$('#contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = $('#contact-btn');
  const msg = $('#contact-msg');
  btn.disabled = true; btn.textContent = 'Sending...';
  setTimeout(() => {
    btn.textContent = 'Message Sent!';
    msg.style.display = 'block';
    e.target.reset();
  }, 1500);
});
