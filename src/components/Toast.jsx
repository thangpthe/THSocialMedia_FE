import React, { useEffect, useState } from 'react';
import "../styles/Toast.css";

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShowToast = (event) => {
      const { msg, type = 'success' } = event.detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, msg, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      ))}
    </div>
  );
}
