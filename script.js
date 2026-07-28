document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const deleteAllBtn = document.getElementById('delete-all');

    // Load saved tasks from browser local storage
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

    function renderTasks() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = '<p class="no-tasks">No tasks found yet. Add one using the sidebar!</p>';
            return;
        }

        tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = `task-card ${task.completed ? 'completed' : ''}`;
            card.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p style="font-size: 0.85rem; color: #8b949e;">Course: ${task.course} | Deadline: ${task.deadline} | Priority: ${task.priority}</p>
                </div>
                <div>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})" style="width: 20px; height: 20px; cursor: pointer;">
                    <button onclick="deleteTask(${task.id})" style="background: none; border: none; color: #f85149; cursor: pointer; margin-left: 10px;">🗑️</button>
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