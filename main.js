const { app, BrowserWindow, ipcMain } = require('electron');
let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 400,  // Adjust width as needed
        height: 550, // Adjust height to fit content
        resizable: false,  // Prevent weird stretching
        frame: false, // Removes default title bar
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html');
});

// Handle minimize and close events from renderer process
ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
});

ipcMain.on('close-window', () => {
    mainWindow.close();
});
