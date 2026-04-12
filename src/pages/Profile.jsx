// // import React, { useEffect, useState } from 'react';
// // import { useSearchParams } from 'react-router-dom';
// // import Layout from '../components/Layout';
// // import { AccountApi, Auth, PostApi } from '../lib/api';
// // import { getInitials } from '../lib/ui';
// // import "../styles/Profile.css";

// // const ProfilePage = () => {
// //   const [searchParams] = useSearchParams();
// //   const targetId = searchParams.get('id');
// //   const myId = Auth.getUserId();
// //   const isMe = !targetId || targetId === myId;

// //   const [profile, setProfile] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // --- STATE CHO CHỨC NĂNG ĐĂNG BÀI ---
// //   const [postContent, setPostContent] = useState('');
// //   const [visibility, setVisibility] = useState(0); // 0: Công khai, 1: Bạn bè, 2: Chỉ mình tôi
// //   const [isPosting, setIsPosting] = useState(false);

// //   useEffect(() => {
// //     const loadProfile = async () => {
// //       try {
// //         const data = await AccountApi.getProfile(targetId);
// //         setProfile(data.result || data);
// //       } catch (err) {
// //         console.error("Lỗi tải profile:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     loadProfile();
// //   }, [targetId]);

// //   // --- HÀM XỬ LÝ ĐĂNG BÀI VIẾT ---
// //   const handleCreatePost = async () => {
// //     if (!postContent.trim()) return;
    
// //     setIsPosting(true);
// //     try {
// //       const payload = {
// //         content: postContent,
// //         visibility: Number(visibility),
// //         fileUrls: null // Nếu có chức năng upload ảnh, bạn truyền URL vào đây
// //       };

// //       await PostApi.createPost(payload);
      
// //       alert("Đăng bài viết thành công!");
// //       setPostContent(''); // Reset lại khung nhập sau khi đăng thành công
      
// //       // Ở đây bạn có thể gọi thêm hàm load lại danh sách bài viết (nếu có làm chức năng lấy Feed)
// //     } catch (error) {
// //       console.error("Lỗi khi đăng bài:", error);
// //       alert(error.message || "Đã xảy ra lỗi khi đăng bài.");
// //     } finally {
// //       setIsPosting(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <Layout>
// //         <div className="profile-container">
// //           <div className="skeleton" style={{ height: '420px', borderRadius: '20px' }} />
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   const name = profile?.fullName || profile?.username || "Nguyễn Văn A";
// //   const username = profile?.username || "nguyenvana";
// //   const bio = profile?.bio || "Product Designer | Yêu công nghệ và thiết kế sáng tạo ✨";

// //   return (
// //     <Layout>
// //       <div className="profile-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

// //         {/* Cover + Avatar + Info */}
// //         <div className="profile-header-card">
// //           <div 
// //             className="cover-photo"
// //             style={{
// //               background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
// //               backgroundImage: 'url("https://picsum.photos/id/1015/1200/400")',
// //               backgroundSize: 'cover',
// //               backgroundPosition: 'center',
// //               height: '380px',
// //               position: 'relative'
// //             }}
// //           />

// //           <div className="profile-info-bar">
// //             <div className="profile-main">
// //               {/* Avatar */}
// //               <div className="avatar-box" style={{ border: '6px solid white' }}>
// //                 <div className="avatar-placeholder" style={{ fontSize: '3.5rem' }}>
// //                   {getInitials(name)}
// //                 </div>
// //               </div>

// //               <div className="profile-meta">
// //                 <h1 style={{ fontSize: '2.2rem', marginBottom: '4px' }}>{name}</h1>
// //                 <p className="username" style={{ fontSize: '1.1rem' }}>@{username}</p>
// //                 <p style={{ color: '#64748b', marginTop: '6px' }}>
// //                   1.2K bạn bè • 45 bạn chung
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Action buttons */}
// //             <div className="profile-actions" style={{ display: 'flex', gap: '12px' }}>
// //               {isMe ? (
// //                 <>
// //                   <button className="btn btn-primary" style={{ background: '#8b5cf6', color: 'white', padding: '10px 24px', borderRadius: '9999px', fontWeight: 600 }}>
// //                     + Thêm vào tin
// //                   </button>
// //                   <button className="btn btn-secondary" style={{ padding: '10px 24px', borderRadius: '9999px' }}>
// //                     ✏️ Chỉnh sửa trang cá nhân
// //                   </button>
// //                 </>
// //               ) : (
// //                 <button className="btn btn-primary" style={{ padding: '10px 28px', borderRadius: '9999px' }}>
// //                   Kết bạn
// //                 </button>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Tabs */}
// //         <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem', padding: '0 1rem' }}>
// //           <div style={{ padding: '14px 0', borderBottom: '3px solid #8b5cf6', color: '#8b5cf6', fontWeight: 600, cursor: 'pointer' }}>
// //             Bài viết
// //           </div>
// //           <div style={{ padding: '14px 0', color: '#64748b', cursor: 'pointer' }}>Giới thiệu</div>
// //           <div style={{ padding: '14px 0', color: '#64748b', cursor: 'pointer' }}>Bạn bè</div>
// //           <div style={{ padding: '14px 0', color: '#64748b', cursor: 'pointer' }}>Ảnh</div>
// //           <div style={{ padding: '14px 0', color: '#64748b', cursor: 'pointer' }}>Video</div>
// //         </div>

// //         <div className="profile-grid">
// //           {/* CỘT TRÁI */}
// //           <aside className="profile-sidebar">
// //             {/* Giới thiệu */}
// //             <div className="card" style={{ marginBottom: '1.5rem' }}>
// //               <h3 style={{ marginBottom: '1rem' }}>Giới thiệu</h3>
// //               <p style={{ lineHeight: '1.6', color: '#475569' }}>{bio}</p>
// //               <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
// //                 <div>🏠 Sống tại Thành phố Hồ Chí Minh</div>
// //                 <div>🎓 Học tại Đại học Bách Khoa</div>
// //                 <div>💼 Product Designer</div>
// //               </div>
// //             </div>

// //             {/* Ảnh */}
// //             <div className="card">
// //               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
// //                 <h3>Ảnh</h3>
// //                 <span style={{ color: '#8b5cf6', fontWeight: 600, cursor: 'pointer' }}>Xem tất cả ảnh</span>
// //               </div>
// //               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
// //                 {[...Array(6)].map((_, i) => (
// //                   <img
// //                     key={i}
// //                     src={`https://picsum.photos/id/${100 + i}/300/300`}
// //                     alt="photo"
// //                     style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '12px' }}
// //                   />
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Bạn bè */}
// //             <div className="card" style={{ marginTop: '1.5rem' }}>
// //               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
// //                 <h3>Bạn bè • 1.234</h3>
// //                 <span style={{ color: '#8b5cf6', fontWeight: 600, cursor: 'pointer' }}>Xem tất cả</span>
// //               </div>
// //               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
// //                 {[...Array(6)].map((_, i) => (
// //                   <div key={i} style={{ textAlign: 'center' }}>
// //                     <div style={{ width: '64px', height: '64px', background: '#e0e7ff', borderRadius: '50%', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
// //                       👤
// //                     </div>
// //                     <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>Bạn {i + 1}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </aside>

// //           {/* CỘT PHẢI - Bài viết */}
// //           <main className="profile-content">
            
// //             {/* TẠO BÀI VIẾT (Chỉ hiện khi đang xem trang cá nhân của chính mình) */}
// //             {isMe && (
// //               <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
// //                 <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
// //                   <div className="avatar-placeholder" style={{ width: '42px', height: '42px', fontSize: '1.4rem', flexShrink: 0 }}>
// //                     {getInitials(name)}
// //                   </div>
// //                   <div style={{ flex: 1 }}>
// //                     <textarea
// //                       value={postContent}
// //                       onChange={(e) => setPostContent(e.target.value)}
// //                       placeholder={`${name} ơi, bạn đang nghĩ gì?`}
// //                       rows="3"
// //                       style={{
// //                         width: '100%',
// //                         padding: '14px 20px',
// //                         borderRadius: '16px',
// //                         border: '1px solid #e2e8f0',
// //                         background: '#f8fafc',
// //                         fontSize: '1.05rem',
// //                         resize: 'none',
// //                         outline: 'none',
// //                         fontFamily: 'inherit'
// //                       }}
// //                     />
                    
// //                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
// //                       {/* Dropdown Quyền riêng tư */}
// //                       <select 
// //                         value={visibility}
// //                         onChange={(e) => setVisibility(e.target.value)}
// //                         style={{
// //                           padding: '8px 12px',
// //                           borderRadius: '8px',
// //                           border: '1px solid #e2e8f0',
// //                           background: '#f8fafc',
// //                           outline: 'none',
// //                           color: '#475569',
// //                           fontWeight: '500',
// //                           cursor: 'pointer'
// //                         }}
// //                       >
// //                         <option value={0}>🌍 Công khai</option>
// //                         <option value={1}>👥 Bạn bè</option>
// //                         <option value={2}>🔒 Chỉ mình tôi</option>
// //                       </select>

// //                       {/* Nút Đăng bài */}
// //                       <button 
// //                         onClick={handleCreatePost}
// //                         disabled={isPosting || !postContent.trim()}
// //                         style={{
// //                           background: (isPosting || !postContent.trim()) ? '#cbd5e1' : '#8b5cf6',
// //                           color: 'white',
// //                           padding: '10px 24px',
// //                           borderRadius: '9999px',
// //                           fontWeight: 600,
// //                           border: 'none',
// //                           cursor: (isPosting || !postContent.trim()) ? 'not-allowed' : 'pointer',
// //                           transition: 'background 0.2s'
// //                         }}
// //                       >
// //                         {isPosting ? 'Đang đăng...' : 'Đăng bài'}
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Bài viết mẫu 1 */}
// //             <div className="card" style={{ marginBottom: '1.5rem' }}>
// //               <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
// //                 <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
// //                   <div className="avatar-placeholder" style={{ width: '40px', height: '40px' }}>{getInitials(name)}</div>
// //                   <div>
// //                     <strong>{name}</strong>
// //                     <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Hôm qua • 🌍 Công khai</p>
// //                   </div>
// //                 </div>
// //               </div>
// //               <div style={{ padding: '1.25rem' }}>
// //                 <p>Cuối tuần thư giãn cùng gia đình ngoại ô. Thật tuyệt vời khi được hòa mình vào thiên nhiên! 🌳✨</p>
// //                 <img
// //                   src="https://picsum.photos/id/1015/800/500"
// //                   alt="post"
// //                   style={{ width: '100%', borderRadius: '16px', marginTop: '1rem' }}
// //                 />
// //               </div>
// //               <div style={{ padding: '0 1.25rem 1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#64748b' }}>
// //                 <div>❤️ 128</div>
// //                 <div>24 bình luận • 5 chia sẻ</div>
// //               </div>
// //             </div>

// //             {/* Bài viết mẫu 2 */}
// //             <div className="card">
// //               <div style={{ padding: '1.25rem' }}>
// //                 <p>Mới hoàn thành khóa học UI/UX Design nâng cao. Sẵn sàng cho những dự án mới đầy thử thách! 🚀</p>
// //               </div>
// //             </div>
// //           </main>
// //         </div>
// //       </div>
// //     </Layout>
// //   );
// // };

// // export default ProfilePage;

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

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { AccountApi, RelationshipApi, RelationshipStatus, Auth } from '../lib/api';
import { getInitials, showToast } from '../lib/ui';
import '../styles/Profile.css';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');
  const myId = String(Auth.getUserId());
  const isMe = !targetId || targetId === myId;
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relStatus, setRelStatus] = useState(RelationshipStatus.NONE);
  const [relLoading, setRelLoading] = useState(false);
  const [friendCount, setFriendCount] = useState(null);

  // ── Fetch profile + relationship ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await AccountApi.getProfile(isMe ? null : targetId);
        const p = res?.result ?? res;
        setProfile(p);

        // Friend count (own profile)
        if (isMe) {
          const fr = await RelationshipApi.getFriends();
          setFriendCount((fr?.result || []).length);
        } else {
          // Try backend field first, fallback null
          setFriendCount(p?.friendCount ?? null);
          // Relationship status via getStatus endpoint
          try {
            const sr = await RelationshipApi.getStatus(targetId);
            setRelStatus(sr?.result ?? RelationshipStatus.NONE);
          } catch {
            setRelStatus(RelationshipStatus.NONE);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [targetId, isMe]);

  // ── Relationship actions ──────────────────────────────────────────
  const handleSendRequest = async () => {
    setRelLoading(true);
    try {
      await RelationshipApi.sendFriendRequest(targetId);
      setRelStatus(RelationshipStatus.PENDING_SENT);
      showToast('Đã gửi lời mời kết bạn', 'success');
    } catch (err) { showToast(err.message, 'error'); }
    finally { setRelLoading(false); }
  };

  const handleAccept = async () => {
    setRelLoading(true);
    try {
      await RelationshipApi.acceptRequest(targetId);
      setRelStatus(RelationshipStatus.FRIENDS);
      setFriendCount((c) => c !== null ? c + 1 : null);
      showToast('Đã kết bạn!', 'success');
    } catch (err) { showToast(err.message, 'error'); }
    finally { setRelLoading(false); }
  };

  const handleUnfriend = async () => {
    if (!window.confirm('Hủy kết bạn?')) return;
    setRelLoading(true);
    try {
      await RelationshipApi.unfriend(targetId);
      setRelStatus(RelationshipStatus.NONE);
      setFriendCount((c) => c !== null ? c - 1 : null);
      showToast('Đã hủy kết bạn', 'success');
    } catch (err) { showToast(err.message, 'error'); }
    finally { setRelLoading(false); }
  };

  // ── Relationship button ───────────────────────────────────────────
  const RelBtn = () => {
    if (isMe) return <button className="btn btn-secondary">Chỉnh sửa hồ sơ</button>;
    switch (relStatus) {
      case RelationshipStatus.FRIENDS:
        return <button className="btn btn-ghost" onClick={handleUnfriend} disabled={relLoading}>✓ Bạn bè</button>;
      case RelationshipStatus.PENDING_SENT:
        return <button className="btn btn-ghost" disabled>Đã gửi lời mời</button>;
      case RelationshipStatus.PENDING_RECEIVED:
        return <button className="btn btn-success" onClick={handleAccept} disabled={relLoading}>Chấp nhận lời mời</button>;
      default:
        return <button className="btn btn-primary" onClick={handleSendRequest} disabled={relLoading}>+ Kết bạn</button>;
    }
  };

  // ── Loading ───────────────────────────────────────────────────────
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
                    <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle' }}>group</span>
                    {' '}{friendCount.toLocaleString('vi-VN')} bạn bè
                  </p>
                )}
              </div>
            </div>
            <div className="p-actions">
              <RelBtn />
              {!isMe && (
                <button className="btn btn-secondary">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat</span>
                  Nhắn tin
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Content grid ── */}
        <div className="p-grid">
          <aside className="p-sidebar">
            <div className="card">
              <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>Giới thiệu</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {profile?.bio || 'Chưa có thông tin'}
              </p>
            </div>
          </aside>

          <main className="p-main">
            {isMe && (
              <div className="card p-post-input">
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div className="avatar">{getInitials(profile?.fullName || 'U')}</div>
                  <input
                    type="text"
                    placeholder="Bạn đang nghĩ gì?"
                    onClick={() => navigate('/')}
                    readOnly
                    style={{ cursor: 'pointer', background: 'var(--surface-2)', border: 'none', borderRadius: 'var(--r-full)', padding: '10px 18px', flex: 1, fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            )}

            <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-tertiary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 44, marginBottom: 12, display: 'block' }}>article</span>
              <p style={{ fontSize: '0.9rem' }}>Chưa có bài viết nào</p>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
