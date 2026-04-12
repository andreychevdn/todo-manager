

// Элементы DOM
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterAll = document.getElementById("filterAll");
const filterActive = document.getElementById("filterActive");
const filterCompleted = document.getElementById("filterCompleted");
const searchInput = document.getElementById("searchInput");

// кнопки сортировки
const sortDefault = document.getElementById("sortDefault");
const sortAsc = document.getElementById("sortAsc");
const sortDesc = document.getElementById("sortDesc");

// состояния
let tasks = [];
let completedTasks = [];
let currentFilter = "all";
let currentSort = "default"; // default / asc / desc

// загрузка задач из localStorage
let savedTasks = localStorage.getItem("tasks");
if (savedTasks !== null) tasks = JSON.parse(savedTasks);

let savedCompleted = localStorage.getItem("completedTasks");
if (savedCompleted !== null) completedTasks = JSON.parse(savedCompleted);

// загрузка состояния! сортировки из localStorage
let savedSort = localStorage.getItem("currentSort");
if (savedSort !== null) currentSort = savedSort;

// добавление задачи в DOM
function addTaskToDOM(taskText, index) {
    let li = document.createElement("li");
    li.classList.add("task-item");

    let span = document.createElement("span");
    span.textContent = taskText;
    if (completedTasks.includes(taskText)) span.classList.add("completed");

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

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        render();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// добавление новой задачи
function addTask() {
    let text = taskInput.value;
    if (text !== "") {
        tasks.push(text);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskInput.value = "";
        render();
    }
}

// render с фильтрами, поиском и сортировкой
function render() {
    taskList.innerHTML = ""
    let filteredTasks = tasks.slice()

    if (currentFilter === "active") {
        filteredTasks = filteredTasks.filter(function (task) {
            return !completedTasks.includes(task)
        })
    } else if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(function (task) {
            return completedTasks.includes(task)
        })
    }

    let query = searchInput.value.toLowerCase()
    if (query !== "") {
        filteredTasks = filteredTasks.filter(function (task) {
            return task.toLowerCase().includes(query)
        })
    }

    // Сортировка
    if (currentSort === "asc") {
        filteredTasks = filteredTasks.sort(function (a, b) { 
            return a.localeCompare(b) 
        })
    }
    if (currentSort === "desc") {
        filteredTasks = filteredTasks.sort(function (a, b) { 
            return b.localeCompare(a)
         })
    }

    for (let i = 0; i < filteredTasks.length; i++) {
        addTaskToDOM(filteredTasks[i], i)
    }
}

// обработчики добавление новой задачи
addBtn.addEventListener("click", addTask)
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") addTask()
})

// Обработчики кнопок фильтрации
filterAll.addEventListener("click", function () {
    currentFilter = "all"
    render()
})
filterActive.addEventListener("click", function () {
    currentFilter = "active"
    render()
})
filterCompleted.addEventListener("click", function () {
    currentFilter = "completed"
    render()
})

// Обработчик поиска
searchInput.addEventListener("input", function () {
    render()
})

// обработчики сортировки
sortDefault.addEventListener("click", function() { 
    currentSort = "default"
    localStorage.setItem("currentSort", currentSort)
    render()
})
sortAsc.addEventListener("click", function() { 
    currentSort = "asc"
    localStorage.setItem("currentSort", currentSort)
    render() 
})
sortDesc.addEventListener("click", function() { 
    currentSort = "desc"
    localStorage.setItem("currentSort", currentSort)
    render() 
})

// первая отрисовка
render();


