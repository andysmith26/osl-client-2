import api from './config. js';

export const getGames = async () => {
  const response = await api.get('/api/games');
  return response.data;
};

export const getGameById = async (id) => {
  const response = await api.get(`/api/games/${id}`);
  return response.data;
};

export const createGame = async (gameData) => {
  const response = await api.post('/api/games', gameData);
  return response.data;
};
