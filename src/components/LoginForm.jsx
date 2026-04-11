import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountApi, Auth } from '../lib/api';
import { showToast } from '../lib/ui';

export default function LoginForm({ onSwitchMode }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await AccountApi.login(formData);
      
      Auth.setToken(response.result?.token || response.result);
      if (response.result?.userId) Auth.setUserId(response.result.userId);
      if (response.result?.username) Auth.setUsername(response.result.username);

      showToast('Đăng nhập thành công!', 'success');
      navigate('/profile');
    } catch (error) {
      const msg = error.message || 'Đăng nhập thất bại';
      setErrors({ submit: msg });
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>Chào mừng quay trở lại</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Vui lòng đăng nhập để tiếp tục truy cập
      </p>

      {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Tên đăng nhập / Email</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="nhập tên đăng nhập hoặc email"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.username && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.username}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.password && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.password}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Chưa có tài khoản?{' '}
          <button
            onClick={onSwitchMode}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
}
