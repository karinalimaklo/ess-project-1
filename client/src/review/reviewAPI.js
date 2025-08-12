import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const REVIEWS_API_URL = `${BASE_URL}/reviews`;

export const getReviewById = async (reviewId) => {
  const res = await axios.get(`${REVIEWS_API_URL}/${reviewId}`);
  return res.data;
};

export const getReviewsByUser = async (userId) => {
  const res = await axios.get(`${REVIEWS_API_URL}/user/${userId}`);
  return res.data;
}

export const toggleReviewVisibility = async (reviewId) => {
  const res = await axios.patch(`${REVIEWS_API_URL}/${reviewId}/toggle-visibility`);
  return res.data.review;
}
