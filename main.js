/*
 * @description:
 */
// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const AnyProxy = require("anyproxy");
const serve = require("electron-serve");
const loadURL = serve({ directory: "public" });
// const proxyRule = require("./proxy");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function isDev() {
  return !app.isPackaged;
}

function proxy() {
  const options = {
    port: 8001,
    rule: require(path.join(__dirname, "proxy.js")),
    webInterface: {
      enable: true,
      webPort: 8002,
    },
    throttle: 10000,
    forceProxyHttps: false,
    wsIntercept: false, // 不开启websocket代理
    silent: true,
  };
  const proxyServer = new AnyProxy.ProxyServer(options);

  proxyServer.on("ready", () => {
    console.log("ready");
    /* */
  });
  proxyServer.on("error", (e) => {
    console.error("error");
    /* */
  });
  proxyServer.start();
}

function createWindow() {
  Menu.setApplicationMenu(null);
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      // enableRemoteModule: true,
      // contextIsolation: false
    },
    icon: path.join(__dirname, "public/favicon.png"),
    show: false,
  });

  // This block of code is intended for development purpose only.
  // Delete this entire block of code when you are ready to package the application.
  mainWindow.loadURL("http://localhost:8002/");
  // if (isDev()) {
  //   mainWindow.loadURL("http://localhost:8002/");
  // } else {
  //   loadURL(mainWindow);
  // }

  // Uncomment the following line of code when app is ready to be packaged.
  // loadURL(mainWindow);

  // Open the DevTools and also disable Electron Security Warning.
  // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Emitted when the window is ready to be shown
  // This helps in showing the window gracefully.
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  AnyProxy.utils.systemProxyMgr.enableGlobalProxy("127.0.0.1", "8001");
  proxy();
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
  ProxyServer.close();
  // 关闭全局代理服务器
  AnyProxy.utils.systemProxyMgr.disableGlobalProxy();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
