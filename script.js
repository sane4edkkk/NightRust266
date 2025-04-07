document.addEventListener('DOMContentLoaded', () => {
    // Обработчики кнопок авторизации
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    loginBtn.addEventListener('click', () => {
        showAuthModal('login');
    });

    registerBtn.addEventListener('click', () => {
        showAuthModal('register');
    });

    // Обработчики кнопок заказа сервера
    const orderButtons = document.querySelectorAll('.game-card button');
    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const gameCard = e.target.closest('.game-card');
            const gameName = gameCard.querySelector('h3').textContent;
            showOrderModal(gameName);
        });
    });
});

// Функция показа модального окна авторизации
function showAuthModal(type) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${type === 'login' ? 'Вход' : 'Регистрация'}</h2>
            <form id="authForm">
                ${type === 'register' ? '<input type="text" placeholder="Имя пользователя" required>' : ''}
                <input type="email" placeholder="Email" required>
                <input type="password" placeholder="Пароль" required>
                <button type="submit" class="btn btn-primary">
                    ${type === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Обработчик закрытия модального окна
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Обработчик отправки формы
    const form = modal.querySelector('#authForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/api/auth/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('token', result.token);
                updateHeader(result.user);
                modal.remove();
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке запроса');
        }
    });
}

// Функция показа модального окна заказа
function showOrderModal(gameName) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Заказ сервера ${gameName}</h2>
            <form id="orderForm">
                <div class="form-group">
                    <label>Тариф</label>
                    <select name="plan" required>
                        <option value="basic">Базовый</option>
                        <option value="premium">Премиум</option>
                        <option value="pro">Профессиональный</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Количество слотов</label>
                    <input type="number" name="slots" min="1" max="100" required>
                </div>
                <div class="form-group">
                    <label>Название сервера</label>
                    <input type="text" name="name" required>
                </div>
                <button type="submit" class="btn btn-primary">Заказать</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Обработчик закрытия модального окна
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Обработчик отправки формы
    const form = modal.querySelector('#orderForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            ...Object.fromEntries(formData.entries()),
            game: gameName
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Пожалуйста, войдите в систему');
                modal.remove();
                showAuthModal('login');
                return;
            }

            const response = await fetch('/api/servers/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Сервер успешно создан!');
                modal.remove();
                window.location.href = '/servers';
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при создании сервера');
        }
    });
}

// Функция обновления шапки после авторизации
function updateHeader(user) {
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <div class="user-info">
            <span>${user.username}</span>
            <span class="balance">${user.balance} ₽</span>
            <button class="btn btn-outline" onclick="logout()">Выйти</button>
        </div>
    `;
}

// Функция выхода из системы
function logout() {
    localStorage.removeItem('token');
    window.location.reload();
} 