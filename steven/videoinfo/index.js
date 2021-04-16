const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

app.on('ready', () => {
    // 1
    // console.log('App ready');
    // 2
    // new BrowserWindow({}); // see dev tools inside
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    // 3
    // mainWindow.loadURL('http://ynet.co.il');
    mainWindow.loadURL(`file://${__dirname}\\index.html`); // start with h1 hello world
    // 4 --> show refresh Ctrl + R

});

ipcMain.on('video:submit', (event, path) => {
    console.log(path);

    const fs = require("fs").promises;

    const buff = Buffer.alloc(100);
    const header = Buffer.from("mvhd");
    
    async function main() {
        const file = await fs.open(path, "r");
        const { buffer } = await file.read(buff, 0, 100, 0);
    
        await file.close();
    
        const start = buffer.indexOf(header) + 17;
        const timeScale = buffer.readUInt32BE(start);
        const duration = buffer.readUInt32BE(start + 4);
    
        const audioLength = Math.floor((duration / timeScale) * 1000) / 1000;
        
        console.log(`${duration} duration`);
        console.log(`${timeScale} timeScale`);
        console.log(`${audioLength} seconds`);
        console.log(`${Math.floor(audioLength / 60)} minutes ${audioLength - Math.floor(audioLength / 60) * 60 } seconds`);
        const result = `${Math.floor(audioLength / 60)} minutes ${audioLength - Math.floor(audioLength / 60) * 60 } seconds`;

        mainWindow.webContents.send('video:metadata', result);
    }
    main()
});

 

