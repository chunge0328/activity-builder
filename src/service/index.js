const Enum = require('../common/enum');
const shortcut = require('./shortcut');
const { ipcMain, webContents } = require('electron');

function registerServiceApi() {
	ipcMain.on(Enum.EVENTS.GET_ROOT_SYNC, (event) => {
		event.returnValue = process.cwd();
	});
	ipcMain.on(Enum.EVENTS.CAPTURE_PAGE, (event, arg) => {
		webContents.getAllWebContents()[0].capturePage(arg.rect, function(image) {
			event.sender.send(arg.fc, image.toDataURL());
		})
	});
}

function registerShortcut() {
	shortcut.registerAll();
}

function unRegisterShort() {
	shortcut.unRegisterAll();
}

exports.setup = function() {
	registerServiceApi();
	registerShortcut();
}
exports.dispose = function() {
	unRegisterShort();
}