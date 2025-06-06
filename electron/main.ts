import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // In development, load from local server
  if (process.env.NODE_ENV === 'development') {
    console.log('Loading development server...');
    mainWindow.loadURL('http://localhost:5173/');
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Loading production build...');
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Log any load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
    // Retry loading in development mode if the initial load fails
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        console.log('Retrying development server...');
        mainWindow?.loadURL('http://localhost:5173/');
      }, 1000);
    }
  });
}

app.whenReady().then(() => {
  console.log('App is ready, creating window...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle scanning for MP3 files
ipcMain.handle('scan-for-mp3', async () => {
  const musicFolders = [
    path.join(app.getPath('music')),
    path.join(app.getPath('home'), 'Music'),
    path.join(app.getPath('home'), 'Downloads')
  ];

  let mp3Files: { title: string; artist: string; url: string }[] = [];

  for (const folder of musicFolders) {
    try {
      const files = fs.readdirSync(folder);
      for (const file of files) {
        if (file.endsWith('.mp3')) {
          const filePath = path.join(folder, file);
          mp3Files.push({
            title: file.replace('.mp3', ''),
            artist: 'Unknown Artist',
            url: 'file://' + filePath
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning ${folder}:`, error);
    }
  }

  return mp3Files;
});

// Handle selecting music folder
ipcMain.handle('select-music-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (!result.canceled) {
    const folder = result.filePaths[0];
    const mp3Files: { title: string; artist: string; url: string }[] = [];

    try {
      const files = fs.readdirSync(folder);
      for (const file of files) {
        if (file.endsWith('.mp3')) {
          const filePath = path.join(folder, file);
          mp3Files.push({
            title: file.replace('.mp3', ''),
            artist: 'Unknown Artist',
            url: 'file://' + filePath
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning folder:`, error);
    }

    return mp3Files;
  }
  return [];
}); 