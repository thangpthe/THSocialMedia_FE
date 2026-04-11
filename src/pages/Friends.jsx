import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { RelationshipApi, RelationshipStatus, Auth } from '../lib/api';
import { getInitials, showToast } from '../lib/ui';
import "../styles/Friends.css";

export default function Friends() {
  const [tab, setTab] = useState('all');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const myId = Auth.getUserId();

  useEffect(() => {
    loadTab(tab);
  }, [tab]);

  const loadTab = async (tabName) => {
    setLoading(true);
    try {
      if (tabName === 'all') {
        const res = await RelationshipApi.getFriends();
        setFriends(res.result || []);
      } else if (tabName === 'requests') {
        const res = await RelationshipApi.getPendingRequests();
        setRequests(res.result || []);
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
      setSearchResults(res.result || []);
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
      showToast('Chấp nhận lời mời kết bạn', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReject = async (userId) => {
    try {
      await RelationshipApi.rejectRequest(userId);
      setRequests((prev) => prev.filter((r) => r.id !== userId));
      showToast('Từ chối lời mời', 'success');
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
      showToast('Gửi lời mời kết bạn thành công!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <Layout>
      <div className="friends-container">
        <h1 style={{ marginBottom: '1.5rem' }}>👥 Bạn bè</h1>

        <div className="tabs">
          <button
            className={`tab ${tab === 'all' ? 'active' : ''}`}
            onClick={() => setTab('all')}
          >
            Tất cả bạn ({friends.length})
          </button>
          <button
            className={`tab ${tab === 'requests' ? 'active' : ''}`}
            onClick={() => setTab('requests')}
          >
            Lời mời ({requests.length})
          </button>
          <button
            className={`tab ${tab === 'search' ? 'active' : ''}`}
            onClick={() => setTab('search')}
          >
            🔍 Tìm kiếm
          </button>
        </div>

        {tab === 'search' && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
              Tìm
            </button>
          </div>
        )}

        <div className="content">
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner"></div>
            </div>
          )}

          {!loading && tab === 'all' && (
            <div className="user-grid">
              {friends.length === 0 ? (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Bạn chưa có bạn bè nào
                </p>
              ) : (
                friends.map((friend) => (
                  <div key={friend.id} className="user-card">
                    <div className="user-avatar">{getInitials(friend.fullName || friend.username)}</div>
                    <h4>{friend.fullName || friend.username}</h4>
                    <p className="username">@{friend.username}</p>
                    <button className="btn btn-ghost btn-sm" style={{ width: '100%' }}>
                      Xem trang cá nhân
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && tab === 'requests' && (
            <div className="requests-grid">
              {requests.length === 0 ? (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Không có lời mời nào
                </p>
              ) : (
                requests.map((user) => (
                  <div key={user.id} className="request-card">
                    <div className="user-avatar">{getInitials(user.fullName || user.username)}</div>
                    <h4>{user.fullName || user.username}</h4>
                    <p className="username">@{user.username}</p>
                    <div className="request-actions">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleAccept(user.id)}
                      >
                        Chấp nhận
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleReject(user.id)}
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && tab === 'search' && (
            <div className="user-grid">
              {searchResults.length === 0 && searchQuery ? (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Không tìm thấy kết quả
                </p>
              ) : (
                searchResults
                  .filter((u) => u.id !== myId)
                  .map((user) => (
                    <div key={user.id} className="user-card">
                      <div className="user-avatar">{getInitials(user.fullName || user.username)}</div>
                      <h4>{user.fullName || user.username}</h4>
                      <p className="username">@{user.username}</p>

                      {user.relationshipStatus === RelationshipStatus.FRIENDS ? (
                        <button className="btn btn-ghost btn-sm" disabled style={{ width: '100%' }}>
                          ✓ Đã là bạn bè
                        </button>
                      ) : user.relationshipStatus === RelationshipStatus.PENDING_SENT ? (
                        <button className="btn btn-ghost btn-sm" disabled style={{ width: '100%' }}>
                          Đã gửi lời mời
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSendRequest(user.id)}
                          style={{ width: '100%' }}
                        >
                          Kết bạn
                        </button>
                      )}
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}