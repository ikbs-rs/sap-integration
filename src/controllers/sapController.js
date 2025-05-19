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
      res.json({ csrfToken, sessionCookie });

      // console.log(csrfToken, "333333333333333333333333333333333333333333333333", sessionCookie) 
      // const updatedToken = jwt.sign(
      //   { username, password, csrfToken, sessionCookie },
      //   process.env.JWT_SECRET,
      //   { expiresIn: '1h' }
      // );
      // console.log(csrfToken, "4444444444444444444444444444444444444444444444444444", sessionCookie) 
      // res.json({  csrfToken, sessionCookie, updatedToken });
    } else {
      // Token već ima CSRF i cookie — koristi ih
      res.json({ csrfToken, sessionCookie });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
