const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверка существования пользователя
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    // Создание нового пользователя
    user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверные учетные данные' });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 