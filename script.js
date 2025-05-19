// Состояние пользователя
let currentUser = null;
const users = new Map(); // Хранилище онлайн пользователей

// DOM элементы
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileForm = document.getElementById('profile-settings');
const uploadForm = document.getElementById('uploadForm');
const supportForm = document.getElementById('support-section');
const userStatus = document.getElementById('user-status');
const usernameDisplay = document.getElementById('username-display');
const usersList = document.getElementById('users-list');

// Навигационные ссылки
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const profileLink = document.getElementById('profile-link');
const logoutLink = document.getElementById('logout-link');
const homeLink = document.getElementById('home-link');
const filesLink = document.getElementById('files-link');
const supportLink = document.getElementById('support-link');

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка пользователя из localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUI();
    }

    // Настройка обработчиков событий
    setupEventListeners();
    
    // Показываем пользователей онлайн сразу при загрузке
    updateOnlineStatus();
});

function setupEventListeners() {
    // Навигация
    loginLink.addEventListener('click', () => showForm('login'));
    registerLink.addEventListener('click', () => showForm('register'));
    profileLink.addEventListener('click', () => showForm('profile'));
    logoutLink.addEventListener('click', handleLogout);
    homeLink.addEventListener('click', () => showForm('home'));
    filesLink.addEventListener('click', () => showForm('files'));
    supportLink.addEventListener('click', () => showForm('support'));

    // Формы
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('profileForm')?.addEventListener('submit', handleProfileUpdate);
    document.getElementById('uploadForm')?.addEventListener('submit', handleFileUpload);
    document.getElementById('supportForm')?.addEventListener('submit', handleSupportTicket);

    // Обновление статуса онлайн
    setInterval(updateOnlineStatus, 30000);
}

function showForm(formName) {
    // Скрыть все формы
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => form.style.display = 'none');

    // Показать выбранную форму
    switch(formName) {
        case 'login':
            loginForm.style.display = 'block';
            break;
        case 'register':
            registerForm.style.display = 'block';
            break;
        case 'profile':
            if (currentUser) {
                profileForm.style.display = 'block';
                // Заполнение формы данными пользователя
                document.querySelector('#profileForm input[type="text"]').value = currentUser.username;
                document.querySelector('#profileForm input[type="email"]').value = currentUser.email;
            }
            break;
        case 'files':
            document.getElementById('file-upload').style.display = 'block';
            break;
        case 'support':
            supportForm.style.display = 'block';
            break;
        default:
            document.getElementById('file-upload').style.display = 'block';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
        // В реальном приложении здесь будет API запрос
        const user = await authenticateUser(email, password);
        currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        updateUserUI();
        showForm('files');
        showNotification('Успешный вход в систему', 'success');
    } catch (error) {
        showNotification('Ошибка входа: ' + error.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;

    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }

    try {
        // В реальном приложении здесь будет API запрос
        const user = await registerUser(username, email, password);
        currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        updateUserUI();
        showForm('files');
        showNotification('Регистрация успешна', 'success');
    } catch (error) {
        showNotification('Ошибка регистрации: ' + error.message, 'error');
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const newPassword = e.target[2].value;
    const profilePicture = e.target[3].files[0];

    try {
        // В реальном приложении здесь будет API запрос
        const updatedUser = await updateUserProfile(currentUser.id, {
            username,
            email,
            password: newPassword || undefined,
            profilePicture
        });
        currentUser = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        updateUserUI();
        showNotification('Профиль успешно обновлен', 'success');
    } catch (error) {
        showNotification('Ошибка обновления профиля: ' + error.message, 'error');
    }
}

async function handleFileUpload(e) {
    e.preventDefault();
    const files = e.target[0].files;

    if (!files.length) {
        showNotification('Пожалуйста, выберите файлы для загрузки', 'warning');
        return;
    }

    try {
        // В реальном приложении здесь будет API запрос
        await uploadFiles(files);
        showNotification('Файлы успешно загружены', 'success');
        e.target.reset();
    } catch (error) {
        showNotification('Ошибка загрузки файлов: ' + error.message, 'error');
    }
}

async function handleSupportTicket(e) {
    e.preventDefault();
    const message = e.target[0].value;

    try {
        // В реальном приложении здесь будет API запрос
        await submitSupportTicket(currentUser.id, message);
        showNotification('Заявка в поддержку отправлена', 'success');
        e.target.reset();
    } catch (error) {
        showNotification('Ошибка отправки заявки: ' + error.message, 'error');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('user');
    updateUserUI();
    showForm('home');
    showNotification('Вы успешно вышли из системы', 'info');
}

function updateUserUI() {
    if (currentUser) {
        userStatus.classList.add('online');
        usernameDisplay.textContent = currentUser.username;
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        profileLink.style.display = 'block';
        logoutLink.style.display = 'block';
    } else {
        userStatus.classList.remove('online');
        usernameDisplay.textContent = 'Гость';
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        profileLink.style.display = 'none';
        logoutLink.style.display = 'none';
    }
}

function updateOnlineStatus() {
    // В реальном приложении здесь будет API запрос
    const onlineUsers = getOnlineUsers();
    updateUsersList(onlineUsers);
}

function updateUsersList(onlineUsers) {
    if (!usersList) return; // Проверка на существование элемента
    
    usersList.innerHTML = '';
    
    if (onlineUsers.length === 0) {
        usersList.innerHTML = '<div class="no-users">Нет пользователей онлайн</div>';
        return;
    }
    
    onlineUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
            <div class="user-info">
                <div class="user-name">${user.username}</div>
                <div class="user-status">
                    <span class="status-indicator online"></span>
                    <span>В сети</span>
                </div>
            </div>
        `;
        usersList.appendChild(userCard);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Мок API функции (заменить на реальные API запросы)
async function authenticateUser(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        id: 1,
        username: 'ТестовыйПользователь',
        email: email
    };
}

async function registerUser(username, email, password) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        id: 1,
        username: username,
        email: email
    };
}

async function updateUserProfile(userId, updates) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        id: userId,
        username: updates.username,
        email: updates.email
    };
}

async function uploadFiles(files) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
}

async function submitSupportTicket(userId, message) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
}

function getOnlineUsers() {
    // Имитация онлайн пользователей
    return [
        { id: 1, username: 'Пользователь1' },
        { id: 2, username: 'Пользователь2' },
        { id: 3, username: 'Пользователь3' }
    ];
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Показываем форму входа по умолчанию
    showSection('login');
    
    // Загружаем список пользователей онлайн
    updateOnlineUsers();
    
    // Обновляем список пользователей каждые 30 секунд
    setInterval(updateOnlineUsers, 30000);
});

// Функция для отображения нужной секции
function showSection(sectionId) {
    // Скрываем все формы
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => form.style.display = 'none');
    
    // Показываем выбранную форму
    const selectedForm = document.getElementById(`${sectionId}-form`);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }
}

// Функция обновления списка пользователей онлайн
async function updateOnlineUsers() {
    try {
        const users = await mockGetOnlineUsers();
        const usersList = document.getElementById('users-list');
        
        if (users.length === 0) {
            usersList.innerHTML = '<div class="no-users">Нет пользователей онлайн</div>';
            return;
        }
        
        usersList.innerHTML = users.map(user => `
            <div class="user-card">
                <div class="user-avatar">${user.name.charAt(0)}</div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-status">
                        <span class="status-indicator online"></span>
                        <span>В сети</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = '<div class="no-users">Ошибка загрузки пользователей</div>';
    }
}

// Мок функция для получения списка пользователей онлайн
async function mockGetOnlineUsers() {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Возвращаем тестовых пользователей
    return [
        { name: 'Алексей' },
        { name: 'Мария' },
        { name: 'Иван' },
        { name: 'Елена' }
    ];
}

// --- Регистрация ---
function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const regMsg = document.getElementById('reg-message');
    if (!username || !password) {
        regMsg.textContent = 'Заполните все поля';
        return;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === username)) {
        regMsg.textContent = 'Пользователь уже существует';
        return;
    }
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    regMsg.textContent = 'Регистрация успешна! Теперь войдите.';
}

// --- Вход ---
function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const loginMsg = document.getElementById('login-message');
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        loginMsg.textContent = 'Неверные данные';
        return;
    }
    localStorage.setItem('currentUser', username);
    showUserSection();
}

// --- Выход ---
function logout() {
    localStorage.removeItem('currentUser');
    showAuthSection();
}

// --- Проверка авторизации при загрузке ---
window.onload = function() {
    if (localStorage.getItem('currentUser')) {
        showUserSection();
    } else {
        showAuthSection();
    }
}

function showUserSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-section').style.display = 'block';
    const username = localStorage.getItem('currentUser');
    document.getElementById('welcome').textContent = `Здравствуйте, ${username}!`;
    loadOrders();
}

function showAuthSection() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('user-section').style.display = 'none';
    document.getElementById('reg-message').textContent = '';
    document.getElementById('login-message').textContent = '';
}

// --- Оформление заказа ---
function submitOrder(e) {
    e.preventDefault();
    const service = document.getElementById('service-type').value;
    const desc = document.getElementById('order-desc').value.trim();
    const username = localStorage.getItem('currentUser');
    if (!desc) return;
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({ username, service, desc, date: new Date().toLocaleString() });
    localStorage.setItem('orders', JSON.stringify(orders));
    document.getElementById('order-form').reset();
    loadOrders();
}

// --- Загрузка заказов пользователя ---
function loadOrders() {
    const username = localStorage.getItem('currentUser');
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const myOrders = orders.filter(o => o.username === username);
    const list = document.getElementById('orders-list');
    list.innerHTML = '';
    if (myOrders.length === 0) {
        list.innerHTML = '<li>У вас пока нет заказов.</li>';
        return;
    }
    myOrders.forEach(o => {
        const li = document.createElement('li');
        li.textContent = `${o.service} — ${o.desc} (${o.date})`;
        list.appendChild(li);
    });
} 