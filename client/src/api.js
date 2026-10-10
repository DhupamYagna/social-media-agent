import axios from 'axios';

const BASE = 'http://localhost:3001/api';

export const api = {
  health: () => axios.get(`${BASE}/health`),
  getTrends: (platform) => axios.get(`${BASE}/trends`, { params: { platform } }),
  getAllTrends: () => axios.get(`${BASE}/trends/all`),
  getSentiment: (platform) => axios.get(`${BASE}/sentiment`, { params: { platform } }),
  getAllSentiment: () => axios.get(`${BASE}/sentiment/all`),
  getCompetitors: (names) => axios.get(`${BASE}/competitors`, { params: { names } }),
  generateContent: (profile, topic, platform) =>
    axios.post(`${BASE}/content/generate`, { profile, topic, platform }),
  agentQuery: (query, profile) =>
    axios.post(`${BASE}/agent/query`, { query, profile }),
};
