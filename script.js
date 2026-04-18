// 🔐 Protect page (only login session)
if (!localStorage.getItem("user")) {
    window.location.href = "login.html";
}

const currentUser = localStorage.getItem("user");

let tasks = [];
let filter = "all";

const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const priorityInput = document.getElementById("priority");
const stats = document.getElementById("stats");
const clearBtn = document.getElementById("clearAll");
const logoutBtn = document.getElementById("logout");

// 🌐 YOUR BACKEND URL
const BASE_URL = "https://to-do-list-3-i3ma.onrender.com";

// 👋 Welcome + Load tasks
window.onload = () => {
    document.getElementById("welcome").textContent = "Welcome, " + currentUser;
    loadTasks();
};

// 🔍 Filter
function filterTasks(type) {
    filter = type;
    render();
}

// 🔄 Render tasks
function render() {
    list.innerHTML = "";

    tasks.forEach((task) => {

        if (filter === "done" && task.done != 1) return;
        if (filter === "pending" && task.done == 1) return;

        const li = document.createElement("li");

        // 🎨 Priority color
        if (task.priority === "high") li.style.borderLeft = "5px solid red";
        if (task.priority === "medium") li.style.borderLeft = "5px solid orange";
        if (task.priority === "low") li.style.borderLeft = "5px solid green";

        // ✅ CHECKBOX
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done == 1;

        checkbox.onchange = () => {
            updateTask(task.id, task.task, checkbox.checked);
        };

        // 📝 TEXT
        const text = document.createElement("span");
        text.textContent = task.task;

        if (task.done == 1) {
            text.classList.add("done");
        }

        // ✏️ EDIT
        const edit = document.createElement("button");
        edit.textContent = "✏️";
        edit.onclick = () => {
            let newText = prompt("Edit task:", task.task);
            if (newText) {
                updateTask(task.id, newText, task.done);
            }
        };

        // 🗑 DELETE
        const del = document.createElement("button");
        del.textContent = "🗑";
        del.onclick = () => deleteTask(task.id);

        // 👉 ADD ELEMENTS
        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(edit);
        li.appendChild(del);

        list.appendChild(li);
    });

    // 📊 Stats
    let total = tasks.length;
    let completed = tasks.filter(t => t.done == 1).length;
    stats.textContent = `Total: ${total} | Completed: ${completed}`;
}

// 📥 LOAD TASKS FROM DB
function loadTasks() {
    fetch(`${BASE_URL}/getTasks/${currentUser}`)
        .then(res => res.json())
        .then(data => {
            tasks = data;
            render();
        });
}

// ➕ ADD TASK
addBtn.onclick = () => {
    if (input.value.trim() === "") return;

    fetch(`${BASE_URL}/addTask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: currentUser,
            task: input.value,
            priority: priorityInput.value
        })
    })
    .then(() => {
        input.value = "";
        loadTasks();
    });
};

// 🔄 UPDATE TASK
function updateTask(id, task, done) {
    fetch(`${BASE_URL}/updateTask/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            task: task,
            done: done ? 1 : 0
        })
    })
    .then(() => loadTasks());
}

// ❌ DELETE TASK
function deleteTask(id) {
    fetch(`${BASE_URL}/deleteTask/${id}`, {
        method: "DELETE"
    })
    .then(() => loadTasks());
}

// 🧹 CLEAR ALL (frontend only)
clearBtn.onclick = () => {
    tasks = [];
    render();
};

// 🚪 Logout
logoutBtn.onclick = () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
};
