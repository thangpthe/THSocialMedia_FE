# TH Social Media - Web UI

Modern, responsive React-based social media interface built with Vite.

## 🚀 Features

- ✅ Modern & clean UI with gradient designs
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ User authentication (Login/Register)
- ✅ Friend management
- ✅ User profile pages
- ✅ Real-time notifications with Toast
- ✅ Smooth animations & transitions
- ✅ Dark-friendly color palette

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn

## 🔧 Installation & Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API endpoint

Edit `src/lib/api.js` and update `API_BASE`:

```javascript
const API_BASE = 'http://localhost:5265/api'; // Change if your API is at a different address
```

### 3. Run development server

```bash
npm run dev
```

This will start the development server at `http://localhost:3000` and automatically open it in your browser.

### 4. Build for production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── assets/               # Images, icons, etc.
├── components/           # Reusable components
│   ├── Layout.jsx       # Main layout wrapper with sidebar
│   ├── LoginForm.jsx    # Login form component
│   ├── RegisterForm.jsx # Register form component
│   └── Toast.jsx        # Notification system
├── lib/
│   ├── api.js           # API service layer
│   └── ui.js            # UI utilities
├── pages/               # Page components
│   ├── Login.jsx        # Login page
│   ├── Profile.jsx      # User profile page
│   └── Friends.jsx      # Friends management page
├── styles/
│   └── globals.css      # Global styles
├── App.jsx              # Main app component with routing
└── main.jsx            # Entry point
```

## 🎨 Design System

The project uses a modern Purple/Violet color palette with:
- **Primary Color**: #8B5CF6 (Violet)
- **Success**: #10B981 (Green)
- **Danger**: #EF4444 (Red)
- **Warning**: #F59E0B (Amber)

## 🔐 Authentication

The app uses JWT tokens stored in localStorage:
- Login/Register: `AccountApi.login()`, `AccountApi.register()`
- Token management: `Auth.setToken()`, `Auth.getToken()`, `Auth.isLoggedIn()`
- Logout: `AccountApi.logout()`

## 📡 API Integration

All API calls are handled through `src/lib/api.js`:

```javascript
// Example: Login
const response = await AccountApi.login({ username, password });

// Example: Get friends
const friends = await RelationshipApi.getFriends();

// Example: Send friend request
await RelationshipApi.sendFriendRequest(userId);
```

## 🌐 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 📦 Dependencies

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **vite** - Build tool and dev server

## 🚀 Deployment

### Vercel / Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### Self-hosted

```bash
npm run build
# Copy dist/ folder to your web server
```

## 🐛 Troubleshooting

**API calls fail with CORS error:**
- Ensure your backend API is running and CORS is properly configured
- Check `API_BASE` URL in `src/lib/api.js`

**Styles not loading:**
- Make sure `src/styles/globals.css` is imported in `src/main.jsx`
- Clear browser cache and restart dev server

**Authentication not persisting:**
- Check browser's localStorage is not disabled
- Verify JWT token is properly saved after login

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)

## 📄 License

Copyright © 2026 TH Social Media. All rights reserved.
