import axios from 'axios';

const API_BASE = 'https://saavn.sumit.co/api';

export const fetchTrendingTracks = async (query: string, limit = 20) => {
  try {
    const { data } = await axios.get(`${API_BASE}/search/songs`, {
      params: { query, limit }
    });
    return data.data.results || [];
  } catch (error) {
    console.error('Failed to fetch from JioSaavn API', error);
    return [];
  }
};

export const searchTracks = async (query: string, limit = 50) => {
  try {
    const { data } = await axios.get(`${API_BASE}/search/songs`, {
      params: { query, limit }
    });
    return data.data.results || [];
  } catch (error) {
    console.error('Failed to search tracks', error);
    return [];
  }
};

