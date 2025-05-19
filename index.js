import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes.js';
import sapRoutes from './src/routes/sapRoutes.js';

dotenv.config();

const app = express();
// app.use('/', (req, res, next) => {
//   console.log('Radi server!');
//   next()
// });
const allowedOrigins = ['http://ems.local', 'http://ems.rs', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (origin && !allowedOrigins.includes(origin)) {
      console.warn(`⚠️ Nepoznat origin: ${origin}`);
    }
    callback(null, true); // ipak pusti sve
  },
  credentials: true
}));

app.use(express.json());

app.use('/user', userRoutes);
app.use('/sap', sapRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server pokrenut na portu ${PORT}`));
