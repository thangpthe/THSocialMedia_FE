import { authRequest } from './baseApi';

export const PostApi = {
  createPost: (payload) => {
    const body = {
      content: payload.content,
      visibility: payload.visibility,
    };

    if (payload.fileUrls && payload.fileUrls.length > 0) {
    body.fileUrl = payload.fileUrls.join(','); 
  }

    return authRequest('POST', '/Post', body);
  },

  getPosts: () =>
    authRequest('GET', '/Post'),

  getPost: (id) =>
    authRequest('GET', `/Post/${id}`),

  updatePost: (id, payload) =>
    authRequest('PUT', `/Post/${id}`, {
      ...payload,
      id,
    }),

  deletePost: (id) =>
    authRequest('DELETE', `/Post/${id}`),

  commentPost: (id, payload) =>
    authRequest('POST', `/Post/${id}/comment`, payload),

  reactPost: (id, reactionId) =>
    authRequest('POST', `/Post/${id}/react`, { reactionId }),
};