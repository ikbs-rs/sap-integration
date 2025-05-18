import { fetchSapSessionAndToken } from '../utils/sapClient.js';

export const getSapSessionAndToken = async (req, res) => {
  try {

    const { username, password } = req.user;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Korisnički podaci nisu pronađeni u tokenu' });
    }

    const result = await fetchSapSessionAndToken(username, password);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
