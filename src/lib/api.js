

const API_BASE = 'http://localhost:5265/api';

// ── Authentication Management ─────────────────────────────────────
export const Auth = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  clearToken: () => localStorage.removeItem('token'),
  getUserId: () => localStorage.getItem('userId'),
  setUserId: (id) => localStorage.setItem('userId', id),
  getUsername: () => localStorage.getItem('username'),
  setUsername: (name) => localStorage.setItem('username', name),
  isLoggedIn: () => !!localStorage.getItem('token'),
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },
};

// ── Base Request Handler ──────────────────────────────────────────
async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok || data.success === false) {
    const msg = data.errors?.[0]?.message || data.errors?.[0] || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// ── Account API ───────────────────────────────────────────────────
export const AccountApi = {
  register: ({ username, password, fullName, email }) =>
    request('POST', '/account/register', { username, password, fullName, email }),
  login: ({ username, password }) =>
    request('POST', '/account/login', { username, password }),
  logout: () => request('POST', '/account/logout'),
  getProfile: (id) =>
    id ? request('GET', `/account/${id}`) : request('GET', '/account/me'),
  updateProfile: (payload) => request('PUT', '/account/profile', payload),
};

// ── Relationship API ──────────────────────────────────────────────
export const RelationshipApi = {
  sendFriendRequest: (userId) =>
    request('POST', `/relationship/send/${userId}`),
  acceptRequest: (userId) =>
    request('POST', `/relationship/accept/${userId}`),
  rejectRequest: (userId) =>
    request('POST', `/relationship/reject/${userId}`),
  unfriend: (userId) =>
    request('DELETE', `/relationship/unfriend/${userId}`),
  getFriends: () =>
    request('GET', '/relationship/friends'),
  getPendingRequests: () =>
    request('GET', '/relationship/requests/pending'),
  getSentRequests: () =>
    request('GET', '/relationship/requests/sent'),
  searchUsers: (query) =>
    request('GET', `/relationship/search?q=${encodeURIComponent(query)}`),
};

// Relationship Status Enum
export const RelationshipStatus = {
  NONE: 0,
  PENDING_SENT: 1,
  PENDING_RECEIVED: 2,
  FRIENDS: 3,
  BLOCKED: 4,
};
