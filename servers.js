const express = require('express');
const router = express.Router();
const Server = require('../models/Server');
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

// Получение всех серверов пользователя
router.get('/my-servers', auth, async (req, res) => {
  try {
    const servers = await Server.find({ owner: req.user._id });
    res.json(servers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создание нового сервера
router.post('/create', auth, async (req, res) => {
  try {
    const { name, game, plan, slots } = req.body;

    // Расчет цены в зависимости от игры и плана
    const prices = {
      CS2: {
        basic: 500,
        premium: 1000,
        pro: 2000
      },
      Rust: {
        basic: 1000,
        premium: 2000,
        pro: 4000
      },
      SAMP: {
        basic: 300,
        premium: 600,
        pro: 1200
      }
    };

    const price = prices[game][plan] * slots;

    // Проверка баланса
    if (req.user.balance < price) {
      return res.status(400).json({ message: 'Недостаточно средств на балансе' });
    }

    // Создание сервера
    const server = new Server({
      name,
      game,
      owner: req.user._id,
      plan,
      price,
      slots,
      ip: '192.168.1.1', // Здесь должна быть логика генерации IP
      port: Math.floor(Math.random() * (65535 - 1024) + 1024),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней
    });

    // Списание средств
    req.user.balance -= price;
    await req.user.save();
    await server.save();

    res.status(201).json(server);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Продление сервера
router.post('/:id/renew', auth, async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    if (!server || server.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Сервер не найден' });
    }

    // Проверка баланса
    if (req.user.balance < server.price) {
      return res.status(400).json({ message: 'Недостаточно средств на балансе' });
    }

    // Списание средств и продление
    req.user.balance -= server.price;
    server.expiresAt = new Date(server.expiresAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    await req.user.save();
    await server.save();

    res.json(server);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 