const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const highscoreRoutes = require('./routes/highscoreRoutes');
const jsquiz = require('./routes/jsquizRoutes')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/highscore', highscoreRoutes);
app.use('/api/jsquiz', jsquiz);

app.listen(process.env.PORT, () => {
  console.log(`Server läuft auf http://localhost:${process.env.PORT}`);
});

