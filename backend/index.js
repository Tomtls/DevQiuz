import express, { json } from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import jsquiz from './routes/jsquizRoutes.js';
import helloWorldRoutes from './routes/helloWorldRoutes.js';

const app = express();
app.use(cors());
app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/jsquiz', jsquiz);
app.use('/api/helloworld', helloWorldRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server läuft auf http://localhost:${process.env.PORT}`);
});

