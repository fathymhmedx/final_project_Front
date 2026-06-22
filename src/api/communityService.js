import axiosInstance from './axios';

// ==========================================
// POSTS API
// ==========================================

export const getPosts = async (params = {}) => {
  const { data } = await axiosInstance.get('/community/posts', { params });
  return data;
};

export const getMyPosts = async (params = {}) => {
  const { data } = await axiosInstance.get('/community/posts/my/posts', { params });
  return data;
};

export const getMyBookmarks = async () => {
  const { data } = await axiosInstance.get('/community/posts/my/bookmarks');
  return data;
};

export const getTrendingHashtags = async () => {
  const { data } = await axiosInstance.get('/community/posts/trending/hashtags');
  return data;
};

export const getTrendingPosts = async () => {
  const { data } = await axiosInstance.get('/community/posts/trending/posts');
  return data;
};

export const getUserPosts = async (userId, params = {}) => {
  const { data } = await axiosInstance.get(`/community/posts/user/${userId}`, { params });
  return data;
};

export const getPost = async (id) => {
  const { data } = await axiosInstance.get(`/community/posts/${id}`);
  return data;
};

export const createPost = async (formData) => {
  // Uses multipart/form-data because it handles images
  const { data } = await axiosInstance.post('/community/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updatePost = async (id, postData) => {
  const { data } = await axiosInstance.patch(`/community/posts/${id}`, postData);
  return data;
};

export const deletePost = async (id) => {
  const { data } = await axiosInstance.delete(`/community/posts/${id}`);
  return data;
};

export const toggleLikePost = async (id) => {
  const { data } = await axiosInstance.post(`/community/posts/${id}/like`);
  return data;
};

export const toggleBookmarkPost = async (id) => {
  const response = await axiosInstance.post(`/community/posts/${id}/bookmark`);
  return response.data; // { status, message, data: { isBookmarked } }
};

// ==========================================
// COMMENTS API
// ==========================================

export const getPostComments = async (postId, params = {}) => {
  const { data } = await axiosInstance.get(`/community/posts/${postId}/comments`, { params });
  return data;
};

export const addComment = async (postId, content) => {
  const { data } = await axiosInstance.post(`/community/posts/${postId}/comments`, { content });
  return data;
};

export const getCommentReplies = async (commentId, params = {}) => {
  const { data } = await axiosInstance.get(`/community/comments/${commentId}/replies`, { params });
  return data;
};

export const replyToComment = async (commentId, content) => {
  const { data } = await axiosInstance.post(`/community/comments/${commentId}/reply`, { content });
  return data;
};

export const updateComment = async (commentId, content) => {
  const { data } = await axiosInstance.patch(`/community/comments/${commentId}`, { content });
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await axiosInstance.delete(`/community/comments/${commentId}`);
  return data;
};

export const toggleLikeComment = async (commentId) => {
  const { data } = await axiosInstance.post(`/community/comments/${commentId}/like`);
  return data;
};
