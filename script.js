// --- Пользователи и заказы хранятся в localStorage ---

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
}
function setOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}
function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}
function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

// --- Регистрация ---
function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const message = document.getElementById('reg-message');
    message.textContent = '';
    if (username.length < 3 || password.length < 4) {
        message.textContent = 'Имя ≥ 3 символа, пароль ≥ 4 символа';
        return;
    }
    let users = getUsers();
    if (users.find(u => u.username === username)) {
        message.textContent = 'Пользователь уже существует';
        return;
    }
    users.push({ username, password });
    setUsers(users);
    message.style.color = '#2ECC71';
    message.textContent = 'Успешно! Теперь войдите.';
    setTimeout(() => {
        message.textContent = '';
        message.style.color = '';
    }, 2000);
}

// --- Вход ---
function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const message = document.getElementById('login-message');
    message.textContent = '';
    let users = getUsers();
    let user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        message.textContent = 'Неверные данные';
        return;
    }
    setCurrentUser(username);
    showUserSection();
}

// --- Выход ---
function logout() {
    clearCurrentUser();
    showAuthSection();
}

// --- Оформление заказа ---
function submitOrder(e) {
    e.preventDefault();
    const type = document.getElementById('service-type').value;
    const desc = document.getElementById('order-desc').value.trim();
    if (!desc) return;
    let orders = getOrders();
    orders.push({
        username: getCurrentUser(),
        type,
        desc,
        date: new Date().toLocaleString('ru-RU')
    });
    setOrders(orders);
    document.getElementById('order-form').reset();
    renderOrders();
}

// --- Отображение секций ---
function showUserSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-section').style.display = '';
    document.getElementById('welcome').textContent = `Здравствуйте, ${getCurrentUser()}!`;
    renderOrders();
}
function showAuthSection() {
    document.getElementById('auth-section').style.display = '';
    document.getElementById('user-section').style.display = 'none';
    document.getElementById('login-message').textContent = '';
    document.getElementById('reg-message').textContent = '';
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}

// --- Отображение заказов ---
function renderOrders() {
    const orders = getOrders().filter(o => o.username === getCurrentUser());
    const list = document.getElementById('orders-list');
    list.innerHTML = '';
    if (orders.length === 0) {
        list.innerHTML = '<li>Нет заказов</li>';
        return;
    }
    orders.slice().reverse().forEach(order => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${order.type}</b><br><span style='color:#F1C40F'>${order.desc}</span><br><small>${order.date}</small>`;
        list.appendChild(li);
    });
}

// --- Автоматическое переключение секций при загрузке ---
window.onload = function() {
    if (getCurrentUser()) {
        showUserSection();
    } else {
        showAuthSection();
    }
}; 