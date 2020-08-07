process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow

const createWindow  = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      devTools: process.env.NODE_ENV !== 'production',
      webSecurity: false,
      allowRunningInsecureContent: true
    },
  })

  mainWindow.setMenuBarVisibility(false)

  if (process.env.NODE_ENV === 'production') mainWindow.loadFile('dist/index.html')
  
  else {
    mainWindow.loadURL('http://localhost:8080')
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// EVENTS
ipcMain.on('select-dir', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  event.reply('select-dir-reply', result.filePaths)
})

ipcMain.on('open-url', async (event, url) => {
  shell.openExternal(url)
})