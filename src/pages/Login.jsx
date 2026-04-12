// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthApi, Auth } from '../lib/api';
// import '../styles/Login.css';

// const LoginPage = () => {
//   const navigate = useNavigate();

//   // identifier: username hoặc email — xử lý ở handleSubmit
//   const [form, setForm] = useState({ identifier: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     // Validate phía client trước khi gọi API
//     if (!form.identifier.trim()) {
//       setError('Vui lòng nhập tên đăng nhập hoặc email');
//       return;
//     }
//     if (!form.password) {
//       setError('Vui lòng nhập mật khẩu');
//       return;
//     }

//     setLoading(true);
//     try {
//       /*
//        * LoginCommand gửi lên: { username, email, password }
//        * Backend LoginCommandHandler phân biệt username/email bằng contains('@')
//        *
//        * ApiResponse<LoginResult> trả về:
//        * {
//        *   success: true,
//        *   statusCode: 200,
//        *   result: { token, userId, username, fullName, avatarUrl }
//        * }
//        */
//       const isEmail = form.identifier.includes('@');
//       const payload = {
//         username: isEmail ? ''                  : form.identifier.trim(),
//         email:    isEmail ? form.identifier.trim() : '',
//         password: form.password,
//       };

//       const response = await AuthApi.login(payload);

//       /*
//        * Backend dùng ApiResponse<T>.ToActionResult() → result nằm trong response.result
//        * Xử lý cả hai trường hợp phòng backend trả flat object
//        */
//       const loginResult = response?.result ?? response;

//       const token    = loginResult?.token;
//       const userId   = loginResult?.userId;
//       const username = loginResult?.username;
//       const fullName = loginResult?.fullName;

//       if (!token) {
//         throw new Error('Không nhận được token từ server. Vui lòng thử lại.');
//       }

//       // Lưu JWT + thông tin user
//       Auth.setToken(token);
//       if (userId)   Auth.setUserId(String(userId));
//       if (username) Auth.setUsername(username);

//       // Redirect về trang profile sau khi đăng nhập thành công
//       navigate('/profile');

//     } catch (err) {
//       /*
//        * Mapping message từ backend (§4.3.1.2):
//        * - "Tên đăng nhập hoặc mật khẩu không đúng" (401 từ LoginCommandHandler)
//        * - Network error → message từ request() wrapper
//        */
//       const msg = err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">

//         {/* Left side — Brand */}
//         <div className="login-left">
//           <div className="login-brand">
//             <div className="brand-logo">📱</div>
//             <h1>TH Social</h1>
//           </div>
//           <p className="brand-tagline">
//             Kết nối, chia sẻ và khám phá những khoảnh khắc tuyệt vời cùng cộng đồng
//           </p>
//         </div>

//         {/* Right side — Login Form */}
//         <div className="login-right">
//           <div className="login-header">
//             <h2>Đăng nhập</h2>
//             <p>Chào mừng bạn quay trở lại!</p>
//           </div>

//           <form onSubmit={handleSubmit} className="login-form" noValidate>

//             {/* Error message (§4.3.1.2 output) */}
//             {error && (
//               <div
//                 className="error-message"
//                 role="alert"
//                 style={{
//                   color: '#dc2626',
//                   backgroundColor: '#fef2f2',
//                   border: '1px solid #fecaca',
//                   padding: '10px 14px',
//                   borderRadius: '8px',
//                   marginBottom: '16px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {error}
//               </div>
//             )}

//             {/* Input: Tên đăng nhập / Email (§4.3.1.2) */}
//             <div className="input-group">
//               <label htmlFor="identifier">Tên đăng nhập / Email</label>
//               <input
//                 id="identifier"
//                 type="text"
//                 placeholder="Nhập tên đăng nhập hoặc email"
//                 value={form.identifier}
//                 onChange={(e) => setForm({ ...form, identifier: e.target.value })}
//                 autoComplete="username"
//                 disabled={loading}
//               />
//             </div>

//             {/* Input: Mật khẩu (§4.3.1.2) */}
//             <div className="input-group">
//               <label htmlFor="password">Mật khẩu</label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 autoComplete="current-password"
//                 disabled={loading}
//               />
//             </div>

//             {/* Submit — nút "Đăng nhập" (§4.3.1.2) */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn btn-primary btn-lg w-full"
//             >
//               {loading
//                 ? <><span className="spinner" /> Đang đăng nhập...</>
//                 : 'Đăng nhập ngay'
//               }
//             </button>

//             <p
//               className="text-center text-sm text-slate-500"
//               style={{ marginTop: '1.5rem' }}
//             >
//               Chưa có tài khoản?{' '}
//               <a href="/register" className="text-primary font-semibold hover:underline">
//                 Đăng ký miễn phí
//               </a>
//             </p>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthApi, Auth } from '../lib/api';
import '../styles/Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.identifier.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }
    if (!form.password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);
    try {
      /*
       * Backend LoginCommand nhận: { UserName, Password }
       * LoginCommandHandler tìm: x.Username == request.UserName
       * → Chỉ hỗ trợ đăng nhập bằng username, không hỗ trợ email
       *
       * Gửi đúng field name "userName" (C# JSON binding case-insensitive
       * sẽ map "userName" → UserName)
       */
      const response = await AuthApi.login({
        userName: form.identifier.trim(),
        password: form.password,
      });

      /*
       * Backend trả: ApiResponse<string> (Result<string>)
       * {
       *   success: true,
       *   statusCode: 200,
       *   result: "<jwt_token_string>"   ← token là string thẳng
       * }
       */
      const token = response?.result ?? response?.token ?? response;

      if (!token || typeof token !== 'string') {
        throw new Error('Không nhận được token từ server');
      }

      Auth.setToken(token);

      // Decode JWT để lấy userId và username (không cần gọi thêm API)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId   = payload['UserGuid'] ?? payload['sub'];
        const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
                      ?? payload['name']
                      ?? form.identifier.trim();
        if (userId)   Auth.setUserId(userId);
        if (username) Auth.setUsername(username);
      } catch {
        // Decode thất bại — không critical, vẫn đăng nhập được
      }

      navigate('/');
    } catch (err) {
      /*
       * 401 từ LoginCommandHandler (user null hoặc sai password)
       * → api.js throw new Error("Tên đăng nhập hoặc mật khẩu không đúng")
       */
      setError(err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-left">
          <div className="login-brand">
            <div className="brand-logo">📱</div>
            <h1>TH Social</h1>
          </div>
          <p className="brand-tagline">
            Kết nối, chia sẻ và khám phá những khoảnh khắc tuyệt vời cùng cộng đồng
          </p>
        </div>

        <div className="login-right">
          <div className="login-header">
            <h2>Đăng nhập</h2>
            <p>Chào mừng bạn quay trở lại!</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>

            {error && (
              <div className="error-message" role="alert" style={{
                color: '#dc2626', backgroundColor: '#fef2f2',
                border: '1px solid #fecaca', padding: '10px 14px',
                borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
              }}>
                {error}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="identifier">Tên đăng nhập</label>
              <input
                id="identifier"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading
                ? <><span className="spinner" /> Đang đăng nhập...</>
                : 'Đăng nhập ngay'
              }
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '1.5rem', color: '#64748b' }}>
              Chưa có tài khoản?{' '}
              <a href="/register" style={{ color: '#2563eb', fontWeight: 600 }}>
                Đăng ký miễn phí
              </a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
