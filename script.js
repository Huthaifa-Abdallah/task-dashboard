const STORAGE_KEY = "tasks";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const app = document.querySelector("#app");

let tasks = [];

try {
  tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
} catch {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  app.innerHTML = "";

  tasks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task";

    if (task.completed) {
      div.classList.add("completed");
    }

    const textElement = document.createElement("span");
    textElement.textContent = task.text;

    const completeButton = document.createElement("button");
    completeButton.textContent = task.completed ? "Completed" : "Complete";
    completeButton.className = "complete-button";
    completeButton.dataset.id = task.id;
    completeButton.disabled = task.completed;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.dataset.id = task.id;

    div.append(textElement, completeButton, deleteButton);
    app.append(div);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    return;
  }

  
  const largestId = tasks.reduce(
    (largest, task) => Math.max(largest, task.id),
    0
  );

  const newTask = {
    id: largestId + 1,
    text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  input.value = "";
  input.focus();
});

app.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button || !app.contains(button)) {
    return;
  }

  const taskId = Number(button.dataset.id);

  if (button.classList.contains("complete-button")) {
    const task = tasks.find((item) => item.id === taskId);

    if (task && !task.completed) {
      task.completed = true;
    }
  }

  if (button.classList.contains("delete-button")) {
    tasks = tasks.filter((item) => item.id !== taskId);
  }

  saveTasks();
  renderTasks();
});

renderTasks();