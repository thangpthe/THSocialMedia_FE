import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { AccountApi } from '../lib/api/account.api';
import { RelationshipApi } from '../lib/api/relationship.api';
import { Auth, uploadFile } from '../lib/api/baseApi';
import { PostApi } from '../lib/api/post.api';
import { getInitials, timeAgo, showToast } from '../lib/ui';
import PostCard from '../components/PostCard';

import "../styles/Profile.css";
import "../styles/Home.css";

export default function ProfilePage() {
  const { id: targetId } = useParams();
  const myId = String(Auth.getUserId());
  const myName = Auth.getUsername() || 'Bạn';

  const displayId = targetId || myId;
  const isMe = displayId === myId;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef(null);

  const [relationshipStatus, setRelationshipStatus] = useState('NONE');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const pRes = await AccountApi.getProfile(displayId);
      setProfile(pRes.result || pRes);

      const postRes = await PostApi.getPosts();
      const allPosts = Array.isArray(postRes) ? postRes : (postRes?.result || postRes?.value || []);
      const userPosts = allPosts.filter(p => String(p.userId) === String(displayId));
      setPosts(userPosts);

      if (!isMe) {
        const [friendsRes, requestsRes] = await Promise.all([
          RelationshipApi.getFriends(),
          RelationshipApi.getPendingRequests()
        ]);
        const friends = friendsRes.result || [];
        const requests = requestsRes.result || [];
        const uId = String(displayId);

        if (friends.some(f => String(f.userId) === uId || String(f.friendId) === uId)) {
          setRelationshipStatus('FRIENDS');
        } else {
          const req = requests.find(r => String(r.userId) === uId || String(r.friendId) === uId);
          if (req) {
            setRelationshipStatus(String(req.friendId) === myId ? 'PENDING_RECEIVED' : 'PENDING_SENT');
          } else {
            setRelationshipStatus('NONE');
          }
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi tải thông tin', 'error');
    } finally {
      setLoading(false);
    }
  }, [displayId, isMe, myId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        content: postContent,
        visibility: 0,
        fileUrls: fileUrls.length > 0 ? fileUrls : null,
      });
      setPostContent('');
      setSelectedImages([]);
      showToast('Đăng bài thành công!', 'success');
      await loadData();
    } catch (err) {
      showToast(err.message || 'Lỗi khi đăng bài', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = '';

    const newEntries = files.map(file => ({
      previewUrl: URL.createObjectURL(file),
      serverUrl: null,
      uploading: true,
    }));

    setSelectedImages(prev => [...prev, ...newEntries]);
    setUploadingCount(prev => prev + files.length);

    await Promise.all(
      files.map(async (file, i) => {
        try {
          const url = await uploadFile(file);
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

  const handlePostComment = async (postId, content) => {
    try {
      await PostApi.commentPost(postId, { content });
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleReact = async (postId) => {
    try {
      await PostApi.reactPost(postId, "like-guid");
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await PostApi.deletePost(postId);
      loadData();
      showToast('Đã xóa bài viết', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading && !profile) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải trang cá nhân...</div>
    </Layout>
  );

  if (!profile) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '40px' }}>Không tìm thấy người dùng này.</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="page-content" style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div className="p-header-card">
          <div className="p-cover" />
          <div className="p-info-bar">
            <div className="p-left">
              <div className="p-avatar-wrap">
                <div className="p-avatar">{getInitials(profile?.fullName || profile?.username || 'U')}</div>
              </div>
              <div className="p-meta">
                <h1>{profile?.fullName || profile?.username || 'Người dùng'}</h1>
                <div className="p-username">@{profile?.username}</div>
              </div>
            </div>

            {!isMe && (
              <div className="p-actions">
                {relationshipStatus === 'FRIENDS' ? (
                  <button className="btn btn-secondary btn-sm" disabled>Bạn bè</button>
                ) : relationshipStatus === 'PENDING_SENT' ? (
                  <button className="btn btn-secondary btn-sm" disabled>Đã gửi lời mời</button>
                ) : relationshipStatus === 'PENDING_RECEIVED' ? (
                  <button className="btn btn-primary btn-sm" onClick={() => window.location.href = '/friends'}>Kiểm tra lời mời</button>
                ) : (
                  <button className="btn btn-primary btn-sm">+ Thêm bạn bè</button>
                )}
                <button className="btn btn-secondary btn-sm">Nhắn tin</button>
              </div>
            )}
          </div>
        </div>

        <div className="p-grid">

          <aside className="p-sidebar">
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Giới thiệu</h3>
              <p style={{ fontSize: '0.9rem' }}>{profile?.bio || 'Chưa có thông tin giới thiệu.'}</p>
              <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                <div>📧 Email: {profile?.email || '—'}</div>
                <div style={{ marginTop: 6 }}>📅 Tham gia: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : '—'}</div>
              </div>
            </div>
          </aside>

          <main className="p-main">
            {isMe && (
              <div className="card post-creator" style={{ marginBottom: 16, padding: '16px 20px' }}>
                <div className="creator-row">
                  <div className="avatar sm">{getInitials(profile?.fullName || 'U')}</div>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Bạn đang nghĩ gì thế?"
                    className="creator-textarea"
                    rows={2}
                  />
                </div>

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
                    <button className="attach-btn" title="Ảnh/Video" onClick={() => fileInputRef.current.click()}>
                      <span className="material-symbols-outlined" style={{ color: '#10b981' }}>image</span> Ảnh/Video
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
            )}

            <div className="feed-list">
              {posts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-tertiary)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 44, marginBottom: 12, display: 'block' }}>article</span>
                  <p style={{ fontSize: '0.9rem' }}>Chưa có bài viết nào</p>
                </div>
              ) : (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    myName={myName}
                    myId={myId}
                    onReact={handleReact}
                    onComment={handlePostComment}
                    onDeletePost={handleDeletePost}
                  />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}