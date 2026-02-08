// Обновлённая функция для создания карточек
function enhanceCourseCards() {
    document.querySelectorAll('.course-card').forEach((card, index) => {
        // Устанавливаем индекс для анимации
        card.style.setProperty('--card-index', index);
        
        // Добавляем теги
        addCourseTags(card);
        
        // Добавляем прогресс для некоторых курсов
        addCourseProgress(card, index);
        
        // Добавляем рейтинг
        addRatingStars(card);
        
        // Добавляем быстрый просмотр
        addQuickView(card);
        
        // Добавляем иконки статистики
        enhanceStatsIcons(card);
    });
}

function addCourseTags(card) {
    const tags = getTagsForCourse(card);
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'course-tags';
    
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    const description = card.querySelector('.course-description');
    if (description) {
        description.after(tagsContainer);
    }
}

function getTagsForCourse(card) {
    const category = card.dataset.category;
    const tags = [];
    
    // Базовые теги для всех курсов
    tags.push('Интерактивный', 'С практикой');
    
    // Теги по категориям
    if (category === 'python') {
        tags.push('Python', 'Популярный');
    } else if (category === 'javascript') {
        tags.push('ES6+', 'Современный');
    } else if (category === 'algorithms') {
        tags.push('Собеседование', 'Сложный');
    } else if (category === 'web') {
        tags.push('React', 'Frontend');
    } else if (category === 'database') {
        tags.push('SQL', 'Backend');
    }
    
    return tags.slice(0, 3); // Максимум 3 тега
}

function addCourseProgress(card, index) {
    // Каждый третий курс показывает прогресс
    if (index % 3 === 0) {
        const progress = Math.floor(Math.random() * 30) + 40; // 40-70%
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-text">
                <span>Прогресс</span>
                <span class="progress-percent">${progress}%</span>
            </div>
        `;
        
        const tags = card.querySelector('.course-tags');
        if (tags) {
            tags.after(progressContainer);
        }
        
        card.classList.add('in-progress');
    }
}

function addRatingStars(card) {
    const ratingValue = parseFloat(card.querySelector('.course-stats .stat:nth-child(3) span').textContent);
    const ratingElement = card.querySelector('.course-stats .stat:nth-child(3)');
    
    if (ratingElement) {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'rating';
        starsContainer.innerHTML = `
            <div class="rating-stars">
                ${getStarIcons(ratingValue)}
            </div>
            <span class="rating-value">${ratingValue}</span>
        `;
        
        ratingElement.innerHTML = '';
        ratingElement.appendChild(starsContainer);
    }
}

function getStarIcons(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

function addQuickView(card) {
    const quickView = document.createElement('div');
    quickView.className = 'quick-view';
    quickView.innerHTML = `
        <button class="quick-view-btn">
            <i class="fas fa-eye"></i> Быстрый просмотр
        </button>
    `;
    card.appendChild(quickView);
    
    const quickViewBtn = quickView.querySelector('.quick-view-btn');
    quickViewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showQuickViewModal(card);
    });
}

function showQuickViewModal(card) {
    const title = card.querySelector('.course-title').textContent;
    const description = card.querySelector('.course-description').textContent;
    const category = card.querySelector('.course-category').textContent;
    const difficulty = card.querySelector('.course-difficulty').textContent;
    const duration = card.querySelector('.course-stats .stat:nth-child(1) span').textContent;
    const students = card.querySelector('.course-stats .stat:nth-child(2) span').textContent;
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="modal-tags">
                    <span class="modal-tag">${category}</span>
                    <span class="modal-tag ${card.querySelector('.course-difficulty').className}">${difficulty}</span>
                    <span class="modal-tag">${duration}</span>
                </div>
                <p class="modal-description">${description}</p>
                <div class="modal-stats">
                    <div class="modal-stat">
                        <i class="fas fa-user-graduate"></i>
                        <span>${students} студентов</span>
                    </div>
                    <div class="modal-stat">
                        <i class="fas fa-medal"></i>
                        <span>Награда: ${card.querySelector('.course-reward span').textContent}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary modal-close-btn">Закрыть</button>
                    <button class="btn btn-primary start-course-modal">Начать курс</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Добавляем стили для модального окна
    const style = document.createElement('style');
    style.textContent = `
        .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }
        
        .modal-content {
            position: relative;
            background: var(--white);
            border-radius: var(--radius-lg);
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalAppear 0.3s ease;
        }
        
        @keyframes modalAppear {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 24px 24px 16px;
            border-bottom: 1px solid rgba(42, 45, 67, 0.1);
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 1.4rem;
            color: var(--primary);
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--secondary);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 4px;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: var(--accent);
        }
        
        .modal-body {
            padding: 24px;
        }
        
        .modal-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
        }
        
        .modal-tag {
            padding: 6px 12px;
            background: rgba(42, 45, 67, 0.05);
            color: var(--secondary);
            border-radius: var(--radius-full);
            font-size: 0.85rem;
        }
        
        .modal-description {
            color: var(--secondary);
            line-height: 1.7;
            margin-bottom: 24px;
        }
        
        .modal-stats {
            display: flex;
            gap: 20px;
            margin-bottom: 24px;
            padding: 20px 0;
            border-top: 1px solid rgba(42, 45, 67, 0.1);
            border-bottom: 1px solid rgba(42, 45, 67, 0.1);
        }
        
        .modal-stat {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--secondary);
        }
        
        .modal-stat i {
            color: var(--accent);
        }
        
        .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        
        .modal-close-btn {
            padding: 12px 24px;
        }
        
        .start-course-modal {
            padding: 12px 24px;
        }
    `;
    document.head.appendChild(style);
    
    // Обработчики закрытия
    const closeModal = () => {
        modal.style.animation = 'modalDisappear 0.3s ease forwards';
        setTimeout(() => {
            modal.remove();
            style.remove();
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Обработчик начала курса
    modal.querySelector('.start-course-modal').addEventListener('click', () => {
        card.querySelector('.start-course').click();
        closeModal();
    });
    
    // Добавляем анимацию исчезновения
    const style2 = document.createElement('style');
    style2.textContent = `
        @keyframes modalDisappear {
            from {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
        }
    `;
    document.head.appendChild(style2);
    setTimeout(() => style2.remove(), 300);
}

function enhanceStatsIcons(card) {
    const stats = card.querySelectorAll('.course-stats .stat i');
    stats[0].className = 'fas fa-clock';
    stats[1].className = 'fas fa-user-graduate';
    stats[2].className = 'fas fa-star'; // Будет заменено звёздами
}