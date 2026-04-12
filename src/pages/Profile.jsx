// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import Layout from '../components/Layout';
// import { AccountApi, Auth, PostApi } from '../lib/api'; // Đảm bảo import PostApi
// import { getInitials } from '../lib/ui';
// import "../styles/Profile.css";

// const ProfilePage = () => {
//   const [searchParams] = useSearchParams();
//   const targetId = searchParams.get('id');
//   const myId = Auth.getUserId();
//   const isMe = !targetId || targetId === myId;

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // --- STATE BÀI VIẾT ---
//   const [posts, setPosts] = useState([]); // Lưu danh sách bài viết
//   const [postContent, setPostContent] = useState('');
//   const [visibility, setVisibility] = useState(0); 
//   const [isPosting, setIsPosting] = useState(false);

//   // Hàm tải danh sách bài viết
//   const loadPosts = async () => {
//     try {
//       // Giả sử API getPosts lấy danh sách bài viết của user. 
//       // (Nếu API backend yêu cầu truyền targetId thì bạn truyền vào nhé)
//       const res = await PostApi.getPosts(); 
//       // API có thể bọc data trong res.result hoặc trả về trực tiếp mảng
//       setPosts(res.result || res || []); 
//     } catch (err) {
//       console.error("Lỗi tải bài viết:", err);
//     }
//   };

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         setLoading(true);
//         const data = await AccountApi.getProfile(targetId);
//         setProfile(data.result || data);
        
//         // Tải danh sách bài viết sau khi tải xong profile
//         await loadPosts();
//       } catch (err) {
//         console.error("Lỗi tải profile:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProfile();
//   }, [targetId]);

//   // --- HÀM XỬ LÝ ĐĂNG BÀI VIẾT ---
//   const handleCreatePost = async () => {
//     if (!postContent.trim()) return;
    
//     setIsPosting(true);
//     try {
//       const payload = {
//         content: postContent,
//         visibility: Number(visibility),
//         fileUrls: null 
//       };

//       await PostApi.createPost(payload);
      
//       setPostContent(''); // 1. Xóa rỗng ô nhập
//       await loadPosts();  // 2. GỌI LẠI HÀM LOAD POSTS ĐỂ CẬP NHẬT UI NGAY LẬP TỨC
      
//       // Không dùng alert nữa để UX mượt mà hơn, hoặc bạn có thể dùng toast (showToast)
//     } catch (error) {
//       console.error("Lỗi khi đăng bài:", error);
//       alert(error.message || "Đã xảy ra lỗi khi đăng bài.");
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="profile-container">
//           <div className="skeleton" style={{ height: '420px', borderRadius: '20px' }} />
//         </div>
//       </Layout>
//     );
//   }

//   const name = profile?.fullName || profile?.username || "Nguyễn Văn A";
//   const username = profile?.username || "nguyenvana";
//   const bio = profile?.bio || "Chưa có thông tin giới thiệu";

//   return (
//     <Layout>
//       <div className="profile-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

//         {/* Cover + Avatar + Info */}
//         <div className="profile-header-card">
//           <div 
//             className="cover-photo"
//             style={{
//               background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
//               backgroundImage: 'url("https://picsum.photos/id/1015/1200/400")',
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               height: '380px',
//               position: 'relative'
//             }}
//           />

//           <div className="profile-info-bar">
//             <div className="profile-main">
//               {/* Avatar */}
//               <div className="avatar-box" style={{ border: '6px solid white' }}>
//                 <div className="avatar-placeholder" style={{ fontSize: '3.5rem' }}>
//                   {getInitials(name)}
//                 </div>
//               </div>

//               <div className="profile-meta">
//                 <h1 style={{ fontSize: '2.2rem', marginBottom: '4px' }}>{name}</h1>
//                 <p className="username" style={{ fontSize: '1.1rem' }}>@{username}</p>
//                 <p style={{ color: '#64748b', marginTop: '6px' }}>
//                   1.2K bạn bè • 45 bạn chung
//                 </p>
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div className="profile-actions" style={{ display: 'flex', gap: '12px' }}>
//               {isMe ? (
//                 <>
//                   <button className="btn btn-primary" style={{ background: '#8b5cf6', color: 'white', padding: '10px 24px', borderRadius: '9999px', fontWeight: 600 }}>
//                     + Thêm vào tin
//                   </button>
//                   <button className="btn btn-secondary" style={{ padding: '10px 24px', borderRadius: '9999px' }}>
//                     ✏️ Chỉnh sửa trang cá nhân
//                   </button>
//                 </>
//               ) : (
//                 <button className="btn btn-primary" style={{ padding: '10px 28px', borderRadius: '9999px' }}>
//                   Kết bạn
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem', padding: '0 1rem' }}>
//           <div style={{ padding: '14px 0', borderBottom: '3px solid #8b5cf6', color: '#8b5cf6', fontWeight: 600, cursor: 'pointer' }}>
//             Bài viết
//           </div>
//           <div style={{ padding: '14px 0', color: '#64748b', cursor: 'pointer' }}>Giới thiệu</div>
//           <div style={{ padding: '14px 0', color: '#64748b', cursor: 'pointer' }}>Bạn bè</div>
//         </div>

//         <div className="profile-grid">
//           {/* CỘT TRÁI */}
//           <aside className="profile-sidebar">
//             <div className="card" style={{ marginBottom: '1.5rem' }}>
//               <h3 style={{ marginBottom: '1rem' }}>Giới thiệu</h3>
//               <p style={{ lineHeight: '1.6', color: '#475569' }}>{bio}</p>
//             </div>
//           </aside>

//           {/* CỘT PHẢI - Bài viết */}
//           <main className="profile-content">
            
//             {/* TẠO BÀI VIẾT */}
//             {isMe && (
//               <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
//                 <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
//                   <div className="avatar-placeholder" style={{ width: '42px', height: '42px', fontSize: '1.4rem', flexShrink: 0 }}>
//                     {getInitials(name)}
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <textarea
//                       value={postContent}
//                       onChange={(e) => setPostContent(e.target.value)}
//                       placeholder={`${name} ơi, bạn đang nghĩ gì?`}
//                       rows="3"
//                       style={{
//                         width: '100%',
//                         padding: '14px 20px',
//                         borderRadius: '16px',
//                         border: '1px solid #e2e8f0',
//                         background: '#f8fafc',
//                         fontSize: '1.05rem',
//                         resize: 'none',
//                         outline: 'none',
//                         fontFamily: 'inherit'
//                       }}
//                     />
                    
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
//                       <select 
//                         value={visibility}
//                         onChange={(e) => setVisibility(e.target.value)}
//                         style={{
//                           padding: '8px 12px',
//                           borderRadius: '8px',
//                           border: '1px solid #e2e8f0',
//                           background: '#f8fafc',
//                           outline: 'none',
//                           color: '#475569',
//                           fontWeight: '500',
//                           cursor: 'pointer'
//                         }}
//                       >
//                         <option value={0}>🌍 Công khai</option>
//                         <option value={1}>👥 Bạn bè</option>
//                         <option value={2}>🔒 Chỉ mình tôi</option>
//                       </select>

//                       <button 
//                         onClick={handleCreatePost}
//                         disabled={isPosting || !postContent.trim()}
//                         style={{
//                           background: (isPosting || !postContent.trim()) ? '#cbd5e1' : '#8b5cf6',
//                           color: 'white',
//                           padding: '10px 24px',
//                           borderRadius: '9999px',
//                           fontWeight: 600,
//                           border: 'none',
//                           cursor: (isPosting || !postContent.trim()) ? 'not-allowed' : 'pointer',
//                           transition: 'background 0.2s'
//                         }}
//                       >
//                         {isPosting ? 'Đang đăng...' : 'Đăng bài'}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* DANH SÁCH BÀI VIẾT (Tự động cập nhật) */}
//             {posts.length === 0 ? (
//                <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
//                   Không có bài viết nào để hiển thị.
//                </div>
//             ) : (
//                posts.map((post, index) => (
//                   <div key={post.id || index} className="card" style={{ marginBottom: '1.5rem' }}>
//                     <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
//                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//                         {/* Lấy avatar người đăng hoặc fallback */}
//                         <div className="avatar-placeholder" style={{ width: '40px', height: '40px' }}>
//                           {getInitials(post.authorName || name)}
//                         </div>
//                         <div>
//                           <strong>{post.authorName || name}</strong>
//                           <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
//                             Vừa xong • {post.visibility === 0 ? '🌍 Công khai' : post.visibility === 1 ? '👥 Bạn bè' : '🔒 Riêng tư'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div style={{ padding: '1.25rem' }}>
//                       {/* Đổ nội dung bài viết ra */}
//                       <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                      
//                       {/* Đổ hình ảnh (nếu có FileUrls) */}
//                       {post.fileUrls && (
//                         <img
//                           src={post.fileUrls}
//                           alt="post media"
//                           style={{ width: '100%', borderRadius: '16px', marginTop: '1rem' }}
//                         />
//                       )}
//                     </div>
                    
//                     <div style={{ padding: '0 1.25rem 1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#64748b' }}>
//                       <div>❤️ {post.likeCount || 0}</div>
//                       <div>{post.commentCount || 0} bình luận • 0 chia sẻ</div>
//                     </div>
//                   </div>
//                ))
//             )}

//           </main>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ProfilePage;

// src/pages/Profile.jsx
//
// Relationship flow:
//   - Xem profile người khác → GET /api/User/AddFriend?userId=<myId>
//     → Tìm trong kết quả xem có relationship nào liên quan đến targetId
//   - Gửi kết bạn → POST /api/User/AddFriend { senderId: myId, targetUserId }
//   - Chấp nhận   → PUT  /api/User/AddFriend { id: relationship.Id, status: 1 }
//   - Từ chối     → PUT  /api/User/AddFriend { id: relationship.Id, status: 2 }

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { AccountApi, RelationshipApi, Auth } from '../lib/api';
import { getInitials, showToast } from '../lib/ui';
import '../styles/Profile.css';

// Relationship status từ backend
const REL = { PENDING: 0, ACCEPTED: 1, REJECTED: 2, NONE: -1 };

export default function Profile() {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');
  const myId     = String(Auth.getUserId());
  const isMe     = !targetId || targetId === myId;
  const navigate = useNavigate();

  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [relLoading, setRelLoading] = useState(false);

  // Relationship state
  // relStatus: -1 (none) | 0 (pending) | 1 (accepted) | 2 (rejected)
  const [relStatus, setRelStatus]   = useState(REL.NONE);
  // Lưu relationship.Id để truyền vào accept/reject (KHÔNG phải userId)
  const [relId, setRelId]           = useState(null);
  // Chiều của pending: 'sent' | 'received'
  const [relDirection, setRelDirection] = useState(null);
  const [friendCount, setFriendCount]   = useState(null);

  // ── Load profile + relationship status ────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy profile
      const res = await AccountApi.getProfile(isMe ? myId : targetId);
      // UserController trả raw object (không wrap ApiResponse)
      const p = res?.result ?? res;
      setProfile(p);

      if (isMe) {
        // Lấy số bạn bè của mình
        const fr = await RelationshipApi.getFriends();
        setFriendCount((fr?.result ?? []).length);
      } else {
        // Xác định relationship status với targetId
        // GET /api/User/AddFriend?userId=<myId>
        // → Các relationship có ReceiverId = myId
        // Cần tìm cả chiều ngược (mình gửi đến targetId)
        // → Cũng GET với userId=<targetId> nếu backend hỗ trợ
        // Tạm: chỉ dùng userId=myId (nhận lời mời từ target)
        try {
          const relRes = await RelationshipApi.getRelationships(myId);
          const all = relRes?.result ?? [];

          // Tìm relationship giữa mình và targetId
          const rel = all.find(
            (r) => r.userId === targetId || r.friendId === targetId
          );

          if (!rel) {
            // Thử tìm theo chiều mình gửi: GET với userId=targetId
            const relRes2 = await RelationshipApi.getRelationships(targetId);
            const all2 = relRes2?.result ?? [];
            const rel2 = all2.find(
              (r) => r.userId === myId || r.friendId === myId
            );
            if (rel2) {
              setRelId(rel2.id);
              setRelStatus(rel2.status);
              setRelDirection(rel2.userId === myId ? 'sent' : 'received');
            } else {
              setRelStatus(REL.NONE);
              setRelId(null);
            }
          } else {
            setRelId(rel.id);
            setRelStatus(rel.status);
            setRelDirection(rel.userId === myId ? 'sent' : 'received');
          }
        } catch {
          setRelStatus(REL.NONE);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [targetId, isMe, myId]);

  useEffect(() => { load(); }, [load]);

  // ── Gửi lời mời kết bạn ──────────────────────────────────────────
  // POST /api/User/AddFriend { senderId: myId, targetUserId }
  const handleSendRequest = async () => {
    setRelLoading(true);
    try {
      const res = await RelationshipApi.sendFriendRequest(targetId);
      // res.result là relationship.Id vừa tạo
      const newRelId = res?.result ?? res;
      setRelId(newRelId);
      setRelStatus(REL.PENDING);
      setRelDirection('sent');
      showToast('Đã gửi lời mời kết bạn', 'success');
    } catch (err) {
      showToast(err.message || 'Gửi lời mời thất bại', 'error');
    } finally {
      setRelLoading(false);
    }
  };

  // ── Chấp nhận lời mời ────────────────────────────────────────────
  // PUT /api/User/AddFriend { id: relId, status: 1 }
  // PHẢI dùng relId (relationship.Id), KHÔNG phải targetId
  const handleAccept = async () => {
    if (!relId) { showToast('Không tìm thấy lời mời', 'error'); return; }
    setRelLoading(true);
    try {
      await RelationshipApi.acceptRequest(relId);
      setRelStatus(REL.ACCEPTED);
      setFriendCount((c) => (c !== null ? c + 1 : 1));
      showToast('Đã chấp nhận lời mời kết bạn!', 'success');
    } catch (err) {
      showToast(err.message || 'Không thể chấp nhận', 'error');
    } finally {
      setRelLoading(false);
    }
  };

  // ── Từ chối lời mời ──────────────────────────────────────────────
  // PUT /api/User/AddFriend { id: relId, status: 2 }
  const handleReject = async () => {
    if (!relId) return;
    setRelLoading(true);
    try {
      await RelationshipApi.rejectRequest(relId);
      setRelStatus(REL.NONE);
      setRelId(null);
      showToast('Đã từ chối lời mời', 'success');
    } catch (err) {
      showToast(err.message || 'Không thể từ chối', 'error');
    } finally {
      setRelLoading(false);
    }
  };

  // ── Render nút hành động theo trạng thái ─────────────────────────
  const renderRelButton = () => {
    if (isMe) {
      return <button className="btn btn-secondary">Chỉnh sửa hồ sơ</button>;
    }
    if (relLoading) {
      return <button className="btn btn-ghost" disabled><span className="spinner" /></button>;
    }
    switch (relStatus) {
      case REL.ACCEPTED:
        return (
          <button className="btn btn-ghost" disabled>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
            Bạn bè
          </button>
        );
      case REL.PENDING:
        if (relDirection === 'sent') {
          return <button className="btn btn-ghost" disabled>Đã gửi lời mời</button>;
        }
        // Nhận được lời mời → hiện nút Chấp nhận / Từ chối
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={handleAccept}>Chấp nhận</button>
            <button className="btn btn-ghost"   onClick={handleReject}>Từ chối</button>
          </div>
        );
      default:
        return (
          <button className="btn btn-primary" onClick={handleSendRequest}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_add</span>
            Kết bạn
          </button>
        );
    }
  };

  // ── Loading / Error ───────────────────────────────────────────────
  if (loading) return (
    <Layout title="Trang cá nhân">
      <div className="page-content">
        <div className="skeleton" style={{ height: 280, borderRadius: 16, marginBottom: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
          <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
          <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
        </div>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout title="Trang cá nhân">
      <div className="page-content">
        <div className="alert alert-error">{error}</div>
      </div>
    </Layout>
  );

  return (
    <Layout title={profile?.fullName || 'Trang cá nhân'}>
      <div className="page-content wide">

        {/* ── Header card ── */}
        <div className="p-header-card">
          <div className="p-cover" />
          <div className="p-info-bar">
            <div className="p-left">
              <div className="p-avatar-wrap">
                <div className="p-avatar">{getInitials(profile?.fullName || 'U')}</div>
              </div>
              <div className="p-meta">
                <h1>{profile?.fullName || profile?.username || 'User'}</h1>
                <p className="p-username">@{profile?.username}</p>
                {friendCount !== null && (
                  <p className="p-friends">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16, verticalAlign: 'middle' }}
                    >group</span>
                    {' '}{friendCount.toLocaleString('vi-VN')} bạn bè
                  </p>
                )}
              </div>
            </div>

            <div className="p-actions">
              {renderRelButton()}
              {!isMe && (
                <button className="btn btn-secondary">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                  Nhắn tin
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-grid">
          <aside className="p-sidebar">
            <div className="card">
              <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>Giới thiệu</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {profile?.bio || 'Chưa có thông tin'}
              </p>
              <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                <div>📧 {profile?.email || '—'}</div>
              </div>
            </div>
          </aside>

          <main className="p-main">
            {isMe && (
              <div
                className="card p-post-input"
                style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, padding: '1rem' }}
              >
                <div className="avatar">{getInitials(profile?.fullName || 'U')}</div>
                <input
                  type="text"
                  placeholder="Bạn đang nghĩ gì?"
                  onClick={() => navigate('/')}
                  readOnly
                  style={{
                    cursor: 'pointer', background: 'var(--surface-2)',
                    border: 'none', borderRadius: '999px',
                    padding: '10px 18px', flex: 1, fontSize: '0.9rem',
                  }}
                />
              </div>
            )}

            <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-tertiary)' }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 44, marginBottom: 12, display: 'block' }}
              >article</span>
              <p style={{ fontSize: '0.9rem' }}>Chưa có bài viết nào</p>
            </div>
          </main>
        </div>

      </div>
    </Layout>
  );
}