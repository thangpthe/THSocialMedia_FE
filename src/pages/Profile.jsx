import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { AccountApi, RelationshipApi, Auth } from '../lib/api';
import { getInitials } from '../lib/ui';
import "../styles/Profile.css";

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');
  const myId = Auth.getUserId();
  const isMe = !targetId || targetId === myId;

  const [profile, setProfile] = useState(null);
  const [relStatus, setRelStatus] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pData = await AccountApi.getProfile(targetId);
        setProfile(pData.result || pData);

        if (!isMe) {
          const sData = await RelationshipApi.getStatus(targetId);
          setRelStatus(sData.result || 0);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [targetId, isMe]);

  const handleFriendAction = async () => {
    if (relStatus === 0) {
      await RelationshipApi.sendFriendRequest(targetId);
      alert('✅ Đã gửi lời mời kết bạn!');
      setRelStatus(1); // pending sent
    } else if (relStatus === 3) {
      if (window.confirm('Hủy kết bạn?')) {
        await RelationshipApi.unfriend(targetId);
        setRelStatus(0);
      }
    }
  };

  if (!profile) {
    return (
      <Layout>
        <div className="profile-container">
          <div className="skeleton" style={{ height: '400px', borderRadius: '20px' }} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-header-card">
          <div className="cover-photo" />
          <div className="profile-info-bar">
            <div className="profile-main">
              <div className="avatar-box">
                <div className="avatar-placeholder">
                  {getInitials(profile.fullName || profile.username)}
                </div>
              </div>
              <div className="profile-meta">
                <h1>{profile.fullName || profile.username}</h1>
                <p className="username">@{profile.username}</p>
                <p className="friends-count">1.2K bạn bè • {profile.bio || 'Chưa có tiểu sử'}</p>
              </div>
            </div>

            <div className="profile-actions">
              {isMe ? (
                <button className="btn btn-primary">Chỉnh sửa hồ sơ</button>
              ) : (
                <button
                  onClick={handleFriendAction}
                  className={`btn ${relStatus === 3 ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {relStatus === 3 ? 'Hủy kết bạn' : 'Kết bạn'}
                </button>
              )}
              <button className="btn btn-secondary">Nhắn tin</button>
            </div>
          </div>
        </div>

        {/* Phần nội dung bên dưới */}
        <div className="profile-grid">
          <aside className="profile-sidebar">
            <div className="card">
              <h3>Giới thiệu</h3>
              <p>{profile.bio || 'Chưa có thông tin gì...'}</p>
            </div>
          </aside>

          <main className="profile-content">
            <div className="card">
              <input
                type="text"
                placeholder="Bạn đang nghĩ gì?"
                style={{ width: '100%', padding: '1rem', borderRadius: '9999px', border: '1px solid var(--border)' }}
              />
            </div>

            <div className="posts-section card">
              <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                Chưa có bài viết nào
              </p>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;