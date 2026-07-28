document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const scheduleForm = document.getElementById('schedule-form');
    const taskList = document.getElementById('task-list');
    const timetableList = document.getElementById('timetable-list');

    const clearCompletedBtn = document.getElementById('clear-completed');
    const deleteAllBtn = document.getElementById('delete-all');
    const searchInput = document.getElementById('search-input');
    const filterCategory = document.getElementById('filter-category');

    const statTotal = document.getElementById('stat-total');
    const statPending = document.getElementById('stat-pending');
    const statCompleted = document.getElementById('stat-completed');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let schedule = JSON.parse(localStorage.getItem('schedule')) || [];

    renderAll();

    // Handle Task Form Submission
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

    // Handle Timetable Form Submission
    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newClass = {
            id: Date.now(),
            name: document.getElementById('class-name').value,
            day: document.getElementById('class-day').value,
            time: document.getElementById('class-time').value
        };
        schedule.push(newClass);
        saveAndRender();
        scheduleForm.reset();
    });

    searchInput.addEventListener('input', renderTasks);
    filterCategory.addEventListener('change', renderTasks);

    function renderAll() {
        renderTasks();
        renderTimetable();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = filterCategory.value;

        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchText);
            const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        statTotal.textContent = tasks.length;
        const completedCount = tasks.filter(t => t.completed).length;
        statCompleted.textContent = completedCount;
        statPending.textContent = tasks.length - completedCount;

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks found.</p>';
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
                    <h3>${task.title} ${badgeText ? `<span style="font-size: 0.7rem; padding: 2px 5px; border-radius: 4px; background: #30363d; margin-left: 6px;">${badgeText}</span>` : ''}</h3>
                    <p style="font-size: 0.8rem; color: #8b949e; margin-top: 3px;">${task.course} | ${task.category} | 📅 ${task.deadline}</p>
                </div>
                <div>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})" style="width: 18px; height: 18px; cursor: pointer;">
                    <button onclick="deleteTask(${task.id})" style="background: none; border: none; color: #f85149; cursor: pointer; margin-left: 8px;">🗑️</button>
                </div>
            `;
            taskList.appendChild(card);
        });
    }

    function renderTimetable() {
        timetableList.innerHTML = '';
        if (schedule.length === 0) {
            timetableList.innerHTML = '<p class="no-tasks">No classes scheduled yet.</p>';
            return;
        }

        schedule.forEach(item => {
            const card = document.createElement('div');
            card.className = 'task-card';
            card.innerHTML = `
                <div>
                    <h3>📚 ${item.name}</h3>
                    <p style="font-size: 0.8rem; color: #8b949e; margin-top: 3px;">Day: <strong>${item.day}</strong> | Time: ${item.time}</p>
                </div>
                <div>
                    <button onclick="deleteClass(${item.id})" style="background: none; border: none; color: #f85149; cursor: pointer;">🗑️</button>
                </div>
            `;
            timetableList.appendChild(card);
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

    window.deleteClass = function (id) {
        schedule = schedule.filter(s => s.id !== id);
        saveAndRender();
    };

    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveAndRender();
    });

    deleteAllBtn.addEventListener('click', () => {
        tasks = [];
        schedule = [];
        saveAndRender();
    });

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('schedule', JSON.stringify(schedule));
        renderAll();
    }
});