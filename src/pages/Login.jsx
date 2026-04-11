import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountApi, Auth } from '../lib/api';
import { validateEmail, validatePassword, showToast } from '../lib/ui';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import "../styles/Login.css";

export default function Login() {
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();

  if (Auth.isLoggedIn()) {
    navigate('/profile');
    return null;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-logo">📱</div>
            <h1>TH Social</h1>
          </div>
          <p className="brand-tagline">
            Kết nối, chia sẻ và khám phá những khoảnh khắc tuyệt vời cùng cộng đồng
          </p>
        </div>

        <div className="login-right">
          {mode === 'login' ? (
            <LoginForm onSwitchMode={() => setMode('register')} />
          ) : (
            <RegisterForm onSwitchMode={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
