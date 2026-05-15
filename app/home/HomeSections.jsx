import Link from 'next/link';

export default function HomeSections() {
  return (
    <>
      <div className="press-strip animate-fade-up" style={{ animationDelay: '.7s' }} aria-label="As seen in">
        <span className="press-label">As seen in</span>
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

      <div className="ticker-bar" role="region" aria-label="Live gold prices">
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
            <span className="ti-label">Last updated</span>
            <span className="ti-value" id="ticker-time">Live</span>
            <span className="ti-change" style={{ color: 'var(--text-3)' }}>LBMA</span>
          </div>
        </div>
      </div>

      <section className="why-section" id="why" aria-labelledby="why-heading">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Why gold</p>
            <h2 id="why-heading" className="section-title">
              The world's most enduring<br /><em>store of value</em>
            </h2>
            <p className="section-desc">
              While currencies inflate and markets wobble, gold has preserved wealth for 5,000 years.
              It's not speculation — it's insurance.
            </p>
          </div>

          <div className="stats-row">
            <div className="stat-card reveal">
              <div className="stat-num">5,000<span>+</span></div>
              <div className="stat-label">Years as money</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-num">$1,000</div>
              <div className="stat-label">Minimum investment</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-num">+480<span>%</span></div>
              <div className="stat-label">XAU/USD 5-year return</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-num">100<span>%</span></div>
              <div className="stat-label">Allocated & insured</div>
            </div>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card reveal">
              <div className="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3>Inflation hedge</h3>
              <p>Gold consistently outpaces inflation over the long term. As purchasing power erodes, your gold holdings appreciate in local currency terms.</p>
            </div>
            <div className="pillar-card reveal">
              <div className="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              </div>
              <h3>Portfolio diversification</h3>
              <p>Gold moves independently of equities and bonds. Adding gold reduces portfolio volatility and smooths out market shocks when they inevitably arrive.</p>
            </div>
            <div className="pillar-card reveal">
              <div className="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              <h3>Currency protection</h3>
              <p>Denominated in USD globally, gold automatically hedges currency depreciation. When exchange rates move against you, your gold moves with it.</p>
            </div>
            <div className="pillar-card reveal">
              <div className="pillar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2M12 12v4M10 14h4" /></svg>
              </div>
              <h3>Tangible wealth</h3>
              <p>Unlike shares or cryptocurrencies, gold is a physical commodity with intrinsic value. Your allocation is a real bar in a real vault with a serial number.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="how-section" id="how" aria-labelledby="how-heading">
        <div className="container">
          <div className="how-inner">
            <div className="how-left">
              <p className="section-eyebrow">How it works</p>
              <h2 id="how-heading" className="section-title">
                Getting gold used to<br />take an <em>army</em>
              </h2>
              <p className="section-desc">Now it's four steps and a few taps. No broker. No dealer visit. No five-figure minimum.</p>

              <div className="steps">
                <div className="step reveal">
                  <div className="step-num">01</div>
                  <div className="step-content">
                    <h4>Create your account</h4>
                    <p>Sign up with your email and phone. Verify identity with BVN and a quick selfie. Takes under 2 minutes.</p>
                  </div>
                </div>
                <div className="step reveal">
                  <div className="step-num">02</div>
                  <div className="step-content">
                    <h4>Fund your wallet</h4>
                    <p>Add funds via bank transfer or debit card. Funds land in your wallet instantly.</p>
                  </div>
                </div>
                <div className="step reveal">
                  <div className="step-num">03</div>
                  <div className="step-content">
                    <h4>Buy gold</h4>
                    <p>Enter your amount in USD or grams. Confirm the live price. Your gold is allocated within seconds.</p>
                  </div>
                </div>
                <div className="step reveal">
                  <div className="step-num">04</div>
                  <div className="step-content">
                    <h4>Watch it grow</h4>
                    <p>Track portfolio value in real time. Set up auto-invest schedules. Sell any time — proceeds land same day.</p>
                  </div>
                </div>
              </div>

              <Link className="btn btn-gold" style={{ marginTop: '2.5rem' }} href="/signup">
                Open your vault
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>

            <div className="how-right" aria-hidden="true">
              <div className="phone-device">
                <div className="phone-frame">
                  <div className="phone-notch"></div>
                  <div className="phone-screen">
                    <div className="screen-header">
                      <span className="screen-greeting">Good morning, Adaeze</span>
                      <span className="screen-time">9:41</span>
                    </div>
                    <div className="screen-balance">
                      <div className="sb-label">Total portfolio value</div>
                      <div className="sb-value">$847,320</div>
                      <div className="sb-change">
                        <span className="up-arrow">▲</span> $62,440 (7.97%) all time
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
                        <span className="sr-label">Gold held</span>
                        <span className="sr-value">5.07 g</span>
                      </div>
                      <div className="screen-row">
                        <span className="sr-label">Avg buy price</span>
                        <span className="sr-value">$155,230/g</span>
                      </div>
                      <div className="screen-row">
                        <span className="sr-label">Today's return</span>
                        <span className="sr-value up">+$9,472</span>
                      </div>
                    </div>
                    <div className="screen-btns">
                      <button className="screen-btn primary">Buy</button>
                      <button className="screen-btn">Sell</button>
                      <button className="screen-btn">History</button>
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
            <p className="section-eyebrow">Trust & security</p>
            <h2 id="trust-heading" className="section-title">We take "vaulted" literally</h2>
            <p className="section-desc">Your gold is allocated, audited, and insured. Not paper. Not promises. Actual metal, with a serial number.</p>
          </div>

          <div className="trust-grid">
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
              </div>
              <h3>Allocated storage</h3>
              <p>Every gram you own is assigned to a specific bar, tracked by serial number. Your gold is never pooled or shared with other investors.</p>
            </div>
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18.01" /></svg>
              </div>
              <h3>Third-party audited</h3>
              <p>Independent auditors verify every quarter that our total physical gold holdings match total customer allocations. Reports are published on-platform.</p>
            </div>
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
              </div>
              <h3>Fully insured</h3>
              <p>All holdings are insured at 100% of market value against theft, loss, and damage via our Lloyd's-affiliated policy. Your wealth is always protected.</p>
            </div>
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
              </div>
              <h3>SEC regulated</h3>
              <p>Aurum Vault follows global compliance best practices and operates under robust AML/CFT guidelines.</p>
            </div>
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              </div>
              <h3>Bank-grade encryption</h3>
              <p>AES-256 encryption at rest, TLS 1.3 in transit, mandatory 2FA, and quarterly penetration testing by CREST-certified security firms.</p>
            </div>
            <div className="trust-card reveal">
              <div className="tc-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
              </div>
              <h3>Physical redemption</h3>
              <p>Hold 1 troy ounce or more? Request physical delivery to your Lagos address or collect directly from our certified vault partner.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="pricing-section" id="pricing" aria-labelledby="pricing-heading">
        <div className="container">
          <div className="section-header centered">
            <p className="section-eyebrow">Transparent pricing</p>
            <h2 id="pricing-heading" className="section-title">Integrity isn't a feature.<br />It's the <em>business model.</em></h2>
          </div>

          <div className="pricing-grid">
            <div className="pricing-main reveal">
              <div className="pm-fee">1.5<span>%</span></div>
              <div className="pm-title">One flat fee</div>
              <div className="pm-sub">on buy and sell. That is all.</div>
              <div className="pm-divider"></div>
              <ul className="pm-list">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  No storage or custody fees
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  No account maintenance fees
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  No inactivity penalties
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  Free bank transfer funding
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  30-second price lock on purchase
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  Same-day proceeds on sale
                </li>
              </ul>
              <Link className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '2rem' }} href="/signup">
                Start investing free
              </Link>
            </div>

            <div className="pricing-compare reveal">
              <h3>How we compare</h3>
              <div className="compare-table" role="table" aria-label="Fee comparison">
                <div className="ct-header" role="row">
                  <span role="columnheader">Provider</span>
                  <span role="columnheader">Buy fee</span>
                  <span role="columnheader">Storage</span>
                </div>
                <div className="ct-row highlight" role="row">
                  <span role="cell">Aurum Vault</span>
                  <span role="cell" className="fee-good">1.5%</span>
                  <span role="cell" className="fee-good">Free</span>
                </div>
                <div className="ct-row" role="row">
                  <span role="cell">Traditional dealer</span>
                  <span role="cell" className="fee-bad">3–8%</span>
                  <span role="cell" className="fee-bad">Your problem</span>
                </div>
                <div className="ct-row" role="row">
                  <span role="cell">Gold ETF</span>
                  <span role="cell" className="fee-mid">0.5–1%</span>
                  <span role="cell" className="fee-bad">0.5%/yr mgmt</span>
                </div>
                <div className="ct-row" role="row">
                  <span role="cell">Other platforms</span>
                  <span role="cell" className="fee-bad">2–5%</span>
                  <span role="cell" className="fee-bad">0.3–1%/yr</span>
                </div>
              </div>
              <p className="compare-note">Unlike ETFs, Aurum Vault gives you allocated physical ownership, not a financial instrument.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section className="faq-section" id="faq" aria-labelledby="faq-heading">
        <div className="container">
          <div className="faq-inner">
            <div className="faq-left">
              <p className="section-eyebrow">FAQ</p>
              <h2 id="faq-heading" className="section-title">Questions worth<br /><em>asking</em></h2>
              <p className="section-desc">Can't find your answer? <a href="mailto:hello@aurumvault.ng" style={{ color: 'var(--gold)' }}>Email our team</a> — we reply within 2 hours on business days.</p>
            </div>
            <div className="faq-list" role="list">
              <div className="faq-item reveal" role="listitem">
                <button className="faq-q" aria-expanded="false" aria-controls="faq-1">
                  Is my gold actually physical, or just a number on a screen?
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a" id="faq-1" hidden>
                  <p>It is genuinely physical. Every gram you purchase is allocated to a specific bar stored in a certified, insured vault. You receive the serial number of your bar. Quarterly audits confirm that physical holdings match digital allocations. You can request physical delivery for holdings of 1 troy ounce or more.</p>
                </div>
              </div>
              <div className="faq-item reveal" role="listitem">
                <button className="faq-q" aria-expanded="false" aria-controls="faq-2">
                  How quickly can I sell and access my cash?
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a" id="faq-2" hidden>
                  <p>You can sell any portion of your holdings any time the platform is open. Proceeds are settled to your linked bank account within the same business day for sales made before 3 PM, or the next business day for later sales.</p>
                </div>
              </div>
              <div className="faq-item reveal" role="listitem">
                <button className="faq-q" aria-expanded="false" aria-controls="faq-3">
                  What happens if Aurum Vault shuts down?
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a" id="faq-3" hidden>
                  <p>Your gold is held in allocated storage in your name, entirely separate from Aurum Vault's corporate assets. In the event the company ceases operations, your allocated gold is returned to you directly by the vault custodian. Our structure is specifically designed to protect customers in this scenario.</p>
                </div>
              </div>
              <div className="faq-item reveal" role="listitem">
                <button className="faq-q" aria-expanded="false" aria-controls="faq-4">
                  What is the minimum investment?
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a" id="faq-4" hidden>
                  <p>You can start with as little as $1,000, which buys you a fraction of a gram at current prices. There is no maximum, and you can buy in any amount in USD or grams. Fractional ownership is one of Aurum Vault's core features.</p>
                </div>
              </div>
              <div className="faq-item reveal" role="listitem">
                <button className="faq-q" aria-expanded="false" aria-controls="faq-5">
                  How is gold priced on the platform?
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-a" id="faq-5" hidden>
                  <p>Gold is priced using the LBMA international benchmark. Prices refresh every 60 seconds. When you initiate a purchase, we lock the displayed price for 30 seconds so you know exactly what you are paying before confirming.</p>
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
            <p className="section-eyebrow" style={{ textAlign: 'center' }}>Your wealth deserves a harder asset</p>
            <h2 id="cta-heading" className="cta-title">Stack gold.<br />The way <em>empires</em> did.</h2>
            <p className="cta-sub">Join thousands of investors building real wealth with real gold. Open your vault in under 2 minutes.</p>
            <div className="cta-actions">
              <Link className="btn btn-gold btn-lg" href="/signup">
                Open my vault free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/login">Sign in</Link>
            </div>
            <div className="cta-stats">
              <div className="cta-stat">
                <strong>$1,000</strong>
                <span>minimum to start</span>
              </div>
              <div className="cta-stat-divider" aria-hidden="true"></div>
              <div className="cta-stat">
                <strong>2 min</strong>
                <span>to open an account</span>
              </div>
              <div className="cta-stat-divider" aria-hidden="true"></div>
              <div className="cta-stat">
                <strong>0</strong>
                <span>hidden fees</span>
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
              <p>Real gold ownership for the modern investor. Fully insured. Accessible from $1,000.</p>
            </div>
            <div className="footer-col">
              <h5>Platform</h5>
              <a href="#">Buy gold</a>
              <a href="#">Auto-invest</a>
              <a href="#">Portfolio</a>
              <a href="#">Physical delivery</a>
            </div>
            <div className="footer-col">
              <h5>Learn</h5>
              <a href="#why">Why gold?</a>
              <a href="#">Gold vs inflation</a>
              <a href="#">Market insights</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <a href="#">About us</a>
              <a href="#trust">Security</a>
              <a href="#">Careers</a>
              <a href="mailto:hello@aurumvault.ng">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-legal">© 2026 Aurum Vault Ltd. Gold investments carry risk. Past performance does not guarantee future returns. The value of your investment may go down as well as up.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
