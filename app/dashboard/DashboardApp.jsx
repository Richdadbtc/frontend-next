'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import API from '@/src/lib/api';

function computeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function fmtMoney(n) {
  const v = Number(n || 0);
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

function fmtGrams(n) {
  return `${Number(n || 0).toFixed(4)} g`;
}

function getDisplayName(user) {
  if (!user) return '—';
  const first = String(user.firstName || '').trim();
  const last = String(user.lastName || '').trim();
  const full = `${first} ${last}`.trim();
  if (full) return full;
  if (first) return first;
  if (last) return last;
  return String(user.email || '—');
}

const ALLOWED_TABS = new Set(['portfolio', 'buy', 'sell', 'transactions', 'autoinvest', 'profile', 'support']);

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo (Republic of the)' },
  { code: 'CD', name: 'Congo (Democratic Republic of the)' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Côte d’Ivoire" },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czechia' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];

const CRYPTO_PAYMENTS = {
  BTC: { network: 'Bitcoin', address: 'bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  USDT: { network: 'USDT (TRC20)', address: 'Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
};

function tabFromPath(pathname) {
  const p = String(pathname || '');
  const raw = p.replace(/^\/dashboard\/?/i, '').replace(/^\//, '');
  const seg = raw.split('/')[0] || '';
  const tab = seg ? seg.toLowerCase() : 'portfolio';
  return ALLOWED_TABS.has(tab) ? tab : 'portfolio';
}

export default function DashboardApp() {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = useMemo(() => tabFromPath(pathname), [pathname]);
  const greeting = useMemo(() => computeGreeting(), []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [name, setName] = useState('—');
  const [walletBal, setWalletBal] = useState(fmtMoney(0));

  const [pricePerGram, setPricePerGram] = useState(0);
  const [kycVerified, setKycVerified] = useState(false);

  const [portValue, setPortValue] = useState(fmtMoney(0));
  const [portPnl, setPortPnl] = useState('—');
  const [portGrams, setPortGrams] = useState(fmtGrams(0));
  const [portAvg, setPortAvg] = useState('Avg $0/g');
  const [portInvested, setPortInvested] = useState(fmtMoney(0));

  const [priceOz, setPriceOz] = useState(fmtMoney(0));
  const [priceGram, setPriceGram] = useState('$0/g');

  const [recentTx, setRecentTx] = useState([]);

  const [buyMode, setBuyMode] = useState('usd');
  const [buyAmount, setBuyAmount] = useState('');
  const [buyHint, setBuyHint] = useState('');
  const [buyError, setBuyError] = useState('');

  const [sellGrams, setSellGrams] = useState('');
  const [sellHint, setSellHint] = useState('');
  const [sellError, setSellError] = useState('');
  const [sellAvailable, setSellAvailable] = useState(fmtGrams(0));

  const [txRows, setTxRows] = useState([]);
  const [txPage, setTxPage] = useState(1);
  const [txPages, setTxPages] = useState(1);
  const [txType, setTxType] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [txFrom, setTxFrom] = useState('');
  const [txTo, setTxTo] = useState('');
  const [txError, setTxError] = useState('');

  const [pfFname, setPfFname] = useState('');
  const [pfLname, setPfLname] = useState('');
  const [pfState, setPfState] = useState('');
  const [profileEmail, setProfileEmail] = useState('—');
  const [profileAvatar, setProfileAvatar] = useState('A');
  const [kycBadge, setKycBadge] = useState('KYC Pending');
  const [kycTierDisplay, setKycTierDisplay] = useState('Tier 0 — Unverified');
  const [kycStatusDesc, setKycStatusDesc] = useState('Submit your ID or Driver liceince to start buying gold.');
  const [profileMsg, setProfileMsg] = useState('');

  const [kycBvn, setKycBvn] = useState('');
  const [kycNin, setKycNin] = useState('');
  const [kycIdType, setKycIdType] = useState('');
  const [kycMsg, setKycMsg] = useState('');

  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiAmount, setAiAmount] = useState('');
  const [aiFrequency, setAiFrequency] = useState('daily');
  const [aiNextRun, setAiNextRun] = useState('');
  const [aiMsg, setAiMsg] = useState('');

  const [supportMessages, setSupportMessages] = useState([]);
  const [supportInput, setSupportInput] = useState('');
  const [supportMsg, setSupportMsg] = useState('');

  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositError, setDepositError] = useState('');
  const [payOptionOpen, setPayOptionOpen] = useState(false);
  const [payOptionError, setPayOptionError] = useState('');

  const [bankCountryOpen, setBankCountryOpen] = useState(false);
  const [bankCountry, setBankCountry] = useState('');
  const [bankCountryError, setBankCountryError] = useState('');
  const [generatingOpen, setGeneratingOpen] = useState(false);
  const [generatingDoneOpen, setGeneratingDoneOpen] = useState(false);
  const generatingTimerRef = useRef(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('Confirm');
  const [confirmBody, setConfirmBody] = useState(null);
  const confirmActionRef = useRef(null);

  const pollTimersRef = useRef({ price: null, support: null });

  useEffect(() => {
    return () => {
      if (generatingTimerRef.current) clearTimeout(generatingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('dashboard-body');
    return () => {
      document.body.classList.remove('dashboard-body');
    };
  }, []);

  function updateBuyPreview(nextAmount = buyAmount, nextMode = buyMode, nextPricePerGram = pricePerGram, nextKyc = kycVerified) {
    const v = parseFloat(String(nextAmount || ''));
    const valid = !!(v && v > 0);
    if (!nextKyc) {
      setBuyHint('Complete KYC to buy gold');
      return;
    }

    let usdAmount = 0;
    let grams = 0;
    if (nextMode === 'usd') {
      usdAmount = valid ? v : 0;
      grams = nextPricePerGram > 0 ? usdAmount / nextPricePerGram : 0;
      setBuyHint(`≈ ${grams.toFixed(4)} grams`);
    } else {
      grams = valid ? v : 0;
      usdAmount = nextPricePerGram > 0 ? grams * nextPricePerGram : 0;
      setBuyHint(`≈ ${fmtMoney(usdAmount)}`);
    }
  }

  function updateSellPreview(nextGrams = sellGrams, nextPricePerGram = pricePerGram) {
    const grams = parseFloat(String(nextGrams || ''));
    const ok = !!(grams && grams > 0);
    const proceeds = ok ? grams * (nextPricePerGram || 0) * 0.985 : 0;
    setSellHint(ok ? `≈ ${fmtMoney(proceeds)}` : '≈ $0.00');
  }

  function openConfirm({ title, body, onConfirm }) {
    setConfirmTitle(title || 'Confirm');
    setConfirmBody(body || null);
    confirmActionRef.current = onConfirm || null;
    setConfirmOpen(true);
  }

  async function loadDashboard() {
    const res = await API.get('/user/dashboard');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load dashboard');

    setWalletBal(fmtMoney(data?.portfolio?.walletBalance));
    setPortValue(fmtMoney(data?.portfolio?.currentValue));

    const pnl = Number(data?.portfolio?.pnl || 0);
    const pnlPct = Number(data?.portfolio?.pnlPct || 0);
    setPortPnl(`${pnl >= 0 ? '▲' : '▼'} ${fmtMoney(Math.abs(pnl))} (${pnlPct.toFixed(2)}%)`);

    setPortGrams(fmtGrams(data?.portfolio?.gramsHeld));
    setPortAvg(`Avg ${fmtMoney(data?.portfolio?.averageBuyPrice)}/g`);
    setPortInvested(fmtMoney(data?.portfolio?.totalInvested));

    setPriceOz(fmtMoney(data?.price?.xauUsd));
    setPriceGram(`${fmtMoney(data?.price?.perGram)}/g`);

    const pg = Number(data?.price?.perGram || 0);
    setPricePerGram(pg);
    setSellAvailable(fmtGrams(data?.portfolio?.gramsHeld));

    setRecentTx(Array.isArray(data?.recentTransactions) ? data.recentTransactions : []);
    updateBuyPreview(buyAmount, buyMode, pg, kycVerified);
    updateSellPreview(sellGrams, pg);
  }

  async function doConfirm() {
    const fn = confirmActionRef.current;
    if (!fn) {
      setConfirmOpen(false);
      return;
    }
    await fn();
    setConfirmOpen(false);
  }

  async function loadProfile() {
    const res = await API.get('/user/me');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success || !data?.user) throw new Error(data?.message || 'Unable to load profile');
    API.setUser(data.user);

    setProfileEmail(data.user.email || '—');
    setName(getDisplayName(data.user));
    setPfFname(data.user.firstName || '');
    setPfLname(data.user.lastName || '');
    setPfState(data.user.state || '');

    const letter = (data.user.firstName || data.user.email || 'A').slice(0, 1).toUpperCase();
    setProfileAvatar(letter);

    const verified = data.user.kycStatus === 'verified';
    setKycVerified(verified);
    setKycBadge(verified ? `KYC Tier ${data.user.kycTier}` : `KYC ${data.user.kycStatus}`);
    setKycTierDisplay(`Tier ${data.user.kycTier} — ${verified ? 'Verified' : 'Unverified'}`);
    setKycStatusDesc(verified ? 'You can buy gold instantly.' : 'Submit your ID or Driver liceince to start buying gold.');
    updateBuyPreview(buyAmount, buyMode, pricePerGram, verified);
  }

  async function saveProfile() {
    setProfileMsg('');
    const res = await API.put('/user/me', {
      firstName: pfFname.trim(),
      lastName: pfLname.trim(),
      state: pfState,
    });
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Update failed');
    API.setUser(data.user);
    setProfileMsg('Saved');
    await loadProfile();
  }

  async function submitKyc() {
    setKycMsg('');
    const bvn = String(kycBvn || '').replace(/\D/g, '');
    const nin = String(kycNin || '').replace(/\D/g, '');
    const res = await API.post('/kyc/submit', { bvn: bvn || undefined, nin: nin || undefined, idType: kycIdType || undefined });
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'KYC submission failed');
    setKycMsg('Submitted. Refreshing status…');
    setTimeout(() => {
      loadProfile().catch(() => {});
    }, 1500);
  }

  async function loadAutoInvest() {
    const res = await API.get('/user/auto-invest');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load auto-invest');
    const ai = data.autoInvest || {};
    setAiEnabled(!!ai.enabled);
    setAiAmount(ai.amount ? String(ai.amount) : '');
    setAiFrequency(ai.frequency || 'daily');
    setAiNextRun(ai.nextRun ? new Date(ai.nextRun).toLocaleString() : '');
  }

  async function saveAutoInvest() {
    setAiMsg('');
    const res = await API.put('/user/auto-invest', {
      enabled: !!aiEnabled,
      amount: parseFloat(aiAmount) || 0,
      frequency: aiFrequency,
    });
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Save failed');
    setAiMsg('Saved');
    await loadAutoInvest();
  }

  async function loadSupportMessages({ silent = false } = {}) {
    setSupportMsg('');
    const res = await API.get('/support/messages?limit=100');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) {
      if (!silent) throw new Error(data?.message || 'Unable to load support messages');
      return;
    }
    setSupportMessages(Array.isArray(data?.messages) ? data.messages : []);
  }

  async function sendSupportMessage() {
    setSupportMsg('');
    const text = String(supportInput || '').trim();
    if (!text) return;
    const res = await API.post('/support/messages', { message: text });
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Message failed');
    setSupportInput('');
    await loadSupportMessages({ silent: true });
  }

  async function loadTransactions(page = 1) {
    setTxError('');
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '20');
    if (txType) params.set('type', txType);
    if (txStatus) params.set('status', txStatus);
    if (txFrom) params.set('from', txFrom);
    if (txTo) params.set('to', txTo);
    const res = await API.get(`/user/transactions?${params.toString()}`);
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load transactions');
    setTxRows(Array.isArray(data?.transactions) ? data.transactions : []);
    setTxPage(Number(data?.pagination?.page || page));
    setTxPages(Number(data?.pagination?.pages || 1));
  }

  async function pollPrice() {
    const res = await API.get('/gold/price');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) return;
    setPriceOz(fmtMoney(data.price?.xauUsd));
    setPriceGram(`${fmtMoney(data.price?.perGram)}/g`);
    const pg = Number(data.price?.perGram || 0);
    setPricePerGram(pg);
    updateBuyPreview(buyAmount, buyMode, pg, kycVerified);
    updateSellPreview(sellGrams, pg);
  }

  async function onBuy() {
    setBuyError('');
    if (!kycVerified) {
      setBuyError('KYC verification required before buying');
      return;
    }
    const inputVal = parseFloat(String(buyAmount || ''));
    if (!inputVal || inputVal <= 0) {
      setBuyError('Enter a valid amount');
      return;
    }
    const perGram = pricePerGram || 0;
    if (!perGram) {
      setBuyError('Live price unavailable. Please try again.');
      return;
    }
    const usdAmount = buyMode === 'usd' ? inputVal : inputVal * perGram;
    const grams = usdAmount / perGram;
    const fee = usdAmount * 0.015;
    const total = usdAmount + fee;

    openConfirm({
      title: 'Confirm purchase',
      body: (
        <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Gold amount</span><strong>{fmtMoney(usdAmount)}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Estimated grams</span><strong>{grams.toFixed(4)} g</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fee (1.5%)</span><strong>{fmtMoney(fee)}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total charged</span><strong>{fmtMoney(total)}</strong></div>
        </div>
      ),
      onConfirm: async () => {
        const res = await API.post('/gold/buy', { amount: usdAmount });
        const data = await res?.json?.().catch(() => ({}));
        if (!res?.ok || !data?.success) throw new Error(data?.message || 'Buy failed');
        await loadDashboard();
        await loadTransactions(1);
      },
    });
  }

  async function onSell() {
    setSellError('');
    const grams = parseFloat(String(sellGrams || ''));
    if (!grams || grams <= 0) {
      setSellError('Enter a valid grams amount');
      return;
    }
    const perGram = pricePerGram || 0;
    const gross = grams * perGram;
    const fee = gross * 0.015;
    const net = gross - fee;

    openConfirm({
      title: 'Confirm sale',
      body: (
        <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Grams to sell</span><strong>{grams.toFixed(4)} g</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Gross proceeds</span><strong>{fmtMoney(gross)}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fee (1.5%)</span><strong>{fmtMoney(fee)}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Net to wallet</span><strong>{fmtMoney(net)}</strong></div>
        </div>
      ),
      onConfirm: async () => {
        const res = await API.post('/gold/sell', { grams });
        const data = await res?.json?.().catch(() => ({}));
        if (!res?.ok || !data?.success) throw new Error(data?.message || 'Sell failed');
        await loadDashboard();
        await loadTransactions(1);
      },
    });
  }

  async function onDeposit() {
    setDepositError('');
    const amount = parseFloat(String(depositAmount || ''));
    if (!amount || amount < 1) {
      setDepositError('Enter a valid amount');
      return;
    }
    const res = await API.post('/payment/initiate', { amount });
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to initiate payment');
    window.location.href = data.authorizationUrl;
  }

  function onDepositContinue() {
    setDepositError('');
    setPayOptionError('');
    const amount = parseFloat(String(depositAmount || ''));
    if (!amount || amount < 1) {
      setDepositError('Enter a valid amount');
      return;
    }
    setDepositOpen(false);
    setPayOptionOpen(true);
  }

  function startBankTransferFlow() {
    setPayOptionError('');
    setBankCountry('');
    setBankCountryError('');
    setPayOptionOpen(false);
    setBankCountryOpen(true);
  }

  function beginGeneratingAccount() {
    if (!bankCountry) {
      setBankCountryError('Select a country');
      return;
    }
    setBankCountryError('');
    setBankCountryOpen(false);
    setGeneratingDoneOpen(false);
    setGeneratingOpen(true);

    if (generatingTimerRef.current) clearTimeout(generatingTimerRef.current);
    generatingTimerRef.current = setTimeout(() => {
      setGeneratingOpen(false);
      setGeneratingDoneOpen(true);
    }, 5000);
  }

  useEffect(() => {
    const me = API.getUser();
    setName(getDisplayName(me));

    let t;

    const init = async () => {
      await loadDashboard().catch(() => {});
      await loadProfile().catch(() => {});
      await loadAutoInvest().catch(() => {});
      await loadTransactions(1).catch(() => {});
      await loadSupportMessages({ silent: true }).catch(() => {});

      await pollPrice().catch(() => {});

      pollTimersRef.current.price = window.setInterval(() => pollPrice().catch(() => {}), 60_000);
      pollTimersRef.current.support = window.setInterval(() => loadSupportMessages({ silent: true }).catch(() => {}), 8000);
    };

    init();

    t = window.setInterval(() => loadDashboard().catch(() => {}), 60_000);
    return () => {
      window.clearInterval(t);
      if (pollTimersRef.current.price) window.clearInterval(pollTimersRef.current.price);
      if (pollTimersRef.current.support) window.clearInterval(pollTimersRef.current.support);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth > 980) return;
    if (!sidebarOpen) return;

    const onDoc = (e) => {
      const sidebar = document.getElementById('sidebar');
      const toggle = document.getElementById('menu-toggle');
      const t = e.target;
      if (sidebar?.contains(t) || toggle?.contains(t)) return;
      setSidebarOpen(false);
    };

    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [sidebarOpen]);

  const linkClass = (tab) => (activeTab === tab ? 'sb-link active' : 'sb-link');

  return (
    <>
      <div className={sidebarOpen ? 'sidebar-backdrop active' : 'sidebar-backdrop'} onClick={() => setSidebarOpen(false)} />

      <aside className={sidebarOpen ? 'sidebar open' : 'sidebar'} id="sidebar">
        <Link href="/" className="sb-logo nav-logo" aria-label="Aurum Vault home">
          <div className="hex" aria-hidden="true">A</div>
          AURUM VAULT
        </Link>
        <nav className="sb-nav">
          <Link href="/dashboard" className={linkClass('portfolio')}>Portfolio</Link>
          <Link href="/dashboard/buy" className={linkClass('buy')}>Buy Gold</Link>
          <Link href="/dashboard/sell" className={linkClass('sell')}>Sell Gold</Link>
          <Link href="/dashboard/transactions" className={linkClass('transactions')}>Transactions</Link>
          <Link href="/dashboard/autoinvest" className={linkClass('autoinvest')}>Auto-Invest</Link>
          <Link href="/dashboard/profile" className={linkClass('profile')}>Profile & KYC</Link>
          <Link href="/dashboard/support" className={linkClass('support')}>Support</Link>
        </nav>
        <button className="sb-signout" onClick={() => API.logout()}>Sign Out</button>
      </aside>

      <div className="main-wrap">
        <header className="topbar">
          <button className="hamburger-dash" id="menu-toggle" aria-label="Toggle menu" onClick={() => setSidebarOpen((v) => !v)}>
            <span></span><span></span><span></span>
          </button>
          <div className="tb-greeting">{greeting}, {name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="wallet-chip"><span>{walletBal}</span></div>
            <button className="btn-deposit" onClick={() => setDepositOpen(true)}>+ Deposit</button>
          </div>
        </header>

        <section className={activeTab === 'portfolio' ? 'tab-panel active' : 'tab-panel'}>
          <div className="page-title">Portfolio</div>

          <div className="stats-grid">
            <div className="stat-card gold-border">
              <div className="sc-label">Total Value</div>
              <div className="sc-value">{portValue}</div>
              <div className="sc-change">{portPnl}</div>
            </div>
            <div className="stat-card">
              <div className="sc-label">Gold Held</div>
              <div className="sc-value">{portGrams}</div>
              <div className="sc-change">{portAvg}</div>
            </div>
            <div className="stat-card">
              <div className="sc-label">Total Invested</div>
              <div className="sc-value">{portInvested}</div>
              <div className="sc-change">All-time return</div>
            </div>
            <div className="stat-card">
              <div className="sc-label">XAU / USD <span className="live-dot"></span></div>
              <div className="sc-value">{priceOz}</div>
              <div className="sc-change">{priceGram}</div>
            </div>
          </div>

          <div className="section-heading">Recent Transactions</div>
          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead><tr><th>Type</th><th>Amount</th><th>Grams</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentTx.length ? recentTx.map((t) => (
                  <tr key={t._id || `${t.type}-${t.createdAt}`}>
                    <td>{t.type}</td>
                    <td>{fmtMoney(t.amount)}</td>
                    <td>{t.gramsGold ? Number(t.gramsGold).toFixed(4) : '—'}</td>
                    <td>{t.status}</td>
                    <td>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="empty-row">No transactions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={activeTab === 'buy' ? 'tab-panel active' : 'tab-panel'}>
          <div className="page-title">Buy Gold</div>
          <div className="trade-layout">
            <div className="trade-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, paddingBottom: 12, borderBottom: '1px solid var(--border-dim)', marginBottom: 12 }}>
                <div>
                  <div className="sc-label">Live price</div>
                  <div className="sc-value" style={{ fontSize: 20 }}>{fmtMoney(pricePerGram)} / gram</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button className={buyMode === 'usd' ? 'btn-action gold' : 'btn-action'} style={{ height: 40 }} onClick={() => { setBuyMode('usd'); updateBuyPreview(buyAmount, 'usd'); }}>USD $</button>
                <button className={buyMode === 'grams' ? 'btn-action gold' : 'btn-action'} style={{ height: 40 }} onClick={() => { setBuyMode('grams'); updateBuyPreview(buyAmount, 'grams'); }}>Grams g</button>
              </div>

              <div className="form-group">
                <label className="form-label">Amount ({buyMode === 'usd' ? 'USD' : 'grams'})</label>
                <div className="input-wrap">
                  <span className="input-pre">{buyMode === 'usd' ? '$' : 'g'}</span>
                  <input
                    className="form-input"
                    value={buyAmount}
                    onChange={(e) => {
                      setBuyAmount(e.target.value);
                      updateBuyPreview(e.target.value);
                    }}
                    placeholder={buyMode === 'usd' ? '100.00' : '0.5000'}
                    inputMode="decimal"
                  />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>{buyHint}</div>
              </div>

              {!kycVerified ? (
                <div style={{ border: '1px solid rgba(201,168,76,0.22)', background: 'rgba(201,168,76,0.06)', color: 'var(--text-1)', borderRadius: 12, padding: '10px 12px', fontSize: 13, margin: '12px 0' }}>
                  KYC verification required before buying. Go to{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); router.push('/dashboard/profile'); }}>Profile &amp; KYC</a> to verify.
                </div>
              ) : null}

              <button className="btn-action gold" onClick={onBuy} disabled={!kycVerified}>Buy Gold</button>
              {buyError ? <div style={{ marginTop: 10, fontSize: 13, color: 'var(--red)' }}>{buyError}</div> : null}
            </div>

            <div className="info-card">
              <div className="sc-label">Fee</div>
              <div className="sc-change">1.5% flat per trade</div>
              <div className="section-heading">Notes</div>
              <div className="sc-change">Minimum purchase: $10 · Price refreshes every minute</div>
            </div>
          </div>
        </section>

        <section className={activeTab === 'sell' ? 'tab-panel active' : 'tab-panel'}>
          <div className="page-title">Sell Gold</div>
          <div className="trade-layout">
            <div className="trade-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, paddingBottom: 12, borderBottom: '1px solid var(--border-dim)', marginBottom: 12 }}>
                <div>
                  <div className="sc-label">Buyback price</div>
                  <div className="sc-value" style={{ fontSize: 20 }}>{fmtMoney(Number(pricePerGram || 0) * 0.985)} / gram</div>
                </div>
                <div className="sc-label" style={{ textAlign: 'right' }}>Available: <strong>{sellAvailable}</strong></div>
              </div>

              <div className="form-group">
                <label className="form-label">Grams to sell</label>
                <div className="input-wrap">
                  <span className="input-pre">g</span>
                  <input
                    className="form-input"
                    value={sellGrams}
                    onChange={(e) => {
                      setSellGrams(e.target.value);
                      updateSellPreview(e.target.value);
                    }}
                    placeholder="0.5000"
                    inputMode="decimal"
                  />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>{sellHint}</div>
              </div>

              <button className="btn-action" onClick={onSell}>Sell Gold</button>
              {sellError ? <div style={{ marginTop: 10, fontSize: 13, color: 'var(--red)' }}>{sellError}</div> : null}
            </div>

            <div className="info-card">
              <div className="sc-label">Fee</div>
              <div className="sc-change">1.5% flat per trade</div>
            </div>
          </div>
        </section>

        <section className={activeTab === 'transactions' ? 'tab-panel active' : 'tab-panel'}>
          <div className="page-title">Transactions</div>
          <div className="stat-card" style={{ marginBottom: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
              <div>
                <div className="sc-label">Type</div>
                <select className="form-input" value={txType} onChange={(e) => setTxType(e.target.value)} style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }}>
                  <option value="">All</option>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdraw">Withdraw</option>
                </select>
              </div>
              <div>
                <div className="sc-label">Status</div>
                <select className="form-input" value={txStatus} onChange={(e) => setTxStatus(e.target.value)} style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }}>
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <div className="sc-label">From</div>
                <input className="form-input" type="date" value={txFrom} onChange={(e) => setTxFrom(e.target.value)} style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }} />
              </div>
              <div>
                <div className="sc-label">To</div>
                <input className="form-input" type="date" value={txTo} onChange={(e) => setTxTo(e.target.value)} style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }} />
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn-action" style={{ width: 'auto', padding: '0 14px', height: 40 }} onClick={() => loadTransactions(1).catch((e) => setTxError(e.message))}>Apply filters</button>
              <button className="btn-action" style={{ width: 'auto', padding: '0 14px', height: 40 }} onClick={() => setDepositOpen(true)}>Deposit</button>
            </div>
            {txError ? <div style={{ marginTop: 10, fontSize: 13, color: 'var(--red)' }}>{txError}</div> : null}
          </div>

          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead><tr><th>Type</th><th>Amount</th><th>Grams</th><th>Fee</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {txRows.length ? txRows.map((t) => (
                  <tr key={t._id || `${t.type}-${t.createdAt}`}>
                    <td>{t.type}</td>
                    <td>{fmtMoney(t.amount)}</td>
                    <td>{t.gramsGold ? Number(t.gramsGold).toFixed(4) : '—'}</td>
                    <td>{fmtMoney(t.fee || 0)}</td>
                    <td>{t.status}</td>
                    <td>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="empty-row">No transactions</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {txPages > 1 ? (
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Array.from({ length: txPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={p === txPage ? 'btn-action gold' : 'btn-action'}
                  style={{ width: 'auto', padding: '0 12px', height: 38 }}
                  onClick={() => loadTransactions(p).catch((e) => setTxError(e.message))}
                >
                  {p}
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className={activeTab === 'autoinvest' ? 'tab-panel active' : 'tab-panel'}>
          <div className="page-title">Auto-Invest</div>
          <div className="stat-card">
            <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-1)' }}>
                <input type="checkbox" checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />
                Enable auto-invest
              </label>
              <div>
                <div className="sc-label">Amount (USD)</div>
                <input className="form-input" value={aiAmount} onChange={(e) => setAiAmount(e.target.value)} inputMode="decimal" style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }} />
              </div>
              <div>
                <div className="sc-label">Frequency</div>
                <select className="form-input" value={aiFrequency} onChange={(e) => setAiFrequency(e.target.value)} style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <button className="btn-action" onClick={() => saveAutoInvest().catch((e) => setAiMsg(e.message))}>Save</button>
              {aiMsg ? <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{aiMsg}</div> : null}
              {aiNextRun ? <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Next run: {aiNextRun}</div> : null}
            </div>
          </div>
        </section>

        <section className={activeTab === 'profile' ? 'tab-panel active' : 'tab-panel'}>
          <div className="page-title">Profile &amp; KYC</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="profile-card">
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, display: 'grid', placeItems: 'center', border: '1px solid var(--border-gold)', background: 'rgba(201,168,76,0.08)', color: 'var(--gold)', fontWeight: 800 }}>
                  {profileAvatar}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-0)' }}>{name}</div>
                  <div style={{ color: 'var(--text-2)', fontSize: 13 }}>{profileEmail}</div>
                </div>
              </div>

              <div className="stat-card" style={{ padding: 12 }}>
                <div className="sc-label">KYC</div>
                <div style={{ color: 'var(--text-0)', fontSize: 14, marginTop: 4 }}>{kycBadge}</div>
                <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 6 }}>{kycTierDisplay}</div>
                <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 6 }}>{kycStatusDesc}</div>
              </div>
            </div>

            <div className="profile-form-card">
              <div className="section-heading">Personal Info</div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div>
                  <div className="sc-label">First Name</div>
                  <input className="form-input" value={pfFname} onChange={(e) => setPfFname(e.target.value)} style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }} />
                </div>
                <div>
                  <div className="sc-label">Last Name</div>
                  <input className="form-input" value={pfLname} onChange={(e) => setPfLname(e.target.value)} style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }} />
                </div>
                <div>
                  <div className="sc-label">State</div>
                  <input className="form-input" value={pfState} onChange={(e) => setPfState(e.target.value)} style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }} />
                </div>
                <button className="btn-action" onClick={() => saveProfile().catch((e) => setProfileMsg(e.message))}>Save Profile</button>
                {profileMsg ? <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{profileMsg}</div> : null}
              </div>

              <div className="section-heading">KYC Submission</div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div>
                  <div className="sc-label">BVN</div>
                  <input className="form-input" value={kycBvn} onChange={(e) => setKycBvn(e.target.value)} inputMode="numeric" style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }} />
                </div>
                <div>
                  <div className="sc-label">NIN</div>
                  <input className="form-input" value={kycNin} onChange={(e) => setKycNin(e.target.value)} inputMode="numeric" style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }} />
                </div>
                <div>
                  <div className="sc-label">ID Type</div>
                  <select className="form-input" value={kycIdType} onChange={(e) => setKycIdType(e.target.value)} style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }}>
                    <option value="">Select</option>
                    <option value="bvn">BVN</option>
                    <option value="nin">NIN</option>
                    <option value="passport">International Passport</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>
                </div>
                <button className="btn-action gold" onClick={() => submitKyc().catch((e) => setKycMsg(e.message))}>Submit KYC</button>
                {kycMsg ? <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{kycMsg}</div> : null}
              </div>
            </div>
          </div>
        </section>

        <section className={activeTab === 'support' ? 'tab-panel active' : 'tab-panel'}>
          <div className="page-title">Support</div>
          <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 16, borderBottom: '1px solid var(--border-dim)' }}>
              <div className="sc-label">Messages</div>
              <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 6 }}>We usually reply within a few minutes.</div>
            </div>
            <div style={{ padding: 16, display: 'grid', gap: 10 }}>
              <div style={{ maxHeight: 360, overflow: 'auto', display: 'grid', gap: 10 }}>
                {!supportMessages.length ? (
                  <div className="empty-row">No messages yet</div>
                ) : (
                  supportMessages.map((m) => {
                    const meUser = API.getUser();
                    const mine = m.senderRole === 'user' && String(m.senderId || '') === String(meUser?._id || '');
                    const who = m.senderRole === 'admin' ? 'Admin' : m.senderRole === 'bot' ? 'Aurum Bot' : 'You';
                    return (
                      <div key={m._id || `${m.senderRole}-${m.createdAt}`} style={{ justifySelf: mine ? 'end' : 'start', maxWidth: '85%' }}>
                        <div style={{ padding: '10px 12px', borderRadius: 14, border: '1px solid var(--border-dim)', background: mine ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)', color: 'var(--text-1)' }}>
                          {m.message}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-3)' }}>
                          {who} · {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input className="form-input" value={supportInput} onChange={(e) => setSupportInput(e.target.value)} placeholder="Type your message" style={{ border: '1px solid var(--border-dim)', borderRadius: 12, height: 44, padding: '0 12px' }} onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendSupportMessage().catch((err) => setSupportMsg(err.message));
                  }
                }} />
                <button className="btn-action gold" style={{ width: 140 }} onClick={() => sendSupportMessage().catch((err) => setSupportMsg(err.message))}>Send</button>
              </div>
              {supportMsg ? <div style={{ fontSize: 13, color: 'var(--red)' }}>{supportMsg}</div> : null}
            </div>
          </div>
        </section>
      </div>

      {depositOpen ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 70, display: 'grid', placeItems: 'center', padding: 16 }} onClick={() => setDepositOpen(false)}>
          <div style={{ width: 'min(520px, 100%)', background: 'rgba(17,17,17,0.9)', border: '1px solid var(--border-dim)', borderRadius: 18, padding: 16 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-0)' }}>Deposit</div>
              <button className="btn-action" style={{ width: 'auto', padding: '0 12px', height: 36 }} onClick={() => setDepositOpen(false)}>Close</button>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (USD)</label>
              <div className="input-wrap">
                <span className="input-pre">$</span>
                <input className="form-input" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="50.00" inputMode="decimal" />
              </div>
            </div>

            <button className="btn-action gold" onClick={onDepositContinue}>Continue</button>
            {depositError ? <div style={{ marginTop: 10, fontSize: 13, color: 'var(--red)' }}>{depositError}</div> : null}
          </div>
        </div>
      ) : null}

      {payOptionOpen ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 75, display: 'grid', placeItems: 'center', padding: 16 }} onClick={() => setPayOptionOpen(false)}>
          <div style={{ width: 'min(560px, 100%)', background: 'rgba(17,17,17,0.9)', border: '1px solid var(--border-dim)', borderRadius: 18, padding: 16 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-0)' }}>Choose payment option</div>
              <button className="btn-action" style={{ width: 'auto', padding: '0 12px', height: 36 }} onClick={() => setPayOptionOpen(false)}>Close</button>
            </div>

            <div style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 12 }}>
              Deposit amount: <strong style={{ color: 'var(--text-0)' }}>{fmtMoney(parseFloat(String(depositAmount || '0')) || 0)}</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              <button
                className="btn-action"
                onClick={() => setPayOptionError('BTC deposits are coming soon. Please use Bank Transfer for now.')}
                style={{ height: 56 }}
              >
                BTC
              </button>
              <button
                className="btn-action"
                onClick={() => setPayOptionError('USDT deposits are coming soon. Please use Bank Transfer for now.')}
                style={{ height: 56 }}
              >
                USDT
              </button>
              <button
                className="btn-action gold"
                onClick={() => {
                  startBankTransferFlow();
                }}
                style={{ height: 56 }}
              >
                Bank Transfer
              </button>
            </div>

            {payOptionError ? <div style={{ marginTop: 12, fontSize: 13, color: 'var(--red)' }}>{payOptionError}</div> : null}

            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <button className="btn-action" style={{ width: 'auto', padding: '0 14px', height: 40 }} onClick={() => { setPayOptionOpen(false); setDepositOpen(true); }}>
                Back
              </button>
              <button className="btn-action" style={{ width: 'auto', padding: '0 14px', height: 40 }} onClick={() => setPayOptionOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {bankCountryOpen ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 76, display: 'grid', placeItems: 'center', padding: 16 }} onClick={() => setBankCountryOpen(false)}>
          <div style={{ width: 'min(520px, 100%)', background: 'rgba(17,17,17,0.9)', border: '1px solid var(--border-dim)', borderRadius: 18, padding: 16 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-0)' }}>Select country</div>
              <button className="btn-action" style={{ width: 'auto', padding: '0 12px', height: 36 }} onClick={() => setBankCountryOpen(false)}>Close</button>
            </div>

            <div style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 12 }}>
              Deposit amount: <strong style={{ color: 'var(--text-0)' }}>{fmtMoney(parseFloat(String(depositAmount || '0')) || 0)}</strong>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <div className="input-wrap select-wrap">
                <select className="form-input form-select" value={bankCountry} onChange={(e) => setBankCountry(e.target.value)}>
                  <option value="">Select country…</option>
                  <option value="NG">Nigeria</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                </select>
                <svg className="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>

            <button className="btn-action gold" onClick={beginGeneratingAccount}>Continue</button>
            {bankCountryError ? <div style={{ marginTop: 10, fontSize: 13, color: 'var(--red)' }}>{bankCountryError}</div> : null}

            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <button className="btn-action" style={{ width: 'auto', padding: '0 14px', height: 40 }} onClick={() => { setBankCountryOpen(false); setPayOptionOpen(true); }}>
                Back
              </button>
              <button className="btn-action" style={{ width: 'auto', padding: '0 14px', height: 40 }} onClick={() => setBankCountryOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {generatingOpen ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 77, display: 'grid', placeItems: 'center', padding: 16 }}>
          <div style={{ width: 'min(520px, 100%)', background: 'rgba(17,17,17,0.9)', border: '1px solid var(--border-dim)', borderRadius: 18, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-0)' }}>Generating account</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14, border: '1px solid var(--border-dim)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-1)', fontSize: 13 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-18 0" />
              </svg>
              <span>Generating account…</span>
            </div>
            <div style={{ marginTop: 12, color: 'var(--text-2)', fontSize: 13 }}>
              Please wait while we generate your bank transfer details.
            </div>
          </div>
        </div>
      ) : null}

      {generatingDoneOpen ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 78, display: 'grid', placeItems: 'center', padding: 16 }} onClick={() => setGeneratingDoneOpen(false)}>
          <div style={{ width: 'min(520px, 100%)', background: 'rgba(17,17,17,0.9)', border: '1px solid var(--border-dim)', borderRadius: 18, padding: 16 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-0)' }}>Deposit details</div>
              <button className="btn-action" style={{ width: 'auto', padding: '0 12px', height: 36 }} onClick={() => setGeneratingDoneOpen(false)}>Close</button>
            </div>
            <div style={{ color: 'var(--text-1)', fontSize: 13, lineHeight: 1.5 }}>
              Account details will be sent to your email to complete your deposit.
            </div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn-action gold" style={{ width: 'auto', padding: '0 14px', height: 40 }} onClick={() => setGeneratingDoneOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmOpen ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 80, display: 'grid', placeItems: 'center', padding: 16 }} onClick={() => setConfirmOpen(false)}>
          <div style={{ width: 'min(520px, 100%)', background: 'rgba(17,17,17,0.9)', border: '1px solid var(--border-dim)', borderRadius: 18, padding: 16 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-0)' }}>{confirmTitle}</div>
              <button className="btn-action" style={{ width: 'auto', padding: '0 12px', height: 36 }} onClick={() => setConfirmOpen(false)}>Close</button>
            </div>
            <div style={{ color: 'var(--text-1)' }}>{confirmBody}</div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn-action" style={{ width: 'auto', padding: '0 14px', height: 40 }} onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="btn-action gold" style={{ width: 'auto', padding: '0 14px', height: 40 }} onClick={() => doConfirm().catch(() => {})}>Confirm</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
