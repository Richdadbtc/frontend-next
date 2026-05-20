'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import API from '@/src/lib/api';

const ALLOWED_TABS = new Set(['dashboard', 'users', 'transactions', 'deposits', 'kyc', 'support', 'logs', 'settings']);

function tabFromPath(pathname) {
  const p = String(pathname || '');
  const raw = p.replace(/^\/admin\/?/i, '').replace(/^\//, '');
  const seg = raw.split('/')[0] || '';
  const tab = seg ? seg.toLowerCase() : 'dashboard';
  return ALLOWED_TABS.has(tab) ? tab : 'dashboard';
}

function fmtMoney(n) {
  const v = Number(n || 0);
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

function fmtTime(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return '';
  }
}

export default function AdminApp() {
  const pathname = usePathname();
  const activeTab = useMemo(() => tabFromPath(pathname), [pathname]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chartReady, setChartReady] = useState(false);

  const [adminEmail, setAdminEmail] = useState('—');

  const [stUsers, setStUsers] = useState('—');
  const [stKyc, setStKyc] = useState('—');
  const [stAum, setStAum] = useState('—');
  const [stVol, setStVol] = useState('—');
  const [stRev, setStRev] = useState('—');

  const [volumeLabels, setVolumeLabels] = useState([]);
  const [volumeValues, setVolumeValues] = useState([]);
  const chartRef = useRef(null);

  const [userSearch, setUserSearch] = useState('');
  const [userKyc, setUserKyc] = useState('');
  const [userSuspended, setUserSuspended] = useState('');
  const [usersRows, setUsersRows] = useState([]);
  const [userEmailError, setUserEmailError] = useState('');

  const [txType, setTxType] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [txFrom, setTxFrom] = useState('');
  const [txTo, setTxTo] = useState('');
  const [txRows, setTxRows] = useState([]);

  const [depositRows, setDepositRows] = useState([]);
  const [depositError, setDepositError] = useState('');

  const [kycRows, setKycRows] = useState([]);
  const [logRows, setLogRows] = useState([]);

  const [supportThreads, setSupportThreads] = useState([]);
  const [activeSupportUserId, setActiveSupportUserId] = useState(null);
  const [supportMessages, setSupportMessages] = useState([]);
  const [supportInput, setSupportInput] = useState('');
  const [supportError, setSupportError] = useState('');
  const supportPollRef = useRef(null);

  const [btcAddress, setBtcAddress] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('');
  const [settingsMsg, setSettingsMsg] = useState('');
  const [settingsErr, setSettingsErr] = useState('');

  async function loadSettings() {
    const res = await API.get('/admin/settings');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load settings');
    setBtcAddress(data?.settings?.btcAddress || '');
    setUsdtAddress(data?.settings?.usdtAddress || '');
  }

  async function saveCryptoAddresses() {
    setSettingsMsg('');
    setSettingsErr('');
    try {
      const res = await API.put('/admin/settings/crypto-addresses', {
        btcAddress: String(btcAddress || '').trim(),
        usdtAddress: String(usdtAddress || '').trim(),
      });
      const data = await res?.json?.().catch(() => ({}));
      if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to save settings');
      setBtcAddress(data?.settings?.btcAddress || '');
      setUsdtAddress(data?.settings?.usdtAddress || '');
      setSettingsMsg('Saved');
    } catch (e) {
      setSettingsErr(e.message || 'Unable to save settings');
    }
  }

  useEffect(() => {
    const u = API.getUser();
    setAdminEmail(u?.email || '—');
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onResize = () => {
      if (window.innerWidth > 980) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sidebarOpen]);

  async function loadStats() {
    const res = await API.get('/admin/stats');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load stats');

    const st = data.stats || {};
    setStUsers(String(st.totalUsers ?? '—'));
    setStKyc(`KYC verified: ${st.kycVerifiedPct ?? 0}%`);
    setStAum(`${Number(st.totalAUM || 0).toFixed(4)} g`);
    setStVol(fmtMoney(st.todayVolume || 0));
    setStRev(fmtMoney(st.todayRevenue || 0));
  }

  async function loadDailyVolume() {
    const res = await API.get('/admin/stats/volume');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load volume');

    const labels = (data.data || []).map((d) => d._id);
    const vols = (data.data || []).map((d) => Number(d.volume || 0));
    setVolumeLabels(labels);
    setVolumeValues(vols);
  }

  async function loadUsers() {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', '50');
    if (userSearch) params.set('search', userSearch);
    if (userKyc) params.set('kycStatus', userKyc);
    if (userSuspended) params.set('suspended', userSuspended);

    const res = await API.get(`/admin/users?${params.toString()}`);
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load users');

    setUsersRows(Array.isArray(data.users) ? data.users : []);
  }

  async function sendUserEmail(userId, email) {
    setUserEmailError('');
    try {
      const subject = window.prompt(`Email subject to ${email || 'user'}`);
      if (!subject) return;
      const body = window.prompt('Email body');
      if (!body) return;

      const res = await API.post(`/admin/users/${encodeURIComponent(userId)}/email`, { subject, body });
      const data = await res?.json?.().catch(() => ({}));
      if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to send email');

      window.alert('Email sent');
    } catch (e) {
      setUserEmailError(e.message || 'Unable to send email');
    }
  }

  async function loadTransactions() {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', '50');
    if (txType) params.set('type', txType);
    if (txStatus) params.set('status', txStatus);
    if (txFrom) params.set('from', txFrom);
    if (txTo) params.set('to', txTo);

    const res = await API.get(`/admin/transactions?${params.toString()}`);
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load transactions');

    setTxRows(Array.isArray(data.transactions) ? data.transactions : []);
  }

  async function loadDepositRequests() {
    const res = await API.get('/admin/transactions?type=deposit&status=pending&page=1&limit=100');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load deposit requests');

    const rows = Array.isArray(data.transactions) ? data.transactions : [];
    setDepositRows(rows.filter((t) => t?.metadata?.method === 'manual'));
  }

  async function reviewDeposit(id, action) {
    setDepositError('');
    try {
      let body = { action };
      if (action === 'reject') {
        const reason = window.prompt('Rejection reason');
        if (!reason) return;
        body = { action, reason };
      }

      const res = await API.put(`/admin/deposits/${encodeURIComponent(id)}/review`, body);
      const data = await res?.json?.().catch(() => ({}));
      if (!res?.ok || !data?.success) throw new Error(data?.message || 'Deposit review failed');

      await loadDepositRequests();
      await loadTransactions().catch(() => {});
    } catch (e) {
      setDepositError(e.message || 'Deposit review failed');
    }
  }

  async function loadKycQueue() {
    const res = await API.get('/admin/kyc-queue');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load KYC queue');

    setKycRows(Array.isArray(data.requests) ? data.requests : []);
  }

  async function loadLogs() {
    const res = await API.get('/admin/logs?page=1&limit=50');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load logs');

    setLogRows(Array.isArray(data.logs) ? data.logs : []);
  }

  async function loadSupportThreads() {
    const res = await API.get('/admin/support/threads?limit=50');
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load threads');

    setSupportThreads(Array.isArray(data.threads) ? data.threads : []);
  }

  async function loadSupportConversation(nextUserId = activeSupportUserId) {
    if (!nextUserId) {
      setSupportMessages([]);
      return;
    }
    const res = await API.get(`/admin/support/messages?userId=${encodeURIComponent(nextUserId)}&limit=200`);
    const data = await res?.json?.().catch(() => ({}));
    if (!res?.ok || !data?.success) throw new Error(data?.message || 'Unable to load messages');

    setSupportMessages(Array.isArray(data.messages) ? data.messages : []);
    await loadSupportThreads().catch(() => {});
  }

  function startSupportPolling(userId) {
    if (supportPollRef.current) clearInterval(supportPollRef.current);
    supportPollRef.current = setInterval(() => {
      loadSupportConversation(userId).catch(() => {});
    }, 8000);
  }

  async function sendSupportReply() {
    if (!activeSupportUserId) return;
    const text = String(supportInput || '').trim();
    if (!text) return;

    setSupportError('');
    try {
      const res = await API.post('/admin/support/messages', { userId: activeSupportUserId, message: text });
      const data = await res?.json?.().catch(() => ({}));
      if (!res?.ok || !data?.success) throw new Error(data?.message || 'Reply failed');

      setSupportInput('');
      await loadSupportConversation(activeSupportUserId);
    } catch (e) {
      setSupportError(e.message);
    }
  }

  useEffect(() => {
    loadStats().catch(() => {});
    loadDailyVolume().catch(() => {});
    loadUsers().catch(() => {});
    loadTransactions().catch(() => {});
    loadDepositRequests().catch(() => {});
    loadKycQueue().catch(() => {});
    loadSupportThreads().catch(() => {});
    loadLogs().catch(() => {});
    loadSettings().catch(() => {});

    return () => {
      if (supportPollRef.current) clearInterval(supportPollRef.current);
    };
  }, []);

  useEffect(() => {
    if (!volumeLabels.length) return;
    if (typeof window === 'undefined') return;
    if (!window.Chart) return;

    const canvas = document.getElementById('volume-chart');
    if (!canvas) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const ctx = canvas.getContext('2d');
    chartRef.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: volumeLabels,
        datasets: [
          {
            label: 'Volume',
            data: volumeValues,
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212,175,55,0.12)',
            tension: 0.25,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#9AA3B2' } },
          y: { ticks: { color: '#9AA3B2' } },
        },
      },
    });
  }, [volumeLabels, volumeValues, chartReady]);

  function navLink(tab, label) {
    const href = tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
    return (
      <Link
        href={href}
        className={`sb-link ${activeTab === tab ? 'active' : ''}`}
        onClick={() => {
          if (window.innerWidth <= 980) setSidebarOpen(false);
        }}
      >
        {label}
      </Link>
    );
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={() => setChartReady(true)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="admin-sidebar">
        <div className="sb-logo">
          <div className="hex" aria-hidden="true">A</div>
          <span>AURUM VAULT</span>
        </div>
        <nav className="sb-nav">
          {navLink('dashboard', 'Dashboard')}
          {navLink('users', 'Users')}
          {navLink('transactions', 'Transactions')}
          {navLink('deposits', 'Deposit Requests')}
          {navLink('kyc', 'KYC Queue')}
          {navLink('support', 'Support')}
          {navLink('logs', 'Logs')}
          {navLink('settings', 'Settings')}
        </nav>
        <button className="sb-signout" onClick={() => API.logout()}>Sign Out</button>
      </aside>

      <div className="main-wrap">
        <header className="topbar">
          <button className="hamburger-dash" aria-label="Toggle menu" onClick={() => setSidebarOpen((v) => !v)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="tb-greeting">Admin Console</div>
          <div className="tb-right">
            <div className="wallet-chip">
              <span>{adminEmail}</span>
            </div>
          </div>
        </header>

        <section className={`tab-panel ${activeTab === 'dashboard' ? 'active' : ''}`} id="tab-dashboard">
          <div className="page-title">Platform Overview</div>
          <div className="stats-grid">
            <div className="stat-card gold-border">
              <div className="sc-label">Total Users</div>
              <div className="sc-value">{stUsers}</div>
              <div className="sc-change">{stKyc}</div>
            </div>
            <div className="stat-card">
              <div className="sc-label">Total AUM (grams)</div>
              <div className="sc-value">{stAum}</div>
              <div className="sc-change">All holdings</div>
            </div>
            <div className="stat-card">
              <div className="sc-label">24h Volume</div>
              <div className="sc-value">{stVol}</div>
              <div className="sc-change">Buy/Sell</div>
            </div>
            <div className="stat-card">
              <div className="sc-label">Revenue Today</div>
              <div className="sc-value">{stRev}</div>
              <div className="sc-change">Fees</div>
            </div>
          </div>

          <div className="section-heading">Daily Volume (30d)</div>
          <div className="chart-card">
            <canvas id="volume-chart" height="120" />
          </div>
        </section>

        <section className={`tab-panel ${activeTab === 'settings' ? 'active' : ''}`} id="tab-settings">
          <div className="page-title">Settings</div>
          <div className="section-heading" style={{ marginTop: 0 }}>Crypto deposit addresses</div>
          <div className="trade-layout">
            <div className="trade-card">
              <div style={{ display: 'grid', gap: 10 }}>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span className="sc-label">BTC address</span>
                  <input className="form-input" value={btcAddress} onChange={(e) => setBtcAddress(e.target.value)} />
                </label>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span className="sc-label">USDT address</span>
                  <input className="form-input" value={usdtAddress} onChange={(e) => setUsdtAddress(e.target.value)} />
                </label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-action gold" onClick={saveCryptoAddresses}>Save</button>
                  <button className="btn-action" onClick={() => loadSettings().catch(() => {})}>Reload</button>
                  {settingsMsg ? <span style={{ color: 'var(--green)', fontSize: 13 }}>{settingsMsg}</span> : null}
                </div>
                {settingsErr ? <div className="action-error" style={{ padding: '10px 12px', color: 'var(--red)' }}>{settingsErr}</div> : null}
              </div>
            </div>
          </div>
        </section>

        <section className={`tab-panel ${activeTab === 'deposits' ? 'active' : ''}`} id="tab-deposits">
          <div className="page-title">Deposit Requests</div>
          <div className="filter-bar">
            <button className="filter-btn" onClick={() => loadDepositRequests().catch(() => {})}>Refresh</button>
          </div>

          {depositError ? <div className="action-error" style={{ padding: '10px 12px', color: 'var(--red)' }}>{depositError}</div> : null}

          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Note</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {!depositRows.length ? (
                  <tr>
                    <td colSpan={5} className="empty-row">No pending deposit requests</td>
                  </tr>
                ) : (
                  depositRows.map((t) => {
                    const u = t.userId;
                    const uname = u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : '';
                    const label = uname || u?.email || '—';
                    const note = t?.metadata?.note ? String(t.metadata.note) : '—';
                    return (
                      <tr key={t._id}>
                        <td>{label}</td>
                        <td>{fmtMoney(t.netAmount ?? t.amount)}</td>
                        <td style={{ maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note}</td>
                        <td>{fmtTime(t.createdAt)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button className="btn-action gold" onClick={() => reviewDeposit(t._id, 'approve')}>Approve</button>
                            <button className="btn-action" onClick={() => reviewDeposit(t._id, 'reject')}>Reject</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`tab-panel ${activeTab === 'users' ? 'active' : ''}`} id="tab-users">
          <div className="page-title">Users</div>
          <div className="filter-bar">
            <input className="filter-input" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search name/email…" />
            <select className="filter-select" value={userKyc} onChange={(e) => setUserKyc(e.target.value)}>
              <option value="">All KYC</option>
              <option value="verified">Verified</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <select className="filter-select" value={userSuspended} onChange={(e) => setUserSuspended(e.target.value)}>
              <option value="">All</option>
              <option value="true">Suspended</option>
            </select>
            <button className="filter-btn" onClick={() => loadUsers().catch(() => {})}>Refresh</button>
          </div>
          {userEmailError ? <div className="action-error" style={{ padding: '10px 12px', color: 'var(--red)' }}>{userEmailError}</div> : null}
          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>KYC</th>
                  <th>Wallet</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!usersRows.length ? (
                  <tr>
                    <td colSpan={6} className="empty-row">No users</td>
                  </tr>
                ) : (
                  usersRows.map((u) => {
                    const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || '—';
                    return (
                      <tr key={u._id || u.email}>
                        <td>{name}</td>
                        <td>{u.email}</td>
                        <td>{u.kycStatus} (T{u.kycTier})</td>
                        <td>{fmtMoney(u.walletBalance || 0)}</td>
                        <td>{u.isSuspended ? 'suspended' : 'active'}</td>
                        <td>
                          <button className="btn-action" onClick={() => sendUserEmail(u._id, u.email)}>Send Email</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`tab-panel ${activeTab === 'transactions' ? 'active' : ''}`} id="tab-transactions">
          <div className="page-title">Transactions</div>
          <div className="filter-bar">
            <select className="filter-select" value={txType} onChange={(e) => setTxType(e.target.value)}>
              <option value="">All types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
            <select className="filter-select" value={txStatus} onChange={(e) => setTxStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <input type="date" className="filter-input" value={txFrom} onChange={(e) => setTxFrom(e.target.value)} />
            <input type="date" className="filter-input" value={txTo} onChange={(e) => setTxTo(e.target.value)} />
            <button className="filter-btn" onClick={() => loadTransactions().catch(() => {})}>Refresh</button>
          </div>

          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Grams</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {!txRows.length ? (
                  <tr>
                    <td colSpan={6} className="empty-row">No transactions</td>
                  </tr>
                ) : (
                  txRows.map((t) => {
                    const u = t.userId;
                    const uname = u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : '';
                    const label = uname || u?.email || '—';
                    return (
                      <tr key={t._id || `${t.type}-${t.createdAt}`}> 
                        <td>{label}</td>
                        <td>{t.type}</td>
                        <td>{fmtMoney(t.amount)}</td>
                        <td>{t.gramsGold ? Number(t.gramsGold).toFixed(4) : '—'}</td>
                        <td>{t.status}</td>
                        <td>{fmtTime(t.createdAt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`tab-panel ${activeTab === 'kyc' ? 'active' : ''}`} id="tab-kyc">
          <div className="page-title">KYC Queue</div>
          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>ID Type</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {!kycRows.length ? (
                  <tr>
                    <td colSpan={4} className="empty-row">No pending KYC</td>
                  </tr>
                ) : (
                  kycRows.map((r) => {
                    const u = r.userId;
                    const name = u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : '';
                    const label = name || u?.email || '—';
                    return (
                      <tr key={r._id || `${label}-${r.createdAt}`}> 
                        <td>{label}</td>
                        <td>{r.idType || '—'}</td>
                        <td>{r.status}</td>
                        <td>{fmtTime(r.createdAt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`tab-panel ${activeTab === 'support' ? 'active' : ''}`} id="tab-support">
          <div className="page-title">Support Inbox</div>
          <div className="trade-layout">
            <div className="trade-card">
              <div className="section-heading" style={{ marginTop: 0 }}>Conversations</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {!supportThreads.length ? (
                  <div className="empty-row">No conversations</div>
                ) : (
                  supportThreads.map((t) => {
                    const name = `${t.user?.firstName || ''} ${t.user?.lastName || ''}`.trim() || (t.user?.email || 'User');
                    return (
                      <button
                        key={t.userId}
                        className="btn-action"
                        style={{ textAlign: 'left', display: 'flex', gap: 10, alignItems: 'center' }}
                        onClick={() => {
                          setActiveSupportUserId(t.userId);
                          loadSupportConversation(t.userId)
                            .then(() => startSupportPolling(t.userId))
                            .catch(() => {});
                        }}
                      >
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                          <strong style={{ fontSize: 13 }}>{name}</strong>
                          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{String(t.lastMessage || '').slice(0, 64)}</span>
                        </span>
                        {t.unreadCount ? (
                          <span style={{ marginLeft: 'auto', border: '1px solid rgba(201,168,76,0.35)', background: 'rgba(201,168,76,0.10)', color: 'var(--text-0)', padding: '2px 8px', borderRadius: 999, fontSize: 12 }}>
                            {t.unreadCount}
                          </span>
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="trade-card">
              <div className="section-heading" style={{ marginTop: 0 }}>Chat</div>
              <div className="support-chat">
                <div className="support-messages">
                  {!activeSupportUserId ? (
                    <div className="empty-row">Select a conversation</div>
                  ) : !supportMessages.length ? (
                    <div className="empty-row">No messages</div>
                  ) : (
                    supportMessages.map((m) => {
                      const mine = m.senderRole === 'admin';
                      const who = m.senderRole === 'admin' ? 'You' : m.senderRole === 'bot' ? 'Bot' : 'User';
                      return (
                        <div key={m._id || `${m.createdAt}-${m.message}`} className={`support-bubble ${mine ? 'mine' : ''}`}>
                          <div>{m.message}</div>
                          <div className="support-meta">{who} • {fmtTime(m.createdAt)}</div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="support-compose">
                  <input
                    className="form-input"
                    value={supportInput}
                    onChange={(e) => setSupportInput(e.target.value)}
                    placeholder="Type a reply…"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        sendSupportReply();
                      }
                    }}
                  />
                  <button className="btn-action gold" onClick={sendSupportReply}>Send</button>
                </div>
                {supportError ? <div className="action-error" style={{ padding: '10px 12px', color: 'var(--red)' }}>{supportError}</div> : null}
              </div>
            </div>
          </div>
        </section>

        <section className={`tab-panel ${activeTab === 'logs' ? 'active' : ''}`} id="tab-logs">
          <div className="page-title">Admin Logs</div>
          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>IP</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {!logRows.length ? (
                  <tr>
                    <td colSpan={5} className="empty-row">No logs</td>
                  </tr>
                ) : (
                  logRows.map((l) => {
                    const admin = l.adminId;
                    const adminName = admin ? `${admin.firstName || ''} ${admin.lastName || ''}`.trim() : '';
                    const who = adminName || admin?.email || '—';
                    const target = l.targetUserId?.email || '—';
                    return (
                      <tr key={l._id || `${l.action}-${l.createdAt}`}> 
                        <td>{who}</td>
                        <td>{l.action}</td>
                        <td>{target}</td>
                        <td>{l.ipAddress || '—'}</td>
                        <td>{fmtTime(l.createdAt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
