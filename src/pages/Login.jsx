import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { AuthApi, Auth } from '../lib/api';
import { AuthApi } from '../lib/api/auth.api';
import { Auth } from '../lib/api/baseApi';
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
    
      const response = await AuthApi.login({
        userName: form.identifier.trim(),
        password: form.password,
      });

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

  // return (
  //   <div className="login-page">
  //     <div className="login-container">

  //       <div className="login-left">
  //         <div className="login-brand">
  //           <div className="brand-logo">📱</div>
  //           <h1>TH Social</h1>
  //         </div>
  //         <p className="brand-tagline">
  //           Kết nối, chia sẻ và khám phá những khoảnh khắc tuyệt vời cùng cộng đồng
  //         </p>
  //       </div>

  //       <div className="login-right">
  //         <div className="login-header">
  //           <h2>Đăng nhập</h2>
  //           <p>Chào mừng bạn quay trở lại!</p>
  //         </div>

  //         <form onSubmit={handleSubmit} className="login-form" noValidate>

  //           {error && (
  //             <div className="error-message" role="alert" style={{
  //               color: '#dc2626', backgroundColor: '#fef2f2',
  //               border: '1px solid #fecaca', padding: '10px 14px',
  //               borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  //             }}>
  //               {error}
  //             </div>
  //           )}

  //           <div className="input-group">
  //             <label htmlFor="identifier">Tên đăng nhập</label>
  //             <input
  //               id="identifier"
  //               type="text"
  //               placeholder="Nhập tên đăng nhập"
  //               value={form.identifier}
  //               onChange={(e) => setForm({ ...form, identifier: e.target.value })}
  //               autoComplete="username"
  //               disabled={loading}
  //             />
  //           </div>

  //           <div className="input-group">
  //             <label htmlFor="password">Mật khẩu</label>
  //             <input
  //               id="password"
  //               type="password"
  //               placeholder="••••••••"
  //               value={form.password}
  //               onChange={(e) => setForm({ ...form, password: e.target.value })}
  //               autoComplete="current-password"
  //               disabled={loading}
  //             />
  //           </div>

  //           <button
  //             type="submit"
  //             disabled={loading}
  //             className="btn btn-primary btn-lg w-full"
  //           >
  //             {loading
  //               ? <><span className="spinner" /> Đang đăng nhập...</>
  //               : 'Đăng nhập ngay'
  //             }
  //           </button>

  //           <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '1.5rem', color: '#64748b' }}>
  //             Chưa có tài khoản?{' '}
  //             <a href="/register" style={{ color: '#2563eb', fontWeight: 600 }}>
  //               Đăng ký miễn phí
  //             </a>
  //           </p>

  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // );


  // src/pages/Login.jsx (Đoạn mã chỉnh sửa phần JSX)
return (
  <div className="login-page">
    <div className="login-container">
      {/* Cột trái: Thương hiệu */}
      <div className="login-left">
        <span className="material-symbols-outlined" style={{fontSize: '64px', marginBottom: '20px'}}>hub</span>
        <h1>thsocial</h1>
        <p>Kết nối cộng đồng, chia sẻ khoảnh khắc và lan tỏa niềm vui mỗi ngày.</p>
      </div>

      {/* Cột phải: Form */}
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Chào mừng trở lại</h2>
          <p className="subtitle">Vui lòng nhập thông tin để truy cập tài khoản của bạn.</p>

          {error && <div className="alert alert-error" style={{marginBottom: '20px'}}>{error}</div>}

          <div className="input-group">
            <label htmlFor="identifier">Username</label>
            <input
              id="identifier"
              type="text"
              placeholder="ten.dang.nhap@example.com"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              disabled={loading}
              autoComplete="username"
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
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg btn-full"
            style={{marginTop: '10px'}}
          >
            {loading ? <span className="spinner"></span> : 'Đăng nhập ngay'}
          </button>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
              Chưa có tài khoản?{' '}
              <a href="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                Đăng ký miễn phí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
);
};

export default LoginPage;
