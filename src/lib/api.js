

// // const API_BASE = 'http://localhost:5265/api';

// // // ── Authentication Management ─────────────────────────────────────
// // export const Auth = {
// //   getToken: () => localStorage.getItem('token'),
// //   setToken: (token) => localStorage.setItem('token', token),
// //   clearToken: () => localStorage.removeItem('token'),
// //   getUserId: () => localStorage.getItem('userId'),
// //   setUserId: (id) => localStorage.setItem('userId', id),
// //   getUsername: () => localStorage.getItem('username'),
// //   setUsername: (name) => localStorage.setItem('username', name),
// //   isLoggedIn: () => !!localStorage.getItem('token'),
// //   clear: () => {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('userId');
// //     localStorage.removeItem('username');
// //   },
// // };

// // // ── Base Request Handler ──────────────────────────────────────────
// // async function request(method, path, body = null) {
// //   const headers = { 'Content-Type': 'application/json' };
// //   const token = Auth.getToken();
// //   if (token) headers['Authorization'] = `Bearer ${token}`;

// //   const opts = { method, headers };
// //   if (body) opts.body = JSON.stringify(body);

// //   const res = await fetch(`${API_BASE}${path}`, opts);

// //   let data;
// //   try {
// //     data = await res.json();
// //   } catch {
// //     data = {};
// //   }

// //   if (!res.ok || data.success === false) {
// //     const msg = data.errors?.[0]?.message || data.errors?.[0] || `HTTP ${res.status}`;
// //     throw new Error(msg);
// //   }
// //   return data;
// // }

// // // ── Account API ───────────────────────────────────────────────────
// // export const AccountApi = {
// //   register: ({ username, password, fullName, email }) =>
// //     request('POST', '/account/register', { username, password, fullName, email }),
// //   login: ({ username, password }) =>
// //     request('POST', '/account/login', { username, password }),
// //   logout: () => request('POST', '/account/logout'),
// //   getProfile: (id) =>
// //     id ? request('GET', `/account/${id}`) : request('GET', '/account/me'),
// //   updateProfile: (payload) => request('PUT', '/account/profile', payload),
// // };

// // // ── Relationship API ──────────────────────────────────────────────
// // export const RelationshipApi = {
// //   sendFriendRequest: (userId) =>
// //     request('POST', `/relationship/send/${userId}`),
// //   acceptRequest: (userId) =>
// //     request('POST', `/relationship/accept/${userId}`),
// //   rejectRequest: (userId) =>
// //     request('POST', `/relationship/reject/${userId}`),
// //   unfriend: (userId) =>
// //     request('DELETE', `/relationship/unfriend/${userId}`),
// //   getFriends: () =>
// //     request('GET', '/relationship/friends'),
// //   getPendingRequests: () =>
// //     request('GET', '/relationship/requests/pending'),
// //   getSentRequests: () =>
// //     request('GET', '/relationship/requests/sent'),
// //   searchUsers: (query) =>
// //     request('GET', `/relationship/search?q=${encodeURIComponent(query)}`),
// // };

// // // Relationship Status Enum
// // export const RelationshipStatus = {
// //   NONE: 0,
// //   PENDING_SENT: 1,
// //   PENDING_RECEIVED: 2,
// //   FRIENDS: 3,
// //   BLOCKED: 4,
// // };
// const API_BASE = 'http://localhost:7069/api';

// export const Auth = {
//   getToken: () => localStorage.getItem('token'),
//   setToken: (token) => localStorage.setItem('token', token),
//   getUserId: () => localStorage.getItem('userId'),
//   setUserId: (id) => localStorage.setItem('userId', id),
//   setUsername: (name) => localStorage.setItem('username', name),
//   isLoggedIn: () => !!localStorage.getItem('token'),
//   clear: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userId');
//     localStorage.removeItem('username');
//   },
// };

// // ── Base Request Handler ──────────────────────────────────────────
// async function request(method, path, body = null) {
//   const headers = { 'Content-Type': 'application/json' };
//   const token = Auth.getToken();
//   if (token) headers['Authorization'] = `Bearer ${token}`;

//   const opts = { method, headers };
//   if (body) opts.body = JSON.stringify(body);

//   const res = await fetch(`${API_BASE}${path}`, opts);

//   if (res.status === 401) {
//     Auth.clear();
//     window.location.href = '/login';
//     return;
//   }

//   let data;
//   try {
//     data = await res.json();
//   } catch {
//     data = {};
//   }

//   if (!res.ok) {
//     const msg = data.message || data.title || `HTTP ${res.status}`;
//     throw new Error(msg);
//   }

//   // Một số endpoint trả về trực tiếp, một số có { result: ... }
//   return data.result !== undefined ? data.result : data;
// }

// // ── Auth API ─────────────────────────────────────────────────────
// export const AccountApi = {
//   // Login
//   login: (credentials) => request('POST', '/Auth/login', credentials),

//   // Register (theo Swagger là POST /api/User)
//   register: (data) => request('POST', '/User', data),

//   // Lấy profile
//   // Nếu không truyền id → lấy profile của chính mình
//   getProfile: (id) => 
//     id ? request('GET', `/User/${id}`) : request('GET', '/User'),

//   // Cập nhật profile
//   updateProfile: (data) => request('PUT', `/User`, data),   // nếu backend yêu cầu id thì sẽ sửa sau
// };

// // ── Relationship API (giữ nguyên vì Swagger chưa hiển thị nhóm này) ──
// export const RelationshipApi = {
//   sendFriendRequest: (userId) =>
//     request('POST', `/relationship/send/${userId}`),

//   acceptRequest: (userId) =>
//     request('POST', `/relationship/accept/${userId}`),

//   rejectRequest: (userId) =>
//     request('POST', `/relationship/reject/${userId}`),

//   unfriend: (userId) =>
//     request('DELETE', `/relationship/unfriend/${userId}`),

//   getFriends: () =>
//     request('GET', '/relationship/friends'),

//   getPendingRequests: () =>
//     request('GET', '/relationship/requests/pending'),

//   getStatus: (userId) =>
//     request('GET', `/relationship/status/${userId}`),

//   searchUsers: (query) =>
//     request('GET', `/relationship/search?q=${encodeURIComponent(query)}`),
// };

// // ── Relationship Status Enum ─────────────────────────────────────
// export const RelationshipStatus = {
//   NONE: 0,
//   PENDING_SENT: 1,
//   PENDING_RECEIVED: 2,
//   FRIENDS: 3,
//   BLOCKED: 4,
// };

// // ── Post API (đã thêm sẵn cho tương lai) ─────────────────────────
// export const PostApi = {
//   createPost: (data) => request('POST', '/Post', data),
//   getAllPosts: () => request('GET', '/Post'),
//   getPostById: (id) => request('GET', `/Post/${id}`),
//   updatePost: (id, data) => request('PUT', `/Post/${id}`, data),
//   deletePost: (id) => request('DELETE', `/Post/${id}`),
//   addComment: (postId, data) => request('POST', `/Post/${postId}/comment`, data),
//   reactPost: (postId, data) => request('POST', `/Post/${postId}/react`, data),
// };

// export default { Auth, AccountApi, RelationshipApi, PostApi, RelationshipStatus };

const API_BASE = 'https://localhost:7069/api';

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

  // Token hết hạn → logout
  if (res.status === 401) {
    Auth.clear();
    window.location.href = '/login';
    return;
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    // Thử lấy message từ nhiều dạng response khác nhau
    const msg =
      data.message ||
      data.errors?.[0]?.message ||
      data.errors?.[0] ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

// ── Auth API → /api/Auth ──────────────────────────────────────────
// POST /api/Auth/login
export const AuthApi = {
  login: ({ username, password }) =>
    request('POST', '/Auth/login', { username, password }),
};

// ── User API → /api/User ──────────────────────────────────────────
// POST /api/User         → đăng ký
// GET  /api/User         → danh sách users (search)
// GET  /api/User/{id}    → lấy profile theo id
// PUT  /api/User/{id}    → cập nhật profile
export const AccountApi = {
  // Đăng ký tài khoản mới
  register: ({ username, password, fullName, email }) =>
    request('POST', '/User', { username, password, fullName, email }),

  // Lấy profile: nếu có id → GET /User/{id}, không → GET /User/me hoặc dùng id từ localStorage
  getProfile: (id) => {
    if (id) return request('GET', `/User/${id}`);
    const myId = Auth.getUserId();
    if (myId) return request('GET', `/User/${myId}`);
    return request('GET', '/User/me'); // fallback nếu backend hỗ trợ
  },

  // Cập nhật profile
  updateProfile: (id, payload) => request('PUT', `/User/${id}`, payload),

  // Tìm kiếm users: GET /api/User?q=...  (nếu backend hỗ trợ query param)
  searchUsers: (query) =>
    request('GET', `/User?q=${encodeURIComponent(query)}`),
};

// ── Post API → /api/Post ──────────────────────────────────────────
// POST   /api/Post          → tạo bài viết
// GET    /api/Post          → lấy danh sách bài viết (feed)
// GET    /api/Post/{id}     → lấy 1 bài viết
// PUT    /api/Post/{id}     → sửa bài viết
// DELETE /api/Post/{id}     → xóa bài viết
// POST   /api/Post/{id}/comment → bình luận
// POST   /api/Post/{id}/react   → react (like/...)
export const PostApi = {
  createPost: (payload) => request('POST', '/Post', payload),
  getPosts: () => request('GET', '/Post'),
  getPost: (id) => request('GET', `/Post/${id}`),
  updatePost: (id, payload) => request('PUT', `/Post/${id}`, payload),
  deletePost: (id) => request('DELETE', `/Post/${id}`),
  commentPost: (id, payload) => request('POST', `/Post/${id}/comment`, payload),
  reactPost: (id, payload) => request('POST', `/Post/${id}/react`, payload),
};

// ── Relationship API ──────────────────────────────────────────────
// Swagger chưa thấy rõ, giữ nguyên endpoint cũ — cập nhật khi biết thêm
export const RelationshipApi = {
  sendFriendRequest: (userId) => request('POST', `/relationship/send/${userId}`),
  acceptRequest: (userId) => request('POST', `/relationship/accept/${userId}`),
  rejectRequest: (userId) => request('POST', `/relationship/reject/${userId}`),
  unfriend: (userId) => request('DELETE', `/relationship/unfriend/${userId}`),
  getFriends: () => request('GET', '/relationship/friends'),
  getPendingRequests: () => request('GET', '/relationship/requests/pending'),
  getStatus: (userId) => request('GET', `/relationship/status/${userId}`),
  searchUsers: (query) =>
    request('GET', `/relationship/search?q=${encodeURIComponent(query)}`),
};

// ── Relationship Status Enum ──────────────────────────────────────
export const RelationshipStatus = {
  NONE: 0,
  PENDING_SENT: 1,
  PENDING_RECEIVED: 2,
  FRIENDS: 3,
  BLOCKED: 4,
};
