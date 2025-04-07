const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware для проверки аутентификации
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Не авторизован' });
  }
};

// Пополнение баланса
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    // Здесь должна быть интеграция с платежной системой
    // Для примера просто добавляем сумму на баланс
    req.user.balance += amount;
    await req.user.save();

    res.json({
      message: 'Баланс успешно пополнен',
      newBalance: req.user.balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение истории платежей
router.get('/history', auth, async (req, res) => {
  try {
    // Здесь должна быть логика получения истории платежей
    // Для примера возвращаем пустой массив
    res.json([]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 