document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDate = document.getElementById('todo-date');
    const todoList = document.getElementById('todo-list');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const filterBtn = document.getElementById('filter-btn');

    // App State
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let filterState = 'all'; // all, completed, pending

    // --- FUNCTIONS ---

    // Save todos to local storage
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Render todos to the DOM
    const renderTodos = () => {
        todoList.innerHTML = ''; // Clear the list first

        if (todos.length === 0) {
            todoList.innerHTML = '<li class="empty-message">No task found</li>';
            return;
        }

        const filteredTodos = todos.filter(todo => {
            if (filterState === 'completed') return todo.completed;
            if (filterState === 'pending') return !todo.completed;
            return true; // 'all'
        });

        if (filteredTodos.length === 0) {
            let message = 'No task found';
            if(filterState === 'completed') message = 'No completed tasks found';
            if(filterState === 'pending') message = 'No pending tasks found';
            todoList.innerHTML = `<li class="empty-message">${message}</li>`;
            return;
        }

        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item');
            todoItem.dataset.id = todo.id;
            if (todo.completed) {
                todoItem.classList.add('completed');
            }

            const statusTag = todo.completed 
                ? '<span class="completed-tag">Completed</span>' 
                : '<span class="pending-tag">Pending</span>';

            todoItem.innerHTML = `
                <span class="header-item task task-text">${todo.text}</span>
                <span class="header-item due-date">${todo.date}</span>
                <span class="header-item status">${statusTag}</span>
                <div class="header-item actions item-actions">
                    <button class="complete-btn">✔</button>
                    <button class="delete-btn">✖</button>
                </div>
            `;
            todoList.appendChild(todoItem);
        });
    };

    // Add a new todo
    const addTodo = (text, date) => {
        // Validate input form
        if (text.trim() === '' || date.trim() === '') {
            alert('Please fill in both the task and the date.');
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            date: date,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
    };

    // Toggle complete status
    const toggleComplete = (id) => {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
    };

    // Delete a todo
    const deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    };

    // --- EVENT LISTENERS ---

    // Form submission
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo(todoInput.value, todoDate.value);
        todoForm.reset();
    });

    // List item clicks (for complete/delete)
    todoList.addEventListener('click', (e) => {
        const id = parseInt(e.target.closest('.todo-item').dataset.id);
        if (e.target.classList.contains('complete-btn')) {
            toggleComplete(id);
        }
        if (e.target.classList.contains('delete-btn')) {
            deleteTodo(id);
        }
    });

    // Delete All button
    deleteAllBtn.addEventListener('click', () => {
        if(confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    });

    // Filter button
    filterBtn.addEventListener('click', () => {
        if (filterState === 'all') {
            filterState = 'pending';
            filterBtn.textContent = 'Filter: Pending';
        } else if (filterState === 'pending') {
            filterState = 'completed';
            filterBtn.textContent = 'Filter: Completed';
        } else {
            filterState = 'all';
            filterBtn.textContent = 'Filter: All';
        }
        renderTodos();
    });

    // Initial Render
    renderTodos();
});