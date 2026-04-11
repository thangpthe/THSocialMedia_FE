/**
 * UI Utilities for React
 */

export function showToast(msg, type = 'success') {
  const event = new CustomEvent('showToast', { detail: { msg, type } });
  window.dispatchEvent(event);
}

export function getInitials(name = '') {
  return (name || '?')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();
}

export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

// Password validation: ≥8 chars, ≥1 uppercase, ≥1 lowercase, ≥1 number
export function validatePassword(pw) {
  if (!pw || pw.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
  if (!/[A-Z]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 chữ hoa';
  if (!/[a-z]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 chữ thường';
  if (!/[0-9]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 chữ số';
  return null;
}

// Email validation
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
