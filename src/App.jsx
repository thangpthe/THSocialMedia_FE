// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Profile from './pages/Profile';
// import Friends from './pages/Friends';
// import { Auth } from './lib/api';
// import Home from './pages/Home';

// function ProtectedRoute({ children }) {
//   return Auth.isLoggedIn() ? children : <Navigate to="/login" replace />;
// }

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/profile" element={
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         } />
//         <Route
//           path="/friends"
//           element={
//             <ProtectedRoute>
//               <Friends />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//       </Routes>
//     </Router>
//   );
// }
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './lib/api';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Friends from './pages/Friends';

// Import global styles once here
import './styles/globals.css';

function ProtectedRoute({ children }) {
  return Auth.isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
