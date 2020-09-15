import url from 'url';
import path from 'path';
import { app, BrowserWindow } from 'electron';

// process.env.ELECTRON_START_URL = 'http://localhost:9000';

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  await mainWindow.loadURL(
    process.env.ELECTRON_START_URL
    || 'http://localhost:8080'
    || url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
    }),
  );
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
