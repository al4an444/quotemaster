
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const isDev = process.env.NODE_ENV === 'development';
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // win.webContents.openDevTools(); // descomenta para abrir la consola
}

app.whenReady().then(createWindow);
