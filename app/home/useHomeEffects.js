import { useEffect } from 'react';

export default function useHomeEffects() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    const faqHandlers = [];
    document.querySelectorAll('.faq-q').forEach((btn) => {
      const handler = () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const answer = document.getElementById(btn.getAttribute('aria-controls'));

        document.querySelectorAll('.faq-q').forEach((b) => {
          b.setAttribute('aria-expanded', 'false');
          const a = document.getElementById(b.getAttribute('aria-controls'));
          if (a) a.hidden = true;
        });

        if (!expanded) {
          btn.setAttribute('aria-expanded', 'true');
          if (answer) answer.hidden = false;
        }
      };
      btn.addEventListener('click', handler);
      faqHandlers.push([btn, handler]);
    });

    const timeEl = document.getElementById('ticker-time');
    const updateTime = () => {
      if (!timeEl) return;
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    };
    updateTime();
    const timeTimer = window.setInterval(updateTime, 1000);

    const heroGlow = document.querySelector('.hero-glow');
    const onScroll = () => {
      if (!heroGlow) return;
      const y = window.scrollY;
      heroGlow.style.transform = `translateX(-50%) translateY(${y * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const closeMenu = () => {
      if (!navLinks || !hamburger) return;
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    const onHamburger = (e) => {
      e.preventDefault();
      if (!navLinks || !hamburger) return;
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    hamburger?.addEventListener('click', onHamburger);

    const onDocClick = (e) => {
      if (!navLinks || !hamburger) return;
      if (!navLinks.classList.contains('open')) return;
      const t = e.target;
      if (navLinks.contains(t) || hamburger.contains(t)) return;
      closeMenu();
    };
    document.addEventListener('click', onDocClick);

    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      observer.disconnect();
      faqHandlers.forEach(([btn, handler]) => btn.removeEventListener('click', handler));
      window.clearInterval(timeTimer);
      window.removeEventListener('scroll', onScroll);
      hamburger?.removeEventListener('click', onHamburger);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
}
