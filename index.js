import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import sapRoutes from './routes/sapRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = ['http://ems.local', 'http://ems.rs'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('CORS nije dozvoljen'));
  },
  credentials: true
}));

app.use(express.json());

app.use('/user', userRoutes);
app.use('/sap', sapRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server pokrenut na portu ${PORT}`));
