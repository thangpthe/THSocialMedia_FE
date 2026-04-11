import { AccountApi, Auth } from '../js/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('btn-login');
    const inputUser = document.getElementById('input-username');
    const inputPass = document.getElementById('input-password');
    const alertBox = document.getElementById('alert-box');

    btnLogin.addEventListener('click', async () => {
        const username = inputUser.value.trim();
        const password = inputPass.value;

        if (!username || !password) {
            alertBox.textContent = "Vui lòng nhập đầy đủ thông tin.";
            alertBox.style.display = "block";
            return;
        }

        try {
            const res = await AccountApi.login({ username, password });
            Auth.setToken(res.token);
            Auth.setUserId(res.userId);
            window.location.href = 'profile.html';
        } catch (error) {
            alertBox.textContent = error.message || "Đăng nhập thất bại.";
            alertBox.style.display = "block";
        }
    });
});