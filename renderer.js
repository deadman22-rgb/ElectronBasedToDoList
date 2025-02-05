const { ipcRenderer } = require('electron');

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const deleteCompletedBtn = document.getElementById('deleteCompletedBtn');
const minimizeBtn = document.getElementById('minimize');  // Ensure this is defined
const closeBtn = document.getElementById('close');        // Ensure this is defined

// Load tasks when the app starts
ipcRenderer.on('load-tasks', (event, tasks) => {
    tasks.forEach(task => {
        let li = document.createElement('li');
        li.textContent = task.task;
        if (task.completed) {
            li.classList.add('completed');
        }
        li.addEventListener('click', toggleCompletion);
        taskList.appendChild(li);
    });
});

// Add task when button clicked or 'Enter' pressed
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Delete completed tasks
deleteCompletedBtn.addEventListener('click', deleteCompletedTasks);

// Toggle task completion
function toggleCompletion(event) {
    event.currentTarget.classList.toggle('completed');
    saveTasks(); // Save tasks after completion status changes
}

// Add task
function addTask() {
    if (taskInput.value.trim() === "") return;

    let li = document.createElement('li');
    li.textContent = taskInput.value;
    li.addEventListener('click', toggleCompletion);
    taskList.appendChild(li);
    taskInput.value = "";

    saveTasks(); // Save tasks after a new one is added
}

// Delete all completed tasks
function deleteCompletedTasks() {
    document.querySelectorAll('.completed').forEach(task => task.remove());
    saveTasks(); // Save tasks after deletion
}

// Save tasks to the file
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('li').forEach(taskItem => {
        tasks.push({
            task: taskItem.textContent,
            completed: taskItem.classList.contains('completed')
        });
    });
    ipcRenderer.send('save-tasks', tasks); // Send tasks to main process to save
}

// Get the new button element
const deleteAllBtn = document.getElementById('deleteAllBtn');

// Add event listener to delete all tasks
deleteAllBtn.addEventListener('click', deleteAllTasks);

// Function to delete all tasks
function deleteAllTasks() {
    // Remove all task items from the list
    taskList.innerHTML = "";

    // Save the updated (empty) tasks list to the file
    saveTasks();
}


// Minimize and close buttons
minimizeBtn.addEventListener('click', () => {
    console.log('Minimize button clicked');
    ipcRenderer.send('minimize-window');
});

closeBtn.addEventListener('click', () => {
    console.log('Close button clicked');
    ipcRenderer.send('close-window');
});
