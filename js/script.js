
// Элементы DOM
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterAll = document.getElementById("filterAll");
const filterActive = document.getElementById("filterActive");
const filterCompleted = document.getElementById("filterCompleted");
const searchInput = document.getElementById("searchInput");

// сортировка
const sortDefault = document.getElementById("sortDefault");
const sortAsc = document.getElementById("sortAsc");
const sortDesc = document.getElementById("sortDesc");

// состояния
let tasks = [];
let completedTasks = [];
let currentFilter = "all";
let currentSort = "default";

// загрузка
let savedTasks = localStorage.getItem("tasks");
if (savedTasks !== null) tasks = JSON.parse(savedTasks);

let savedCompleted = localStorage.getItem("completedTasks");
if (savedCompleted !== null) completedTasks = JSON.parse(savedCompleted);

let savedSort = localStorage.getItem("currentSort");
if (savedSort !== null) currentSort = savedSort;

// добавление в DOM
function addTaskToDOM(taskText, index) {

    let li = document.createElement("li");
    li.classList.add("task-item");

    let span = document.createElement("span");
    span.textContent = taskText;

    if (completedTasks.includes(taskText)) {
        span.classList.add("completed");
    }

    span.addEventListener("click", function () {
        span.classList.toggle("completed");

        if (span.classList.contains("completed")) {
            if (!completedTasks.includes(taskText)) completedTasks.push(taskText);
        } else {
            const i = completedTasks.indexOf(taskText);
            if (i !== -1) completedTasks.splice(i, 1);
        }

        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    });

    // кнопка редактирования
    let editBtn = document.createElement("button");
    editBtn.textContent = "Изменить";
    editBtn.classList.add("edit-btn");

    // кнопка удаления
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", function () {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        render();
    });

    // редактирование
    editBtn.addEventListener("click", function () {

        let input = document.createElement("input");
        input.type = "text";
        input.value = taskText;

        li.classList.add("editing");

        li.replaceChild(input, span);

        let saveBtn = document.createElement("button");
        saveBtn.textContent = "Сохранить";
        saveBtn.classList.add("save-btn");

        li.insertBefore(saveBtn, deleteBtn);

        function saveTask() {

            let newText = input.value.trim();

            if (newText === "") {
                alert("Задача не может быть пустой");
                return;
            }

            tasks[index] = newText;
            localStorage.setItem("tasks", JSON.stringify(tasks));

            render();
        }

        saveBtn.addEventListener("click", function () {
            saveTask();
        });

        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                saveTask();
            }
        });
    });

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}

// добавление задачи
function addTask() {
    let text = taskInput.value;

    if (text !== "") {
        tasks.push(text);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskInput.value = "";
        render();
    }
}

// render
function render() {
    taskList.innerHTML = "";
    let filteredTasks = tasks.slice();

    if (currentFilter === "active") {
        filteredTasks = filteredTasks.filter(function (task) {
            return !completedTasks.includes(task);
        });
    } else if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(function (task) {
            return completedTasks.includes(task);
        });
    }

    let query = searchInput.value.toLowerCase();

    if (query !== "") {
        filteredTasks = filteredTasks.filter(function (task) {
            return task.toLowerCase().includes(query);
        });
    }

    if (currentSort === "asc") {
        filteredTasks.sort(function (a, b) {
            return a.localeCompare(b);
        });
    }

    if (currentSort === "desc") {
        filteredTasks.sort(function (a, b) {
            return b.localeCompare(a);
        });
    }

    for (let i = 0; i < filteredTasks.length; i++) {
        let originalIndex = tasks.indexOf(filteredTasks[i])
        addTaskToDOM(filteredTasks[i], originalIndex)
    }
}

// события
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") addTask();
});

filterAll.addEventListener("click", function () {
    currentFilter = "all";
    render();
});

filterActive.addEventListener("click", function () {
    currentFilter = "active";
    render();
});

filterCompleted.addEventListener("click", function () {
    currentFilter = "completed";
    render();
});

searchInput.addEventListener("input", function () {
    render();
});

// сортировка
sortDefault.addEventListener("click", function () {
    currentSort = "default";
    localStorage.setItem("currentSort", currentSort);
    render();
});

sortAsc.addEventListener("click", function () {
    currentSort = "asc";
    localStorage.setItem("currentSort", currentSort);
    render();
});

sortDesc.addEventListener("click", function () {
    currentSort = "desc";
    localStorage.setItem("currentSort", currentSort);
    render();
});

// старт
render();