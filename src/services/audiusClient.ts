import axios from 'axios';

let audiusHost: string | null = null;
const APP_NAME = 'spotify_clone_modern';

export const getAudiusHost = async () => {
  if (audiusHost) return audiusHost;
  try {
    const { data } = await axios.get('https://api.audius.co');
    audiusHost = data.data[0];
    return audiusHost;
  } catch (error) {
    console.error('Failed to fetch Audius host', error);
    // Fallback host just in case
    return 'https://discoveryprovider.audius.co';
  }
};

export const fetchTrendingTracks = async (limit = 20) => {
  const host = await getAudiusHost();
  try {
    const { data } = await axios.get(`${host}/v1/tracks/trending`, {
      params: { app_name: APP_NAME, limit }
    });
    return data.data;
  } catch (error) {
    console.error('Failed to fetch trending tracks', error);
    return [];
  }
};

export const searchTracks = async (query: string, limit = 20) => {
  const host = await getAudiusHost();
  try {
    const { data } = await axios.get(`${host}/v1/tracks/search`, {
      params: { app_name: APP_NAME, query, limit }
    });
    return data.data;
  } catch (error) {
    console.error('Failed to search tracks', error);
    return [];
  }
};
