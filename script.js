// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация частиц
    initParticles();
    
    // Инициализация AOS анимаций
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Инициализация навигации
    initNavigation();
    
    // Инициализация анимаций
    initAnimations();
    
    // Инициализация модальных окон
    initModals();
    
    // Инициализация форм
    initForms();
});

// Инициализация частиц
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#e94560'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#e94560',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// Инициализация навигации
function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    // Добавляем класс при скролле
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Плавная прокрутка для навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Обновляем активную ссылку
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Закрываем мобильное меню
            if (window.innerWidth <= 768) {
                navList.classList.remove('active');
            }
        });
    });
    
    // Мобильное меню
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Отслеживаем активную секцию при скролле
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Инициализация анимаций
function initAnimations() {
    // Анимация печатающегося текста для логотипа
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        const text = logoText.textContent;
        logoText.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                logoText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Анимация счетчиков в секции About
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                const duration = 2000;
                const increment = finalValue / (duration / 16);
                let currentValue = 0;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        target.textContent = finalValue + '+';
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(currentValue) + '+';
                    }
                }, 16);
                
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Hover эффекты для карточек
    const cards = document.querySelectorAll('.news-card, .project-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Анимация иконок проектов
    const projectIcons = document.querySelectorAll('.project-icon i');
    projectIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Параллакс эффект для hero секции
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroElements = document.querySelectorAll('.hero-bg-element');
        
        heroElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Инициализация модальных окон
function initModals() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.news-title').textContent;
            const excerpt = this.querySelector('.news-excerpt').textContent;
            const date = this.querySelector('.news-date').textContent;
            const category = this.querySelector('.news-category').textContent;
            const author = this.querySelector('.news-author').textContent;
            
            showModal(title, excerpt, date, category, author);
        });
    });
}

// Функция показа модального окна
function showModal(title, excerpt, date, category, author) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="modal-header">
                <span class="modal-category">${category}</span>
                <span class="modal-date">${date}</span>
            </div>
            <h2 class="modal-title">${title}</h2>
            <p class="modal-excerpt">${excerpt}</p>
            <div class="modal-footer">
                <span class="modal-author">${author}</span>
                <button class="btn btn-primary">Читать полностью</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Анимация появления
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Закрытие модального окна
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
        }
    });
}

// Функция закрытия модального окна
function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Инициализация форм
function initForms() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Простая валидация
            if (!name || !email || !message) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }
            
            // Имитация отправки
            showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            this.reset();
        });
    }
}

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Автоматическое закрытие
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Закрытие по клику
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
}

// Функция закрытия уведомления
function closeNotification(notification) {
    notification.classList.remove('active');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Добавляем стили для модальных окон и уведомлений
const additionalStyles = `
    .modal {
        display: flex;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.8);
        backdrop-filter: blur(5px);
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal.active {
        opacity: 1;
    }
    
    .modal-content {
        background-color: white;
        margin: auto;
        padding: 2rem;
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        position: relative;
        transform: translateY(-50px);
        transition: transform 0.3s ease;
    }
    
    .modal.active .modal-content {
        transform: translateY(0);
    }
    
    .close {
        position: absolute;
        right: 1rem;
        top: 1rem;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
        transition: color 0.3s ease;
    }
    
    .close:hover {
        color: #333;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    
    .modal-category {
        background: linear-gradient(135deg, #0f3460 0%, #e94560 100%);
        color: white;
        padding: 0.3rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .modal-date {
        color: #888;
        font-size: 0.9rem;
    }
    
    .modal-title {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #1a1a2e;
    }
    
    .modal-excerpt {
        color: #666;
        line-height: 1.6;
        margin-bottom: 2rem;
    }
    
    .modal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    }
    
    .modal-author {
        color: #888;
        font-size: 0.9rem;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .notification.active {
        transform: translateX(0);
    }
    
    .notification-content {
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 300px;
    }
    
    .notification-success {
        border-left: 4px solid #28a745;
    }
    
    .notification-error {
        border-left: 4px solid #dc3545;
    }
    
    .notification-info {
        border-left: 4px solid #17a2b8;
    }
    
    .notification-message {
        flex: 1;
        color: #333;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        color: #333;
    }
    
    @media (max-width: 768px) {
        .nav-list.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(26, 26, 46, 0.98);
            backdrop-filter: blur(10px);
            padding: 1rem;
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Добавляем стили в head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet); 
setTimeout(createParticles, 2000); 