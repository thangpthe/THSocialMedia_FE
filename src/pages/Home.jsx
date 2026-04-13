// // import React, { useEffect, useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import { PostApi, Auth } from '../lib/api';
// // import { getInitials, timeAgo, showToast } from '../lib/ui';
// // import Layout from '../components/Layout';
// // import '../styles/Home.css';

// // export default function Home() {
// //   const [posts, setPosts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [postContent, setPostContent] = useState('');
// //   const [isPosting, setIsPosting] = useState(false);

// //   const myName = Auth.getUsername() || 'Bạn';

// //   const loadPosts = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await PostApi.getPosts();
// //       setPosts(res?.result || res || []);
// //     } catch (err) {
// //       showToast(err.message, 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => { loadPosts(); }, []);

// //   const handleCreatePost = async () => {
// //     if (!postContent.trim()) return;
// //     setIsPosting(true);
// //     try {
// //       const res = await PostApi.createPost({ content: postContent });
// //       const newPost = res?.result ?? res;
// //       setPosts((prev) => [newPost, ...prev]);
// //       setPostContent('');
// //       showToast('Đã đăng bài!', 'success');
// //     } catch (err) {
// //       showToast(err.message, 'error');
// //     } finally {
// //       setIsPosting(false);
// //     }
// //   };

// //   const handleReact = async (postId) => {
// //     try {
// //       await PostApi.reactPost(postId, { type: 'like' });
// //       setPosts((prev) =>
// //         prev.map((p) =>
// //           p.id === postId ? { ...p, likeCount: (p.likeCount || 0) + 1 } : p
// //         )
// //       );
// //     } catch (err) {
// //       showToast(err.message, 'error');
// //     }
// //   };

// //   return (
// //     <Layout title="Trang chủ">
// //       <div className="page-content">
// //         {/* ── Post creator ── */}
// //         <div className="post-creator card">
// //           <div className="creator-row">
// //             <div className="avatar lg">{getInitials(myName)}</div>
// //             <textarea
// //               className="creator-textarea"
// //               placeholder={`${myName} đang nghĩ gì thế?`}
// //               value={postContent}
// //               onChange={(e) => setPostContent(e.target.value)}
// //               rows={postContent.length > 80 ? 3 : 1}
// //               onKeyDown={(e) => {
// //                 if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleCreatePost();
// //               }}
// //             />
// //           </div>
// //           <div className="creator-footer">
// //             <div className="creator-attachments">
// //               <button className="attach-btn">
// //                 <span className="material-symbols-outlined" style={{ color: '#10b981' }}>image</span>
// //                 Ảnh
// //               </button>
// //               <button className="attach-btn">
// //                 <span className="material-symbols-outlined" style={{ color: '#f59e0b' }}>sentiment_satisfied</span>
// //                 Cảm xúc
// //               </button>
// //             </div>
// //             <button
// //               className="btn btn-primary btn-sm"
// //               onClick={handleCreatePost}
// //               disabled={isPosting || !postContent.trim()}
// //             >
// //               {isPosting ? <><span className="spinner" /> Đang đăng...</> : 'Đăng'}
// //             </button>
// //           </div>
// //         </div>

// //         {/* ── Feed ── */}
// //         <div className="feed-list">
// //           {loading && (
// //             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
// //               {[1, 2, 3].map((i) => (
// //                 <div key={i} className="skeleton" style={{ height: 120 }} />
// //               ))}
// //             </div>
// //           )}

// //           {!loading && posts.length === 0 && (
// //             <div className="empty-feed">
// //               <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--text-disabled)' }}>
// //                 article
// //               </span>
// //               <p>Chưa có bài viết nào. Hãy là người đầu tiên!</p>
// //             </div>
// //           )}

// //           {!loading && posts.map((post) => (
// //             <article key={post.id} className="post-card card">
// //               <div className="post-header">
// //                 <div className="post-author">
// //                   <Link to={`/profile?id=${post.userId}`}>
// //                     <div className="avatar">{getInitials(post.authorName || post.username || 'U')}</div>
// //                   </Link>
// //                   <div>
// //                     <Link to={`/profile?id=${post.userId}`} className="author-name">
// //                       {post.authorName || post.username || 'Người dùng'}
// //                     </Link>
// //                     <div className="post-time">{timeAgo(post.createdAt)}</div>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="post-body">
// //                 <p>{post.content}</p>
// //               </div>

// //               <div className="post-actions">
// //                 <button className="action-btn" onClick={() => handleReact(post.id)}>
// //                   <span className="material-symbols-outlined">favorite</span>
// //                   {post.likeCount || 0}
// //                 </button>
// //                 <button className="action-btn">
// //                   <span className="material-symbols-outlined">chat_bubble</span>
// //                   {post.commentCount || 0}
// //                 </button>
// //                 <button className="action-btn">
// //                   <span className="material-symbols-outlined">share</span>
// //                   Chia sẻ
// //                 </button>
// //               </div>
// //             </article>
// //           ))}
// //         </div>
// //       </div>
// //     </Layout>
// //   );
// // }
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { PostApi, Auth } from '../lib/api';
// import Layout from '../components/Layout';
// import { getInitials, timeAgo, showToast } from '../lib/ui';
// import '../styles/Home.css';

// export default function Home() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [postContent, setPostContent] = useState('');
//   const [isPosting, setIsPosting] = useState(false);
  
//   // State quản lý việc mở/đóng khung bình luận: { [postId]: boolean }
//   const [openComments, setOpenComments] = useState({});
//   // State chứa nội dung bình luận đang gõ: { [postId]: string }
//   const [commentInputs, setCommentInputs] = useState({});
//   // State quản lý trạng thái đang gửi bình luận: { [postId]: boolean }
//   const [isCommenting, setIsCommenting] = useState({});

//   const myName = Auth.getUsername() || "Bạn";
//   const myAvatarUrl = ""; // Nếu có avatar, truyền vào đây

//   const loadPosts = async () => {
//     try {
//       setLoading(true);
//       const res = await PostApi.getPosts();
//       // Bắt dữ liệu mảng an toàn từ các format trả về khác nhau
//       const dataList = Array.isArray(res) ? res : (res?.result || res?.value || []);
//       setPosts(dataList);
//     } catch (err) {
//       console.error("Lỗi tải bài viết:", err);
//       showToast("Lỗi tải bài viết", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadPosts();
//   }, []);

//   // ĐĂNG BÀI
//   const handleCreatePost = async () => {
//     if (!postContent.trim()) return;
//     setIsPosting(true);
//     try {
//       await PostApi.createPost({
//         content: postContent,
//         visibility: 0,
//         fileUrls: null
//       });
//       setPostContent('');
//       await loadPosts(); // Reload lại feed
//       showToast('Đăng bài thành công!', 'success');
//     } catch (err) {
//       showToast(err.message || 'Lỗi khi đăng bài', 'error');
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   // MỞ/ĐÓNG KHUNG BÌNH LUẬN
//   const toggleComments = (postId) => {
//     setOpenComments(prev => ({
//       ...prev,
//       [postId]: !prev[postId]
//     }));
//   };

//   // GỬI BÌNH LUẬN
//   const handlePostComment = async (postId) => {
//     const content = commentInputs[postId];
//     if (!content || !content.trim()) return;

//     setIsCommenting(prev => ({ ...prev, [postId]: true }));
//     try {
//       await PostApi.commentPost(postId, { content: content.trim() });
      
//       // Clear input sau khi gửi
//       setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      
//       // Reload lại danh sách bài viết để cập nhật bình luận mới
//       await loadPosts();
//     } catch (err) {
//       showToast(err.message || 'Lỗi khi gửi bình luận', 'error');
//     } finally {
//       setIsCommenting(prev => ({ ...prev, [postId]: false }));
//     }
//   };

//   return (
//     <Layout>
//       <div className="page-content">
        
//         {/* --- KHUNG TẠO BÀI VIẾT --- */}
//         <div className="card post-creator">
//           <div className="creator-row">
//             <div className="avatar">
//               {getInitials(myName)}
//             </div>
//             <textarea
//               value={postContent}
//               onChange={(e) => setPostContent(e.target.value)}
//               placeholder={`${myName} đang nghĩ gì thế?`}
//               className="creator-textarea"
//               rows={2}
//             />
//           </div>
//           <div className="creator-footer">
//             <div className="creator-attachments">
//               <button className="attach-btn" title="Thêm ảnh/video">
//                 <span className="material-symbols-outlined" style={{ color: '#10b981' }}>image</span>
//                 <span className="hidden-mobile">Ảnh/Video</span>
//               </button>
//               <button className="attach-btn" title="Cảm xúc">
//                 <span className="material-symbols-outlined" style={{ color: '#f59e0b' }}>sentiment_satisfied</span>
//                 <span className="hidden-mobile">Cảm xúc</span>
//               </button>
//             </div>
//             <button 
//               onClick={handleCreatePost} 
//               disabled={isPosting || !postContent.trim()} 
//               className="btn btn-primary"
//             >
//               {isPosting ? 'Đang đăng...' : 'Đăng bài'}
//             </button>
//           </div>
//         </div>

//         {/* --- DANH SÁCH BÀI VIẾT --- */}
//         <div className="feed-list">
//           {loading ? (
//             <div className="empty-feed">
//               <span className="spinner spinner-dark"></span>
//               <p>Đang tải bảng tin...</p>
//             </div>
//           ) : posts.length === 0 ? (
//             <div className="empty-feed">
//               <span className="material-symbols-outlined" style={{fontSize: 48}}>article</span>
//               <p>Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!</p>
//             </div>
//           ) : (
//             posts.map(post => (
//               <article key={post.id} className="card post-card">
                
//                 {/* Header bài viết */}
//                 <div className="post-header">
//                   <div className="post-author">
//                     <Link to={`/profile?id=${post.userId}`}>
//                       <div className="avatar">{getInitials(post.authorName || post.username || 'U')}</div>
//                     </Link>
//                     <div>
//                       <Link to={`/profile?id=${post.userId}`} className="author-name">
//                         {post.authorName || post.username || 'Người dùng'}
//                       </Link>
//                       <div className="post-time">{timeAgo(post.createdAt)}</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Nội dung bài viết */}
//                 <div className="post-body">
//                   <p>{post.content}</p>
//                 </div>

//                 {/* Các nút Tương tác */}
//                 <div className="post-actions">
//                   <button className="action-btn">
//                     <span className="material-symbols-outlined">favorite</span>
//                     Thích
//                   </button>
//                   <button className="action-btn" onClick={() => toggleComments(post.id)}>
//                     <span className="material-symbols-outlined">chat_bubble</span>
//                     Bình luận {post.commentsCount > 0 ? `(${post.commentsCount})` : ''}
//                   </button>
//                   <button className="action-btn">
//                     <span className="material-symbols-outlined">share</span>
//                     Chia sẻ
//                   </button>
//                 </div>

//                 {/* --- KHU VỰC BÌNH LUẬN (Chỉ hiện khi openComments[post.id] === true) --- */}
//                 {openComments[post.id] && (
//                   <div className="comments-section" style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                    
//                     {/* Danh sách bình luận */}
//                     {post.comments && post.comments.length > 0 ? (
//                       <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
//                         {post.comments.map(cmt => (
//                           <div key={cmt.id} className="comment-item" style={{ display: 'flex', gap: '10px' }}>
//                             <div className="avatar sm" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
//                               {getInitials(cmt.userName)}
//                             </div>
//                             <div className="comment-content" style={{ background: 'var(--surface-2)', padding: '8px 12px', borderRadius: '12px', flex: 1 }}>
//                               <Link to={`/profile?id=${cmt.userId}`} style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
//                                 {cmt.userName}
//                               </Link>
//                               <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '2px', wordBreak: 'break-word' }}>
//                                 {cmt.content}
//                               </p>
//                               <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
//                                 {timeAgo(cmt.createdAt)}
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: '16px' }}>
//                         Chưa có bình luận nào.
//                       </p>
//                     )}

//                     {/* Ô nhập bình luận mới */}
//                     <div className="comment-input-area" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//                       <div className="avatar sm" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
//                         {getInitials(myName)}
//                       </div>
//                       <input 
//                         type="text" 
//                         placeholder="Viết bình luận..." 
//                         value={commentInputs[post.id] || ''}
//                         onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
//                         onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post.id)}
//                         style={{
//                           flex: 1, padding: '8px 16px', borderRadius: '20px', 
//                           border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.9rem'
//                         }}
//                       />
//                       <button 
//                         onClick={() => handlePostComment(post.id)}
//                         disabled={isCommenting[post.id] || !(commentInputs[post.id] || '').trim()}
//                         style={{
//                           background: 'none', border: 'none', color: 'var(--primary)', 
//                           cursor: 'pointer', display: 'flex', alignItems: 'center'
//                         }}
//                       >
//                         <span className="material-symbols-outlined">send</span>
//                       </button>
//                     </div>

//                   </div>
//                 )}
//                 {/* --- END KHU VỰC BÌNH LUẬN --- */}

//               </article>
//             ))
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// }

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostApi, Auth } from '../lib/api';
import Layout from '../components/Layout';
import { getInitials, timeAgo, showToast } from '../lib/ui';
import '../styles/Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  // State quản lý mở/đóng toàn bộ khu vực bình luận
  const [openComments, setOpenComments] = useState({});
  
  // MỚI: State quản lý việc "Xem thêm" tất cả bình luận (ẩn/hiện)
  const [expandedComments, setExpandedComments] = useState({});

  // State nhập liệu & gửi bình luận
  const [commentInputs, setCommentInputs] = useState({});
  const [isCommenting, setIsCommenting] = useState({});

  const myName = Auth.getUsername() || "Bạn";

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await PostApi.getPosts();
      const dataList = Array.isArray(res) ? res : (res?.result || res?.value || []);
      setPosts(dataList);
    } catch (err) {
      console.error("Lỗi tải bài viết:", err);
      showToast("Lỗi tải bài viết", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    setIsPosting(true);
    try {
      await PostApi.createPost({
        content: postContent,
        visibility: 0,
        fileUrls: null
      });
      setPostContent('');
      await loadPosts();
      showToast('Đăng bài thành công!', 'success');
    } catch (err) {
      showToast(err.message || 'Lỗi khi đăng bài', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  const toggleComments = (postId) => {
    setOpenComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // MỚI: Hàm xử lý khi bấm "Xem thêm bình luận"
  const handleExpandComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const handlePostComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content || !content.trim()) return;

    setIsCommenting(prev => ({ ...prev, [postId]: true }));
    try {
      await PostApi.commentPost(postId, { content: content.trim() });
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      
      // Tự động mở rộng danh sách để user thấy bình luận vừa đăng
      setExpandedComments(prev => ({ ...prev, [postId]: true }));
      
      await loadPosts();
    } catch (err) {
      showToast(err.message || 'Lỗi khi gửi bình luận', 'error');
    } finally {
      setIsCommenting(prev => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <Layout>
      <div className="page-content">
        
        {/* --- KHUNG TẠO BÀI VIẾT --- */}
        <div className="card post-creator">
          <div className="creator-row">
            <div className="avatar">
              {getInitials(myName)}
            </div>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`${myName} đang nghĩ gì thế?`}
              className="creator-textarea"
              rows={2}
            />
          </div>
          <div className="creator-footer">
            <div className="creator-attachments">
              <button className="attach-btn" title="Thêm ảnh/video">
                <span className="material-symbols-outlined" style={{ color: '#10b981' }}>image</span>
                <span className="hidden-mobile">Ảnh/Video</span>
              </button>
              <button className="attach-btn" title="Cảm xúc">
                <span className="material-symbols-outlined" style={{ color: '#f59e0b' }}>sentiment_satisfied</span>
                <span className="hidden-mobile">Cảm xúc</span>
              </button>
            </div>
            <button 
              onClick={handleCreatePost} 
              disabled={isPosting || !postContent.trim()} 
              className="btn btn-primary"
            >
              {isPosting ? 'Đang đăng...' : 'Đăng bài'}
            </button>
          </div>
        </div>

        {/* --- DANH SÁCH BÀI VIẾT --- */}
        <div className="feed-list">
          {loading ? (
            <div className="empty-feed">
              <span className="spinner spinner-dark"></span>
              <p>Đang tải bảng tin...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-feed">
              <span className="material-symbols-outlined" style={{fontSize: 48}}>article</span>
              <p>Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!</p>
            </div>
          ) : (
            posts.map(post => {
              // Lọc ra số bình luận hiển thị (tất cả, hoặc chỉ 2 cái đầu)
              const isExpanded = expandedComments[post.id];
              const visibleComments = isExpanded ? post.comments : (post.comments?.slice(0, 2) || []);

              return (
                <article key={post.id} className="card post-card">
                  
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
                    <button className="action-btn">
                      <span className="material-symbols-outlined">favorite</span> Thích
                    </button>
                    <button className="action-btn" onClick={() => toggleComments(post.id)}>
                      <span className="material-symbols-outlined">chat_bubble</span> 
                      Bình luận {post.commentsCount > 0 ? `(${post.commentsCount})` : ''}
                    </button>
                    <button className="action-btn">
                      <span className="material-symbols-outlined">share</span> Chia sẻ
                    </button>
                  </div>

                  {/* --- KHU VỰC BÌNH LUẬN --- */}
                  {openComments[post.id] && (
                    <div className="comments-section" style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                      
                      {post.comments && post.comments.length > 0 ? (
                        <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                          
                          {/* Render danh sách bình luận (đã bị cắt hoặc hiển thị full) */}
                          {visibleComments.map(cmt => (
                            <div key={cmt.id} className="comment-item" style={{ display: 'flex', gap: '10px' }}>
                              <div className="avatar sm" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                {getInitials(cmt.userName)}
                              </div>
                              <div className="comment-content" style={{ background: 'var(--surface-2)', padding: '8px 12px', borderRadius: '12px', flex: 1 }}>
                                <Link to={`/profile?id=${cmt.userId}`} style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                  {cmt.userName}
                                </Link>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '2px', wordBreak: 'break-word' }}>
                                  {cmt.content}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                                  {timeAgo(cmt.createdAt)}
                                </span>
                              </div>
                            </div>
                          ))}

                          {/* NÚT XEM THÊM: Chỉ hiện nếu danh sách chưa được mở rộng và có > 2 bình luận */}
                          {!isExpanded && post.comments.length > 2 && (
                            <button 
                              onClick={() => handleExpandComments(post.id)}
                              style={{
                                background: 'none', border: 'none', color: 'var(--text-secondary)',
                                fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
                                textAlign: 'left', padding: '4px 0', alignSelf: 'flex-start'
                              }}
                            >
                              Xem thêm {post.comments.length - 2} bình luận...
                            </button>
                          )}

                        </div>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: '16px' }}>
                          Chưa có bình luận nào.
                        </p>
                      )}

                      {/* Ô nhập bình luận */}
                      <div className="comment-input-area" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div className="avatar sm" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                          {getInitials(myName)}
                        </div>
                        <input 
                          type="text" 
                          placeholder="Viết bình luận..." 
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handlePostComment(post.id)}
                          style={{
                            flex: 1, padding: '8px 16px', borderRadius: '20px', 
                            border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.9rem'
                          }}
                        />
                        <button 
                          onClick={() => handlePostComment(post.id)}
                          disabled={isCommenting[post.id] || !(commentInputs[post.id] || '').trim()}
                          style={{
                            background: 'none', border: 'none', color: 'var(--primary)', 
                            cursor: 'pointer', display: 'flex', alignItems: 'center'
                          }}
                        >
                          <span className="material-symbols-outlined">send</span>
                        </button>
                      </div>

                    </div>
                  )}
                  {/* --- END KHU VỰC BÌNH LUẬN --- */}

                </article>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}