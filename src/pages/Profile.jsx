// import React, { useEffect, useState, useCallback } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import Layout from '../components/Layout';
// import { AccountApi } from '../lib/api/account.api';
// import { RelationshipApi } from '../lib/api/relationship.api';
// import { Auth } from '../lib/api/baseApi';
// import { PostApi } from '../lib/api/post.api';
// import { getInitials, timeAgo, showToast } from '../lib/ui';

// import "../styles/Profile.css";
// import "../styles/Home.css"; // Import CSS của Home để tái sử dụng giao diện Bài viết & Bình luận

// export default function ProfilePage() {
//   const [searchParams] = useSearchParams();
//   const targetId = searchParams.get('id');
//   const myId = String(Auth.getUserId());
  
//   // Xác định ID đang xem (Nếu không có targetId trên URL -> Đang xem trang của chính mình)
//   const displayId = targetId || myId;
//   const isMe = displayId === myId;

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // --- STATE BÀI VIẾT & BÌNH LUẬN ---
//   const [posts, setPosts] = useState([]); 
//   const [postContent, setPostContent] = useState('');
//   const [isPosting, setIsPosting] = useState(false);

//   const [openComments, setOpenComments] = useState({});
//   const [expandedComments, setExpandedComments] = useState({});
//   const [commentInputs, setCommentInputs] = useState({});
//   const [isCommenting, setIsCommenting] = useState({});

//   // --- STATE QUAN HỆ (NẾU XEM TRANG NGƯỜI KHÁC) ---
//   const [relationshipStatus, setRelationshipStatus] = useState('NONE'); 
//   const [actionLoading, setActionLoading] = useState(false);

//   const loadData = useCallback(async () => {
//     try {
//       setLoading(true);
      
//       // 1. Tải thông tin Profile
//       const pRes = await AccountApi.getProfile(displayId);
//       setProfile(pRes.result || pRes);

//       // 2. Tải Bài viết & Lọc theo displayId
//       const postRes = await PostApi.getPosts();
//       const allPosts = Array.isArray(postRes) ? postRes : (postRes?.result || postRes?.value || []);
//       const userPosts = allPosts.filter(p => String(p.userId) === String(displayId));
//       setPosts(userPosts);

//       // 3. Tải trạng thái quan hệ (Nếu không phải mình)
//       if (!isMe) {
//         const [friendsRes, requestsRes] = await Promise.all([
//           RelationshipApi.getFriends(),
//           RelationshipApi.getPendingRequests()
//         ]);
//         const friends = friendsRes.result || [];
//         const requests = requestsRes.result || [];
//         const uId = String(displayId);
        
//         if (friends.some(f => String(f.userId) === uId || String(f.friendId) === uId)) {
//           setRelationshipStatus('FRIENDS');
//         } else {
//           const req = requests.find(r => String(r.userId) === uId || String(r.friendId) === uId);
//           if (req) {
//             setRelationshipStatus(String(req.friendId) === myId ? 'PENDING_RECEIVED' : 'PENDING_SENT');
//           } else {
//             setRelationshipStatus('NONE');
//           }
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       showToast('Lỗi khi tải thông tin', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [displayId, isMe, myId]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   // --- CÁC HÀM XỬ LÝ BÀI VIẾT & BÌNH LUẬN ---
//   const handleCreatePost = async () => {
//     if (!postContent.trim()) return;
//     setIsPosting(true);
//     try {
//       await PostApi.createPost({ content: postContent, visibility: 0, fileUrls: null });
//       setPostContent('');
//       showToast('Đăng bài thành công!', 'success');
//       await loadData();
//     } catch (err) {
//       showToast(err.message || 'Lỗi khi đăng bài', 'error');
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   const toggleComments = (postId) => setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
//   const handleExpandComments = (postId) => setExpandedComments(prev => ({ ...prev, [postId]: true }));

//   const handlePostComment = async (postId) => {
//     const content = commentInputs[postId];
//     if (!content || !content.trim()) return;
//     setIsCommenting(prev => ({ ...prev, [postId]: true }));
//     try {
//       await PostApi.commentPost(postId, { content: content.trim() });
//       setCommentInputs(prev => ({ ...prev, [postId]: '' }));
//       setExpandedComments(prev => ({ ...prev, [postId]: true })); // Tự động hiển thị hết bình luận sau khi gõ
//       await loadData();
//     } catch (err) {
//       showToast(err.message || 'Lỗi khi gửi bình luận', 'error');
//     } finally {
//       setIsCommenting(prev => ({ ...prev, [postId]: false }));
//     }
//   };

//   // --- GIAO DIỆN ---
//   if (loading && !profile) return <Layout><div style={{textAlign: 'center', padding: '40px'}}>Đang tải trang cá nhân...</div></Layout>;

//   return (
//     <Layout>
//       <div className="page-content" style={{maxWidth: '900px', margin: '0 auto'}}>
        
//         {/* --- ẢNH BÌA VÀ ẢNH ĐẠI DIỆN --- */}
//         <div className="p-header-card">
//           <div className="p-cover" />
//           <div className="p-info-bar">
//             <div className="p-left">
//               <div className="p-avatar-wrap">
//                 <div className="p-avatar">{getInitials(profile?.fullName || profile?.username || 'U')}</div>
//               </div>
//               <div className="p-meta">
//                 <h1>{profile?.fullName || profile?.username || 'Người dùng'}</h1>
//                 <div className="p-username">@{profile?.username}</div>
//                 {/* <div className="p-friends">
//                   <span className="material-symbols-outlined" style={{fontSize: 16}}>group</span>
//                   {profile?.friendCount || 0} bạn bè
//                 </div> */}
//               </div>
//             </div>
            
//             {/* Nút hành động tương tác với User */}
//             {!isMe && (
//               <div className="p-actions">
//                 {relationshipStatus === 'FRIENDS' ? (
//                   <button className="btn btn-secondary btn-sm" disabled>Bạn bè</button>
//                 ) : relationshipStatus === 'PENDING_SENT' ? (
//                   <button className="btn btn-secondary btn-sm" disabled>Đã gửi lời mời</button>
//                 ) : relationshipStatus === 'PENDING_RECEIVED' ? (
//                   <button className="btn btn-primary btn-sm" onClick={() => window.location.href='/friends'}>Kiểm tra lời mời</button>
//                 ) : (
//                   <button className="btn btn-primary btn-sm">+ Thêm bạn bè</button> // Bạn có thể gắn hàm sendRequest vào đây
//                 )}
//                 <button className="btn btn-secondary btn-sm">Nhắn tin</button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* --- KHU VỰC BÀI VIẾT (CỘT 2) VÀ THÔNG TIN (CỘT 1) --- */}
//         <div className="p-grid">
          
//           <aside className="p-sidebar">
//             <div className="card">
//               <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Giới thiệu</h3>
//               <p style={{ fontSize: '0.9rem' }}>{profile?.bio || 'Chưa có thông tin giới thiệu.'}</p>
              
//               <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
//                 <div>📧 Email: {profile?.email || '—'}</div>
//                 <div style={{ marginTop: 6 }}>📅 Tham gia: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : '—'}</div>
//               </div>
//             </div>
//           </aside>

//           <main className="p-main">
//             {/* KHUNG TẠO BÀI VIẾT: Chỉ hiển thị trên trang của chính mình */}
//             {isMe && (
//               <div className="card post-creator" style={{ marginBottom: 16, padding: '16px 20px' }}>
//                 <div className="creator-row">
//                   <div className="avatar sm">{getInitials(profile?.fullName || 'U')}</div>
//                   <textarea
//                     value={postContent}
//                     onChange={(e) => setPostContent(e.target.value)}
//                     placeholder="Bạn đang nghĩ gì thế?"
//                     className="creator-textarea"
//                     rows={2}
//                   />
//                 </div>
//                 <div className="creator-footer">
//                   <div className="creator-attachments">
//                     <button className="attach-btn" title="Ảnh/Video">
//                       <span className="material-symbols-outlined" style={{ color: '#10b981' }}>image</span> Ảnh/Video
//                     </button>
//                   </div>
//                   <button onClick={handleCreatePost} disabled={isPosting || !postContent.trim()} className="btn btn-primary">
//                     {isPosting ? 'Đang đăng...' : 'Đăng bài'}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* DANH SÁCH BÀI VIẾT CỦA USER ĐÓ */}
//             <div className="feed-list">
//               {posts.length === 0 ? (
//                 <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-tertiary)' }}>
//                   <span className="material-symbols-outlined" style={{ fontSize: 44, marginBottom: 12, display: 'block' }}>article</span>
//                   <p style={{ fontSize: '0.9rem' }}>Chưa có bài viết nào</p>
//                 </div>
//               ) : (
//                 posts.map(post => {
//                   const isExpanded = expandedComments[post.id];
//                   const visibleComments = isExpanded ? post.comments : (post.comments?.slice(0, 2) || []);

//                   return (
//                     <article key={post.id} className="card post-card" style={{ marginBottom: '16px' }}>
//                       <div className="post-header">
//                         <div className="post-author">
//                           <Link to={`/profile?id=${post.userId}`}>
//                             <div className="avatar">{getInitials(post.authorName || post.username || 'U')}</div>
//                           </Link>
//                           <div>
//                             <Link to={`/profile?id=${post.userId}`} className="author-name">
//                               {post.authorName || post.username || 'Người dùng'}
//                             </Link>
//                             <div className="post-time">{timeAgo(post.createdAt)}</div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="post-body">
//                         <p>{post.content}</p>
//                       </div>

//                       <div className="post-actions">
//                         <button className="action-btn">
//                           <span className="material-symbols-outlined">favorite</span> Thích
//                         </button>
//                         <button className="action-btn" onClick={() => toggleComments(post.id)}>
//                           <span className="material-symbols-outlined">chat_bubble</span> 
//                           Bình luận {post.commentsCount > 0 ? `(${post.commentsCount})` : ''}
//                         </button>
//                         <button className="action-btn">
//                           <span className="material-symbols-outlined">share</span> Chia sẻ
//                         </button>
//                       </div>

//                       {/* --- KHU VỰC BÌNH LUẬN --- */}
//                       {openComments[post.id] && (
//                         <div className="comments-section" style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                          
//                           {post.comments && post.comments.length > 0 ? (
//                             <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                              
//                               {/* Danh sách 2 bình luận đầu hoặc tất cả */}
//                               {visibleComments.map(cmt => (
//                                 <div key={cmt.id} className="comment-item" style={{ display: 'flex', gap: '10px' }}>
//                                   <div className="avatar sm" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
//                                     {getInitials(cmt.userName)}
//                                   </div>
//                                   <div className="comment-content" style={{ background: 'var(--surface-2)', padding: '8px 12px', borderRadius: '12px', flex: 1 }}>
//                                     <Link to={`/profile?id=${cmt.userId}`} style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
//                                       {cmt.userName}
//                                     </Link>
//                                     <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '2px', wordBreak: 'break-word' }}>
//                                       {cmt.content}
//                                     </p>
//                                     <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
//                                       {timeAgo(cmt.createdAt)}
//                                     </span>
//                                   </div>
//                                 </div>
//                               ))}

//                               {/* NÚT XEM THÊM */}
//                               {!isExpanded && post.comments.length > 2 && (
//                                 <button 
//                                   onClick={() => handleExpandComments(post.id)}
//                                   style={{
//                                     background: 'none', border: 'none', color: 'var(--text-secondary)',
//                                     fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
//                                     textAlign: 'left', padding: '4px 0', alignSelf: 'flex-start'
//                                   }}
//                                 >
//                                   Xem thêm {post.comments.length - 2} bình luận...
//                                 </button>
//                               )}
//                             </div>
//                           ) : (
//                             <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: '16px' }}>Chưa có bình luận nào.</p>
//                           )}

//                           {/* Ô nhập bình luận */}
//                           <div className="comment-input-area" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//                             <div className="avatar sm" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
//                               {getInitials(Auth.getUsername() || 'U')}
//                             </div>
//                             <input 
//                               type="text" 
//                               placeholder="Viết bình luận..." 
//                               value={commentInputs[post.id] || ''}
//                               onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
//                               onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post.id)}
//                               style={{
//                                 flex: 1, padding: '8px 16px', borderRadius: '20px', 
//                                 border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.9rem'
//                               }}
//                             />
//                             <button 
//                               onClick={() => handlePostComment(post.id)}
//                               disabled={isCommenting[post.id] || !(commentInputs[post.id] || '').trim()}
//                               style={{
//                                 background: 'none', border: 'none', color: 'var(--primary)', 
//                                 cursor: 'pointer', display: 'flex', alignItems: 'center'
//                               }}
//                             >
//                               <span className="material-symbols-outlined">send</span>
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                       {/* --- END KHU VỰC BÌNH LUẬN --- */}
//                     </article>
//                   );
//                 })
//               )}
//             </div>

//           </main>
//         </div>
//       </div>
//     </Layout>
//   );
// }

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { AccountApi } from '../lib/api/account.api';
import { RelationshipApi } from '../lib/api/relationship.api';
import { Auth } from '../lib/api/baseApi';
import { PostApi } from '../lib/api/post.api';
import { getInitials, timeAgo, showToast } from '../lib/ui';
import "../styles/Profile.css";

export default function Profile() {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');
  const myId = String(Auth.getUserId());
  const displayId = targetId || myId;
  const isMe = displayId === myId;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [relStatus, setRelStatus] = useState('NONE');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [pRes, postRes] = await Promise.all([
        AccountApi.getProfile(displayId),
        PostApi.getPosts()
      ]);
      setProfile(pRes.result || pRes);
      const allPosts = Array.isArray(postRes) ? postRes : (postRes?.result || []);
      setPosts(allPosts.filter(p => String(p.userId) === displayId));

      if (!isMe) {
        const [fRes, rRes] = await Promise.all([
          RelationshipApi.getFriends(),
          RelationshipApi.getPendingRequests()
        ]);
        const friends = fRes.result || [];
        const requests = rRes.result || [];
        if (friends.some(f => String(f.userId) === displayId || String(f.friendId) === displayId)) {
          setRelStatus('FRIENDS');
        } else {
          const req = requests.find(r => String(r.userId) === displayId || String(r.friendId) === displayId);
          setRelStatus(req ? (String(req.friendId) === myId ? 'PENDING_RECEIVED' : 'PENDING_SENT') : 'NONE');
        }
      }
    } catch (err) {
      showToast("Lỗi tải trang cá nhân", "error");
    } finally {
      setLoading(false);
    }
  }, [displayId, isMe, myId]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <Layout><div className="loader">Đang tải...</div></Layout>;

  return (
    <Layout>
      <div className="page-content">
        <div className="p-header-card card">
          <div className="p-avatar">{getInitials(profile?.fullName || profile?.username)}</div>
          <h1>{profile?.fullName || profile?.username}</h1>
        </div>
        <div className="p-grid">
          <aside className="p-sidebar">
            <div className="card">
              <h3>Giới thiệu</h3>
              <p>{profile?.bio || "Chưa có thông tin"}</p>
            </div>
          </aside>
          <main className="p-main">
            {posts.map(post => (
              <article key={post.id} className="card post-card">
                <div className="post-time">{timeAgo(post.createdAt)}</div>
                <p>{post.content}</p>
                {post.fileUrl && (
                  <div className="post-images">
                    {post.fileUrl.split(',').map((url, i) => (
                      url && <img key={i} src={url} alt="post" style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </main>
        </div>
      </div>
    </Layout>
  );
}