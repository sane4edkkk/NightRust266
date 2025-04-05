// Функция проверки авторизации
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        return JSON.parse(localStorage.getItem('user'));
    }
    return null;
}

// Функция обновления навигации
function updateNavigation() {
    const userData = checkAuth();
    const authButtons = document.querySelector('.auth-buttons');
    
    if (userData && authButtons) {
        authButtons.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="user-avatar" style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #333; cursor: pointer;">
                    ${userData.avatarImage ? 
                        `<img src="${userData.avatarImage}" style="width: 100%; height: 100%; object-fit: cover;">` :
                        `<span style="color: white; font-weight: bold;">${userData.avatar}</span>`
                    }
                </div>
                <span style="color: #fff;">${userData.username}</span>
                <div class="user-menu" style="display: flex; gap: 1rem;">
                    <a href="account-settings.html" class="nav-link" style="color: #fff; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; transition: background-color 0.3s;">
                        <i class="fas fa-cog"></i> Настройки
                    </a>
                    <a href="#" class="nav-link" onclick="logout(); return false;" style="color: #fff; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; transition: background-color 0.3s;">
                        <i class="fas fa-sign-out-alt"></i> Выйти
                    </a>
                </div>
            </div>
        `;

        // Добавляем стили для эффекта при наведении
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            link.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
            });
        });
    } else if (authButtons) {
        authButtons.innerHTML = `
            <a href="login.html" class="login-btn">Войти</a>
            <a href="register.html" class="register-btn">Регистрация</a>
        `;
    }
}

// Функция выхода
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
}); 