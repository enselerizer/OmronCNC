import { app, BrowserWindow, ipcMain, dialog, protocol } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import * as util from 'util';
import * as rimraf from 'rimraf';

let win: BrowserWindow;

const Net = require('net');
const client = new Net.Socket();

const tempFolder = __dirname + '\\temp';

const awUnlink = util.promisify(fs.unlink);
const awExists = util.promisify(fs.exists);

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

app.on('ready', async () => {
  rimraf.sync(tempFolder);
  fs.mkdirSync(tempFolder);
  createWindow();
  const protocolName = 'sfp';

  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const url = request.url.replace(`${protocolName}://`, '');
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      console.error(error);
    }
  });
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  rimraf.sync(tempFolder);
  app.quit();
});

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 640,
    minWidth: 640,
    minHeight: 480,
    frame: false,
    backgroundColor: '#262c35',
    darkTheme: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/OmronCNC/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  );

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });

  win.on('maximize', () => {
    win.webContents.send('windowStatusChanged', true);
  });
  win.on('unmaximize', () => {
    win.webContents.send('windowStatusChanged', false);
  });
}


ipcMain.on('windowClose', (event, arg) => {
  win.close();
});

ipcMain.on('windowMinimize', (event, arg) => {
  win.minimize();
});

ipcMain.on('windowMaximize', (event, arg) => {
  win.maximize();
});

ipcMain.on('windowUnmaximize', (event, arg) => {
  win.unmaximize();
});

ipcMain.on('cnc_sendToController', (event, data) => {
    win.unmaximize();
});

ipcMain.on('connectToController', (event, data) => {
    client.connect({ port: data.ipconfig.port, host: data.ipconfig.ip }, function() {
        win.webContents.send('connectStatus', true);
    });
});

ipcMain.on('disconnectFromController', (event, data) => {
    client.end();    
});

ipcMain.on('cnc_SendToController', (event, data) => {
    client.write(data);
});



client.on('data', function(chunk) {
    win.webContents.send('cnc_ReceivedFromController', chunk.toString());
});

client.on('end', function() {
    win.webContents.send('connectStatus', false);
});