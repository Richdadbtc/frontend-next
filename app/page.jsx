'use client';

import Link from 'next/link';
import HomeSections from './home/HomeSections';
import useHomeEffects from './home/useHomeEffects';
import { SUPPORTED_LANGS, useI18n } from '@/src/lib/i18n';

export default function HomePage() {
  useHomeEffects();
  const { lang, setLang, t } = useI18n();

  return (
    <>
      <nav className="site-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label="Aurum Vault home">
            <div className="hex" aria-hidden="true">A</div>
            AURUM VAULT
          </Link>
          <ul className="nav-links" role="list">
            <li><Link href="/" className="active">{t('nav_home')}</Link></li>
            <li><a href="#why">{t('nav_why')}</a></li>
            <li><a href="#how">{t('nav_how')}</a></li>
            <li><a href="#pricing">{t('nav_pricing')}</a></li>
            <li><a href="#trust">{t('nav_security')}</a></li>
            <li><a href="#faq">{t('nav_faq')}</a></li>
          </ul>
          <div className="nav-actions">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label={t('nav_language')}
              className="btn-text"
              style={{ border: '1px solid var(--border-dim)', borderRadius: 10, height: 38, padding: '0 10px', background: 'rgba(0,0,0,0.25)' }}
            >
              {SUPPORTED_LANGS.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <Link className="btn-text" href="/login">{t('nav_sign_in')}</Link>
            <Link className="nav-cta-btn" href="/signup">{t('nav_get_started')}</Link>
            <button className="hamburger" aria-label="Open menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      <section className="hero" id="hero" aria-labelledby="hero-heading">
        <div className="hero-bg-grid" aria-hidden="true"></div>
        <div className="hero-glow" aria-hidden="true"></div>

        <div className="hero-inner container">
          <div className="hero-content">
            <div className="hero-eyebrow animate-fade-up" style={{ animationDelay: '.1s' }}>
              <span className="eyebrow-dot"></span>
              {t('hero_eyebrow')}
            </div>

            <h1 id="hero-heading" className="hero-title animate-fade-up" style={{ animationDelay: '.22s' }}>
              {t('hero_title_1')}<br />
              {t('hero_title_2')} <em>{t('hero_title_3')}</em><br />
              {t('hero_title_4')}
            </h1>

            <p className="hero-sub animate-fade-up" style={{ animationDelay: '.34s' }}>
              {t('hero_sub_1')}<br />
              {t('hero_sub_2')}
            </p>

            <div className="hero-actions animate-fade-up" style={{ animationDelay: '.46s' }}>
              <Link className="btn btn-gold btn-lg" href="/signup">
                {t('hero_cta_primary')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <button className="btn btn-ghost btn-lg" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
                {t('hero_cta_secondary')}
              </button>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="gold-bar-wrapper">
              <div className="gold-bar">
                <div className="bar-face">
                  <div className="bar-emblem">◎</div>
                  <div className="bar-brand">AURUM VAULT</div>
                  <div className="bar-weight">1 OZ · 999.9 FINE GOLD</div>
                  <div className="bar-serial">SN: AV-2026-001847</div>
                </div>
              </div>
              <div className="bar-shadow"></div>
            </div>

            <div className="price-card floating-card card-1">
              <div className="price-card-label">XAU / USD</div>
              <div className="price-card-value" data-ticker="intl">$5,194,600</div>
              <div className="price-card-change up">▲ +1.12% today</div>
            </div>

            <div className="price-card floating-card card-2">
              <div className="price-card-label">Per gram</div>
              <div className="price-card-value" data-ticker="gram">$167,040</div>
              <div className="price-card-change up">▲ +0.84%</div>
            </div>

            <div className="portfolio-card floating-card card-3">
              <div className="port-label">My Portfolio</div>
              <div className="port-value">$847,320</div>
              <div className="port-grams">5.07 grams allocated</div>
              <div className="mini-bars">
                <span style={{ height: '40%' }}></span><span style={{ height: '55%' }}></span>
                <span style={{ height: '45%' }}></span><span style={{ height: '70%' }}></span>
                <span style={{ height: '60%' }}></span><span style={{ height: '82%' }}></span>
                <span style={{ height: '75%' }}></span><span style={{ height: '100%' }}></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeSections />

      <a className="support-fab" href="mailto:hello@aurumvault.ng?subject=Aurum%20Vault%20Support" aria-label="Contact support">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          <path d="M8 10h8" />
          <path d="M8 14h5" />
        </svg>
      </a>
    </>
  );
}
