import Link from 'next/link';
import { useI18n } from '@/src/lib/i18n';

export default function HomeSections() {
  const { t } = useI18n();
  return (
    <>
      <div className="press-strip animate-fade-up" style={{ animationDelay: '.7s' }} aria-label={t('home_press_aria')}>
        <span className="press-label">{t('home_press_label')}</span>
        <div className="press-logos">
          <span>Bloomberg</span>
          <span className="dot">·</span>
          <span>Reuters</span>
          <span className="dot">·</span>
          <span>TechCabal</span>
          <span className="dot">·</span>
          <span>BusinessDay</span>
          <span className="dot">·</span>
          <span>Financial Times</span>
        </div>
      </div>

      <div className="ticker-bar" role="region" aria-label={t('home_ticker_aria')}>
        <div className="ticker-inner container">
          <div className="ticker-item">
            <span className="ti-label">XAU / USD</span>
            <span className="ti-value" data-ticker="usd">$3,314.40</span>
            <span className="ti-change up">▲ +0.84%</span>
          </div>
          <div className="ticker-sep" aria-hidden="true"></div>
          <div className="ticker-item">
            <span className="ti-label">XAU / USD</span>
            <span className="ti-value" data-ticker="intl">$5,194,600</span>
            <span className="ti-change up">▲ +1.12%</span>
          </div>
          <div className="ticker-sep" aria-hidden="true"></div>
          <div className="ticker-item">
            <span className="ti-label">Per gram</span>
            <span className="ti-value" data-ticker="gram">$167,040</span>
            <span className="ti-change up">▲ +1.12%</span>
          </div>
          <div className="ticker-sep" aria-hidden="true"></div>
          <div className="ticker-item">
            <span className="ti-label">{t('home_ticker_last_updated')}</span>
            <span className="ti-value" id="ticker-time">Live</span>
            <span className="ti-change" style={{ color: 'var(--text-3)' }}>LBMA</span>
          </div>
        </div>
      </div>

      <section className="why-section" id="why" aria-labelledby="why-heading">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">{t('home_why_eyebrow')}</p>
            <h2 id="why-heading" className="section-title">
              {t('home_why_title_1')}<br /><em>{t('home_why_title_2')}</em>
            </h2>
            <p className="section-desc">
              {t('home_why_desc_1')}
              {t('home_why_desc_2')}
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card reveal">
              <div className="stat-num">5,000<span>+</span></div>
              <div className="stat-label">{t('home_why_stat_1')}</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-num">$1,000</div>
              <div className="stat-label">{t('home_why_stat_2')}</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-num">+480<span>%</span></div>
              <div className="stat-label">{t('home_why_stat_3')}</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-num">100<span>%</span></div>
              <div className="stat-label">{t('home_why_stat_4')}</div>
            </div>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card reveal">
              <div className="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3>{t('home_pillar_1_title')}</h3>
              <p>{t('home_pillar_1_desc')}</p>
            </div>
            <div className="pillar-card reveal">
              <div className="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
              <h3>{t('home_pillar_2_title')}</h3>
              <p>{t('home_pillar_2_desc')}</p>
            </div>
            <div className="pillar-card reveal">
              <div className="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              <h3>{t('home_pillar_3_title')}</h3>
              <p>{t('home_pillar_3_desc')}</p>
            </div>
            <div className="pillar-card reveal">
              <div className="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2M12 12v4M10 14h4" /></svg>
              </div>
              <h3>{t('home_pillar_4_title')}</h3>
              <p>{t('home_pillar_4_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="how-section" id="how" aria-labelledby="how-heading">
        <div className="container">
          <div className="how-inner">
            <div className="how-left">
              <p className="section-eyebrow">{t('home_how_eyebrow')}</p>
              <h2 id="how-heading" className="section-title">
                {t('home_how_title_1')}<br />{t('home_how_title_2')} <em>{t('home_how_title_3')}</em>
              </h2>
              <p className="section-desc">{t('home_how_desc')}</p>

              <div className="steps">
                <div className="step reveal">
                  <div className="step-num">01</div>
                  <div className="step-content">
                    <h4>{t('home_step_1_title')}</h4>
                    <p>{t('home_step_1_desc')}</p>
                  </div>
                </div>
                <div className="step reveal">
                  <div className="step-num">02</div>
                  <div className="step-content">
                    <h4>{t('home_step_2_title')}</h4>
                    <p>{t('home_step_2_desc')}</p>
                  </div>
                </div>
                <div className="step reveal">
                  <div className="step-num">03</div>
                  <div className="step-content">
                    <h4>{t('home_step_3_title')}</h4>
                    <p>{t('home_step_3_desc')}</p>
                  </div>
                </div>
                <div className="step reveal">
                  <div className="step-num">04</div>
                  <div className="step-content">
                    <h4>{t('home_step_4_title')}</h4>
                    <p>{t('home_step_4_desc')}</p>
                  </div>
                </div>
              </div>

              <Link className="btn btn-gold" style={{ marginTop: '2.5rem' }} href="/signup">
                {t('home_open_vault')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>

            <div className="how-right" aria-hidden="true">
              <div className="phone-device">
                <div className="phone-frame">
                  <div className="phone-notch"></div>
                  <div className="phone-screen">
                    <div className="screen-header">
                      <span className="screen-greeting">{t('home_screen_greeting')}</span>
                      <span className="screen-time">9:41</span>
                    </div>
                    <div className="screen-balance">
                      <div className="sb-label">{t('home_screen_total_portfolio')}</div>
                      <div className="sb-value">$847,320</div>
                      <div className="sb-change">
                        <span className="up-arrow">▲</span> $62,440 (7.97%) {t('home_screen_all_time')}
                      </div>
                    </div>
                    <div className="screen-chart">
                      <svg viewBox="0 0 200 60" preserveAspectRatio="none" style={{ width: '100%', height: 60 }}>
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,55 C20,50 30,45 50,38 C70,30 80,32 100,25 C120,18 130,20 150,14 C170,8 180,10 200,5" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
                        <path d="M0,55 C20,50 30,45 50,38 C70,30 80,32 100,25 C120,18 130,20 150,14 C170,8 180,10 200,5 L200,60 L0,60Z" fill="url(#chartGrad)" />
                      </svg>
                    </div>
                    <div className="screen-rows">
                      <div className="screen-row">
                        <span className="sr-label">{t('home_screen_gold_held')}</span>
                        <span className="sr-value">5.07 g</span>
                      </div>
                      <div className="screen-row">
                        <span className="sr-label">{t('home_screen_avg_buy')}</span>
                        <span className="sr-value">$155,230/g</span>
                      </div>
                      <div className="screen-row">
                        <span className="sr-label">{t('home_screen_today_return')}</span>
                        <span className="sr-value up">+$9,472</span>
                      </div>
                    </div>
                    <div className="screen-btns">
                      <button className="screen-btn primary">{t('home_screen_buy')}</button>
                      <button className="screen-btn">{t('home_screen_sell')}</button>
                      <button className="screen-btn">{t('home_screen_history')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="trust-section" id="trust" aria-labelledby="trust-heading">
        <div className="container">
          <div className="section-header centered">
            <p className="section-eyebrow">{t('home_trust_eyebrow')}</p>
            <h2 id="trust-heading" className="section-title">{t('home_trust_title')}</h2>
            <p className="section-desc">{t('home_trust_desc')}</p>
          </div>

          <div className="trust-grid">
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              </div>
              <h3>{t('home_trust_card_1_title')}</h3>
              <p>{t('home_trust_card_1_desc')}</p>
            </div>
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" /></svg>
              </div>
              <h3>{t('home_trust_card_2_title')}</h3>
              <p>{t('home_trust_card_2_desc')}</p>
            </div>
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
              </div>
              <h3>{t('home_trust_card_3_title')}</h3>
              <p>{t('home_trust_card_3_desc')}</p>
            </div>
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
              </div>
              <h3>{t('home_trust_card_4_title')}</h3>
              <p>{t('home_trust_card_4_desc')}</p>
            </div>
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </div>
              <h3>{t('home_trust_card_5_title')}</h3>
              <p>{t('home_trust_card_5_desc')}</p>
            </div>
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
              </div>
              <h3>{t('home_trust_card_6_title')}</h3>
              <p>{t('home_trust_card_6_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="pricing-section" id="pricing" aria-labelledby="pricing-heading">
        <div className="container">
          <div className="section-header centered">
            <p className="section-eyebrow">{t('home_pricing_eyebrow')}</p>
            <h2 id="pricing-heading" className="section-title">{t('home_pricing_title_1')}<br />{t('home_pricing_title_2')} <em>{t('home_pricing_title_3')}</em></h2>
          </div>

          <div className="pricing-grid">
            <div className="pricing-main reveal">
              <div className="pm-fee">1.5<span>%</span></div>
              <div className="pm-title">{t('home_pricing_fee_title')}</div>
              <div className="pm-sub">{t('home_pricing_fee_sub')}</div>
              <div className="pm-divider"></div>
              <ul className="pm-list">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {t('home_pricing_bullet_1')}
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {t('home_pricing_bullet_2')}
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {t('home_pricing_bullet_3')}
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {t('home_pricing_bullet_4')}
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {t('home_pricing_bullet_5')}
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {t('home_pricing_bullet_6')}
                </li>
              </ul>
              <Link className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }} href="/signup">
                {t('home_pricing_cta')}
              </Link>
            </div>

            <div className="pricing-compare reveal">
              <h3>{t('home_compare_title')}</h3>
              <div className="compare-table" role="table" aria-label={t('home_compare_aria')}>
                <div className="ct-header" role="row">
                  <span role="columnheader">{t('home_compare_col_provider')}</span>
                  <span role="columnheader">{t('home_compare_col_buy_fee')}</span>
                  <span role="columnheader">{t('home_compare_col_storage')}</span>
                </div>
                <div className="ct-row highlight" role="row">
                  <span role="cell">{t('home_compare_row_aurum')}</span>
                  <span role="cell" className="fee-good">1.5%</span>
                  <span role="cell" className="fee-good">{t('home_compare_free')}</span>
                </div>
                <div className="ct-row" role="row">
                  <span role="cell">{t('home_compare_row_dealer')}</span>
                  <span role="cell" className="fee-bad">3–8%</span>
                  <span role="cell" className="fee-bad">{t('home_compare_problem')}</span>
                </div>
                <div className="ct-row" role="row">
                  <span role="cell">{t('home_compare_row_etf')}</span>
                  <span role="cell" className="fee-mid">0.5–1%</span>
                  <span role="cell" className="fee-bad">{t('home_compare_etf_storage')}</span>
                </div>
                <div className="ct-row" role="row">
                  <span role="cell">{t('home_compare_row_other')}</span>
                  <span role="cell" className="fee-bad">2–5%</span>
                  <span role="cell" className="fee-bad">{t('home_compare_other_storage')}</span>
                </div>
              </div>
              <p className="compare-note">{t('home_compare_note')}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="faq-section" id="faq" aria-labelledby="faq-heading">
        <div className="container">
          <div className="faq-inner">
            <div className="faq-left">
              <p className="section-eyebrow">{t('home_faq_eyebrow')}</p>
              <h2 id="faq-heading" className="section-title">{t('home_faq_title_1')}<br /><em>{t('home_faq_title_2')}</em></h2>
              <p className="section-desc">{t('home_faq_desc_1')} <a href="mailto:hello@aurumvault.ng" style={{ color: 'var(--gold)' }}>{t('home_faq_desc_link')}</a> {t('home_faq_desc_2')}</p>
            </div>
            <div className="faq-list" role="list">
              <div className="faq-item reveal" role="listitem">
                <button className="faq-q" aria-expanded="false" aria-controls="faq-1">
                  {t('home_faq_q1')}
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a" id="faq-1" hidden>
                  <p>{t('home_faq_a1')}</p>
                </div>
              </div>
              <div className="faq-item reveal" role="listitem">
                <button className="faq-q" aria-expanded="false" aria-controls="faq-2">
                  {t('home_faq_q2')}
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a" id="faq-2" hidden>
                  <p>{t('home_faq_a2')}</p>
                </div>
              </div>
              <div className="faq-item reveal" role="listitem">
                <button className="faq-q" aria-expanded="false" aria-controls="faq-3">
                  {t('home_faq_q3')}
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a" id="faq-3" hidden>
                  <p>{t('home_faq_a3')}</p>
                </div>
              </div>
              <div className="faq-item reveal" role="listitem">
                <button className="faq-q" aria-expanded="false" aria-controls="faq-4">
                  {t('home_faq_q4')}
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a" id="faq-4" hidden>
                  <p>{t('home_faq_a4')}</p>
                </div>
              </div>
              <div className="faq-item reveal" role="listitem">
                <button className="faq-q" aria-expanded="false" aria-controls="faq-5">
                  {t('home_faq_q5')}
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a" id="faq-5" hidden>
                  <p>{t('home_faq_a5')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band" aria-labelledby="cta-heading">
        <div className="cta-glow" aria-hidden="true"></div>
        <div className="container">
          <div className="cta-inner">
            <p className="section-eyebrow" style={{ textAlign: 'center' }}>{t('home_cta_eyebrow')}</p>
            <h2 id="cta-heading" className="cta-title">{t('home_cta_title_1')}<br />{t('home_cta_title_2')} <em>{t('home_cta_title_3')}</em> {t('home_cta_title_4')}</h2>
            <p className="cta-sub">{t('home_cta_sub')}</p>
            <div className="cta-actions">
              <Link className="btn btn-gold btn-lg" href="/signup">
                {t('home_cta_primary')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/login">{t('nav_sign_in')}</Link>
            </div>
            <div className="cta-stats">
              <div className="cta-stat">
                <strong>$1,000</strong>
                <span>{t('home_cta_stat_1')}</span>
              </div>
              <div className="cta-stat-divider" aria-hidden="true"></div>
              <div className="cta-stat">
                <strong>2 min</strong>
                <span>{t('home_cta_stat_2')}</span>
              </div>
              <div className="cta-stat-divider" aria-hidden="true"></div>
              <div className="cta-stat">
                <strong>0</strong>
                <span>{t('home_cta_stat_3')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo-text">
                <div className="hex" style={{ width: 28, height: 28, fontSize: 11 }} aria-hidden="true">A</div>
                AURUM VAULT
              </div>
              <p>{t('home_footer_blurb')}</p>
            </div>
            <div className="footer-col">
              <h5>{t('home_footer_col_1_title')}</h5>
              <a href="#">{t('home_footer_col_1_link_1')}</a>
              <a href="#">{t('home_footer_col_1_link_2')}</a>
              <a href="#">{t('home_footer_col_1_link_3')}</a>
              <a href="#">{t('home_footer_col_1_link_4')}</a>
            </div>
            <div className="footer-col">
              <h5>{t('home_footer_col_2_title')}</h5>
              <a href="#why">{t('home_footer_col_2_link_1')}</a>
              <a href="#">{t('home_footer_col_2_link_2')}</a>
              <a href="#">{t('home_footer_col_2_link_3')}</a>
              <a href="#faq">{t('nav_faq')}</a>
            </div>
            <div className="footer-col">
              <h5>{t('home_footer_col_3_title')}</h5>
              <a href="#">{t('home_footer_col_3_link_1')}</a>
              <a href="#trust">{t('nav_security')}</a>
              <a href="#">{t('home_footer_col_3_link_3')}</a>
              <a href="mailto:hello@aurumvault.ng">{t('home_footer_col_3_link_4')}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-legal">{t('home_footer_legal')}</p>
            <div className="footer-links">
              <a href="#">{t('home_footer_privacy')}</a>
              <a href="#">{t('home_footer_terms')}</a>
              <a href="#">{t('home_footer_cookies')}</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
