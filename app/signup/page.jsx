'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import API from '@/src/lib/api';

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function digitsOnly(v) {
  return String(v || '').replace(/\D/g, '');
}

export default function SignupPage() {
  const [step, setStep] = useState(1);

  const [countries, setCountries] = useState([]);
  const [countryValue, setCountryValue] = useState('');
  const dialPrefix = useMemo(() => {
    const parts = String(countryValue || '').split('|');
    return parts[1] ? `+${parts[1]}` : '+';
  }, [countryValue]);

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
      } catch {
        const fallback = [
          { code: 'NG', dial: '234', name: 'Nigeria' },
          { code: 'US', dial: '1', name: 'United States' },
          { code: 'GB', dial: '44', name: 'United Kingdom' },
        ];
        if (!mounted) return;
        setCountries(fallback);
        setCountryValue('');
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  function go(n) {
    setStep(n);
    setErr({});
  }

  function validateStep1() {
    const e = {};
    if (!countryValue) e.country = 'Please select your country';
    if (!email.trim() || !isEmail(email.trim())) e.email = 'Please enter a valid email address';

    const d = digitsOnly(phone);
    if (!d || d.length < 7) e.phone = 'Please enter a valid phone number';

    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!confirm || confirm !== password) e.confirm = 'Passwords do not match';
    if (!terms) e.terms = 'You must accept the Terms of Service to continue';

    setErr(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2Otp() {
    const e = {};
    if (!otp.trim()) e.otp = 'Enter the code sent to your email';
    setErr(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e = {};
    if (!fname.trim() || fname.trim().length < 2) e.fname = 'Please enter your first name';
    if (!lname.trim() || lname.trim().length < 2) e.lname = 'Please enter your last name';
    if (!dob) e.dob = 'Please enter your date of birth';
    if (dob) {
      const age = (Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) e.dob = 'You must be 18 years or older to open an account';
    }
    if (!state) e.state = 'Please select your state of residence';
    if (!gender) e.gender = 'Please select an option';

    setErr(e);
    return Object.keys(e).length === 0;
  }

  async function requestOtp() {
    setLoading((s) => ({ ...s, otpReq: true }));
    try {
      const res = await API.post('/auth/email-otp/request', { email: email.trim() });
      const data = await res?.json?.().catch(() => ({}));
      if (!res?.ok || !data?.success) throw new Error(data?.message || data?.errors?.[0]?.msg || 'Unable to send code');
      go(2);
    } catch (ex) {
      setErr((e) => ({ ...e, toast: ex?.message || 'Unable to send code' }));
    } finally {
      setLoading((s) => ({ ...s, otpReq: false }));
    }
  }

  async function resendOtp() {
    setLoading((s) => ({ ...s, resend: true }));
    try {
      const res = await API.post('/auth/email-otp/request', { email: email.trim() });
      const data = await res?.json?.().catch(() => ({}));
      if (!res?.ok || !data?.success) throw new Error(data?.message || data?.errors?.[0]?.msg || 'Unable to resend code');
    } catch (ex) {
      setErr((e) => ({ ...e, toast: ex?.message || 'Unable to resend code' }));
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
      if (!res?.ok || !data?.success) throw new Error(data?.message || data?.errors?.[0]?.msg || 'Invalid code');
      go(3);
    } catch (ex) {
      setErr((e) => ({ ...e, otp: ex?.message || 'Invalid code' }));
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
      if (!res?.ok || !data?.success) throw new Error(data?.message || data?.errors?.[0]?.msg || 'Registration failed');

      API.setTokens(data.accessToken, data.refreshToken);
      API.setUser(data.user);

      go(4);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1200);
    } catch (ex) {
      setErr((e) => ({ ...e, toast: ex?.message || 'Something went wrong.' }));
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
            <Link className="btn-text" href="/login">Sign In</Link>
          </div>
        </div>
      </nav>

      <main className="auth-page" role="main" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 68px)' }}>
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
                        {n === 1 ? 'Account details' : n === 2 ? 'Email verification' : n === 3 ? 'Personal info' : 'Start investing'}
                      </strong>
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
                        {n === 1 ? 'Country, email, phone' : n === 2 ? 'One-time code' : n === 3 ? 'Name, date of birth' : 'Your vault is ready'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>✓ Fully insured gold storage</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>✓ Real-time pricing</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>✓ Withdraw anytime</div>
            </div>
          </div>
        </section>

        <section className="auth-right" style={{ background: 'var(--bg-0)', padding: '3rem 2.5rem', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 440, paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '2.5rem' }}>
              <div style={{ flex: 1, height: 3, background: 'var(--bg-4)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${[0, 25, 50, 75, 100][step]}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))', borderRadius: 2, transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>Step {step > 4 ? 4 : step} of 4</div>
            </div>

            {err.toast ? (
              <div style={{ marginBottom: 14, border: '1px solid var(--border-dim)', borderRadius: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', color: 'var(--red)' }}>
                {err.toast}
              </div>
            ) : null}

            {step === 1 ? (
              <>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, marginBottom: 10 }}>Create your account</h1>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Open your Aurum Vault account in under 2 minutes.</p>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>Country</label>
                  <select value={countryValue} onChange={(e) => setCountryValue(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.country ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }}>
                    <option value="">Select your country</option>
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
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setErr((x) => ({ ...x, email: !email.trim() || !isEmail(email.trim()) ? 'Please enter a valid email address' : '' }))} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.email ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  {err.email ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.email}</div> : null}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>Phone</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '86px 1fr', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, border: '1px solid var(--border-dim)', background: 'var(--bg-1)', color: 'var(--text-2)' }}>{dialPrefix}</div>
                    <input value={phone} onChange={(e) => setPhone(digitsOnly(e.target.value).slice(0, 11))} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.phone ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  </div>
                  {err.phone ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.phone}</div> : null}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.password ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  {err.password ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.password}</div> : null}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>Confirm password</label>
                  <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.confirm ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  {err.confirm ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.confirm}</div> : null}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-2)' }}>
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                  {err.terms ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.terms}</div> : null}
                </div>

                <button
                  type="button"
                  className="btn btn-gold"
                  disabled={loading.otpReq}
                  onClick={() => {
                    if (!validateStep1()) return;
                    requestOtp();
                  }}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 16px', borderRadius: 12, fontSize: 15, fontWeight: 600, opacity: loading.otpReq ? 0.7 : 1 }}
                >
                  {loading.otpReq ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span>Sending code</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-18 0" />
                      </svg>
                    </span>
                  ) : (
                    'Continue'
                  )}
                </button>

                <p style={{ marginTop: 16, color: 'var(--text-2)', fontSize: 13 }}>
                  Already have an account? <Link href="/login" style={{ color: 'var(--gold)' }}>Sign in</Link>
                </p>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, marginBottom: 10 }}>Verify your email</h1>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>
                  We sent a one-time code to <strong>{email.trim() || 'your email'}</strong>
                </p>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>One-time code</label>
                  <input value={otp} onChange={(e) => setOtp(digitsOnly(e.target.value).slice(0, 6))} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.otp ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)', letterSpacing: '0.2em' }} />
                  {err.otp ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.otp}</div> : null}
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => go(1)} style={{ flex: 1, justifyContent: 'center', padding: '14px 16px', borderRadius: 12 }}>
                    Back
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
                        <span>Verifying</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                          <path d="M21 12a9 9 0 1 1-18 0" />
                        </svg>
                      </span>
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>

                <button type="button" disabled={loading.resend} onClick={resendOtp} className="btn" style={{ marginTop: 12, width: '100%', justifyContent: 'center', padding: '12px 16px', borderRadius: 12, background: 'transparent', border: '1px dashed var(--border-dim)', color: 'var(--text-2)', opacity: loading.resend ? 0.6 : 1 }}>
                  {loading.resend ? 'Resending…' : 'Resend code'}
                </button>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, marginBottom: 10 }}>Personal information</h1>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Tell us a bit about yourself.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>First name</label>
                    <input value={fname} onChange={(e) => setFname(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.fname ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                    {err.fname ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.fname}</div> : null}
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>Last name</label>
                    <input value={lname} onChange={(e) => setLname(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.lname ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                    {err.lname ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.lname}</div> : null}
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>Date of birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.dob ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }} />
                  {err.dob ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.dob}</div> : null}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', marginBottom: 6, color: 'var(--text-2)' }}>State of residence</label>
                  <select value={state} onChange={(e) => setStateVal(e.target.value)} style={{ width: '100%', padding: '12px 12px', borderRadius: 12, border: `1px solid ${err.state ? 'rgba(224,82,82,0.5)' : 'var(--border-dim)'}`, background: 'var(--bg-1)', color: 'var(--text-0)' }}>
                    <option value="">Select your state</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Kano">Kano</option>
                  </select>
                  {err.state ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.state}</div> : null}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 6, color: 'var(--text-2)' }}>Gender</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {['male', 'female', 'other'].map((g) => (
                      <label key={g} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-dim)', borderRadius: 999, padding: '10px 12px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-2)' }}>
                        <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} />
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </label>
                    ))}
                  </div>
                  {err.gender ? <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{err.gender}</div> : null}
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => go(2)} style={{ flex: 1, justifyContent: 'center', padding: '14px 16px', borderRadius: 12 }}>
                    Back
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
                        <span>Creating</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                          <path d="M21 12a9 9 0 1 1-18 0" />
                        </svg>
                      </span>
                    ) : (
                      'Create account'
                    )}
                  </button>
                </div>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 400, marginBottom: 10 }}>Your vault is ready</h1>
                <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Redirecting you to your dashboard…</p>
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
