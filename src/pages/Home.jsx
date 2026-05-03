import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PostApi } from '../lib/api/post.api';
import { Auth, uploadFile } from '../lib/api/baseApi';
import Layout from '../components/Layout';
import { getInitials, timeAgo, showToast } from '../lib/ui';
import '../styles/Home.css';

// ─── MODAL CHỈNH SỬA BÀI VIẾT ───────────────────────────────────────────────
function EditPostModal({ post, onClose, onSaved }) {
  const [content, setContent] = useState(post.content || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await PostApi.updatePost(post.id, { content, visibility: post.visibility ?? 0, fileUrls: post.fileUrls });
      showToast('Đã cập nhật bài viết!', 'success');
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.message || 'Lỗi cập nhật bài viết', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Chỉnh sửa bài viết</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <textarea
          className="modal-textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={5}
          autoFocus
        />
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Huỷ</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !content.trim()}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL CHỈNH SỬA BÌNH LUẬN ───────────────────────────────────────────────
function EditCommentModal({ postId, comment, onClose, onSaved }) {
  const [content, setContent] = useState(comment.content || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await PostApi.updateComment(postId, comment.id, { content, fileUrl: comment.fileUrl || null });
      showToast('Đã cập nhật bình luận!', 'success');
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.message || 'Lỗi cập nhật bình luận', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Chỉnh sửa bình luận</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <textarea
          className="modal-textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
          autoFocus
        />
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Huỷ</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !content.trim()}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CONFIRM DELETE DIALOG ────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box confirm-box" onClick={e => e.stopPropagation()}>
        <p className="confirm-message">{message}</p>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Huỷ</button>
          <button className="btn btn-danger" onClick={onConfirm}>Xoá</button>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  const [posts, setPosts]                       = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [postContent, setPostContent]           = useState('');
  const [isPosting, setIsPosting]               = useState(false);
  const [selectedImages, setSelectedImages]     = useState([]);
  const [uploadingCount, setUploadingCount]     = useState(0);
  const fileInputRef                            = useRef(null);
  const [openComments, setOpenComments]         = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs]       = useState({});
  const [isCommenting, setIsCommenting]         = useState({});

  // Dropdown menu cho post
  const [postMenu, setPostMenu]                 = useState(null); // postId
  // Dropdown menu cho comment
  const [commentMenu, setCommentMenu]           = useState(null); // { postId, commentId }

  // Modals
  const [editPostTarget, setEditPostTarget]         = useState(null);   // post object
  const [editCommentTarget, setEditCommentTarget]   = useState(null);   // { post, comment }
  const [deleteConfirm, setDeleteConfirm]           = useState(null);   // { type, label, action }

  const myId   = Auth.getUserId();
  const myName = Auth.getUsername() || 'Bạn';

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const close = () => { setPostMenu(null); setCommentMenu(null); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  // ── Load bài viết ────────────────────────────────────────────────────────
  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await PostApi.getPosts();
      const dataList = Array.isArray(res) ? res : (res?.result || res?.value || []);
      setPosts(dataList);
    } catch {
      showToast('Lỗi tải bảng tin', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  // ── Upload ảnh ───────────────────────────────────────────────────────────
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
        const previewUrl = newEntries[i].previewUrl;
        try {
          const url = await uploadFile(file);
          setSelectedImages(prev =>
            prev.map(img => img.previewUrl === previewUrl ? { ...img, serverUrl: url, uploading: false } : img)
          );
        } catch (err) {
          showToast(`Lỗi upload ảnh: ${err.message}`, 'error');
          setSelectedImages(prev => prev.filter(img => img.previewUrl !== previewUrl));
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

  // ── Tạo bài viết ────────────────────────────────────────────────────────
  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedImages.length === 0) return;
    if (uploadingCount > 0) { showToast('Vui lòng chờ ảnh upload xong!', 'error'); return; }

    const fileUrls = selectedImages.filter(img => img.serverUrl).map(img => img.serverUrl);
    setIsPosting(true);
    try {
      await PostApi.createPost({ content: postContent, visibility: 0, fileUrls: fileUrls.length > 0 ? fileUrls : null });
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

  // ── Xoá bài viết ────────────────────────────────────────────────────────
  const confirmDeletePost = (post) => {
    setPostMenu(null);
    setDeleteConfirm({
      message: 'Bạn chắc chắn muốn xoá bài viết này?',
      action: async () => {
        try {
          await PostApi.deletePost(post.id);
          showToast('Đã xoá bài viết', 'success');
          loadPosts();
        } catch (err) {
          showToast(err.message || 'Lỗi xoá bài viết', 'error');
        } finally {
          setDeleteConfirm(null);
        }
      },
    });
  };

  // ── Xoá bình luận ───────────────────────────────────────────────────────
  const confirmDeleteComment = (post, comment) => {
    setCommentMenu(null);
    setDeleteConfirm({
      message: 'Bạn chắc chắn muốn xoá bình luận này?',
      action: async () => {
        try {
          await PostApi.deleteComment(post.id, comment.id);
          showToast('Đã xoá bình luận', 'success');
          loadPosts();
        } catch (err) {
          showToast(err.message || 'Lỗi xoá bình luận', 'error');
        } finally {
          setDeleteConfirm(null);
        }
      },
    });
  };

  // ── Bình luận ────────────────────────────────────────────────────────────
  const handlePostComment = async (postId) => {
    const content = (commentInputs[postId] || '').trim();
    if (!content) return;
    setIsCommenting(prev => ({ ...prev, [postId]: true }));
    try {
      await PostApi.commentPost(postId, { content });
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      loadPosts();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsCommenting(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleComments = (postId) =>
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));

  const handleExpandComments = (postId) =>
    setExpandedComments(prev => ({ ...prev, [postId]: true }));

  return (
    <Layout>
      {/* ── Modals ── */}
      {editPostTarget && (
        <EditPostModal
          post={editPostTarget}
          onClose={() => setEditPostTarget(null)}
          onSaved={loadPosts}
        />
      )}
      {editCommentTarget && (
        <EditCommentModal
          postId={editCommentTarget.post.id}
          comment={editCommentTarget.comment}
          onClose={() => setEditCommentTarget(null)}
          onSaved={loadPosts}
        />
      )}
      {deleteConfirm && (
        <ConfirmDialog
          message={deleteConfirm.message}
          onConfirm={deleteConfirm.action}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

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
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleCreatePost(); }}
            />
          </div>

          {selectedImages.length > 0 && (
            <div className="preview-container">
              {selectedImages.map((img, index) => (
                <div key={index} className={`preview-thumb${img.uploading ? ' uploading' : ''}`}>
                  <img src={img.previewUrl} alt="preview" />
                  {img.uploading && <div className="upload-overlay"><span className="spinner" /></div>}
                  {!img.uploading && <button className="remove-img-btn" onClick={() => removeImage(index)}>×</button>}
                </div>
              ))}
            </div>
          )}

          <div className="creator-footer">
            <div className="creator-attachments">
              <input type="file" multiple accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
              <button className="attach-btn" title="Thêm ảnh/video" onClick={() => fileInputRef.current.click()}>
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
              const isMyPost        = String(post.userId) === String(myId);

              return (
                <article key={post.id} className="card post-card">

                  {/* ── Header ── */}
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

                    {/* ── Menu bài viết (chỉ hiện với chủ bài) ── */}
                    {isMyPost && (
                      <div className="post-menu-wrap" onClick={e => e.stopPropagation()}>
                        <button
                          className="post-menu-btn"
                          title="Tuỳ chọn"
                          onClick={() => setPostMenu(prev => prev === post.id ? null : post.id)}
                        >
                          <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                        {postMenu === post.id && (
                          <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => { setPostMenu(null); setEditPostTarget(post); }}>
                              <span className="material-symbols-outlined">edit</span> Chỉnh sửa
                            </button>
                            <button className="dropdown-item danger" onClick={() => confirmDeletePost(post)}>
                              <span className="material-symbols-outlined">delete</span> Xoá bài viết
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── Nội dung ── */}
                  {post.content && (
                    <div className="post-body"><p>{post.content}</p></div>
                  )}

                  {/* ── Ảnh ── */}
                  {post.fileUrls && post.fileUrls.length > 0 && (
                    <div className={`post-images img-count-${Math.min(post.fileUrls.length, 4)}`}>
                      {post.fileUrls.slice(0, 4).map((url, i, arr) => (
                        <div key={i} className="post-img-wrap">
                          <img src={url} alt={`ảnh ${i + 1}`} loading="lazy" />
                          {i === 3 && arr.length > 4 && <div className="post-img-more">+{arr.length - 4}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Stats bar ── */}
                  {(post.reactCount > 0 || allComments.length > 0) && (
                    <div className="post-stats">
                      {post.reactCount > 0 && (
                        <span className="stat-likes"><span className="stat-heart">❤</span> {post.reactCount}</span>
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
                          {visibleComments.map((cmt, idx) => {
                            const isMyComment = String(cmt.userId) === String(myId)
                                             || String(cmt.userName) === String(myName);
                            return (
                              <div key={cmt.id ?? idx} className="comment-item">
                                <div className="avatar sm">{getInitials(cmt.userName || cmt.authorName || 'U')}</div>
                                <div className="comment-bubble">
                                  <div className="comment-bubble-header">
                                    <Link to={`/profile?id=${cmt.userId}`} className="comment-author">
                                      {cmt.userName || cmt.authorName || 'Người dùng'}
                                    </Link>
                                    {/* Menu bình luận */}
                                    {isMyComment && (
                                      <div className="comment-menu-wrap" onClick={e => e.stopPropagation()}>
                                        <button
                                          className="comment-menu-btn"
                                          onClick={() => setCommentMenu(prev =>
                                            prev?.commentId === cmt.id ? null : { postId: post.id, commentId: cmt.id }
                                          )}
                                        >
                                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>more_horiz</span>
                                        </button>
                                        {commentMenu?.commentId === cmt.id && (
                                          <div className="dropdown-menu comment-dropdown">
                                            <button
                                              className="dropdown-item"
                                              onClick={() => { setCommentMenu(null); setEditCommentTarget({ post, comment: cmt }); }}
                                            >
                                              <span className="material-symbols-outlined">edit</span> Chỉnh sửa
                                            </button>
                                            <button
                                              className="dropdown-item danger"
                                              onClick={() => confirmDeleteComment(post, cmt)}
                                            >
                                              <span className="material-symbols-outlined">delete</span> Xoá
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <p className="comment-text">{cmt.content}</p>
                                  <span className="comment-time">{timeAgo(cmt.createdAt)}</span>
                                </div>
                              </div>
                            );
                          })}

                          {!isExpanded && hiddenCount > 0 && (
                            <button className="expand-comments-btn" onClick={() => handleExpandComments(post.id)}>
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
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handlePostComment(post.id)}
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
                </article>
              );
            })
          )}
        </div>

      </div>
    </Layout>
  );
}