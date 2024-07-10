import {app, BrowserWindow} from "electron";
import * as path from "path";
import Client from "./slsk/Client";

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

app.whenReady().then(function () {
  createWindow();

  const client = new Client();
  client.login("username", "password").then((response) => {
    console.log(response);
    client.search("lil peep", (result) => console.dir(result, {depth: null}));
  });

  app.on("activate", function () {
    if (!BrowserWindow.getAllWindows().length) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
