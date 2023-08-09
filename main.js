(async () => {
    const { app, BrowserWindow } = require('electron');

    const create = async () => {
        const main = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        await main.loadFile('src/index.html');
        main.removeMenu();
    }

    await app.whenReady();
    await create();

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) await create();
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
})();
