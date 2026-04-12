// // const API_BASE = 'https://localhost:7069/api';

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

// //   // Token hết hạn → logout
// //   if (res.status === 401) {
// //     if (path.includes('/login')) {
// //       throw new Error("Sai tên đăng nhập hoặc mật khẩu");
// //   }
// //     Auth.clear();
// //     window.location.href = '/login';
// //     return;
// //   }

// //   let data;
// //   try {
// //     data = await res.json();
// //   } catch {
// //     data = {};
// //   }

// //   if (!res.ok) {
// //     // Thử lấy message từ nhiều dạng response khác nhau
// //     const msg =
// //       data.message ||
// //       data.errors?.[0]?.message ||
// //       data.errors?.[0] ||
// //       `HTTP ${res.status}`;
// //     throw new Error(msg);
// //   }

// //   return data;
// // }

// // // ── Auth API → /api/Auth ──────────────────────────────────────────
// // // POST /api/Auth/login
// // export const AuthApi = {
// //   login: ({ username, email, password }) =>
// //     request('POST', '/Auth/login', { username, email, password })
// // };


// // export const AccountApi = {
// //   // Đăng ký tài khoản mới
// //   register: ({ username, password, fullName, email }) =>
// //     request('POST', '/User', { username, password, fullName, email }),

// //   // Lấy profile: nếu có id → GET /User/{id}, không → GET /User/me hoặc dùng id từ localStorage
// //   getProfile: (id) => {
// //     if (id) return request('GET', `/User/${id}`);
// //     const myId = Auth.getUserId();
// //     if (myId) return request('GET', `/User/${myId}`);
// //     return request('GET', '/User/me'); // fallback nếu backend hỗ trợ
// //   },

// //   // Cập nhật profile
// //   updateProfile: (id, payload) => request('PUT', `/User/${id}`, payload),

// //   // Tìm kiếm users: GET /api/User?q=...  (nếu backend hỗ trợ query param)
// //   searchUsers: (query) =>
// //     request('GET', `/User?q=${encodeURIComponent(query)}`),
// // };

// // // ── Post API → /api/Post ──────────────────────────────────────────
// // // POST   /api/Post          → tạo bài viết
// // // GET    /api/Post          → lấy danh sách bài viết (feed)
// // // GET    /api/Post/{id}     → lấy 1 bài viết
// // // PUT    /api/Post/{id}     → sửa bài viết
// // // DELETE /api/Post/{id}     → xóa bài viết
// // // POST   /api/Post/{id}/comment → bình luận
// // // POST   /api/Post/{id}/react   → react (like/...)
// // export const PostApi = {
// //   createPost: (payload) => request('POST', '/Post', payload),
// //   getPosts: () => request('GET', '/Post'),
// //   getPost: (id) => request('GET', `/Post/${id}`),
// //   updatePost: (id, payload) => request('PUT', `/Post/${id}`, payload),
// //   deletePost: (id) => request('DELETE', `/Post/${id}`),
// //   commentPost: (id, payload) => request('POST', `/Post/${id}/comment`, payload),
// //   reactPost: (id, payload) => request('POST', `/Post/${id}/react`, payload),
// // };

// // // ── Relationship API ──────────────────────────────────────────────
// // // Swagger chưa thấy rõ, giữ nguyên endpoint cũ — cập nhật khi biết thêm
// // export const RelationshipApi = {
// //   sendFriendRequest: (userId) => request('POST', `/relationship/send/${userId}`),
// //   acceptRequest: (userId) => request('POST', `/relationship/accept/${userId}`),
// //   rejectRequest: (userId) => request('POST', `/relationship/reject/${userId}`),
// //   unfriend: (userId) => request('DELETE', `/relationship/unfriend/${userId}`),
// //   getFriends: () => request('GET', '/relationship/friends'),
// //   getPendingRequests: () => request('GET', '/relationship/requests/pending'),
// //   getStatus: (userId) => request('GET', `/relationship/status/${userId}`),
// //   searchUsers: (query) =>
// //     request('GET', `/relationship/search?q=${encodeURIComponent(query)}`),
// // };

// // // ── Relationship Status Enum ──────────────────────────────────────
// // export const RelationshipStatus = {
// //   NONE: 0,
// //   PENDING_SENT: 1,
// //   PENDING_RECEIVED: 2,
// //   FRIENDS: 3,
// //   BLOCKED: 4,
// // };
// // api.js — THSocialMedia Frontend API Service
// // Base URL khớp với launchSettings.json (https profile)


// // const API_BASE = 'https://localhost:7069/api';

// // // ── Auth token management ─────────────────────────────────────────
// // export const Auth = {
// //   getToken:    ()      => localStorage.getItem('token'),
// //   setToken:    (t)     => localStorage.setItem('token', t),
// //   clearToken:  ()      => localStorage.removeItem('token'),
// //   getUserId:   ()      => localStorage.getItem('userId'),
// //   setUserId:   (id)    => localStorage.setItem('userId', String(id)),
// //   getUsername: ()      => localStorage.getItem('username'),
// //   setUsername: (name)  => localStorage.setItem('username', name),
// //   isLoggedIn:  ()      => !!localStorage.getItem('token'),
// //   clear: () => {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('userId');
// //     localStorage.removeItem('username');
// //   },
// // };

// // // ── Base fetch: KHÔNG redirect khi 401 (dùng cho login) ──────────
// // async function request(method, path, body = null) {
// //   const headers = { 'Content-Type': 'application/json' };
// //   const token = Auth.getToken();
// //   if (token) headers['Authorization'] = `Bearer ${token}`;

// //   const opts = { method, headers };
// //   if (body) opts.body = JSON.stringify(body);

// //   let res;
// //   try {
// //     res = await fetch(`${API_BASE}${path}`, opts);
// //   } catch {
// //     throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
// //   }

// //   let data = {};
// //   try { data = await res.json(); } catch { /* body rỗng */ }

// //   if (!res.ok) {
// //     // Ưu tiên lấy message từ ApiResponse.errors (ApiErrorResponse.Message)
// //     const msg =
// //       data?.errors?.[0]?.message ??
// //       data?.errors?.[0] ??
// //       data?.message ??
// //       (res.status === 401
// //         ? 'Tên đăng nhập hoặc mật khẩu không đúng'
// //         : `Lỗi HTTP ${res.status}`);
// //     throw new Error(msg);
// //   }

// //   return data;
// // }

// // // ── Auth fetch: redirect về /login khi token hết hạn (401) ───────
// // async function authRequest(method, path, body = null) {
// //   const headers = { 'Content-Type': 'application/json' };
// //   const token = Auth.getToken();
// //   if (token) headers['Authorization'] = `Bearer ${token}`;

// //   const opts = { method, headers };
// //   if (body) opts.body = JSON.stringify(body);

// //   let res;
// //   try {
// //     res = await fetch(`${API_BASE}${path}`, opts);
// //   } catch {
// //     throw new Error('Không thể kết nối đến server.');
// //   }

// //   let data = {};
// //   try { data = await res.json(); } catch { /* empty */ }

// //   if (res.status === 401) {
// //     Auth.clear();
// //     window.location.href = '/login';
// //     return;
// //   }

// //   if (!res.ok) {
// //     const msg =
// //       data?.errors?.[0]?.message ??
// //       data?.errors?.[0] ??
// //       `Lỗi HTTP ${res.status}`;
// //     throw new Error(msg);
// //   }

// //   return data;
// // }

// // // ═══════════════════════════════════════════════════════════════════
// // // AuthApi → POST /api/Auth/login
// // //
// // // Backend LoginCommand: { UserName, Password }
// // // Backend trả: ApiResponse<string> → { success, statusCode, result: "<token>" }
// // //
// // // QUAN TRỌNG: gửi "userName" (camelCase) — C# JSON binding
// // // case-insensitive sẽ map vào "UserName" đúng
// // // ═══════════════════════════════════════════════════════════════════
// // export const AuthApi = {
// //   login: ({ userName, password }) =>
// //     request('POST', '/Auth/login', { userName, password }),
// // };

// // // ═══════════════════════════════════════════════════════════════════
// // // AccountApi → /api/User  (UserController)
// // // ═══════════════════════════════════════════════════════════════════
// // export const AccountApi = {
// //   // POST /api/User — CreateUserCommand: { username, email, fullName }
// //   register: ({ username, email, fullName }) =>
// //     request('POST', '/User', { username, email, fullName }),

// //   // GET /api/User/{id} — UserController.GetById()
// //   // Response: ApiResponse<UserViewModel> → { result: { id, username, email, fullName, ... } }
// //   getProfile: (id) => {
// //     const targetId = id ?? Auth.getUserId();
// //     if (!targetId) throw new Error('Chưa đăng nhập');
// //     return authRequest('GET', `/User/${targetId}`);
// //   },

// //   // PUT /api/User/{id} — UpdateUserCommand
// //   updateProfile: (payload) => {
// //     const id = Auth.getUserId();
// //     if (!id) throw new Error('Chưa đăng nhập');
// //     return authRequest('PUT', `/User/${id}`, payload);
// //   },

// //   // GET /api/User — GetAllUsersQuery (dùng để search tạm)
// //   getAll: () => authRequest('GET', '/User'),
// // };

// // // ═══════════════════════════════════════════════════════════════════
// // // PostApi → /api/Post  (PostController)
// // // Response mọi endpoint: ApiResponse<T> với T là PostViewModel / Guid / bool
// // // ═══════════════════════════════════════════════════════════════════
// // export const PostApi = {
// //   // POST /api/Post — CreatePostCommand: { content, visibility, fileUrls }
// //   createPost: (payload) => authRequest('POST', '/Post', payload),

// //   // GET /api/Post — Result<IEnumerable<PostViewModel>>
// //   getPosts: () => authRequest('GET', '/Post'),

// //   // GET /api/Post/{id} — Result<PostViewModel>
// //   getPost: (id) => authRequest('GET', `/Post/${id}`),

// //   // PUT /api/Post/{id} — UpdatePostCommand: { id, content, visibility, fileUrls }
// //   updatePost: (id, payload) => authRequest('PUT', `/Post/${id}`, { ...payload, id }),

// //   // DELETE /api/Post/{id}
// //   deletePost: (id) => authRequest('DELETE', `/Post/${id}`),

// //   // POST /api/Post/{id}/comment — CommentPostCommand: { content, fileUrl }
// //   commentPost: (id, payload) => authRequest('POST', `/Post/${id}/comment`, payload),

// //   // POST /api/Post/{id}/react — AddReactionPostCommand: { reactionId }
// //   reactPost: (id, reactionId) =>
// //     authRequest('POST', `/Post/${id}/react`, { reactionId }),
// // };

// // // ═══════════════════════════════════════════════════════════════════
// // // RelationshipApi — cập nhật khi có RelationshipController
// // // ═══════════════════════════════════════════════════════════════════
// // export const RelationshipApi = {
// //   sendFriendRequest: (userId) => authRequest('POST',   `/Relationship/send/${userId}`),
// //   acceptRequest:     (userId) => authRequest('PUT',    `/Relationship/accept/${userId}`),
// //   rejectRequest:     (userId) => authRequest('PUT',    `/Relationship/reject/${userId}`),
// //   unfriend:          (userId) => authRequest('DELETE', `/Relationship/unfriend/${userId}`),
// //   getFriends:        ()       => authRequest('GET',    '/Relationship/friends'),
// //   getPendingRequests:()       => authRequest('GET',    '/Relationship/requests/pending'),
// //   getStatus:         (userId) => authRequest('GET',    `/Relationship/status/${userId}`),
// //   searchUsers:       (query)  => authRequest('GET',
// //     `/Relationship/search?q=${encodeURIComponent(query)}`),
// // };

// // export const RelationshipStatus = {
// //   NONE: 0, PENDING_SENT: 1, PENDING_RECEIVED: 2, FRIENDS: 3, BLOCKED: 4,
// // };

// // src/lib/api.js
// // Map chính xác với backend controllers đã có:
// //   AuthController   → POST /api/Auth/login
// //   UserController   → /api/User + /api/User/AddFriend (GET/POST/PUT)
// //   PostController   → /api/Post

// const API_BASE = 'https://localhost:7069/api';

// // ── JWT token management ──────────────────────────────────────────
// export const Auth = {
//   getToken:    ()     => localStorage.getItem('token'),
//   setToken:    (t)    => localStorage.setItem('token', t),
//   clearToken:  ()     => localStorage.removeItem('token'),
//   getUserId:   ()     => localStorage.getItem('userId'),
//   setUserId:   (id)   => localStorage.setItem('userId', String(id)),
//   getUsername: ()     => localStorage.getItem('username'),
//   setUsername: (n)    => localStorage.setItem('username', n),
//   isLoggedIn:  ()     => !!localStorage.getItem('token'),
//   clear: () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userId');
//     localStorage.removeItem('username');
//   },
// };

// // ── request: KHÔNG redirect khi 401 — dùng cho login ─────────────
// async function request(method, path, body = null) {
//   const headers = { 'Content-Type': 'application/json' };
//   const token = Auth.getToken();
//   if (token) headers['Authorization'] = `Bearer ${token}`;

//   const opts = { method, headers };
//   if (body) opts.body = JSON.stringify(body);

//   let res;
//   try {
//     res = await fetch(`${API_BASE}${path}`, opts);
//   } catch {
//     throw new Error('Không thể kết nối đến server.');
//   }

//   let data = {};
//   try { data = await res.json(); } catch { /* empty body */ }

//   if (!res.ok) {
//     const msg =
//       data?.errors?.[0]?.message ??
//       data?.errors?.[0] ??
//       data?.message ??
//       (res.status === 401 ? 'Tên đăng nhập hoặc mật khẩu không đúng' : `Lỗi ${res.status}`);
//     throw new Error(msg);
//   }
//   return data;
// }

// // ── authRequest: redirect khi token hết hạn — dùng cho mọi API sau login
// async function authRequest(method, path, body = null) {
//   const headers = { 'Content-Type': 'application/json' };
//   const token = Auth.getToken();
//   if (token) headers['Authorization'] = `Bearer ${token}`;

//   const opts = { method, headers };
//   if (body) opts.body = JSON.stringify(body);

//   let res;
//   try {
//     res = await fetch(`${API_BASE}${path}`, opts);
//   } catch {
//     throw new Error('Không thể kết nối đến server.');
//   }

//   let data = {};
//   try { data = await res.json(); } catch { /* empty */ }

//   if (res.status === 401) {
//     Auth.clear();
//     window.location.href = '/login';
//     return;
//   }

//   if (!res.ok) {
//     const msg =
//       data?.errors?.[0]?.message ??
//       data?.errors?.[0] ??
//       `Lỗi ${res.status}`;
//     throw new Error(msg);
//   }
//   return data;
// }

// // ═══════════════════════════════════════════════════════════════════
// // AuthApi → POST /api/Auth/login
// // LoginCommand: { UserName, Password }  (C# JSON binding case-insensitive)
// // Response: ApiResponse<string> → { result: "<jwt_token>" }
// // ═══════════════════════════════════════════════════════════════════
// export const AuthApi = {
//   login: ({ userName, password }) =>
//     request('POST', '/Auth/login', { userName, password }),
// };

// // ═══════════════════════════════════════════════════════════════════
// // AccountApi → /api/User  (UserController)
// // ═══════════════════════════════════════════════════════════════════
// export const AccountApi = {
//   // POST /api/User — CreateUserCommand: { username, email, fullName, avatarUrl, bio }
//   register: ({ username, email, fullName }) =>
//     request('POST', '/User', { username, email, fullName }),

//   // GET /api/User/{id} — Response: plain UserViewModel (không wrap ApiResponse)
//   getProfile: (id) => {
//     const targetId = id ?? Auth.getUserId();
//     if (!targetId) throw new Error('Chưa đăng nhập');
//     return authRequest('GET', `/User/${targetId}`);
//   },

//   // GET /api/User — lấy tất cả user (dùng để tìm kiếm)
//   getAll: () => authRequest('GET', '/User'),

//   // PUT /api/User/{id} — UpdateUserCommand
//   updateProfile: (payload) => {
//     const id = Auth.getUserId();
//     if (!id) throw new Error('Chưa đăng nhập');
//     return authRequest('PUT', `/User/${id}`, payload);
//   },
// };

// // ═══════════════════════════════════════════════════════════════════
// // RelationshipApi → /api/User/AddFriend  (UserController)
// //
// // Endpoints thực tế:
// //   POST /api/User/AddFriend → SendRelationshipUserCommand
// //     body: { senderId: Guid, targetUserId: Guid }
// //     senderId có thể để "00000000-0000-0000-0000-000000000000" để dùng identity
// //
// //   PUT  /api/User/AddFriend → UpdateRelationshipUserCommand
// //     body: { id: relationshipId, status: 1|2 }
// //     QUAN TRỌNG: id là relationship.Id, KHÔNG phải userId
// //
// //   GET  /api/User/AddFriend?userId=<guid> → GetAllRelationshipsQuery
// //     Response: ApiResponse<List<RelationshipDto>>
// //     RelationshipDto: { id, userId, userName, friendId, friendName, status }
// //       status: 0=pending, 1=accepted, 2=rejected
// //
// // ═══════════════════════════════════════════════════════════════════
// // export const RelationshipApi = {
// //   /**
// //    * Gửi lời mời kết bạn
// //    * SendRelationshipUserCommand: { senderId, targetUserId }
// //    */
// //   sendFriendRequest: (targetUserId) =>
// //     authRequest('POST', '/User/AddFriend', {
// //       senderId: Auth.getUserId(),   // backend cũng fallback về IdentityService nếu Empty
// //       targetUserId,
// //     }),

// //   /**
// //    * Chấp nhận lời mời kết bạn
// //    * UpdateRelationshipUserCommand: { id: relationshipId, status: 1 }
// //    * QUAN TRỌNG: relationshipId là relationship.Id từ RelationshipDto.id
// //    */
// //   acceptRequest: (relationshipId) =>
// //     authRequest('PUT', '/User/AddFriend', { id: relationshipId, status: 1 }),

// //   /**
// //    * Từ chối lời mời kết bạn
// //    * UpdateRelationshipUserCommand: { id: relationshipId, status: 2 }
// //    */
// //   rejectRequest: (relationshipId) =>
// //     authRequest('PUT', '/User/AddFriend', { id: relationshipId, status: 2 }),

// //   /**
// //    * Lấy danh sách relationships (lọc theo ReceiverId = userId)
// //    * GetAllRelationshipsQuery: { UserId }
// //    * Response: List<RelationshipDto>
// //    */
// //   getRelationships: (userId) => {
// //     const id = userId ?? Auth.getUserId();
// //     return authRequest('GET', `/User/AddFriend?userId=${id}`);
// //   },

// //   /**
// //    * Lấy danh sách bạn bè (status === 1)
// //    * = getRelationships() rồi filter status === 1
// //    */
// //   getFriends: async () => {
// //     const res = await authRequest('GET', `/User/AddFriend?userId=${Auth.getUserId()}`);
// //     const all = res?.result ?? [];
// //     return { ...res, result: all.filter((r) => r.status === 1) };
// //   },

// //   /**
// //    * Lấy lời mời đang chờ (status === 0, gửi ĐẾN mình)
// //    * = getRelationships() rồi filter status === 0
// //    */
// //   getPendingRequests: async () => {
// //     const res = await authRequest('GET', `/User/AddFriend?userId=${Auth.getUserId()}`);
// //     const all = res?.result ?? [];
// //     return { ...res, result: all.filter((r) => r.status === 0) };
// //   },

// //   /**
// //    * Tìm kiếm user bằng GetAll rồi filter theo tên
// //    * (Backend chưa có search endpoint riêng)
// //    */
// //   searchUsers: async (query) => {
// //     const res = await authRequest('GET', '/User');
// //     const all = res?.result ?? res ?? [];
// //     const myId = String(Auth.getUserId());
// //     const q = query.toLowerCase().trim();
// //     const filtered = (Array.isArray(all) ? all : [])
// //       .filter((u) =>
// //         String(u.id) !== myId &&
// //         (u.username?.toLowerCase().includes(q) || u.fullName?.toLowerCase().includes(q))
// //       );
// //     return { result: filtered };
// //   },

// //   /**
// //    * Không có unfriend endpoint ở backend hiện tại
// //    * Placeholder — backend cần thêm DELETE /api/User/AddFriend
// //    */
// //   unfriend: (userId) =>
// //     authRequest('DELETE', `/User/AddFriend/${userId}`),
// // };

// // ... (các API khác giữ nguyên) ...

// export const RelationshipApi = {
//   // --- 1. GỬI LỜI MỜI KẾT BẠN ---
//   sendFriendRequest: (targetUserId) => {
//     // Gửi cả receiverId và targetUserId để bao trọn mọi trường hợp đặt tên biến ở C# Backend
//     const payload = {
//       senderId: Auth.getUserId() || "00000000-0000-0000-0000-000000000000",
//       receiverId: targetUserId,
//       targetUserId: targetUserId 
//     };
//     return authRequest('POST', '/User/AddFriend', payload);
//   },

//   acceptRequest: (relationshipId) =>
//     authRequest('PUT', '/User/AddFriend', { id: relationshipId, status: 1 }),

//   rejectRequest: (relationshipId) =>
//     authRequest('PUT', '/User/AddFriend', { id: relationshipId, status: 2 }),

//   getFriends: async () => {
//     const res = await authRequest('GET', `/User/AddFriend?userId=${Auth.getUserId()}`);
//     // Bắt mọi trường hợp: res.value (Ardalis) hoặc res.result
//     const all = res?.value ?? res?.result ?? [];
//     return { result: all.filter((r) => r.status === 1) };
//   },

//   getPendingRequests: async () => {
//     const res = await authRequest('GET', `/User/AddFriend?userId=${Auth.getUserId()}`);
//     const all = res?.value ?? res?.result ?? [];
//     return { result: all.filter((r) => r.status === 0) };
//   },

//   // --- 2. TÌM KIẾM NGƯỜI DÙNG ---
//   searchUsers: async (query) => {
//     try {
//       const res = await authRequest('GET', '/User');
//       console.log("=== Dữ liệu Users từ Backend ===", res); // In ra để dễ debug

//       // Trích xuất mảng dữ liệu an toàn
//       let allUsers = [];
//       if (Array.isArray(res)) allUsers = res;
//       else if (Array.isArray(res?.value)) allUsers = res.value;
//       else if (Array.isArray(res?.result)) allUsers = res.result;

//       const myId = String(Auth.getUserId()).toLowerCase();
//       const q = query.toLowerCase().trim();

//       // Lọc ra những người không phải là mình và tên khớp với từ khóa
//       const filtered = allUsers.filter((u) => {
//         const uId = String(u.id).toLowerCase();
//         const matchName = (u.username || '').toLowerCase().includes(q) || 
//                           (u.fullName || '').toLowerCase().includes(q);
//         return uId !== myId && matchName;
//       });

//       return { result: filtered };
//     } catch (err) {
//       console.error("Lỗi khi searchUsers:", err);
//       throw err;
//     }
//   },

//   unfriend: (userId) => authRequest('DELETE', `/User/AddFriend/${userId}`),
// };

// // ═══════════════════════════════════════════════════════════════════
// // PostApi → /api/Post  (PostController)
// // ═══════════════════════════════════════════════════════════════════
// export const PostApi = {
//   createPost: (payload)     => authRequest('POST', '/Post', payload),
//   getPosts:   ()            => authRequest('GET',  '/Post'),
//   getPost:    (id)          => authRequest('GET',  `/Post/${id}`),
//   updatePost: (id, payload) => authRequest('PUT',  `/Post/${id}`, { ...payload, id }),
//   deletePost: (id)          => authRequest('DELETE', `/Post/${id}`),
//   commentPost:(id, payload) => authRequest('POST', `/Post/${id}/comment`, payload),
//   reactPost:  (id, reactionId) =>
//     authRequest('POST', `/Post/${id}/react`, { reactionId }),
// };

// // ═══════════════════════════════════════════════════════════════════
// // Relationship status constants
// // Khớp với Domain/Entities/Relationship.cs và UpdateRelationshipUserCommand
// // ═══════════════════════════════════════════════════════════════════
// export const RelationshipStatus = {
//   PENDING:  0,  // pending — chưa xử lý
//   ACCEPTED: 1,  // accepted — đã là bạn bè
//   REJECTED: 2,  // rejected — đã từ chối
//   // Alias để tương thích với code cũ
//   NONE:             0,
//   PENDING_SENT:     0,
//   PENDING_RECEIVED: 0,
//   FRIENDS:          1,
// };


const API_BASE = 'https://localhost:7069/api';

// ── JWT token management ──────────────────────────────────────────
export const Auth = {
  getToken:    ()     => localStorage.getItem('token'),
  setToken:    (t)    => localStorage.setItem('token', t),
  clearToken:  ()     => localStorage.removeItem('token'),
  getUserId:   ()     => localStorage.getItem('userId'),
  setUserId:   (id)   => localStorage.setItem('userId', String(id)),
  getUsername: ()     => localStorage.getItem('username'),
  setUsername: (n)    => localStorage.setItem('username', n),
  isLoggedIn:  ()     => !!localStorage.getItem('token'),
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },
};

// ── request: Dùng cho Login ─────────────
async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  let res;
  try { res = await fetch(`${API_BASE}${path}`, opts); } 
  catch { throw new Error('Không thể kết nối đến server.'); }

  let data = {};
  try { data = await res.json(); } catch { }

  if (!res.ok) {
    const msg = data?.errors?.[0]?.message ?? data?.errors?.[0] ?? data?.message ?? 
               (res.status === 401 ? 'Tên đăng nhập hoặc mật khẩu không đúng' : `Lỗi ${res.status}`);
    throw new Error(msg);
  }
  return data;
}

// ── authRequest: Dùng cho mọi API sau Login (Có bắt lỗi chi tiết C#)
async function authRequest(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  let res;
  try { res = await fetch(`${API_BASE}${path}`, opts); } 
  catch { throw new Error('Không thể kết nối đến server.'); }

  let data = {};
  try { data = await res.json(); } catch { }

  if (res.status === 401) {
    Auth.clear(); window.location.href = '/login'; return;
  }

  if (!res.ok) {
    let errorText = `Lỗi HTTP ${res.status}`;
    if (data) {
        if (data.message) errorText = data.message;
        else if (data.title) errorText = data.title; // Lỗi chuẩn RFC
        else if (data.errors) {
            if (Array.isArray(data.errors)) errorText = data.errors[0]?.message || data.errors[0];
            else if (typeof data.errors === 'object') {
                // Bắt lỗi Validation của C# (Ví dụ: Required field)
                const firstKey = Object.keys(data.errors)[0];
                errorText = `${firstKey}: ${data.errors[firstKey][0]}`;
            }
        }
    }
    throw new Error(errorText);
  }
  return data;
}

// ── API Đăng Nhập & User ──────────────────────────────────────
export const AuthApi = {
  login: ({ userName, password }) => request('POST', '/Auth/login', { userName, password }),
};

export const AccountApi = {
  register: ({ username, email, fullName }) => request('POST', '/User', { username, email, fullName }),
  getProfile: (id) => authRequest('GET', `/User/${id ?? Auth.getUserId()}`),
  updateProfile: (payload) => authRequest('PUT', `/User/${Auth.getUserId()}`, payload),
  getAll: () => authRequest('GET', '/User'),
};

// ── API KẾT BẠN (Đã fix parse Array) ──────────────────────────
// export const RelationshipApi = {
  
//   sendFriendRequest: (targetUserId) => {
//     // Truyền bao vây các tên biến thường dùng ở C#
//     const payload = { 
//         receiverId: targetUserId, 
//         targetUserId: targetUserId 
//     };
//     return authRequest('POST', '/User/AddFriend', payload);
//   },

//   acceptRequest: (relationshipId) => authRequest('PUT', '/User/AddFriend', { id: relationshipId, status: 1 }),
//   rejectRequest: (relationshipId) => authRequest('PUT', '/User/AddFriend', { id: relationshipId, status: 2 }),

//   getFriends: async () => {
//     const res = await authRequest('GET', `/User/AddFriend?userId=${Auth.getUserId()}`);
//     // Đảm bảo trích xuất đúng mảng dù C# có wrap hay không
//     const all = Array.isArray(res) ? res : (res?.value || res?.result || []);
//     return { result: all.filter((r) => r.status === 1) };
//   },

//   getPendingRequests: async () => {
//     const res = await authRequest('GET', `/User/AddFriend?userId=${Auth.getUserId()}`);
//     const all = Array.isArray(res) ? res : (res?.value || res?.result || []);
//     return { result: all.filter((r) => r.status === 0) };
//   },

//   // searchUsers: async (query) => {
//   //   const res = await authRequest('GET', '/User');
//   //   // Đảm bảo trích xuất đúng mảng
//   //   const all = Array.isArray(res) ? res : (res?.value || res?.result || []);
    
//   //   const myId = String(Auth.getUserId()).toLowerCase();
//   //   const q = query.toLowerCase().trim();

//   //   const filtered = all.filter((u) => {
//   //     const uId = String(u.id).toLowerCase();
//   //     // Bắt cả 2 format username và userName
//   //     const name = (u.fullName || u.username || u.userName || '').toLowerCase();
//   //     return uId !== myId && name.includes(q);
//   //   });

//   //   return { result: filtered };
//   // },
//   searchUsers: async (query) => {
//     // 1. Gọi API lấy toàn bộ User
//     const res = await authRequest('GET', '/User');
    
//     // 2. Trích xuất mảng an toàn (Bao trọn mọi format mà C# có thể trả về)
//     let allUsers = [];
//     if (Array.isArray(res)) {
//       allUsers = res; // C# trả về mảng trực tiếp
//     } else if (res && Array.isArray(res.value)) {
//       allUsers = res.value; // Ardalis Result format
//     } else if (res && Array.isArray(res.result)) {
//       allUsers = res.result; // Custom Wrapper format
//     }

//     // 3. ID của mình để loại trừ (không tự tìm thấy chính mình)
//     const myId = String(Auth.getUserId()).toLowerCase();
//     const q = (query || "").toLowerCase().trim();

//     // 4. Lọc mảng
//     const filtered = allUsers.filter((u) => {
//       const uId = String(u.id).toLowerCase();
      
//       // Bỏ qua tài khoản của chính mình
//       if (uId === myId) return false;

//       // Nếu ô tìm kiếm rỗng, hiển thị tất cả mọi người
//       if (!q) return true;

//       // Lọc theo FullName hoặc Username (đề phòng C# serialize chữ hoa/thường)
//       const name = String(u.fullName || '').toLowerCase();
//       const uname = String(u.username || u.userName || '').toLowerCase();

//       return name.includes(q) || uname.includes(q);
//     });

//     return { result: filtered };
//   }

//   // unfriend: (userId) => authRequest('DELETE', `/User/AddFriend/${userId}`),
// };

// src/lib/api.js

export const RelationshipApi = {
  // --- 1. GỬI LỜI MỜI KẾT BẠN ---
  sendFriendRequest: (targetUserId) => {
    // Gửi receiverId để khớp với Command ở Backend C#
    const payload = { 
        receiverId: targetUserId, 
        targetUserId: targetUserId // Dự phòng trường hợp backend dùng tên khác
    };
    return authRequest('POST', '/User/AddFriend', payload);
  },

  // Chấp nhận: Truyền ID của Relationship, không phải ID của User
  acceptRequest: (relationshipId) => 
    authRequest('PUT', '/User/AddFriend', { id: relationshipId, status: 1 }),

  // Từ chối: Truyền ID của Relationship
  rejectRequest: (relationshipId) => 
    authRequest('PUT', '/User/AddFriend', { id: relationshipId, status: 2 }),

  getFriends: async () => {
    const res = await authRequest('GET', `/User/AddFriend?userId=${Auth.getUserId()}`);
    // Đảm bảo trích xuất đúng mảng dù Backend có bọc trong 'value' hay 'result' hay không
    const all = Array.isArray(res) ? res : (res?.value || res?.result || []);
    return { result: all.filter((r) => r.status === 1) };
  },

  getPendingRequests: async () => {
    const res = await authRequest('GET', `/User/AddFriend?userId=${Auth.getUserId()}`);
    const all = Array.isArray(res) ? res : (res?.value || res?.result || []);
    return { result: all.filter((r) => r.status === 0) };
  },

  // --- 2. TÌM KIẾM THEO USERNAME ---
  searchUsers: async (query) => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return { result: [] }; // Không trả về gì nếu ô tìm kiếm trống

    const res = await authRequest('GET', '/User');
    const all = Array.isArray(res) ? res : (res?.value || res?.result || []);
    
    const myId = String(Auth.getUserId()).toLowerCase();

    const filtered = all.filter((u) => {
      const uId = String(u.id).toLowerCase();
      if (uId === myId) return false; // Loại trừ chính mình

      // Chỉ lọc theo username
      const uname = String(u.username || u.userName || '').toLowerCase();
      return uname.includes(q);
    });

    return { result: filtered };
  },
};

export const PostApi = {
  createPost: (payload)     => authRequest('POST', '/Post', payload),
  getPosts:   ()            => authRequest('GET',  '/Post'),
  getPost:    (id)          => authRequest('GET',  `/Post/${id}`),
  updatePost: (id, payload) => authRequest('PUT',  `/Post/${id}`, { ...payload, id }),
  deletePost: (id)          => authRequest('DELETE', `/Post/${id}`),
  commentPost:(id, payload) => authRequest('POST', `/Post/${id}/comment`, payload),
  reactPost:  (id, reactionId) => authRequest('POST', `/Post/${id}/react`, { reactionId }),
};