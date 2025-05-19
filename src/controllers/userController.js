import jwt from 'jsonwebtoken';

export const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    // Provera korisničkih podataka (uvek true za sada)
    const token = jwt.sign({ username, password }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ username, password }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.json({ token, refreshToken });
  } else {
    res.status(400).json({ message: 'Nedostaju korisnički podaci' });
  }
};
