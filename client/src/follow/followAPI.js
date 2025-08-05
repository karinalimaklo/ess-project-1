import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const FOLLOWS_API_URL = `${BASE_URL}/follows`;
const USERS_API_URL = `${BASE_URL}/users`;

export const getUserProfile = async (userId) => {
  const res = await axios.get(`${USERS_API_URL}/${userId}`);
  return res.data;
};

export const getFollowers = async (userId) => {
  const res = await axios.get(`${FOLLOWS_API_URL}/followers/${userId}`);
  return res.data;
};

export const getFollowing = async (userId) => {
  const res = await axios.get(`${FOLLOWS_API_URL}/following/${userId}`);
  return res.data;
};

export const createFollow = async (followerId, followingId) => {
  const res = await axios.post(FOLLOWS_API_URL, { followerId, followingId });
  return res.data;
};

export const deleteFollow = async (followerId, followingId) => {
  const res = await axios.delete(FOLLOWS_API_URL, { data: { followerId, followingId } });
  return res.data;
};