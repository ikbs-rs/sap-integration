import express from 'express';
import { getSapSessionAndToken } from '../controllers/sapController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { callSapService } from '../utils/sapTokenClient.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('SAP endpoint radi!');
});

router.post('/call-sap', async (req, res) => {
    const jwtUser = req.body.jwtUser;
    const username = req.body.sapUsername;
    const password = req.body.sapPassword;
  
    try {
      const data = await callSapService(jwtUser, username, password);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: 'SAP error', details: e.message });
    }
  });

router.get('/zhr2001', verifyToken, getSapSessionAndToken);

export default router;
