import { AccountApi, Auth } from "../js/api.js";

document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const user = await AccountApi.getProfile();
        document.getElementById('profile-name').textContent = user.fullName || user.username;
        document.getElementById('profile-bio').textContent = user.bio || "Chưa có tiểu sử.";
        document.getElementById('avatar-img').src = user.avatarUrl || "../assets/default-avatar.png";
    } catch (error) {
        console.error("Lỗi load profile:", error);
    }
});