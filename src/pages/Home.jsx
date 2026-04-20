import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PostApi } from '../lib/api/post.api';
import { Auth, uploadFile } from '../lib/api/baseApi';
import Layout from '../components/Layout';
import { getInitials, timeAgo, showToast } from '../lib/ui';
import '../styles/Home.css';
import PostCard from '../components/PostCard';
export default function Home() {
  const [posts, setPosts]                       = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [postContent, setPostContent]           = useState('');
  const [isPosting, setIsPosting]               = useState(false);
    const [selectedImages, setSelectedImages]     = useState([]);
  const [uploadingCount, setUploadingCount]     = useState(0); 
  const fileInputRef                            = useRef(null);

  const [openComments, setOpenComments]         = useState({});   // { [postId]: bool }
  const [expandedComments, setExpandedComments] = useState({});   // { [postId]: bool }
  const [commentInputs, setCommentInputs]       = useState({});   // { [postId]: string }
  const [isCommenting, setIsCommenting]         = useState({});   // { [postId]: bool }

  const myName = Auth.getUsername() || 'Bạn';

  // ── Load bài viết ─────────────────────────────────────────────────────────
  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await PostApi.getPosts();
      const dataList = Array.isArray(res) ? res : (res?.result || res?.value || []);
      setPosts(dataList);
    } catch (err) {
      showToast('Lỗi tải bảng tin', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = ''; 

    const newEntries = files.map(file => ({
      previewUrl: URL.createObjectURL(file),
      serverUrl:  null,
      uploading:  true,
    }));

    setSelectedImages(prev => [...prev, ...newEntries]);
    setUploadingCount(prev => prev + files.length);

    await Promise.all(
      files.map(async (file, i) => {
        const indexInState = i; 
        try {
          const url = await uploadFile(file);
          // Cập nhật đúng entry: tìm theo previewUrl (unique per object URL)
          const previewUrl = newEntries[i].previewUrl;
          setSelectedImages(prev =>
            prev.map(img =>
              img.previewUrl === previewUrl
                ? { ...img, serverUrl: url, uploading: false }
                : img
            )
          );
        } catch (err) {
          const previewUrl = newEntries[i].previewUrl;
          showToast(`Lỗi upload ảnh: ${err.message}`, 'error');
          // Xóa ảnh lỗi khỏi danh sách
          setSelectedImages(prev =>
            prev.filter(img => img.previewUrl !== previewUrl)
          );
          URL.revokeObjectURL(previewUrl);
        } finally {
          setUploadingCount(prev => prev - 1);
        }
      })
    );
  };

  const removeImage = (index) => {
    setSelectedImages(prev => {
      const item = prev[index];
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedImages.length === 0) return;
    if (uploadingCount > 0) {
      showToast('Vui lòng chờ ảnh upload xong!', 'error');
      return;
    }

    const fileUrls = selectedImages
      .filter(img => img.serverUrl)
      .map(img => img.serverUrl);

    setIsPosting(true);
    try {
      await PostApi.createPost({
        content:    postContent,
        visibility: 0,
        fileUrls:   fileUrls.length > 0 ? fileUrls : null,
      });

      selectedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
      setPostContent('');
      setSelectedImages([]);
      await loadPosts();
      showToast('Đã đăng bài viết!', 'success');
    } catch (err) {
      showToast(err.message || 'Lỗi khi đăng bài', 'error');
    } finally {
      setIsPosting(false);
    }
  };


  const toggleComments = (postId) =>
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));

  const handleExpandComments = (postId) =>
    setExpandedComments(prev => ({ ...prev, [postId]: true }));

  const handlePostComment = async (postId, content) => {
     try {
       await PostApi.commentPost(postId, { content });
       loadPosts();
     } catch (err) {
       showToast(err.message, 'error');
     }
  };

  const handleReact = async (postId) => {
    try {
      await PostApi.reactPost(postId, "like-guid");
      loadPosts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await PostApi.deletePost(postId);
      loadPosts();
      showToast('Đã xóa bài viết', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };
  return (
    <Layout>
      <div className="page-content">

        {/* ══ KHUNG TẠO BÀI VIẾT ══════════════════════════════════════════ */}
        <div className="card post-creator">
          <div className="creator-row">
            <div className="avatar">{getInitials(myName)}</div>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`${myName} ơi, bạn đang nghĩ gì?`}
              className="creator-textarea"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleCreatePost();
              }}
            />
          </div>

          {/* Preview ảnh đã chọn */}
          {selectedImages.length > 0 && (
            <div className="preview-container">
              {selectedImages.map((img, index) => (
                <div key={index} className={`preview-thumb${img.uploading ? ' uploading' : ''}`}>
                  <img src={img.previewUrl} alt="preview" />
                  {img.uploading && (
                    <div className="upload-overlay">
                      <span className="spinner" />
                    </div>
                  )}
                  {!img.uploading && (
                    <button className="remove-img-btn" onClick={() => removeImage(index)}>×</button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="creator-footer">
            <div className="creator-attachments">
              <input
                type="file" multiple accept="image/*"
                ref={fileInputRef} style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <button
                className="attach-btn"
                title="Thêm ảnh/video"
                onClick={() => fileInputRef.current.click()}
              >
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
              disabled={isPosting || uploadingCount > 0 || (!postContent.trim() && selectedImages.length === 0)}
              className="btn btn-primary"
            >
              {isPosting ? 'Đang đăng...' : uploadingCount > 0 ? `Đang tải ảnh (${uploadingCount})...` : 'Đăng bài'}
            </button>
          </div>
        </div>

        {/* ══ DANH SÁCH BÀI VIẾT ══════════════════════════════════════════ */}
        <div className="feed-list">
          {loading ? (
            <div className="empty-feed">
              <span className="spinner spinner-dark" />
              <p>Đang tải bảng tin...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-feed">
              <span className="material-symbols-outlined" style={{ fontSize: 48 }}>article</span>
              <p>Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!</p>
            </div>
          ) : (
            posts.map(post => {
              const isExpanded      = expandedComments[post.id];
              const allComments     = post.comments || [];
              const visibleComments = isExpanded ? allComments : allComments.slice(0, 2);
              const hiddenCount     = allComments.length - 2;

              // Tách fileUrls (backend trả mảng ròi)
              const images = post.fileUrls || [];

              return (
                <article key={post.id} className="card post-card">

                  {/* ── Header: avatar + tên + thời gian ── */}
                  <div className="post-header">
                    <div className="post-author">
                      <Link to={`/profile?id=${post.userId}`}>
                        <div className="avatar">
                          {getInitials(post.authorName || post.username || 'U')}
                        </div>
                      </Link>
                      <div>
                        <Link to={`/profile?id=${post.userId}`} className="author-name">
                          {post.authorName || post.username || 'Người dùng'}
                        </Link>
                        <div className="post-time">{timeAgo(post.createdAt)}</div>
                      </div>
                    </div>
                  </div>

                  {/* ── Nội dung văn bản ── */}
                  {post.content && (
                    <div className="post-body">
                      <p>{post.content}</p>
                    </div>
                  )}

                  {/* ── Ảnh bài đăng ── */}
                  {post.fileUrls && post.fileUrls.length > 0 && (
                    <div className={`post-images img-count-${Math.min(post.fileUrls.length, 4)}`}>
                      {post.fileUrls.slice(0, 4).map((url, i, arr) => (
                        <div key={i} className="post-img-wrap">
                          <img src={url} alt={`ảnh ${i + 1}`} loading="lazy" />
                          {/* Hiển thị số lượng ảnh còn lại nếu nhiều hơn 4 ảnh */}
                          {i === 3 && arr.length > 4 && (
                            <div className="post-img-more">+{arr.length - 4}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Stats bar ── */}
                  {(post.reactCount > 0 || allComments.length > 0) && (
                    <div className="post-stats">
                      {post.reactCount > 0 && (
                        <span className="stat-likes">
                          <span className="stat-heart">❤</span> {post.reactCount}
                        </span>
                      )}
                      
                    </div>
                  )}

                  {/* ── Nút hành động ── */}
                  <div className="post-actions">
                    <button className="action-btn">
                      <span className="material-symbols-outlined">favorite</span>
                      Thích
                    </button>
                    <button className="action-btn" onClick={() => toggleComments(post.id)}>
                      <span className="material-symbols-outlined">chat_bubble</span>
                      Bình luận{allComments.length > 0 ? ` (${allComments.length})` : ''}
                    </button>
                    <button className="action-btn">
                      <span className="material-symbols-outlined">share</span>
                      Chia sẻ
                    </button>
                  </div>

                  {/* ── Khu vực bình luận ── */}
                  {openComments[post.id] && (
                    <div className="comments-section">

                      {allComments.length > 0 ? (
                        <div className="comments-list">
                          {visibleComments.map((cmt, idx) => (
                            <div key={cmt.id ?? idx} className="comment-item">
                              <div className="avatar sm">
                                {getInitials(cmt.userName || cmt.authorName || 'U')}
                              </div>
                              <div className="comment-bubble">
                                <Link
                                  to={`/profile?id=${cmt.userId}`}
                                  className="comment-author"
                                >
                                  {cmt.userName || cmt.authorName || 'Người dùng'}
                                </Link>
                                <p className="comment-text">{cmt.content}</p>
                                <span className="comment-time">{timeAgo(cmt.createdAt)}</span>
                              </div>
                            </div>
                          ))}

                          {/* Nút xem thêm bình luận */}
                          {!isExpanded && hiddenCount > 0 && (
                            <button
                              className="expand-comments-btn"
                              onClick={() => handleExpandComments(post.id)}
                            >
                              Xem thêm {hiddenCount} bình luận...
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="no-comments">Chưa có bình luận nào.</p>
                      )}

                      {/* Ô nhập bình luận */}
                      <div className="comment-input-area">
                        <div className="avatar sm">{getInitials(myName)}</div>
                        <input
                          type="text"
                          placeholder="Viết bình luận..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) =>
                            e.key === 'Enter' && !e.shiftKey && handlePostComment(post.id)
                          }
                        />
                        <button
                          className="send-comment-btn"
                          onClick={() => handlePostComment(post.id)}
                          disabled={isCommenting[post.id] || !(commentInputs[post.id] || '').trim()}
                        >
                          <span className="material-symbols-outlined">send</span>
                        </button>
                      </div>

                    </div>
                  )}
                  {/* ── END khu vực bình luận ── */}

                </article>
              );
            })
          )}
        </div>

      </div>
    </Layout>
  );
}