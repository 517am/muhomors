// Основные анимации и взаимодействия
class AetherUI {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSmoothScroll();
        this.setupHoverEffects();
        this.setupScrollAnimations();
        this.setupInteractiveElements();
        this.setupNotifications();
        this.setupTypingEffects();
    }
    
    // Плавная прокрутка
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Эффекты при наведении
    setupHoverEffects() {
        // 3D эффект для карточек
        document.querySelectorAll('.card, .article-card, .tech-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = 
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Эффект света
                const glow = document.createElement('div');
                glow.className = 'card-glow';
                glow.style.cssText = `
                    position: absolute;
                    top: ${y - 50}px;
                    left: ${x - 50}px;
                    width: 100px;
                    height: 100px;
                    background: radial-gradient(circle, rgba(0, 243, 255, 0.2) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1;
                `;
                card.appendChild(glow);
                
                setTimeout(() => glow.remove(), 500);
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
        
        // Эффект волны для кнопок
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const x = e.clientX - this.getBoundingClientRect().left;
                const y = e.clientY - this.getBoundingClientRect().top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    width: 100px;
                    height: 100px;
                    top: ${y - 50}px;
                    left: ${x - 50}px;
                `;
                
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
    
    // Анимации при скролле
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Добавляем задержку для дочерних элементов
                    const children = entry.target.querySelectorAll('.card, .article-card, .tech-card');
                    children.forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.2}s`;
                        child.classList.add('animate-in');
                    });
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Интерактивные элементы
    setupInteractiveElements() {
        // Переключатель темы (день/ночь)
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--gradient-cyber);
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 1000;
            box-shadow: var(--glow-blue);
            transition: var(--transition-smooth);
        `;
        
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            
            if (document.body.classList.contains('light-theme')) {
                icon.className = 'fas fa-sun';
                themeToggle.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
            } else {
                icon.className = 'fas fa-moon';
                themeToggle.style.background = 'var(--gradient-cyber)';
            }
        });
        
        // Прогресс бар скролла
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--gradient-cyber);
            width: 0%;
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    // Система уведомлений
    setupNotifications() {
        window.showNotification = function(message, type = 'info', duration = 5000) {
            const container = document.getElementById('notification-container') || 
                (() => {
                    const div = document.createElement('div');
                    div.id = 'notification-container';
                    div.style.cssText = `
                        position: fixed;
                        top: 100px;
                        right: 30px;
                        z-index: 9999;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    `;
                    document.body.appendChild(div);
                    return div;
                })();
            
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-icon">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                </div>
                <div class="notification-content">
                    <p>${message}</p>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Анимация появления
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Кнопка закрытия
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });
            
            // Авто-закрытие
            if (duration > 0) {
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.classList.remove('show');
                        setTimeout(() => notification.remove(), 300);
                    }
                }, duration);
            }
            
            container.appendChild(notification);
            
            return {
                close: () => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }
            };
        };
    }
    
    // Эффекты печатной машинки
    setupTypingEffects() {
        document.querySelectorAll('.typewriter').forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            let i = 0;
            const speed = element.dataset.speed || 50;
            
            function typeWriter() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    element.classList.add('typing-complete');
                }
            }
            
            // Запускаем при появлении в viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typeWriter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const aetherUI = new AetherUI();
    
    // Анимация статистики при скролле
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => {
                    const target = parseInt(stat.textContent.replace('+', ''));
                    let current = 0;
                    const increment = target / 60;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                    }, 30);
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stats-grid').forEach(grid => {
        statsObserver.observe(grid);
    });
    
    // Параллакс эффект для фона
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        document.querySelector('.space-bg').style.transform = 
            `translate(${x}px, ${y}px)`;
    });
    
    // Эффект мерцания для текста
    document.querySelectorAll('.glow-text').forEach(text => {
        setInterval(() => {
            const colors = [
                'var(--cyber-blue)',
                'var(--cyber-pink)',
                'var(--cyber-green)',
                'var(--cyber-purple)'
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            text.style.textShadow = `0 0 20px ${randomColor}`;
        }, 2000);
    });
    
    // Музыкальные эффекты для кликов (опционально)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
        });
    });
    
    function playClickSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    // Сохранение прогресса прокрутки для анимации возврата
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        if (st > lastScrollTop) {
            // Скролл вниз
            document.querySelector('.navbar').style.transform = 'translateY(-100%)';
        } else {
            // Скролл вверх
            document.querySelector('.navbar').style.transform = 'translateY(0)';
        }
        
        lastScrollTop = st <= 0 ? 0 : st;
    });
});

// Глобальные функции для использования в других файлах
window.AetherUI = AetherUI;

// CSS для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes animate-in {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: animate-in 0.8s ease-out forwards;
    }
    
    .card-glow {
        animation: glow-fade 0.5s ease-out forwards;
    }
    
    @keyframes glow-fade {
        to {
            opacity: 0;
            transform: scale(2);
        }
    }
    
    .light-theme {
        --space: #f0f2f5;
        --space-light: #ffffff;
        --nebula: #e4e7eb;
        --cyber-blue: #0066cc;
        --cyber-pink: #cc00cc;
        --cyber-green: #00cc66;
        color: #333333;
    }
    
    .notification-close {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        font-size: 1rem;
        transition: var(--transition-smooth);
    }
    
    .notification-close:hover {
        color: white;
        transform: rotate(90deg);
    }
    
    .typing-complete::after {
        content: '|';
        animation: blink-caret 0.75s step-end infinite;
    }
    
    @keyframes blink-caret {
        from, to { opacity: 0; }
        50% { opacity: 1; }
    }
    
    .glow-text {
        transition: text-shadow 0.3s ease;
    }
`;
document.head.appendChild(style);