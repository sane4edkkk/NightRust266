const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/game-hosting', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Подключено к MongoDB'))
.catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/servers', require('./routes/servers'));
app.use('/api/payments', require('./routes/payments'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 