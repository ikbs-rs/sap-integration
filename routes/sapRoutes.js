import express from 'express';
import { getSapSessionAndToken } from '../controllers/sapController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('SAP endpoint radi!');
});

router.get('/zhr2001', verifyToken, getSapSessionAndToken);

export default router;
