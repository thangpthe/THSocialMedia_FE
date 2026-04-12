import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { RelationshipApi, RelationshipStatus, Auth } from '../lib/api';
import { getInitials, showToast } from '../lib/ui';
import '../styles/Friends.css';

export default function Friends() {
  const [tab, setTab] = useState('all');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const myId = String(Auth.getUserId());
  const navigate = useNavigate();

  useEffect(() => { loadTab(tab); }, [tab]);

  const loadTab = async (tabName) => {
    setLoading(true);
    try {
      if (tabName === 'all') {
        const res = await RelationshipApi.getFriends();
        setFriends(res?.result || []);
      } else if (tabName === 'requests') {
        const res = await RelationshipApi.getPendingRequests();
        setRequests(res?.result || []);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await RelationshipApi.searchUsers(searchQuery);
      setSearchResults(res?.result || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    try {
      await RelationshipApi.acceptRequest(userId);
      setRequests((prev) => prev.filter((r) => r.id !== userId));
      showToast('Đã chấp nhận lời mời kết bạn', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReject = async (userId) => {
    try {
      await RelationshipApi.rejectRequest(userId);
      setRequests((prev) => prev.filter((r) => r.id !== userId));
      showToast('Đã từ chối lời mời', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await RelationshipApi.sendFriendRequest(userId);
      setSearchResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, relationshipStatus: RelationshipStatus.PENDING_SENT } : u
        )
      );
      showToast('Đã gửi lời mời kết bạn', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUnfriend = async (userId) => {
    if (!window.confirm('Hủy kết bạn?')) return;
    try {
      await RelationshipApi.unfriend(userId);
      setFriends((prev) => prev.filter((f) => f.id !== userId));
      showToast('Đã hủy kết bạn', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const TAB_DEF = [
    { key: 'all',      label: 'Tất cả',    icon: 'group',     count: friends.length },
    { key: 'requests', label: 'Lời mời',   icon: 'person_add', count: requests.length },
    { key: 'search',   label: 'Tìm kiếm', icon: 'search',     count: null },
  ];

  return (
    <Layout title="Bạn bè">
      <div className="page-content">
        {/* ── Tabs ── */}
        <div className="f-tabs">
          {TAB_DEF.map(({ key, label, icon, count }) => (
            <button
              key={key}
              className={`f-tab ${tab === key ? 'active' : ''}`}
              onClick={() => setTab(key)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
              {label}
              {count !== null && count > 0 && <span className="f-badge">{count}</span>}
            </button>
          ))}
        </div>

        {/* ── Search bar ── */}
        {tab === 'search' && (
          <div className="f-search">
            <span className="material-symbols-outlined f-search-icon">search</span>
            <input
              type="text"
              placeholder="Nhập tên hoặc username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              autoFocus
            />
            <button className="btn btn-primary btn-sm" onClick={handleSearch} disabled={loading}>
              Tìm
            </button>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="f-grid">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />
            ))}
          </div>
        ) : (
          <>
            {/* All friends */}
            {tab === 'all' && (
              <div className="f-grid">
                {friends.length === 0 ? (
                  <div className="f-empty">
                    <span className="material-symbols-outlined">group</span>
                    <p>Bạn chưa có bạn bè nào</p>
                  </div>
                ) : friends.map((friend) => (
                  <div key={friend.id} className="f-card">
                    <div
                      className="f-avatar"
                      onClick={() => navigate(`/profile?id=${friend.id}`)}
                    >
                      {getInitials(friend.fullName || friend.username)}
                    </div>
                    <div className="f-info" onClick={() => navigate(`/profile?id=${friend.id}`)}>
                      <span className="f-name">{friend.fullName || friend.username}</span>
                      <span className="f-username">@{friend.username}</span>
                    </div>
                    <div className="f-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/profile?id=${friend.id}`)}
                      >
                        Xem trang
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleUnfriend(friend.id)}
                        title="Hủy kết bạn"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Requests */}
            {tab === 'requests' && (
              <div className="f-grid">
                {requests.length === 0 ? (
                  <div className="f-empty">
                    <span className="material-symbols-outlined">inbox</span>
                    <p>Không có lời mời nào</p>
                  </div>
                ) : requests.map((user) => (
                  <div key={user.id} className="f-card">
                    <div
                      className="f-avatar"
                      onClick={() => navigate(`/profile?id=${user.id}`)}
                    >
                      {getInitials(user.fullName || user.username)}
                    </div>
                    <div className="f-info" onClick={() => navigate(`/profile?id=${user.id}`)}>
                      <span className="f-name">{user.fullName || user.username}</span>
                      <span className="f-username">@{user.username}</span>
                    </div>
                    <div className="f-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => handleAccept(user.id)}>
                        Chấp nhận
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleReject(user.id)}>
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search results */}
            {tab === 'search' && (
              <div className="f-grid">
                {searchResults.length === 0 && searchQuery.trim() ? (
                  <div className="f-empty">
                    <span className="material-symbols-outlined">search_off</span>
                    <p>Không tìm thấy kết quả cho "{searchQuery}"</p>
                  </div>
                ) : searchResults
                    .filter((u) => String(u.id) !== myId)
                    .map((user) => (
                  <div key={user.id} className="f-card">
                    <div
                      className="f-avatar"
                      onClick={() => navigate(`/profile?id=${user.id}`)}
                    >
                      {getInitials(user.fullName || user.username)}
                    </div>
                    <div className="f-info" onClick={() => navigate(`/profile?id=${user.id}`)}>
                      <span className="f-name">{user.fullName || user.username}</span>
                      <span className="f-username">@{user.username}</span>
                    </div>
                    <div className="f-actions">
                      {user.relationshipStatus === RelationshipStatus.FRIENDS ? (
                        <button className="btn btn-ghost btn-sm" disabled>✓ Bạn bè</button>
                      ) : user.relationshipStatus === RelationshipStatus.PENDING_SENT ? (
                        <button className="btn btn-ghost btn-sm" disabled>Đã gửi</button>
                      ) : user.relationshipStatus === RelationshipStatus.PENDING_RECEIVED ? (
                        <button className="btn btn-success btn-sm" onClick={() => handleAccept(user.id)}>
                          Chấp nhận
                        </button>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => handleSendRequest(user.id)}>
                          + Kết bạn
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
