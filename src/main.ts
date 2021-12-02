import path from "path";
import {app, BrowserWindow} from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 600,
    maximizable: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

app.on("ready", function () {
  createWindow();

  app.on("activate", function () {
    if (!BrowserWindow.getAllWindows().length) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
