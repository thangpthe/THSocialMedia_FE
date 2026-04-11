import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { AccountApi, Auth } from '../lib/api';
import { getInitials } from '../lib/ui';
import "../styles/Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await AccountApi.getProfile(userId);
        setProfile(response.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <Layout>
        <div className="profile-container">
          <div className="skeleton" style={{ height: '250px', borderRadius: '16px' }}></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="profile-container">
          <div className="alert alert-error">Lỗi: {error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="cover-photo"></div>
          <div className="profile-info-bar">
            <div className="profile-main">
              <div className="avatar-box">
                <div className="avatar-placeholder">{getInitials(profile?.fullName || 'U')}</div>
              </div>
              <div className="profile-meta">
                <h1>{profile?.fullName || 'User Profile'}</h1>
                <p className="username">@{profile?.username || 'username'}</p>
                <p className="friends-count">1.2K bạn bè</p>
              </div>
            </div>
            <div className="profile-actions">
              {!userId && <button className="btn btn-primary">Chỉnh sửa hồ sơ</button>}
              <button className="btn btn-secondary">Nhắn tin</button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-grid">
          <aside className="profile-sidebar">
            <div className="card">
              <h3>Giới thiệu</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {profile?.bio || 'Chưa có thông tin'}
              </p>
            </div>
          </aside>

          <main className="profile-content">
            <div className="card">
              <input
                type="text"
                placeholder="Bạn đang nghĩ gì?"
                className="post-input"
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'var(--surface-2)',
                  padding: '1rem',
                  borderRadius: '20px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />
            </div>

            {/* Posts Section */}
            <div className="posts-section">
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                Chưa có bài viết nào
              </p>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
