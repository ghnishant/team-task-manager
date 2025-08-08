
const baseUrl = "http://localhost:5000/api";
const token = localStorage.getItem("token");

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch(baseUrl + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert(data.message);
  }
}

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert(data.message || "Signup successful. Please login.");
  }
}


async function addTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const assignee = document.getElementById("task-assignee").value;
  const deadline = document.getElementById("task-deadline").value;
  const res = await fetch(baseUrl + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ title, description, assignee, deadline })
  });
  const data = await res.json();
  loadTasks();
}

async function loadTasks() {
  const res = await fetch(baseUrl + "/tasks", {
    headers: { Authorization: token }
  });
  const tasks = await res.json();
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.status.replace(" ", "").toLowerCase();
    li.innerHTML = `
      <strong>${task.title}</strong><br>${task.description}<br>
      Assignee: ${task.assignee} | Due: ${task.deadline}
      <span class="status">${task.status}</span><br>
      <button onclick="updateStatus('${task._id}', 'in progress')">Start</button>
      <button onclick="updateStatus('${task._id}', 'completed')">Complete</button>
    `;
    list.appendChild(li);
  });
}

async function updateStatus(id, status) {
  await fetch(baseUrl + "/tasks/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ status })
  });
  loadTasks();
}

if (window.location.pathname.includes("dashboard.html")) {
  loadTasks();
}
