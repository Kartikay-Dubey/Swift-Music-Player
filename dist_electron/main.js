"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
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
    }
    else {
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
electron_1.app.whenReady().then(() => {
    console.log('App is ready, creating window...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
// Handle scanning for MP3 files
electron_1.ipcMain.handle('scan-for-mp3', async () => {
    const musicFolders = [
        path.join(electron_1.app.getPath('music')),
        path.join(electron_1.app.getPath('home'), 'Music'),
        path.join(electron_1.app.getPath('home'), 'Downloads')
    ];
    let mp3Files = [];
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
        }
        catch (error) {
            console.error(`Error scanning ${folder}:`, error);
        }
    }
    return mp3Files;
});
// Handle selecting music folder
electron_1.ipcMain.handle('select-music-folder', async () => {
    const result = await electron_1.dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (!result.canceled) {
        const folder = result.filePaths[0];
        const mp3Files = [];
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
        }
        catch (error) {
            console.error(`Error scanning folder:`, error);
        }
        return mp3Files;
    }
    return [];
});
