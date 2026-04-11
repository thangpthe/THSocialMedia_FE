import React, { useState } from 'react';
import { AccountApi } from '../lib/api';
import { validateEmail, validatePassword, showToast } from '../lib/ui';

export default function RegisterForm({ onSwitchMode }) {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!validateEmail(formData.email)) newErrors.email = 'Email không hợp lệ';

    const pwErr = validatePassword(formData.password);
    if (pwErr) newErrors.password = pwErr;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await AccountApi.register({
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
      });

      showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
      onSwitchMode();
      setFormData({ username: '', fullName: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      const msg = error.message || 'Đăng ký thất bại';
      setErrors({ submit: msg });
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem' }}>Tạo tài khoản mới</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Tham gia TH Social để kết nối với cộng đồng
      </p>

      {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="chọn tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.username && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.username}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="fullName">Họ và tên</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="nhập họ tên đầy đủ"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.fullName && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.fullName}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.email}</span>}
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

        <div className="input-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.confirmPassword && <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Đang tạo tài khoản...
            </>
          ) : (
            'Đăng ký'
          )}
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Đã có tài khoản?{' '}
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
            Đăng nhập
          </button>
        </p>
      </div>
    </div>
  );
}
