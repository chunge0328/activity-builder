const Enum = require('../common/enum');
const shortcut = require('./shortcut');
const { ipcMain, webContents, app } = require('electron');

function registerServiceAPI() {
	ipcMain.on(Enum.EVENTS.GET_ROOT_SYNC, (event) => {
		event.returnValue = process.cwd();
	});
	ipcMain.on(Enum.EVENTS.GET_BASE_DIR, (event) => {
		event.returnValue = app.getAppPath();
	});
	ipcMain.on(Enum.EVENTS.CAPTURE_PAGE, (event, arg) => {
		webContents.getAllWebContents()[0].capturePage(arg.rect, function(image) {
			event.sender.send(arg.fc, image.toDataURL());
		})
	});
	ipcMain.on(Enum.EVENTS.RELAUNCH, (event) => {
		app.relaunch();
		app.exit(0);
	});
}

function registerShortcut() {
	shortcut.registerAll();
}

function unRegisterShort() {
	shortcut.unRegisterAll();
}

exports.setup = function() {
	registerServiceAPI();
	registerShortcut();
}
exports.dispose = function() {
	unRegisterShort();
}