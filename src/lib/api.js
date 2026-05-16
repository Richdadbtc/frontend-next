const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function assertClient() {
  if (typeof window === 'undefined') {
    throw new Error('API helper must be used in the browser');
  }
}

function getTokens() {
  assertClient();
  return {
    access: localStorage.getItem('av_access'),
    refresh: localStorage.getItem('av_refresh'),
  };
}

function setTokens(access, refresh) {
  assertClient();
  if (access) localStorage.setItem('av_access', access);
  if (refresh) localStorage.setItem('av_refresh', refresh);
}

function clearTokens() {
  assertClient();
  localStorage.removeItem('av_access');
  localStorage.removeItem('av_refresh');
  localStorage.removeItem('av_user');
}

function getUser() {
  assertClient();
  try {
    return JSON.parse(localStorage.getItem('av_user'));
  } catch {
    return null;
  }
}

function setUser(user) {
  assertClient();
  localStorage.setItem('av_user', JSON.stringify(user));
}

async function refreshAccessToken() {
  assertClient();
  const { refresh } = getTokens();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

async function request(path, options = {}, retry = true) {
  assertClient();
  const { access } = getTokens();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (access) headers.Authorization = `Bearer ${access}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const body = await res.clone().json().catch(() => ({}));
    if (body?.code === 'TOKEN_EXPIRED') {
      const ok = await refreshAccessToken();
      if (ok) return request(path, options, false);
    }
    clearTokens();
    const here = window.location.pathname || '';
    window.location.href = here.startsWith('/admin') ? '/admin/login' : '/login';
    return;
  }

  return res;
}

async function get(path) {
  return request(path, { method: 'GET' });
}

async function post(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}

async function put(path, body) {
  return request(path, { method: 'PUT', body: JSON.stringify(body) });
}

async function del(path) {
  return request(path, { method: 'DELETE' });
}

function isLoggedIn() {
  assertClient();
  return !!getTokens().access;
}

function requireAuth({ adminRequired = false } = {}) {
  assertClient();
  if (!isLoggedIn()) {
    window.location.href = adminRequired ? '/admin/login' : '/login';
    return false;
  }
  if (adminRequired) {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      window.location.href = '/admin/login';
      return false;
    }
  }
  return true;
}

async function login(email, password) {
  assertClient();
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data?.success) {
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
  }
  return { ok: res.ok, data };
}

async function logout() {
  assertClient();
  const { refresh } = getTokens();
  await post('/auth/logout', { refreshToken: refresh }).catch(() => {});
  clearTokens();
  const here = window.location.pathname || '';
  window.location.href = here.startsWith('/admin') ? '/admin/login' : '/login';
}

const API = {
  get,
  post,
  put,
  del,
  login,
  logout,
  getUser,
  setUser,
  setTokens,
  clearTokens,
  isLoggedIn,
  requireAuth,
};

export default API;
