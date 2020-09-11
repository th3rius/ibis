const { app, BrowserWindow } = require('electron');

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  let mainWindow = new BrowserWindow({ width: 800, height: 600 });
  await mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
