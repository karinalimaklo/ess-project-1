import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const REPORTS_API_URL = `${BASE_URL}/reports`;

export const createReport = async (reviewId, motivo, reporterId) => {
  const response = await axios.post(REPORTS_API_URL, { reviewId, motivo, reporterId });
  return response.data;
};

export const getReportsForReview = async (reviewId) => {
  const response = await axios.get(`${REPORTS_API_URL}/review/${reviewId}`);
  return response.data;
};
