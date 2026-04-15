import { request, authRequest, Auth } from './baseApi';

export const AccountApi = {
  register: ({ username, email, fullName }) =>
    request('POST', '/User', { username, email, fullName }),

  getProfile: (id) =>
    authRequest('GET', `/User/${id ?? Auth.getUserId()}`),

  updateProfile: (payload) =>
    authRequest('PUT', `/User/${Auth.getUserId()}`, payload),

  getAll: () =>
    authRequest('GET', '/User'),
};