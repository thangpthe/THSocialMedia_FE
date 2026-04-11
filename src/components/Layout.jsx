import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth, AccountApi } from '../lib/api';
import Toast from './Toast';
import '../styles/Layout.css';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await AccountApi.getProfile();
        setUser(res.result);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    if (Auth.isLoggedIn()) {
      fetchUser();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await AccountApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    Auth.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-emoji">📱</span>
            <span className="logo-text">THSocial</span>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="nav">
          <a
            href="/profile"
            className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Trang cá nhân</span>
          </a>
          <a
            href="/friends"
            className={`nav-item ${isActive('/friends') ? 'active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-label">Bạn bè</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="main">
        {children}
      </main>

      <Toast />
    </div>
  );
}
