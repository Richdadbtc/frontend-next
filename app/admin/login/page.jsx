'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import API from '@/src/lib/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => !loading, [loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');

    const em = String(email || '').trim();
    if (!em) return setErr('Email is required');
    if (!String(password || '')) return setErr('Password is required');

    setLoading(true);
    try {
      const { ok, data } = await API.login(em, password);
      if (!ok || !data?.success) throw new Error(data?.message || 'Unable to sign in');
      if (data.user?.role !== 'admin') {
        API.clearTokens();
        throw new Error('Admin access required');
      }
      window.location.href = '/admin';
    } catch (e2) {
      setErr(e2.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68, maxWidth: 520, margin: '0 auto', paddingInline: 16 }}>
      <nav className="site-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label="Aurum Vault home">
            <div className="hex" aria-hidden="true">A</div>
            AURUM VAULT
          </Link>
          <div className="nav-actions">
            <Link className="btn-text" href="/login">User Login</Link>
          </div>
        </div>
      </nav>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 40, marginTop: 26 }}>Admin Login</h1>
      <p style={{ color: 'var(--text-2)', marginTop: 6 }}>Sign in with an admin account.</p>

      <form onSubmit={onSubmit} style={{ marginTop: 18 }}>
        <label style={{ display: 'block', color: 'var(--text-2)', marginBottom: 6 }}>Email</label>
        <input className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label style={{ display: 'block', color: 'var(--text-2)', marginTop: 14, marginBottom: 6 }}>Password</label>
        <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn btn-gold" disabled={!canSubmit} style={{ width: '100%', marginTop: 16, opacity: canSubmit ? 1 : 0.6 }}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        {err ? <div style={{ marginTop: 12, color: 'var(--red)', fontSize: 13 }}>{err}</div> : null}
      </form>
    </div>
  );
}
