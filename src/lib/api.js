// const API_BASE = 'https://localhost:7069/api';

// // ── Authentication Management ─────────────────────────────────────
// export const Auth = {
//   getToken: () => localStorage.getItem('token'),
//   setToken: (token) => localStorage.setItem('token', token),
//   clearToken: () => localStorage.removeItem('token'),
//   getUserId: () => localStorage.getItem('userId'),
//   setUserId: (id) => localStorage.setItem('userId', id),
//   getUsername: () => localStorage.getItem('username'),
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

//   // Token hết hạn → logout
//   if (res.status === 401) {
//     if (path.includes('/login')) {
//       throw new Error("Sai tên đăng nhập hoặc mật khẩu");
//   }
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
//     // Thử lấy message từ nhiều dạng response khác nhau
//     const msg =
//       data.message ||
//       data.errors?.[0]?.message ||
//       data.errors?.[0] ||
//       `HTTP ${res.status}`;
//     throw new Error(msg);
//   }

//   return data;
// }

// // ── Auth API → /api/Auth ──────────────────────────────────────────
// // POST /api/Auth/login
// export const AuthApi = {
//   login: ({ username, email, password }) =>
//     request('POST', '/Auth/login', { username, email, password })
// };


// export const AccountApi = {
//   // Đăng ký tài khoản mới
//   register: ({ username, password, fullName, email }) =>
//     request('POST', '/User', { username, password, fullName, email }),

//   // Lấy profile: nếu có id → GET /User/{id}, không → GET /User/me hoặc dùng id từ localStorage
//   getProfile: (id) => {
//     if (id) return request('GET', `/User/${id}`);
//     const myId = Auth.getUserId();
//     if (myId) return request('GET', `/User/${myId}`);
//     return request('GET', '/User/me'); // fallback nếu backend hỗ trợ
//   },

//   // Cập nhật profile
//   updateProfile: (id, payload) => request('PUT', `/User/${id}`, payload),

//   // Tìm kiếm users: GET /api/User?q=...  (nếu backend hỗ trợ query param)
//   searchUsers: (query) =>
//     request('GET', `/User?q=${encodeURIComponent(query)}`),
// };

// // ── Post API → /api/Post ──────────────────────────────────────────
// // POST   /api/Post          → tạo bài viết
// // GET    /api/Post          → lấy danh sách bài viết (feed)
// // GET    /api/Post/{id}     → lấy 1 bài viết
// // PUT    /api/Post/{id}     → sửa bài viết
// // DELETE /api/Post/{id}     → xóa bài viết
// // POST   /api/Post/{id}/comment → bình luận
// // POST   /api/Post/{id}/react   → react (like/...)
// export const PostApi = {
//   createPost: (payload) => request('POST', '/Post', payload),
//   getPosts: () => request('GET', '/Post'),
//   getPost: (id) => request('GET', `/Post/${id}`),
//   updatePost: (id, payload) => request('PUT', `/Post/${id}`, payload),
//   deletePost: (id) => request('DELETE', `/Post/${id}`),
//   commentPost: (id, payload) => request('POST', `/Post/${id}/comment`, payload),
//   reactPost: (id, payload) => request('POST', `/Post/${id}/react`, payload),
// };

// // ── Relationship API ──────────────────────────────────────────────
// // Swagger chưa thấy rõ, giữ nguyên endpoint cũ — cập nhật khi biết thêm
// export const RelationshipApi = {
//   sendFriendRequest: (userId) => request('POST', `/relationship/send/${userId}`),
//   acceptRequest: (userId) => request('POST', `/relationship/accept/${userId}`),
//   rejectRequest: (userId) => request('POST', `/relationship/reject/${userId}`),
//   unfriend: (userId) => request('DELETE', `/relationship/unfriend/${userId}`),
//   getFriends: () => request('GET', '/relationship/friends'),
//   getPendingRequests: () => request('GET', '/relationship/requests/pending'),
//   getStatus: (userId) => request('GET', `/relationship/status/${userId}`),
//   searchUsers: (query) =>
//     request('GET', `/relationship/search?q=${encodeURIComponent(query)}`),
// };

// // ── Relationship Status Enum ──────────────────────────────────────
// export const RelationshipStatus = {
//   NONE: 0,
//   PENDING_SENT: 1,
//   PENDING_RECEIVED: 2,
//   FRIENDS: 3,
//   BLOCKED: 4,
// };
// api.js — THSocialMedia Frontend API Service
// Base URL khớp với launchSettings.json (https profile)


const API_BASE = 'https://localhost:7069/api';

// ── Auth token management ─────────────────────────────────────────
export const Auth = {
  getToken:    ()      => localStorage.getItem('token'),
  setToken:    (t)     => localStorage.setItem('token', t),
  clearToken:  ()      => localStorage.removeItem('token'),
  getUserId:   ()      => localStorage.getItem('userId'),
  setUserId:   (id)    => localStorage.setItem('userId', String(id)),
  getUsername: ()      => localStorage.getItem('username'),
  setUsername: (name)  => localStorage.setItem('username', name),
  isLoggedIn:  ()      => !!localStorage.getItem('token'),
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },
};

// ── Base fetch: KHÔNG redirect khi 401 (dùng cho login) ──────────
async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, opts);
  } catch {
    throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
  }

  let data = {};
  try { data = await res.json(); } catch { /* body rỗng */ }

  if (!res.ok) {
    // Ưu tiên lấy message từ ApiResponse.errors (ApiErrorResponse.Message)
    const msg =
      data?.errors?.[0]?.message ??
      data?.errors?.[0] ??
      data?.message ??
      (res.status === 401
        ? 'Tên đăng nhập hoặc mật khẩu không đúng'
        : `Lỗi HTTP ${res.status}`);
    throw new Error(msg);
  }

  return data;
}

// ── Auth fetch: redirect về /login khi token hết hạn (401) ───────
async function authRequest(method, path, body = null) {
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
  try { data = await res.json(); } catch { /* empty */ }

  if (res.status === 401) {
    Auth.clear();
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const msg =
      data?.errors?.[0]?.message ??
      data?.errors?.[0] ??
      `Lỗi HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

// ═══════════════════════════════════════════════════════════════════
// AuthApi → POST /api/Auth/login
//
// Backend LoginCommand: { UserName, Password }
// Backend trả: ApiResponse<string> → { success, statusCode, result: "<token>" }
//
// QUAN TRỌNG: gửi "userName" (camelCase) — C# JSON binding
// case-insensitive sẽ map vào "UserName" đúng
// ═══════════════════════════════════════════════════════════════════
export const AuthApi = {
  login: ({ userName, password }) =>
    request('POST', '/Auth/login', { userName, password }),
};

// ═══════════════════════════════════════════════════════════════════
// AccountApi → /api/User  (UserController)
// ═══════════════════════════════════════════════════════════════════
export const AccountApi = {
  // POST /api/User — CreateUserCommand: { username, email, fullName }
  register: ({ username, email, fullName }) =>
    request('POST', '/User', { username, email, fullName }),

  // GET /api/User/{id} — UserController.GetById()
  // Response: ApiResponse<UserViewModel> → { result: { id, username, email, fullName, ... } }
  getProfile: (id) => {
    const targetId = id ?? Auth.getUserId();
    if (!targetId) throw new Error('Chưa đăng nhập');
    return authRequest('GET', `/User/${targetId}`);
  },

  // PUT /api/User/{id} — UpdateUserCommand
  updateProfile: (payload) => {
    const id = Auth.getUserId();
    if (!id) throw new Error('Chưa đăng nhập');
    return authRequest('PUT', `/User/${id}`, payload);
  },

  // GET /api/User — GetAllUsersQuery (dùng để search tạm)
  getAll: () => authRequest('GET', '/User'),
};

// ═══════════════════════════════════════════════════════════════════
// PostApi → /api/Post  (PostController)
// Response mọi endpoint: ApiResponse<T> với T là PostViewModel / Guid / bool
// ═══════════════════════════════════════════════════════════════════
export const PostApi = {
  // POST /api/Post — CreatePostCommand: { content, visibility, fileUrls }
  createPost: (payload) => authRequest('POST', '/Post', payload),

  // GET /api/Post — Result<IEnumerable<PostViewModel>>
  getPosts: () => authRequest('GET', '/Post'),

  // GET /api/Post/{id} — Result<PostViewModel>
  getPost: (id) => authRequest('GET', `/Post/${id}`),

  // PUT /api/Post/{id} — UpdatePostCommand: { id, content, visibility, fileUrls }
  updatePost: (id, payload) => authRequest('PUT', `/Post/${id}`, { ...payload, id }),

  // DELETE /api/Post/{id}
  deletePost: (id) => authRequest('DELETE', `/Post/${id}`),

  // POST /api/Post/{id}/comment — CommentPostCommand: { content, fileUrl }
  commentPost: (id, payload) => authRequest('POST', `/Post/${id}/comment`, payload),

  // POST /api/Post/{id}/react — AddReactionPostCommand: { reactionId }
  reactPost: (id, reactionId) =>
    authRequest('POST', `/Post/${id}/react`, { reactionId }),
};

// ═══════════════════════════════════════════════════════════════════
// RelationshipApi — cập nhật khi có RelationshipController
// ═══════════════════════════════════════════════════════════════════
export const RelationshipApi = {
  sendFriendRequest: (userId) => authRequest('POST',   `/Relationship/send/${userId}`),
  acceptRequest:     (userId) => authRequest('PUT',    `/Relationship/accept/${userId}`),
  rejectRequest:     (userId) => authRequest('PUT',    `/Relationship/reject/${userId}`),
  unfriend:          (userId) => authRequest('DELETE', `/Relationship/unfriend/${userId}`),
  getFriends:        ()       => authRequest('GET',    '/Relationship/friends'),
  getPendingRequests:()       => authRequest('GET',    '/Relationship/requests/pending'),
  getStatus:         (userId) => authRequest('GET',    `/Relationship/status/${userId}`),
  searchUsers:       (query)  => authRequest('GET',
    `/Relationship/search?q=${encodeURIComponent(query)}`),
};

export const RelationshipStatus = {
  NONE: 0, PENDING_SENT: 1, PENDING_RECEIVED: 2, FRIENDS: 3, BLOCKED: 4,
};
