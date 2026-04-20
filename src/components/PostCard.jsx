import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitials, timeAgo } from '../lib/ui';

export default function PostCard({ 
  post, 
  myName, 
  myId, 
  onReact, 
  onComment, 
  onDeletePost, 
  onDeleteComment 
}) {
  const navigate = useNavigate();
  
  const [openComments, setOpenComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // Xử lý gửi bình luận
  const handlePostComment = async () => {
    if (!commentInput.trim() || !onComment) return;
    setIsCommenting(true);
    try {
      await onComment(post.id, commentInput);
      setCommentInput('');
    } finally {
      setIsCommenting(false);
    }
  };

  const visibleComments = post.comments;
  const fileUrls = post.fileUrls || post.fileUrl || [];

  return (
    <article className="card post-card">
      {/* ── HEADER BÀI VIẾT ── */}
      <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => post.userId && navigate(`/profile/${post.userId}`)}>
          <div className="avatar" style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getInitials(post.authorName || post.userName || 'User')}
          </div>
          <div>
            <b>{post.authorName || post.userName || 'Người dùng'}</b>
            <div className="post-time" style={{ fontSize: '12px', color: '#666' }}>{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        {post.userId === myId && onDeletePost && (
          <button onClick={() => onDeletePost(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <span className="material-symbols-outlined">delete</span>
          </button>
        )}
      </div>

      {/* ── NỘI DUNG & HÌNH ẢNH ── */}
      <div className="post-body" style={{ margin: '12px 0' }}>
        <p>{post.content}</p>
        {Array.isArray(fileUrls) && fileUrls.length > 0 && (
          <div className={`post-images img-count-${Math.min(fileUrls.length, 4)}`}>
            {fileUrls.slice(0, 4).map((url, i, arr) => (
              <div key={i} className="post-img-wrap">
                <img src={url} alt={`ảnh ${i + 1}`} loading="lazy" />
                {i === 3 && arr.length > 4 && (
                  <div className="post-img-more">+{arr.length - 4}</div>
                )}
              </div>
            ))}
          </div>
        )}
        {typeof fileUrls === 'string' && fileUrls && (
          <div className="post-images">
            {fileUrls.split(',').map((url, i) => (
              url && <img key={i} src={url} alt="post media" style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} />
            ))}
          </div>
        )}
      </div>

      {/* ── STATS BAR ── */}
      {(post.reactCount > 0 || (post.comments && post.comments.length > 0)) && (
        <div className="post-stats">
          {post.reactCount > 0 && (
            <span className="stat-likes">
              <span className="stat-heart">❤</span> {post.reactCount}
            </span>
          )}
        </div>
      )}

      {/* ── NÚT TƯƠNG TÁC ── */}
      <div className="post-actions" style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '12px' }}>
        <button 
          onClick={() => onReact && onReact(post.id)}
          style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <span className="material-symbols-outlined">favorite_border</span>
          {post.reactionCount || post.likeCount || 0} Thích
        </button>
        <button onClick={() => setOpenComments(!openComments)} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="material-symbols-outlined">chat_bubble_outline</span>
          {post.comments?.length || post.commentCount || 0} Bình luận
        </button>
      </div>

      {/* ── KHU VỰC BÌNH LUẬN ── */}
      {openComments && (
        <div className="comments-section" style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          {post.comments && post.comments.length > 0 ? (
            <div className="comments-list">
              {visibleComments.map(comment => (
                <div key={comment.id} className="comment-item" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <div className="avatar sm" style={{ width: 32, height: 32, borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getInitials(comment.userName || comment.authorName)}
                  </div>
                  <div className="comment-bubble" style={{ background: 'var(--surface-hover, #f0f2f5)', padding: '8px 12px', borderRadius: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Link to={comment.userId ? `/profile/${comment.userId}` : '#'} style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {comment.userName || comment.authorName}
                      </Link>
                      {comment.userId === myId && onDeleteComment && (
                         <span className="material-symbols-outlined" style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => onDeleteComment(post.id, comment.id)}>close</span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>{comment.content}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-comments" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chưa có bình luận nào.</p>
          )}

          {/* Ô nhập bình luận */}
          <div className="comment-input-area" style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
            <div className="avatar sm" style={{ width: 32, height: 32, borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getInitials(myName)}
            </div>
            <input
              type="text"
              placeholder="Viết bình luận..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handlePostComment()}
              style={{ flex: 1, padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '0.9rem' }}
            />
            <button
              className="send-comment-btn"
              onClick={handlePostComment}
              disabled={isCommenting || !commentInput.trim()}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}
    </article>
  );
}