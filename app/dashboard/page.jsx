'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import API from '@/src/lib/api';

function computeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const [ready, setReady] = useState(false);
  const [name, setName] = useState('');
  const greeting = useMemo(() => computeGreeting(), []);

  useEffect(() => {
    try {
      if (!API.requireAuth({ adminRequired: false })) return;
      const me = API.getUser();
      if (me?.role === 'admin') {
        window.location.href = '/admin';
        return;
      }

      const display =
        [me?.firstName, me?.lastName].filter(Boolean).join(' ').trim() ||
        me?.email ||
        'there';
      setName(display);
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      <nav className="site-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label="Aurum Vault home">
            <div className="hex" aria-hidden="true">A</div>
            AURUM VAULT
          </Link>
          <div className="nav-actions">
            <button className="btn-text" onClick={() => API.logout()}>Sign out</button>
          </div>
        </div>
      </nav>

      <main className="container" style={{ paddingTop: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 400, marginBottom: 8 }}>
          {greeting}, {name}
        </h1>
        <p style={{ color: 'var(--text-2)', marginBottom: 22 }}>
          Dashboard migration in progress. Next I’ll port the full UI and modules (wallet, buy/sell, transactions, support chat, profile, KYC).
        </p>

        <div style={{ border: '1px solid var(--border-dim)', background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 16 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link className="btn btn-gold" href="/">Back to home</Link>
            <button className="btn btn-ghost" onClick={() => window.location.reload()}>Refresh</button>
          </div>
        </div>
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
