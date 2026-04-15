import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// import { Auth, AccountApi } from '../lib/api';
import { Auth } from '../lib/api/baseApi';
import { AccountApi } from '../lib/api/account.api';
import { getInitials } from '../lib/ui';
import Toast from './Toast';
import '../styles/Layout.css';

const NAV_ITEMS = [
  { path: '/',        icon: 'home',        label: 'Trang chủ' },
  { path: '/profile', icon: 'person',      label: 'Trang cá nhân' },
  { path: '/friends', icon: 'group',       label: 'Bạn bè' },
];

export default function Layout({ children, title, showSearch = false, onSearch }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user info for avatar/name
  useEffect(() => {
    if (!Auth.isLoggedIn()) return;
    const cached = Auth.getUsername();
    if (cached) setUser({ username: cached, fullName: cached });

    AccountApi.getProfile()
      .then((res) => {
        const u = res?.result ?? res;
        if (u) {
          setUser(u);
          if (u.username) Auth.setUsername(u.username);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = useCallback(() => {
    Auth.clear();
    navigate('/login');
  }, [navigate]);

  const closeSidebar = () => setSidebarOpen(false);

  const displayName = user?.fullName || user?.username || 'Người dùng';

  return (
    <div className="app-shell">
      {/* ── Mobile topbar ── */}
      <div className="topbar">
        <button className="topbar-hamburger" onClick={() => setSidebarOpen(true)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="topbar-brand">thsocial</span>
        <div className="avatar sm">{getInitials(displayName)}</div>
      </div>

      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>hub</span>
          </div>
          <span className="sidebar-brand-name">thsocial</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="sidebar-footer">
          <div
            className="sidebar-user"
            onClick={() => { navigate('/profile'); closeSidebar(); }}
          >
            <div className="avatar">{getInitials(displayName)}</div>
            <div style={{ overflow: 'hidden' }}>
              <div className="sidebar-user-name">{displayName}</div>
              {user?.username && (
                <div className="sidebar-user-sub">@{user.username}</div>
              )}
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="material-symbols-outlined nav-icon">logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Page area ── */}
      <div className="page-area">
        {/* Desktop topbar inside page */}
        <div className="page-topbar">
          <span className="page-topbar-title">{title || 'thsocial'}</span>

          {showSearch && (
            <div className="topbar-search">
              <span className="material-symbols-outlined topbar-search-icon">search</span>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}

          <div className="topbar-actions">
            <button className="topbar-icon-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div
              className="avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
              title={displayName}
            >
              {getInitials(displayName)}
            </div>
          </div>
        </div>

        {/* Main content slot */}
        {children}
      </div>

      <Toast />
    </div>
  );
}
