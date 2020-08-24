const { ipcRenderer, clipboard, nativeImage } = require('electron')
window.ipcRenderer = ipcRenderer
window.clipboard = clipboard
window.nativeImage = nativeImage