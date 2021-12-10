import {app, BrowserWindow} from "electron";
import * as path from "path";

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 600,
    maximizable: false,
    resizable: false,
    webPreferences: {
      preload: require.resolve("./preload.ts"),
    },
  });

  // FIXME relative to dist/
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
