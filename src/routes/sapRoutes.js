import express from 'express';
import { getSapSessionAndToken } from '../controllers/sapController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { callSapService } from '../utils/sapTokenClient.js';

const router = express.Router();

router.use('/', (req, res, next) => {
    console.log('SAP endpoint radi!', req.url);
    next()
});

router.post('/call-sap', verifyToken, async (req, res) => {
    const jwtUser = req.user.username;
    const username = req.user.username;
    const password = req.user.password;
    console.log('SAP call-sap radi!', req.user);
    try {
      const data = await callSapService(jwtUser, username, password);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: 'SAP error', details: e.message });
    }
  });

router.get('/zhr2001', verifyToken, getSapSessionAndToken);

export default router;
