import { fetchSapSessionAndToken } from '../utils/sapClient.js';

export const getSapSessionAndToken = async (req, res) => {
  try {

    let { username, password, csrfToken, sessionCookie } = req.user;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Korisnički podaci nisu pronađeni u tokenu' });
    }

    if (!csrfToken || !sessionCookie) {
      const sapData = await fetchSapSessionAndToken(username, password);
      csrfToken = sapData.csrfToken;
      sessionCookie = sapData.sessionCookie;

      // Re-generiši JWT sa dodatim SAP tokenima
      const updatedToken = jwt.sign(
        { username, password, csrfToken, sessionCookie },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Vrati novi token klijentu
      res.json({ updatedToken, csrfToken });
    } else {
      // Token već ima CSRF i cookie — koristi ih
      res.json({ csrfToken, sessionCookie });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
