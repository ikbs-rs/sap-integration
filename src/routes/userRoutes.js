import express from 'express';
import { loginUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('User endpoint radi!');
});
  

router.post('/login', loginUser);

export default router;
