// Dashboard - Личный кабинет пользователя

class Dashboard {
    constructor() {
        this.userData = null;
        this.init();
    }
    
    async init() {
        this.loadUserFromStorage();
        await this.loadDashboardData();
        this.setupEventListeners();
        this.initCharts();
    }
    
    loadUserFromStorage() {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            this.userData = JSON.parse(userData);
            this.updateUserInfo();
        } else {
            // Если нет данных, перенаправляем на вход
            window.location.href = 'login.html';
        }
    }
    
    updateUserInfo() {
        if (!this.userData) return;
        
        // Обновляем имя пользователя
        const nameElements = document.querySelectorAll('#userName, #welcomeName');
        nameElements.forEach(el => {
            el.textContent = this.userData.username || 'Пользователь';
        });
        
        // Обновляем аватар
        const avatar = document.getElementById('userAvatar');
        if (avatar && this.userData.email) {
            const name = encodeURIComponent(this.userData.username || 'User');
            avatar.src = `https://ui-avatars.com/api/?name=${name}&background=9A8C98&color=fff`;
        }
    }
    
    async loadDashboardData() {
        try {
            // Показываем состояние загрузки
            document.querySelectorAll('.stat-number, .detail-number, .daily-number').forEach(el => {
                el.classList.add('loading');
            });
            
            // Здесь будет API запрос
            // const response = await fetch('/api/dashboard', {
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem('token')}`
            //     }
            // });
            // const data = await response.json();
            
            // Временные данные для демонстрации
            const mockData = {
                streak: 5,
                level: 3,
                xp: 450,
                nextLevelXp: 200,
                completedArticles: 12,
                totalHours: 18,
                achievementsCount: 8,
                today: {
                    articles: 2,
                    xp: 150,
                    time: 45
                },
                activeCourses: [
                    {
                        id: 1,
                        title: "Python для начинающих",
                        description: "Основы Python: синтаксис, типы данных, функции",
                        progress: 75,
                        currentTime: 6,
                        totalTime: 8,
                        lastActivity: "сегодня"
                    },
                    {
                        id: 2,
                        title: "Современный JavaScript",
                        description: "ES6+, асинхронное программирование, работа с DOM",
                        progress: 30,
                        currentTime: 4,
                        totalTime: 12,
                        lastActivity: "2 дня назад"
                    }
                ]
            };
            
            // Обновляем данные на странице
            this.updateDashboardStats(mockData);
            
            // Скрываем состояние загрузки
            setTimeout(() => {
                document.querySelectorAll('.loading').forEach(el => {
                    el.classList.remove('loading');
                });
            }, 500);
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            this.showError('Не удалось загрузить данные');
        }
    }
    
    updateDashboardStats(data) {
        // Общая статистика
        document.getElementById('streakDays').textContent = data.streak;
        document.getElementById('userLevel').textContent = data.level;
        document.getElementById('currentXP').textContent = data.xp;
        document.getElementById('nextLevelXP').textContent = data.nextLevelXp;
        document.getElementById('completedArticles').textContent = data.completedArticles;
        document.getElementById('totalHours').textContent = data.totalHours;
        document.getElementById('achievementsCount').textContent = data.achievementsCount;
        
        // Прогресс уровня
        const levelProgress = (data.xp % 1000) / 10; // Просто для демонстрации
        document.getElementById('levelProgress').style.width = `${levelProgress}%`;
        
        // Сегодняшняя статистика
        document.getElementById('todayArticles').textContent = data.today.articles;
        document.getElementById('todayXP').textContent = data.today.xp;
        document.getElementById('todayTime').textContent = data.today.time;
        
        // Активные курсы
        this.updateActiveCourses(data.activeCourses);
    }
    
    updateActiveCourses(courses) {
        const container = document.getElementById('activeCourses');
        const emptyState = document.getElementById('noActiveCourses');
        
        if (courses.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        container.style.display = 'block';
        emptyState.style.display = 'none';
        
        // Очищаем контейнер (кроме первого двух элементов, которые уже есть в HTML)
        const existingCourses = container.querySelectorAll('.active-course-card');
        for (let i = courses.length; i < existingCourses.length; i++) {
            existingCourses[i].remove();
        }
        
        // Обновляем существующие курсы и добавляем новые если нужно
        courses.forEach((course, index) => {
            let courseCard;
            if (index < existingCourses.length) {
                courseCard = existingCourses[index];
            } else {
                courseCard = this.createCourseCard(course);
                container.appendChild(courseCard);
            }
            
            this.updateCourseCard(courseCard, course);
        });
    }
    
    createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'active-course-card';
        card.dataset.courseId = course.id;
        card.innerHTML = `
            <div class="course-progress">
                <div class="progress-circle" data-progress="${course.progress}">
                    <svg width="60" height="60">
                        <circle class="progress-bg" cx="30" cy="30" r="25"></circle>
                        <circle class="progress-fill" cx="30" cy="30" r="25"></circle>
                    </svg>
                    <span class="progress-percent">${course.progress}%</span>
                </div>
            </div>
            <div class="course-info">
                <h4>${course.title}</h4>
                <p>${course.description}</p>
                <div class="course-meta">
                    <span class="meta-item">
                        <i class="fas fa-clock"></i> ${course.currentTime}/${course.totalTime} часов
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-calendar"></i> Последнее: ${course.lastActivity}
                    </span>
                </div>
            </div>
            <button class="btn btn-primary btn-sm continue-btn" data-course-id="${course.id}">
                <i class="fas fa-play"></i> Продолжить
            </button>
        `;
        return card;
    }
    
    updateCourseCard(card, course) {
        card.querySelector('h4').textContent = course.title;
        card.querySelector('p').textContent = course.description;
        card.querySelector('.progress-circle').dataset.progress = course.progress;
        card.querySelector('.progress-percent').textContent = `${course.progress}%`;
        card.querySelector('.meta-item:nth-child(1)').innerHTML = 
            `<i class="fas fa-clock"></i> ${course.currentTime}/${course.totalTime} часов`;
        card.querySelector('.meta-item:nth-child(2)').innerHTML = 
            `<i class="fas fa-calendar"></i> Последнее: ${course.lastActivity}`;
        
        // Обновляем прогресс круга
        const progressFill = card.querySelector('.progress-fill');
        const circumference = 2 * Math.PI * 25;
        const offset = circumference - (course.progress / 100) * circumference;
        progressFill.style.strokeDasharray = `${circumference} ${circumference}`;
        progressFill.style.strokeDashoffset = offset;
    }
    
    initCircularProgress() {
        document.querySelectorAll('.progress-circle').forEach(circle => {
            const progress = parseInt(circle.dataset.progress);
            const progressFill = circle.querySelector('.progress-fill');
            const circumference = 2 * Math.PI * 25;
            const offset = circumference - (progress / 100) * circumference;
            
            progressFill.style.strokeDasharray = `${circumference} ${circumference}`;
            progressFill.style.strokeDashoffset = offset;
            
            // Анимация
            setTimeout(() => {
                progressFill.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
            }, 300);
        });
    }
    
    initCharts() {
        // Здесь можно добавить графики с использованием Chart.js
        // Например, график прогресса за неделю
        this.initWeeklyProgressChart();
    }
    
    initWeeklyProgressChart() {
        // Пример простого графика
        const ctx = document.createElement('canvas');
        ctx.style.width = '100%';
        ctx.style.height = '200px';
        
        // Добавляем в секцию прогресса
        const progressSection = document.querySelector('.progress-overview');
        if (progressSection) {
            progressSection.appendChild(ctx);
            
            // Инициализация графика (требуется подключение Chart.js)
            if (typeof Chart !== 'undefined') {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                        datasets: [{
                            label: 'Активность (XP)',
                            data: [50, 75, 60, 90, 120, 80, 150],
                            borderColor: 'var(--accent)',
                            backgroundColor: 'rgba(154, 140, 152, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(42, 45, 67, 0.1)'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            }
        }
    }
    
    setupEventListeners() {
        // Дропдаун пользователя
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            
            // Закрытие дропдауна при клике вне
            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }
        
        // Кнопка выхода
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Кнопка начала обучения
        const startLearningBtn = document.getElementById('startLearningBtn');
        if (startLearningBtn) {
            startLearningBtn.addEventListener('click', () => {
                window.location.href = 'articles.html';
            });
        }
        
        // Кнопки продолжения курса
        document.addEventListener('click', (e) => {
            if (e.target.closest('.continue-btn')) {
                const courseId = e.target.closest('.continue-btn').dataset.courseId;
                this.startCourse(courseId);
            }
            
            // Чекбоксы целей
            if (e.target.type === 'checkbox') {
                this.updateGoalProgress(e.target);
            }
        });
        
        // Обновление даты каждую минуту
        setInterval(() => {
            this.updateCurrentDate();
        }, 60000);
    }
    
    startCourse(courseId) {
        // Здесь будет навигация к курсу
        console.log(`Начинаем курс ${courseId}`);
        // window.location.href = `course.html?id=${courseId}`;
        
        // Временное уведомление
        this.showNotification(`Начинаем курс!`, 'success');
    }
    
    updateGoalProgress(checkbox) {
        const goalItem = checkbox.closest('.goal-item');
        const progressBar = goalItem.querySelector('.progress-bar-small .progress-fill');
        const progressText = goalItem.querySelector('.goal-progress-text');
        
        if (checkbox.checked) {
            // Анимация завершения цели
            goalItem.style.opacity = '0.6';
            progressBar.style.width = '100%';
            
            // Показываем уведомление
            setTimeout(() => {
                this.showNotification('Цель достигнута! +10 XP', 'success');
            }, 300);
        }
    }
    
    logout() {
        // Очищаем данные пользователя
        localStorage.removeItem('user_data');
        localStorage.removeItem('token');
        
        // Перенаправляем на главную
        window.location.href = 'index.html';
    }
    
    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('ru-RU', options);
        }
    }
    
    showNotification(message, type = 'info') {
        // Простая реализация уведомлений
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--white);
            padding: 15px 20px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--secondary);
            cursor: pointer;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        document.body.appendChild(notification);
        
        // Авто-удаление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
    
    // Глобальные функции
    window.updateCurrentDate = () => dashboard.updateCurrentDate();
    window.loadUserData = () => dashboard.loadUserFromStorage();
    window.initCircularProgress = () => dashboard.initCircularProgress();
    window.setupInteractions = () => dashboard.setupEventListeners();
});

// CSS для анимаций уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-error {
        border-left: 4px solid #f44336;
    }
    
    .notification-success {
        border-left: 4px solid #4CAF50;
    }
    
    .notification-info {
        border-left: 4px solid var(--accent);
    }
`;
document.head.appendChild(notificationStyles);