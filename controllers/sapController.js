import { fetchSapSessionAndToken } from '../utils/sapClient.js';

export const getSapSessionAndToken = async (req, res) => {
  try {
    const result = await fetchSapSessionAndToken();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
