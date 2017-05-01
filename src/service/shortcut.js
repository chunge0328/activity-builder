const Enum = require('../common/enum');
const { globalShortcut, webContents, Menu, MenuItem  } = require('electron');

exports.registerAll = ()=> {
	//global shortcut
	// globalShortcut.register('Control+S', () => {
	// 	webContents.getAllWebContents()[0].send(Enum.EVENTS.SAVE);
	// });
	//local shortcut
	const menu = new Menu();
	menu.append(new MenuItem({
		label: '保存',
		accelerator: 'Ctrl+S',
		click: () => {
			webContents.getAllWebContents()[0].send(Enum.EVENTS.SAVE);
		}
	}));
	menu.append(new MenuItem({
		label: '重新加载',
		accelerator: 'Ctrl+R',
		click: ()=> {
			webContents.getAllWebContents()[0].send(Enum.EVENTS.RELOAD);
		}
	}));
	Menu.setApplicationMenu(menu)
};
exports.unRegisterAll = ()=> {
	globalShortcut.unregisterAll();
};