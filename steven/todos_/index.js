const { app, BrowserWindow, ipcMain, Menu } = require('electron');

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    mainWindow.loadURL(`file://${__dirname}\\index.html`); // start with h1 hello world
    mainWindow.on('closed', () => app.quit());
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('todo:add', (event, todo) => {
    console.log(todo);
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 300,
        height: 200,
        title: 'Add New Todo'
    })
    addWindow.loadURL(`file://${__dirname}\\add.html`); // start with h1 hello world
    addWindow.on('closed', () => addWindow = null);

    // how to remove menu from add
    //const addTodoMenu = Menu.buildFromTemplate([]);
    //addWindow.setMenu(addTodoMenu);
}

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'New Todo',
                accelerator: process.platform === 'darwin'? 'Command+N': 'Ctrl+N',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin'? 'Command+Q': 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
]

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            { role: 'reload' },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin'? 'Command+Alt+I': 'Ctrl+Shift+I',
                click(item, focusdWindow) {
                    focusdWindow.toggleDevTools();
                }
            }
        ]
    })
}