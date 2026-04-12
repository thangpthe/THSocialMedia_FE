// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { PostApi, Auth } from '../lib/api';
// import Sidebar from '../components/Sidebar'; // <-- Import Sidebar
// import '../styles/Home.css';

// const getInitials = (name) => name ? name.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase() : 'U';

// export default function Home() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [postContent, setPostContent] = useState('');
//   const [isPosting, setIsPosting] = useState(false);

//   const myName = Auth.getUsername() || "Bạn";

//   // ... (Giữ nguyên các hàm loadPosts và handleCreatePost như cũ) ...
//   const loadPosts = async () => { /* ... */ };
//   useEffect(() => { loadPosts(); }, []);
//   const handleCreatePost = async () => { /* ... */ };

//   return (
//     <div className="home-layout">
//       {/* --- HEADER CHUNG LÊN TOP --- */}
//       <header className="home-header">
//         <Link to="/" className="brand-logo">
//           <div className="brand-icon-box">
//              <span className="material-symbols-outlined fill-1">hub</span>
//           </div>
//           <h1>thsocial</h1>
//         </Link>
        
//         {/* Khung tìm kiếm ở Header giống trong ảnh */}
//         <div className="header-search">
//           <span className="material-symbols-outlined search-icon">search</span>
//           <input type="text" placeholder="Tìm kiếm trên SocialHub" />
//         </div>

//         <div className="header-actions-right">
//           <button className="btn-icon-circular"><span className="material-symbols-outlined">notifications</span></button>
//           <button className="btn-icon-circular"><span className="material-symbols-outlined">chat</span></button>
//           <div className="avatar-circle small">{getInitials(myName)}</div>
//         </div>
//       </header>

//       {/* --- PHẦN CONTENT CHÍNH ĐƯỢC CHIA CỘT --- */}
//       <div className="main-container">
        
//         {/* Cột 1: Sidebar */}
//         <Sidebar />

//         {/* Cột 2: Bảng tin (Feed) */}
//         <main className="feed-content">
          
//           {/* Khung đăng bài giống ảnh */}
//           <div className="post-creator card">
//             <div className="creator-body">
//               <div className="avatar-circle">{getInitials(myName)}</div>
//               <div className="creator-input-group">
//                 <input
//                   type="text"
//                   value={postContent}
//                   onChange={(e) => setPostContent(e.target.value)}
//                   placeholder={`${myName} đang nghĩ gì thế?`}
//                   className="creator-input-pill"
//                 />
//               </div>
//             </div>
//             <div className="creator-footer">
//                <div className="creator-attachments">
//                   <button className="attachment-btn">
//                      <span className="material-symbols-outlined" style={{color: '#10b981'}}>image</span> Ảnh/Video
//                   </button>
//                   <button className="attachment-btn">
//                      <span className="material-symbols-outlined" style={{color: '#f59e0b'}}>sentiment_satisfied</span> Cảm xúc
//                   </button>
//                </div>
//                <button onClick={handleCreatePost} disabled={isPosting || !postContent.trim()} className="btn-primary">
//                   {isPosting ? 'Đang đăng...' : 'Đăng'}
//                </button>
//             </div>
//           </div>

//           {/* ... (Giữ nguyên phần render danh sách posts.map(...) như cũ) ... */}
          
//         </main>

//         {/* Cột 3: Gợi ý kết bạn (Tùy chọn - có thể thêm sau) */}
//         <aside className="right-sidebar">
//            {/* Thêm nội dung cột phải ở đây nếu muốn giống ảnh 100% */}
//         </aside>

//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostApi, Auth } from '../lib/api';
import { getInitials, timeAgo, showToast } from '../lib/ui';
import Layout from '../components/Layout';
import '../styles/Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const myName = Auth.getUsername() || 'Bạn';

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await PostApi.getPosts();
      setPosts(res?.result || res || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    setIsPosting(true);
    try {
      const res = await PostApi.createPost({ content: postContent });
      const newPost = res?.result ?? res;
      setPosts((prev) => [newPost, ...prev]);
      setPostContent('');
      showToast('Đã đăng bài!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsPosting(false);
    }
  };

  const handleReact = async (postId) => {
    try {
      await PostApi.reactPost(postId, { type: 'like' });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likeCount: (p.likeCount || 0) + 1 } : p
        )
      );
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <Layout title="Trang chủ">
      <div className="page-content">
        {/* ── Post creator ── */}
        <div className="post-creator card">
          <div className="creator-row">
            <div className="avatar lg">{getInitials(myName)}</div>
            <textarea
              className="creator-textarea"
              placeholder={`${myName} đang nghĩ gì thế?`}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={postContent.length > 80 ? 3 : 1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleCreatePost();
              }}
            />
          </div>
          <div className="creator-footer">
            <div className="creator-attachments">
              <button className="attach-btn">
                <span className="material-symbols-outlined" style={{ color: '#10b981' }}>image</span>
                Ảnh
              </button>
              <button className="attach-btn">
                <span className="material-symbols-outlined" style={{ color: '#f59e0b' }}>sentiment_satisfied</span>
                Cảm xúc
              </button>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCreatePost}
              disabled={isPosting || !postContent.trim()}
            >
              {isPosting ? <><span className="spinner" /> Đang đăng...</> : 'Đăng'}
            </button>
          </div>
        </div>

        {/* ── Feed ── */}
        <div className="feed-list">
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 120 }} />
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="empty-feed">
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--text-disabled)' }}>
                article
              </span>
              <p>Chưa có bài viết nào. Hãy là người đầu tiên!</p>
            </div>
          )}

          {!loading && posts.map((post) => (
            <article key={post.id} className="post-card card">
              <div className="post-header">
                <div className="post-author">
                  <Link to={`/profile?id=${post.userId}`}>
                    <div className="avatar">{getInitials(post.authorName || post.username || 'U')}</div>
                  </Link>
                  <div>
                    <Link to={`/profile?id=${post.userId}`} className="author-name">
                      {post.authorName || post.username || 'Người dùng'}
                    </Link>
                    <div className="post-time">{timeAgo(post.createdAt)}</div>
                  </div>
                </div>
              </div>

              <div className="post-body">
                <p>{post.content}</p>
              </div>

              <div className="post-actions">
                <button className="action-btn" onClick={() => handleReact(post.id)}>
                  <span className="material-symbols-outlined">favorite</span>
                  {post.likeCount || 0}
                </button>
                <button className="action-btn">
                  <span className="material-symbols-outlined">chat_bubble</span>
                  {post.commentCount || 0}
                </button>
                <button className="action-btn">
                  <span className="material-symbols-outlined">share</span>
                  Chia sẻ
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}
