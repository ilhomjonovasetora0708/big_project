const taskForm = document.getElementById("taskForm");
const taskContainer = document.getElementById("taskContainer");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {

    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    completedTasks.textContent = completed;

    pendingTasks.textContent = tasks.length - completed;
}

function renderTasks() {

    taskContainer.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(task => {

        const div = document.createElement("div");

        div.classList.add("task-item");

        div.innerHTML = `
      <div class="task-content ${task.completed ? "completed" : ""}">
        <h3>${task.title}</h3>

        <p>${task.description}</p>

        <span class="badge ${task.priority}">
          ${task.priority}
        </span>
      </div>

      <div class="task-actions">

        <button class="complete-btn" onclick="toggleTask(${task.id})">
          ${task.completed ? "Undo" : "Done"}
        </button>

        <button class="delete-btn" onclick="deleteTask(${task.id})">
          Delete
        </button>

      </div>
    `;

        taskContainer.appendChild(div);
    });

    updateStats();
}

taskForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const title = document.getElementById("title").value;

    const description = document.getElementById("description").value;

    const priority = document.getElementById("priority").value;

    const newTask = {
        id: Date.now(),
        title,
        description,
        priority,
        completed: false
    };

    tasks.unshift(newTask);

    saveTasks();

    renderTasks();

    taskForm.reset();
});

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();
}

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
});

renderTasks();
