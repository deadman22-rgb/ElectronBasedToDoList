const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, 'tasks.json');
let mainWindow;

// Read tasks from tasks.json
function readTasksFromFile() {
    fs.readFile(tasksFilePath, 'utf-8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('tasks.json not found, creating a new one.');
                saveTasks([]);  // Create an empty file
                return;
            } else {
                console.error('Error reading tasks:', err);
                return;
            }
        }
        try {
            const tasks = JSON.parse(data);  // Parse tasks into an array
            mainWindow.webContents.send('load-tasks', tasks);  // Send tasks to renderer
        } catch (parseErr) {
            console.error('Error parsing tasks:', parseErr);
        }
    });
}

// Save tasks to tasks.json
function saveTasks(tasks) {
    fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
        if (err) {
            console.error('Error saving tasks:', err);
        } else {
            console.log('Tasks saved successfully');
        }
    });
}

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html');

    // Load tasks when the app starts
    readTasksFromFile();

    // Handle minimize and close events from renderer process
    ipcMain.on('minimize-window', () => {
        mainWindow.minimize();
    });

    ipcMain.on('close-window', () => {
        mainWindow.close();
    });

    // Save tasks when the renderer sends them
    ipcMain.on('save-tasks', (event, tasks) => {
        saveTasks(tasks);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
