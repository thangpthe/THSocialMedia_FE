import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { RelationshipApi } from '../lib/api/relationship.api';
import { Auth } from '../lib/api/baseApi';
import { getInitials, showToast } from '../lib/ui';
import '../styles/Friends.css';

export default function Friends() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('search');
  const [friends, setFriends] = useState([]);   
  const [requests, setRequests] = useState([]);   
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const myId = String(Auth.getUserId());

  // Hàm xác định trạng thái quan hệ để hiển thị nút bấm tương ứng
  const getRelationshipStatus = (userId) => {
    const uId = String(userId);
    
    // 1. Kiểm tra nếu đã là bạn bè (Status 1)
    const isFriend = friends.some(f => 
      String(f.userId) === uId || String(f.friendId) === uId
    );
    if (isFriend) return 'FRIENDS';

    // 2. Kiểm tra lời mời (Status 0)
    const request = requests.find(r => 
      String(r.userId) === uId || String(r.friendId) === uId
    );
    
    if (request) {
      // Nếu mình là người nhận (friendId trong DTO là mình)
      return String(request.friendId) === myId ? 'PENDING_RECEIVED' : 'PENDING_SENT';
    }

    return 'NONE';
  };

  // Tải danh sách Bạn bè và Lời mời từ Database
  const loadRelationships = useCallback(async () => {
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        RelationshipApi.getFriends(),
        RelationshipApi.getPendingRequests()
      ]);
      setFriends(friendsRes.result || []);
      setRequests(requestsRes.result || []);
    } catch (err) {
      console.error("Lỗi tải quan hệ:", err);
    }
  }, [myId]);

  // Tải lại dữ liệu khi đổi Tab hoặc thực hiện hành động
  useEffect(() => {
    loadRelationships();
  }, [tab, loadRelationships]);

  // Xử lý Tìm kiếm User theo Username
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Làm mới dữ liệu quan hệ trước khi search để đối soát trạng thái nút chính xác
      await loadRelationships();
      const res = await RelationshipApi.searchUsers(searchQuery);
      setSearchResults(res.result || []);
    } catch (err) {
      showToast("Lỗi tìm kiếm: " + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Gửi lời mời kết bạn
  const handleSendRequest = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await RelationshipApi.sendFriendRequest(userId);
      showToast('Đã gửi lời mời kết bạn!', 'success');
      // Cập nhật lại danh sách quan hệ để nút đổi sang "Đã gửi lời mời"
      await loadRelationships(); 
    } catch (err) {
      showToast(err.message || 'Lỗi gửi lời mời', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Chấp nhận lời mời (Sử dụng relationshipId)
  const handleAccept = async (relationshipId) => {
    setActionLoading(prev => ({ ...prev, [relationshipId]: true }));
    try {
      await RelationshipApi.acceptRequest(relationshipId);
      showToast('Đã thêm bạn bè', 'success');
      await loadRelationships();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [relationshipId]: false }));
    }
  };

  // Từ chối lời mời
  const handleReject = async (relationshipId) => {
    setActionLoading(prev => ({ ...prev, [relationshipId]: true }));
    try {
      await RelationshipApi.rejectRequest(relationshipId);
      showToast('Đã từ chối lời mời', 'success');
      setRequests(prev => prev.filter(r => r.id !== relationshipId));
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [relationshipId]: false }));
    }
  };

  const TABS = [
    { key: 'search',   label: 'Tìm kiếm',   icon: 'search',     count: null },
    { key: 'requests', label: 'Lời mời',    icon: 'person_add', count: requests.length },
    { key: 'all',      label: 'Bạn bè',     icon: 'group',      count: friends.length  },
  ];

  return (
    <Layout>
      <div className="page-content" style={{maxWidth: '800px', margin: '0 auto'}}>
        <h1 style={{marginBottom: '20px'}}>Bạn bè</h1>

        {/* ── Điều hướng Tab ── */}
        <div className="f-tabs">
          {TABS.map(({ key, label, icon, count }) => (
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

        {/* ── Ô tìm kiếm (Chỉ hiện ở Tab Tìm kiếm) ── */}
        {tab === 'search' && (
          <div className="f-search">
            <span className="material-symbols-outlined f-search-icon">search</span>
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
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

        <div className="f-grid">
          {loading ? (
            <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)'}}>Đang tìm kiếm...</div>
          ) : (
            <>
              {/* TAB TÌM KIẾM */}
              {tab === 'search' && (
                searchResults.length === 0 && searchQuery ? (
                  <div className="f-empty">
                    <span className="material-symbols-outlined">search_off</span>
                    <p>Không tìm thấy người dùng "{searchQuery}"</p>
                  </div>
                ) : (
                  searchResults.map((user) => {
                    const status = getRelationshipStatus(user.id);
                    return (
                      <div key={user.id} className="f-card">
                        <div className="f-avatar" onClick={() => navigate(`/profile?id=${user.id}`)}>
                          {getInitials(user.fullName || user.username)}
                        </div>
                        <div className="f-info" onClick={() => navigate(`/profile?id=${user.id}`)}>
                          <span className="f-name">{user.fullName || user.username}</span>
                          <span className="f-username">@{user.username || user.userName}</span>
                        </div>
                        <div className="f-actions">
                          {status === 'FRIENDS' ? (
                            <button className="btn btn-secondary btn-sm" disabled>
                              <span className="material-symbols-outlined" style={{fontSize: 16}}>done</span> Bạn bè
                            </button>
                          ) : status === 'PENDING_SENT' ? (
                            <button className="btn btn-secondary btn-sm" disabled>Đã gửi lời mời</button>
                          ) : status === 'PENDING_RECEIVED' ? (
                            <button className="btn btn-primary btn-sm" onClick={() => setTab('requests')}>
                              Chấp nhận ngay
                            </button>
                          ) : (
                            <button 
                              className="btn btn-primary btn-sm" 
                              onClick={() => handleSendRequest(user.id)}
                              disabled={actionLoading[user.id]}
                            >
                              {actionLoading[user.id] ? '...' : '+ Kết bạn'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )
              )}

              {/* TAB LỜI MỜI (Nhận được từ người khác) */}
              {tab === 'requests' && (
                requests.length === 0 ? (
                  <div className="f-empty">
                    <span className="material-symbols-outlined">inbox</span>
                    <p>Không có lời mời kết bạn nào</p>
                  </div>
                ) : requests.map((r) => (
                  <div key={r.id} className="f-card">
                    <div className="f-avatar" onClick={() => navigate(`/profile?id=${r.userId}`)}>
                      {getInitials(r.userName || r.senderName)}
                    </div>
                    <div className="f-info" onClick={() => navigate(`/profile?id=${r.userId}`)}>
                      <span className="f-name">{r.userName || r.senderName || "Người dùng"}</span>
                      <span className="f-username">Muốn kết bạn với bạn</span>
                    </div>
                    <div className="f-actions">
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleAccept(r.id)} 
                        disabled={actionLoading[r.id]}
                      >
                        Chấp nhận
                      </button>
                      <button 
                        className="btn btn-ghost btn-sm" 
                        onClick={() => handleReject(r.id)} 
                        disabled={actionLoading[r.id]}
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* TAB TẤT CẢ BẠN BÈ */}
              {tab === 'all' && (
                friends.length === 0 ? (
                  <div className="f-empty">
                    <span className="material-symbols-outlined">group</span>
                    <p>Bạn chưa có bạn bè nào</p>
                  </div>
                ) : friends.map((r) => {
                  const name = r.userName || r.friendName || "Người dùng";
                  const fid = r.userId || r.friendId;
                  return (
                    <div key={r.id} className="f-card">
                      <div className="f-avatar" onClick={() => navigate(`/profile?id=${fid}`)}>
                        {getInitials(name)}
                      </div>
                      <div className="f-info" onClick={() => navigate(`/profile?id=${fid}`)}>
                        <span className="f-name">{name}</span>
                        <span className="f-username">Bạn bè</span>
                      </div>
                      <div className="f-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/profile?id=${fid}`)}>
                          Xem trang
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}