// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AccountApi, Auth } from '../lib/api';
// import '../styles/Login.css';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const res = await AccountApi.login(form);
//       Auth.setToken(res.token);
//       Auth.setUserId(res.userId);
//       navigate('/profile');
//     } catch (err) {
//       setError(err.message || 'Đăng nhập thất bại');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         {/* Left side - Brand */}
//         <div className="login-left">
//           <div className="login-brand">
//             <div className="brand-logo">📱</div>
//             <h1>TH Social</h1>
//           </div>
//           <p className="brand-tagline">
//             Kết nối, chia sẻ và khám phá những khoảnh khắc tuyệt vời cùng cộng đồng
//           </p>
//         </div>

//         {/* Right side - Form */}
//         <div className="login-right">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <h2 className="text-3xl font-bold text-center">Chào mừng quay trở lại</h2>

//             {error && (
//               <div className="alert alert-error text-center">{error}</div>
//             )}

//             <div className="input-group">
//               <label>Tên đăng nhập / Email</label>
//               <input
//                 type="text"
//                 placeholder="nhập tên đăng nhập hoặc email"
//                 value={form.username}
//                 onChange={(e) => setForm({ ...form, username: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label>Mật khẩu</label>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="btn btn-primary btn-lg w-full"
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner" /> Đang đăng nhập...
//                 </>
//               ) : (
//                 'Đăng nhập ngay'
//               )}
//             </button>

//             <p className="text-center text-sm text-slate-500">
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
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // ✅ Gọi đúng /api/Auth/login
      const res = await AuthApi.login(form);

      // Backend trả về token ở res.token hoặc res.result.token — xử lý cả hai
      const token = res.token ?? res.result?.token;
      const userId = res.userId ?? res.result?.userId;
      const username = res.username ?? res.result?.username;

      if (!token) throw new Error('Không nhận được token từ server');

      Auth.setToken(token);
      Auth.setUserId(userId);
      if (username) Auth.setUsername(username);

      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Chào mừng quay trở lại</h2>

            {error && (
              <div className="alert alert-error text-center">{error}</div>
            )}

            <div className="input-group">
              <label>Tên đăng nhập / Email</label>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập hoặc email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <><span className="spinner" /> Đang đăng nhập...</>
              ) : (
                'Đăng nhập ngay'
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              Chưa có tài khoản?{' '}
              <a href="/register" className="text-primary font-semibold hover:underline">
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
