import { authRequest, Auth } from './baseApi';

export const RelationshipApi = {
  sendFriendRequest: (targetUserId) =>
    authRequest('POST', '/User/AddFriend', {
      receiverId: targetUserId,
      targetUserId: targetUserId,
    }),

  acceptRequest: (relationshipId) =>
    authRequest('PUT', '/User/AddFriend', {
      id: relationshipId,
      status: 1,
    }),

  rejectRequest: (relationshipId) =>
    authRequest('PUT', '/User/AddFriend', {
      id: relationshipId,
      status: 2,
    }),

  getFriends: async () => {
    const res = await authRequest(
      'GET',
      `/User/AddFriend?userId=${Auth.getUserId()}`
    );

    const all = Array.isArray(res)
      ? res
      : res?.value || res?.result || [];

    return { result: all.filter((r) => r.status === 1) };
  },

  getPendingRequests: async () => {
    const res = await authRequest(
      'GET',
      `/User/AddFriend?userId=${Auth.getUserId()}`
    );

    const all = Array.isArray(res)
      ? res
      : res?.value || res?.result || [];

    return { result: all.filter((r) => r.status === 0) };
  },

  searchUsers: async (query) => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return { result: [] };

    const res = await authRequest('GET', '/User');
    const all = Array.isArray(res)
      ? res
      : res?.value || res?.result || [];

    const myId = String(Auth.getUserId()).toLowerCase();

    const filtered = all.filter((u) => {
      const uId = String(u.id).toLowerCase();
      if (uId === myId) return false;

      const uname = String(u.username || u.userName || '').toLowerCase();
      return uname.includes(q);
    });

    return { result: filtered };
  },
};