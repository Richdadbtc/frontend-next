'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import API from '@/src/lib/api';
import { SUPPORTED_LANGS, useI18n } from '@/src/lib/i18n';

export default function AdminLoginPage() {
  const { lang, setLang, t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => !loading, [loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');

    const em = String(email || '').trim();
    if (!em) return setErr(t('admin_login_email_required'));
    if (!String(password || '')) return setErr(t('admin_login_password_required'));

    setLoading(true);
    try {
      const { ok, data } = await API.login(em, password);
      if (!ok || !data?.success) throw new Error(data?.message || t('admin_login_unable_sign_in'));
      if (data.user?.role !== 'admin') {
        API.clearTokens();
        throw new Error(t('admin_login_admin_access_required'));
      }
      window.location.href = '/admin';
    } catch (e2) {
      setErr(e2.message || t('admin_login_sign_in_failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68, maxWidth: 520, margin: '0 auto', paddingInline: 16 }}>
      <nav className="site-nav" role="navigation" aria-label={t('nav_main_aria')}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label={t('nav_home')}>
            <div className="hex" aria-hidden="true">A</div>
            AURUM VAULT
          </Link>
          <div className="nav-actions">
            <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label={t('nav_language')}>
              {SUPPORTED_LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <Link className="btn-text" href="/login">{t('admin_nav_user_login')}</Link>
          </div>
        </div>
      </nav>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 40, marginTop: 26 }}>{t('admin_login_title')}</h1>
      <p style={{ color: 'var(--text-2)', marginTop: 6 }}>{t('admin_login_subtitle')}</p>

      <form onSubmit={onSubmit} style={{ marginTop: 18 }}>
        <label style={{ display: 'block', color: 'var(--text-2)', marginBottom: 6 }}>{t('admin_login_email_label')}</label>
        <input className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label style={{ display: 'block', color: 'var(--text-2)', marginTop: 14, marginBottom: 6 }}>{t('admin_login_password_label')}</label>
        <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn btn-gold" disabled={!canSubmit} style={{ width: '100%', marginTop: 16, opacity: canSubmit ? 1 : 0.6 }}>
          {loading ? t('admin_login_signing_in') : t('admin_login_sign_in')}
        </button>

        {err ? <div style={{ marginTop: 12, color: 'var(--red)', fontSize: 13 }}>{err}</div> : null}
      </form>
    </div>
  );
}
