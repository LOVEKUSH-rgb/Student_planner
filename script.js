document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const deleteAllBtn = document.getElementById('delete-all');
    const searchInput = document.getElementById('search-input');
    const filterCategory = document.getElementById('filter-category');

    const statTotal = document.getElementById('stat-total');
    const statPending = document.getElementById('stat-pending');
    const statCompleted = document.getElementById('stat-completed');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newTask = {
            id: Date.now(),
            title: document.getElementById('task-title').value,
            deadline: document.getElementById('task-deadline').value,
            course: document.getElementById('task-course').value,
            category: document.getElementById('task-category').value,
            priority: document.getElementById('task-priority').value,
            completed: false
        };

        tasks.push(newTask);
        saveAndRender();
        taskForm.reset();
    });

    searchInput.addEventListener('input', renderTasks);
    filterCategory.addEventListener('change', renderTasks);

    function renderTasks() {
        taskList.innerHTML = '';

        // Filter and Search logic
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = filterCategory.value;

        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchText);
            const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Update Dashboard Stats
        statTotal.textContent = tasks.length;
        const completedCount = tasks.filter(t => t.completed).length;
        statCompleted.textContent = completedCount;
        statPending.textContent = tasks.length - completedCount;

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks found matching your filter.</p>';
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        filteredTasks.forEach(task => {
            let statusClass = '';
            let badgeText = '';

            if (!task.completed) {
                if (task.deadline < today) {
                    statusClass = 'overdue';
                    badgeText = '🔴 Overdue';
                } else if (task.deadline === today) {
                    statusClass = 'urgent';
                    badgeText = '🟡 Due Today';
                }
            }

            const card = document.createElement('div');
            card.className = `task-card ${task.completed ? 'completed' : ''} ${statusClass}`;
            card.innerHTML = `
                <div>
                    <h3>${task.title} ${badgeText ? `<span style="font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; background: #30363d; margin-left: 8px;">${badgeText}</span>` : ''}</h3>
                    <p style="font-size: 0.85rem; color: #8b949e; margin-top: 4px;">Course: ${task.course} | Category: ${task.category} | Deadline: ${task.deadline} | Priority: ${task.priority}</p>
                </div>
                <div>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})" style="width: 20px; height: 20px; cursor: pointer;">
                    <button onclick="deleteTask(${task.id})" style="background: none; border: none; color: #f85149; cursor: pointer; margin-left: 10px; font-size: 1rem;">🗑️</button>
                </div>
            `;
            taskList.appendChild(card);
        });
    }

    window.toggleTask = function (id) {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveAndRender();
    };

    window.deleteTask = function (id) {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    };

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveAndRender();
    });

    deleteAllBtn.addEventListener('click', () => {
        tasks = [];
        saveAndRender();
    });

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
});