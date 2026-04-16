const API_BASE = 'https://localhost:7069/api';

// ── JWT ─────────────────────────────────────────
export const Auth = {
  getToken:    () => localStorage.getItem('token'),
  setToken:    (t) => localStorage.setItem('token', t),
  clearToken:  () => localStorage.removeItem('token'),

  getUserId:   () => localStorage.getItem('userId'),
  setUserId:   (id) => localStorage.setItem('userId', String(id)),

  getUsername: () => localStorage.getItem('username'),
  setUsername: (n) => localStorage.setItem('username', n),

  isLoggedIn:  () => !!localStorage.getItem('token'),

  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },
};

// ── REQUEST CHUNG (LOGIN) ───────────────────────
export async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, opts);
  } catch {
    throw new Error('Không thể kết nối đến server.');
  }

  let data = {};
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg =
      data?.errors?.[0]?.message ??
      data?.errors?.[0] ??
      data?.message ??
      (res.status === 401
        ? 'Tên đăng nhập hoặc mật khẩu không đúng'
        : `Lỗi ${res.status}`);
    throw new Error(msg);
  }

  return data;
}

// ── UPLOAD FILE (multipart/form-data) ───────────
// ── UPLOAD FILE (multipart/form-data) ───────────
// Endpoint: POST /api/upload/multiple  → trả về { result: [ { fileUrl: "https://..." } ] }
export async function uploadFile(file) {
  const token = Auth.getToken();
  const formData = new FormData();
  formData.append('Files', file); // field name phải khớp với backend

  let res;
  try {
    res = await fetch(`${API_BASE}/upload/multiple`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
  } catch {
    throw new Error('Không thể kết nối đến server.');
  }

  let data = {};
  try { data = await res.json(); } catch {}

  if (res.status === 401) {
    Auth.clear();
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const msg = data?.message || data?.title || `Lỗi upload ${res.status}`;
    throw new Error(msg);
  }

  // Backend trả về mảng ảnh trong result
  return data?.result?.[0]?.fileUrl ?? data?.url ?? data?.fileUrl ?? data?.result ?? data;
}

// ── REQUEST CÓ AUTH ─────────────────────────────
export async function authRequest(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, opts);
  } catch {
    throw new Error('Không thể kết nối đến server.');
  }

  let data = {};
  try { data = await res.json(); } catch {}

  if (res.status === 401) {
    Auth.clear();
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    let errorText = `Lỗi HTTP ${res.status}`;

    if (data) {
      if (data.message) errorText = data.message;
      else if (data.title) errorText = data.title;
      else if (data.errors) {
        if (Array.isArray(data.errors)) {
          errorText = data.errors[0]?.message || data.errors[0];
        } else {
          const key = Object.keys(data.errors)[0];
          errorText = `${key}: ${data.errors[key][0]}`;
        }
      }
    }

    throw new Error(errorText);
  }

  return data;
}