'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import API from '@/src/lib/api';

function validateEmail(val) {
  if (!val) return 'Email address is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address';
  return '';
}

function validatePassword(val) {
  if (!val) return 'Password is required';
  if (val.length < 6) return 'Password must be at least 6 characters';
  return '';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const canSubmit = useMemo(() => !loading, [loading]);

  async function onSubmit(e) {
    e.preventDefault();

    const eErr = validateEmail(email.trim());
    const pErr = validatePassword(password);
    setEmailErr(eErr);
    setPassErr(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    try {
      const { ok, data } = await API.login(email.trim(), password);
      if (!ok || !data?.success) {
        const msg = data?.message || (data?.errors?.[0]?.msg ?? 'Unable to sign in');
        setToast({ type: 'error', msg });
        return;
      }

      setToast({ type: 'success', msg: 'Signed in successfully! Redirecting…' });

      if (data.user?.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setToast({ type: 'error', msg: err?.message || 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      <nav className="site-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label="Aurum Vault home">
            <div className="hex" aria-hidden="true">A</div>
            AURUM VAULT
          </Link>
          <div className="nav-actions">
            <Link className="btn-text" href="/signup">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="auth-page" role="main" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 68px)', position: 'relative' }}>
        {loading ? (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14, border: '1px solid var(--border-dim)', background: 'rgba(17,17,17,0.78)', color: 'var(--text-1)', fontSize: 13 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-18 0" />
              </svg>
              <span>Signing in…</span>
            </div>
          </div>
        ) : null}

        <section className="auth-left" aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 3rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 30% 70%, rgba(201,168,76,0.08) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)', backgroundSize: '50px 50px', maskImage: 'radial-gradient(ellipse 90% 80% at 40% 50%, black 0%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 40% 50%, black 0%, transparent 75%)' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 380, width: '100%', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light))', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#0A0A0A' }}>A</div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.2em', color: 'var(--gold)' }}>AURUM VAULT</div>
            </div>

            <div style={{ borderLeft: '2px solid var(--border-gold)', paddingLeft: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.75, color: 'var(--text-1)', marginBottom: '0.8rem' }}>
                “Gold is money. Everything else is credit.”
              </p>
              <cite style={{ fontSize: 12, color: 'var(--text-2)', fontStyle: 'normal', letterSpacing: '0.06em' }}>— J.P. Morgan</cite>
            </div>
          </div>
        </section>

        <section className="auth-right" style={{ background: 'var(--bg-0)', padding: '3rem 2.5rem', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 440, paddingTop: '1rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 400, marginBottom: 10 }}>Welcome back</h1>
            <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Sign in to view your vault and manage your gold.</p>

            {toast ? (
              <div style={{ marginBottom: 14, border: '1px solid var(--border-dim)', borderRadius: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', color: toast.type === 'error' ? 'var(--red)' : 'var(--green)' }}>
                {toast.msg}
              </div>
            ) : null}

            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>Email</label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailErr(validateEmail(email.trim()))}
                  style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${emailErr ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }}
                  autoComplete="email"
                />
                {emailErr ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{emailErr}</div> : null}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPassErr(validatePassword(password))}
                    style={{ width: '100%', padding: '12px 44px 12px 12px', borderRadius: 12, border: `1px solid ${passErr ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} style={{ position: 'absolute', right: 8, top: 8, width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border-dim)', background: 'transparent', color: 'var(--text-2)' }}>
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
                {passErr ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{passErr}</div> : null}
              </div>

              <button
                id="submit-btn"
                disabled={!canSubmit}
                className="btn btn-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '14px 16px', borderRadius: 12, fontSize: 15, fontWeight: 600, opacity: canSubmit ? 1 : 0.6 }}
              >
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <span>Signing in</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-18 0" />
                    </svg>
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              <p style={{ marginTop: 16, color: 'var(--text-2)', fontSize: 13 }}>
                Don’t have an account? <Link href="/signup" style={{ color: 'var(--gold)' }}>Create one</Link>
              </p>
            </form>
          </div>
        </section>
      </main>

      <a className="support-fab" href="mailto:hello@aurumvault.ng?subject=Aurum%20Vault%20Support" aria-label="Contact support">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          <path d="M8 10h8" />
          <path d="M8 14h5" />
        </svg>
      </a>
    </div>
  );
}
