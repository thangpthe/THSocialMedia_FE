import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const menuItems = [
    { path: '/', icon: 'home', label: 'Trang chủ' },
    { path: '/profile', icon: 'person', label: 'Trang cá nhân' },
    { path: '/friends', icon: 'group', label: 'Bạn bè' },
    { path: '/messages', icon: 'chat', label: 'Tin nhắn' },
    { path: '/settings', icon: 'settings', label: 'Cài đặt' },
  ];

  return (
    <aside className="sidebar-container">
      <nav className="sidebar-nav">
        {menuItems.map((item, idx) => (
          <NavLink key={idx} to={item.path} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="material-symbols-outlined icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}