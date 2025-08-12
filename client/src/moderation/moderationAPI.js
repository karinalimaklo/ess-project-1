import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const MODERATION_API_URL = `${BASE_URL}/moderation`;
const REPORTS_API_URL = `${BASE_URL}/reports`;

export const getReportedUsers = async () => {
  const res = await axios.get(`${MODERATION_API_URL}/reported-users`);
  return res.data;
};

export const getIndividualReportsByUserId = async (userId) => {
  const res = await axios.get(`${REPORTS_API_URL}/individual/${userId}`);
  return res.data;
};

export const sendWarning = async (userId, mensagem) => {
  const res = await axios.post(`${MODERATION_API_URL}/users/${userId}/warn`, { mensagem });
  return res.data;
};

export const suspendUser = async (userId, dias, justificativa) => {
  const res = await axios.post(`${MODERATION_API_URL}/users/${userId}/suspend`, { dias, justificativa });
  return res.data;
};

export const deleteUser = async (userId, justificativa) => {
  const res = await axios.delete(`${MODERATION_API_URL}/users/${userId}`, { data: { justificativa } });
  return res.data;
};

export const resolveCase = async (userId) => {
  const res = await axios.patch(`${MODERATION_API_URL}/users/${userId}/resolve`);
  return res.data;
};

export const getGroupedReportsByUserId = async (userId) => {
  const res = await axios.get(`${REPORTS_API_URL}/grouped/${userId}`); 
  return res.data;
};