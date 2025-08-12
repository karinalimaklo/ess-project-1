import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const MUSICS_API_URL = `${BASE_URL}/musics`;

export const deleteMusicById = async (musicId) => {
  const res = await axios.delete(`${MUSICS_API_URL}/${musicId}`);
  return res.data;
};