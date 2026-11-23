const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});

siteNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  if (!element.style.getPropertyValue('--delay')) element.style.setProperty('--delay', `${Math.min(index % 4, 3) * 0.07}s`);
  revealObserver.observe(element);
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    document.querySelectorAll('.project-card').forEach(card => {
      const shouldHide = filter !== 'all' && card.dataset.category !== filter;
      if (shouldHide) {
        card.classList.remove('filter-in');
        card.classList.add('filter-out');
        window.setTimeout(() => {
          if (card.classList.contains('filter-out')) card.classList.add('hidden');
        }, 220);
      } else {
        card.classList.remove('hidden', 'filter-out');
        card.classList.remove('filter-in');
        void card.offsetWidth;
        card.classList.add('filter-in');
      }
    });
  });
});

const form = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  formNote.textContent = 'Opening your email app…';
  window.location.href = `mailto:subhanahmad639031@gmail.com?subject=${subject}&body=${body}`;
});

const cursorGlow = document.querySelector('.cursor-glow');
document.querySelector('#year').textContent = new Date().getFullYear();

const scrollProgress = document.querySelector('.scroll-progress span');
const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress?.style.setProperty('width', `${progress}%`);
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.counter || 0);
    const suffix = element.dataset.suffix || '';
    const start = performance.now();
    const duration = 900;

    const tick = now => {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(element);
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-counter]').forEach(counter => counterObserver.observe(counter));

if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  const portrait = document.querySelector('.portrait-frame');
  window.addEventListener('scroll', () => {
    if (!portrait) return;
    const rect = portrait.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.025;
      portrait.style.transform = `translateY(${offset}px)`;
    }
  }, { passive: true });
}

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.site-nav a');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });
sections.forEach(section => navObserver.observe(section));

if (window.matchMedia('(pointer: fine)').matches && cursorGlow) {
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let targetX = glowX;
  let targetY = glowY;

  window.addEventListener('pointermove', event => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursorGlow.classList.add('active');
  }, { passive: true });

  document.addEventListener('pointerleave', () => cursorGlow.classList.remove('active'));

  const animateGlow = () => {
    glowX += (targetX - glowX) * 0.12;
    glowY += (targetY - glowY) * 0.12;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  };
  animateGlow();

  document.querySelectorAll('.button-primary, .brand-mark').forEach(element => {
    element.addEventListener('pointermove', event => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.animate(
      [{ transform: 'scale(.995)' }, { transform: 'scale(1)' }],
      { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)' }
    );
  });
});
