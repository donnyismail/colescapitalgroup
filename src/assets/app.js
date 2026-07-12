// Cole's Capital Group — homepage behavior. External module (CSP: script-src 'self').
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const burger = document.getElementById('burger');
if (burger) {
  burger.addEventListener('click', () => {
    const menu = document.getElementById('menu');
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
}

const revealables = document.querySelectorAll('.rv');
if (reduceMotion) {
  revealables.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.14 });
  revealables.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 0.07}s`; io.observe(el); });
}

// Inquire modal
const modal = document.getElementById('inquireModal');
const inquireForm = document.getElementById('inquireForm');
if (modal && inquireForm) {
  const closeBtn = document.getElementById('modalClose');
  const status = document.getElementById('formStatus');
  let lastFocused = null;

  function openModal(e) {
    e.preventDefault();
    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('inq-name')?.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.js-inquire').forEach((btn) => btn.addEventListener('click', openModal));
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  inquireForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const accessKey = inquireForm.querySelector('[name="access_key"]').value.trim();
    const name = document.getElementById('inq-name').value;
    const email = document.getElementById('inq-email').value;
    const message = document.getElementById('inq-message').value;

    if (!accessKey) {
      const to = inquireForm.dataset.mailto;
      const subject = encodeURIComponent(`Inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      status.textContent = "Opening your email app — send the pre-filled message to reach us.";
      return;
    }

    status.textContent = 'Sending…';
    try {
      const res = await fetch(inquireForm.action, {
        method: 'POST',
        body: new FormData(inquireForm),
        headers: { Accept: 'application/json' },
      });
      const json = await res.json();
      if (json.success) {
        status.textContent = "Thanks — we'll be in touch soon.";
        inquireForm.reset();
      } else {
        status.textContent = 'Something went wrong. Please email us directly.';
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please email us directly.';
    }
  });
}
