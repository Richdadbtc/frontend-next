'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import API from '@/src/lib/api';
import { SUPPORTED_LANGS, useI18n } from '@/src/lib/i18n';

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function digitsOnly(v) {
  return String(v || '').replace(/\D/g, '');
}

export default function SignupPage() {
  const { lang, setLang, t } = useI18n();
  const [step, setStep] = useState(1);

  const [countries, setCountries] = useState([]);
  const [countryValue, setCountryValue] = useState('');
  const [loadingInit, setLoadingInit] = useState(true);
  const dialPrefix = useMemo(() => {
    const parts = String(countryValue || '').split('|');
    return parts[1] ? `+${parts[1]}` : '+';
  }, [countryValue]);

  const countryCode = useMemo(() => String(countryValue || '').split('|')[0] || '', [countryValue]);

  const statesByCountryCode = useMemo(() => ({
    NG: [
      'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
    ],
    US: [
      'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','District of Columbia',
    ],
  }), []);

  const stateOptions = useMemo(() => statesByCountryCode[countryCode] || null, [statesByCountryCode, countryCode]);

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);

  const [otp, setOtp] = useState('');

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [dob, setDob] = useState('');
  const [state, setStateVal] = useState('');
  const [gender, setGender] = useState('');

  const [err, setErr] = useState({});
  const [loading, setLoading] = useState({ otpReq: false, otpVerify: false, register: false, resend: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/assets/countries.json', { cache: 'no-store' });
        const list = await res.json();
        const sorted = [...list].sort((a, b) => String(a.name).localeCompare(String(b.name)));
        if (!mounted) return;
        setCountries(sorted);
        setCountryValue('');
        setLoadingInit(false);
      } catch {
        const fallback = [
          { code: 'NG', dial: '234', name: 'Nigeria' },
          { code: 'US', dial: '1', name: 'United States' },
          { code: 'GB', dial: '44', name: 'United Kingdom' },
        ];
        if (!mounted) return;
        setCountries(fallback);
        setCountryValue('');
        setLoadingInit(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setStateVal('');
  }, [countryCode]);

  function go(n) {
    setStep(n);
    setErr({});
  }

  function validateStep1() {
    const e = {};
    if (!countryValue) e.country = t('err_country_required');
    if (!email.trim() || !isEmail(email.trim())) e.email = t('err_email_invalid');

    const d = digitsOnly(phone);
    if (!d || d.length < 7) e.phone = t('err_phone_invalid');

    if (password.length < 8) e.password = t('err_password_min_8');
    if (!confirm || confirm !== password) e.confirm = t('err_passwords_no_match');
    if (!terms) e.terms = t('err_terms_required');

    setErr(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2Otp() {
    const e = {};
    if (!otp.trim()) e.otp = t('err_otp_required');
    setErr(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e = {};
    if (!fname.trim() || fname.trim().length < 2) e.fname = t('err_first_name_required');
    if (!lname.trim() || lname.trim().length < 2) e.lname = t('err_last_name_required');
    if (!dob) e.dob = t('err_dob_required');
    if (dob) {
      const age = (Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) e.dob = t('err_age_18');
    }
    if (!state) e.state = t('err_state_required');
    if (!gender) e.gender = t('err_gender_required');

    setErr(e);
    return Object.keys(e).length === 0;
  }

  async function requestOtp() {
    setLoading((s) => ({ ...s, otpReq: true }));
    try {
      const res = await API.post('/auth/email-otp/request', { email: email.trim() });
      const data = await res?.json?.().catch(() => ({}));
      if (!res?.ok || !data?.success) throw new Error(data?.message || data?.errors?.[0]?.msg || t('err_unable_to_send_code'));
      go(2);
    } catch (ex) {
      setErr((e) => ({ ...e, toast: ex?.message || t('err_unable_to_send_code') }));
    } finally {
      setLoading((s) => ({ ...s, otpReq: false }));
    }
  }

  async function resendOtp() {
    setLoading((s) => ({ ...s, resend: true }));
    try {
      const res = await API.post('/auth/email-otp/request', { email: email.trim() });
      const data = await res?.json?.().catch(() => ({}));
      if (!res?.ok || !data?.success) throw new Error(data?.message || data?.errors?.[0]?.msg || t('err_unable_to_resend_code'));
    } catch (ex) {
      setErr((e) => ({ ...e, toast: ex?.message || t('err_unable_to_resend_code') }));
    } finally {
      setLoading((s) => ({ ...s, resend: false }));
    }
  }

  async function verifyOtp() {
    if (!validateStep2Otp()) return;

    setLoading((s) => ({ ...s, otpVerify: true }));
    try {
      const res = await API.post('/auth/email-otp/verify', { email: email.trim(), otp: otp.trim() });
      const data = await res?.json?.().catch(() => ({}));
      if (!res?.ok || !data?.success) throw new Error(data?.message || data?.errors?.[0]?.msg || t('err_invalid_code'));
      go(3);
    } catch (ex) {
      setErr((e) => ({ ...e, otp: ex?.message || t('err_invalid_code') }));
    } finally {
      setLoading((s) => ({ ...s, otpVerify: false }));
    }
  }

  async function register() {
    if (!validateStep3()) return;

    setLoading((s) => ({ ...s, register: true }));
    try {
      const [countryCode, dialCode, countryName] = String(countryValue || '').split('|');
      const payload = {
        email: email.trim(),
        phone: `${dialCode ? '+' + dialCode : ''}${digitsOnly(phone)}`,
        password,
        firstName: fname.trim(),
        lastName: lname.trim(),
        dateOfBirth: dob,
        gender,
        state,
        country: countryName || undefined,
        countryCode: countryCode || undefined,
      };

      const res = await API.post('/auth/register', payload);
      const data = await res?.json?.().catch(() => ({}));
      if (!res?.ok || !data?.success) throw new Error(data?.message || data?.errors?.[0]?.msg || t('err_registration_failed'));

      API.setTokens(data.accessToken, data.refreshToken);
      API.setUser(data.user);

      go(4);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1200);
    } catch (ex) {
      setErr((e) => ({ ...e, toast: ex?.message || t('err_something_went_wrong') }));
    } finally {
      setLoading((s) => ({ ...s, register: false }));
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
          </div>
        </div>
      </nav>

      <main className="auth-page" role="main" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 68px)', position: 'relative' }}>
        {loadingInit || loading.otpReq || loading.otpVerify || loading.register || loading.resend ? (
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
              <span>{t('loading')}</span>
            </div>
          </div>
        ) : null}

        <section className="auth-left" aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 3rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 70% 30%, rgba(201,168,76,0.07) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)', backgroundSize: '50px 50px', maskImage: 'radial-gradient(ellipse 90% 80% at 60% 50%, black 0%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 60% 50%, black 0%, transparent 75%)' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 360, width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light))', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#0A0A0A' }}>A</div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.2em', color: 'var(--gold)' }}>AURUM VAULT</div>
            </div>

            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} style={{ display: 'flex', gap: 14, padding: '12px 0', opacity: step === n ? 1 : n < step ? 0.7 : 0.35, transition: 'opacity 0.3s ease' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 999, border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, background: step === n ? 'var(--gold)' : n < step ? 'rgba(201,168,76,0.15)' : 'transparent', color: step === n ? '#0A0A0A' : n < step ? 'var(--gold)' : 'var(--text-2)' }}>{n}</div>
                    <div>
                      <strong style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'var(--text-0)', marginBottom: 2 }}>
                        {n === 1 ? t('signup_step_1_title') : n === 2 ? t('signup_step_2_title') : n === 3 ? t('signup_step_3_title') : t('signup_step_4_title')}
                      </strong>
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
                        {n === 1 ? t('signup_step_1_desc') : n === 2 ? t('signup_step_2_desc') : n === 3 ? t('signup_step_3_desc') : t('signup_step_4_desc')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>✓ {t('signup_benefit_1')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>✓ {t('signup_benefit_2')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>✓ {t('signup_benefit_3')}</div>
            </div>
          </div>
        </section>

        <section className="auth-right" style={{ background: 'var(--bg-0)', padding: '3rem 2.5rem', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 440, paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2.5rem' }}>
              <div style={{ flex: 1, height: 3, background: 'var(--bg-4)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${[0, 25, 50, 75, 100][step]}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))', borderRadius: 2, transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>{t('signup_step_label')} {step > 4 ? 4 : step} {t('signup_of')} 4</div>
            </div>

            {err.toast ? (
              <div style={{ marginBottom: 14, border: '1px solid var(--border-dim)', borderRadius: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', color: 'var(--red)' }}>
                {err.toast}
              </div>
            ) : null}

            {step === 1 ? (
              <>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, marginBottom: 10 }}>{t('signup_title')}</h1>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>{t('signup_subtitle')}</p>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>{t('label_country')}</label>
                  <select disabled={loadingInit} value={countryValue} onChange={(e) => setCountryValue(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.country ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)', opacity: loadingInit ? 0.7 : 1 }}>
                    <option value="">{t('placeholder_select_country')}</option>
                    {countries.map((c) => {
                      const dial = String(c.dial).replace(/[^0-9]/g, '');
                      const val = `${c.code}|${dial}|${c.name}`;
                      return (
                        <option key={val} value={val}>
                          {c.name} (+{c.dial})
                        </option>
                      );
                    })}
                  </select>
                  {err.country ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.country}</div> : null}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>{t('label_email')}</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setErr((x) => ({ ...x, email: !email.trim() || !isEmail(email.trim()) ? t('err_email_invalid') : '' }))} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.email ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  {err.email ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.email}</div> : null}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>{t('label_phone')}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '86px 1fr', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, border: '1px solid var(--border-dim)', background: 'var(--bg-1)', color: 'var(--text-2)' }}>{dialPrefix}</div>
                    <input value={phone} onChange={(e) => setPhone(digitsOnly(e.target.value).slice(0, 11))} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.phone ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  </div>
                  {err.phone ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.phone}</div> : null}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>{t('label_password')}</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.password ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  {err.password ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.password}</div> : null}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>{t('label_confirm_password')}</label>
                  <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.confirm ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  {err.confirm ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.confirm}</div> : null}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                    {t('signup_terms')}
                  </label>
                  {err.terms ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.terms}</div> : null}
                </div>

                <button
                  type="button"
                  className="btn btn-gold"
                  disabled={loadingInit || loading.otpReq}
                  onClick={() => {
                    if (!validateStep1()) return;
                    requestOtp();
                  }}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 16px', borderRadius: 12, fontSize: 15, fontWeight: 600, opacity: loading.otpReq ? 0.7 : 1 }}
                >
                  {loading.otpReq ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span>{t('signup_sending_code')}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-18 0" />
                      </svg>
                    </span>
                  ) : (
                    t('action_continue')
                  )}
                </button>

                <p style={{ marginTop: 16, color: 'var(--text-2)', fontSize: 13 }}>
                  {t('signup_have_account')}{' '}
                  <Link href="/login" style={{ color: 'var(--gold)' }}>{t('action_sign_in')}</Link>
                </p>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, marginBottom: 10 }}>{t('signup_verify_email_title')}</h1>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>
                  {t('signup_otp_sent_to')}{' '}
                  <strong>{email.trim() || t('signup_your_email')}</strong>
                </p>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>{t('label_otp_code')}</label>
                  <input value={otp} onChange={(e) => setOtp(digitsOnly(e.target.value).slice(0, 6))} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.otp ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)', letterSpacing: '0.2em' }} />
                  {err.otp ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.otp}</div> : null}
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => go(1)} style={{ flex: 1, justifyContent: 'center', padding: '14px 16px', borderRadius: 12 }}>
                    {t('action_back')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-gold"
                    disabled={loading.otpVerify}
                    onClick={verifyOtp}
                    style={{ flex: 1, justifyContent: 'center', padding: '14px 16px', borderRadius: 12, fontSize: 15, fontWeight: 600, opacity: loading.otpVerify ? 0.7 : 1 }}
                  >
                    {loading.otpVerify ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <span>{t('signup_verifying')}</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                          <path d="M21 12a9 9 0 1 1-18 0" />
                        </svg>
                      </span>
                    ) : (
                      t('action_verify')
                    )}
                  </button>
                </div>

                <button type="button" disabled={loading.resend} onClick={resendOtp} className="btn" style={{ marginTop: 12, width: '100%', justifyContent: 'center', padding: '12px 16px', borderRadius: 12, background: 'transparent', border: '1px dashed var(--border-dim)', color: 'var(--text-2)', opacity: loading.resend ? 0.6 : 1 }}>
                  {loading.resend ? t('signup_resending') : t('signup_resend_code')}
                </button>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, marginBottom: 10 }}>{t('signup_personal_info_title')}</h1>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>{t('signup_personal_info_subtitle')}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>{t('label_first_name')}</label>
                    <input value={fname} onChange={(e) => setFname(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.fname ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                    {err.fname ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.fname}</div> : null}
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>{t('label_last_name')}</label>
                    <input value={lname} onChange={(e) => setLname(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.lname ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                    {err.lname ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.lname}</div> : null}
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>{t('label_dob')}</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.dob ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  {err.dob ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.dob}</div> : null}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>{t('label_state_residence')}</label>
                  {stateOptions ? (
                    <select value={state} onChange={(e) => setStateVal(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.state ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }}>
                      <option value="">{t('placeholder_select_state')}</option>
                      {stateOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input value={state} onChange={(e) => setStateVal(e.target.value)} placeholder={t('placeholder_enter_state')} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.state ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  )}
                  {err.state ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.state}</div> : null}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 6, color: 'var(--text-2)' }}>{t('label_gender')}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {['male', 'female', 'other'].map((g) => (
                      <label key={g} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-dim)', borderRadius: 999, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-2)' }}>
                        <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} />
                        {t(`gender_${g}`)}
                      </label>
                    ))}
                  </div>
                  {err.gender ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.gender}</div> : null}
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => go(2)} style={{ flex: 1, justifyContent: 'center', padding: '14px 16px', borderRadius: 12 }}>
                    {t('action_back')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-gold"
                    disabled={loading.register}
                    onClick={register}
                    style={{ flex: 1, justifyContent: 'center', padding: '14px 16px', borderRadius: 12, fontSize: 15, fontWeight: 600, opacity: loading.register ? 0.7 : 1 }}
                  >
                    {loading.register ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        <span>{t('signup_creating')}</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                          <path d="M21 12a9 9 0 1 1-18 0" />
                        </svg>
                      </span>
                    ) : (
                      t('signup_create_account')
                    )}
                  </button>
                </div>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, marginBottom: 10 }}>{t('signup_done_title')}</h1>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>{t('signup_done_subtitle')}</p>
              </>
            ) : null}
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
