const { ipcRenderer } = require('electron');

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const deleteCompletedBtn = document.getElementById('deleteCompletedBtn');
const minimizeBtn = document.getElementById('minimize');
const closeBtn = document.getElementById('close');

// Add task on button click or Enter key
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
deleteCompletedBtn.addEventListener('click', deleteCompletedTasks);

// Minimize and close buttons
minimizeBtn.addEventListener('click', () => ipcRenderer.send('minimize-window'));
closeBtn.addEventListener('click', () => ipcRenderer.send('close-window'));

// Function to add a task
function addTask() {
    if (taskInput.value.trim() === "") return;

    let li = document.createElement('li');
    li.textContent = taskInput.value;
    li.addEventListener('click', toggleCompletion);
    taskList.appendChild(li);
    taskInput.value = "";
}

// Toggle task completion
function toggleCompletion(event) {
    event.currentTarget.classList.toggle('completed');
}

// Delete all completed tasks
function deleteCompletedTasks() {
    document.querySelectorAll('.completed').forEach(task => task.remove());
}
