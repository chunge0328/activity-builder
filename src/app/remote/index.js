import Enum from '../../common/enum';
const { ipcRenderer, globalShortcut } = require('electron');
var fc = 0;
export default {
	getRootSync: ()=> ipcRenderer.sendSync(Enum.EVENTS.GET_ROOT_SYNC),
	capturePage: (rect, callback)=> {
		ipcRenderer.send(Enum.EVENTS.CAPTURE_PAGE, {rect: rect, fc: Enum.EVENTS.CAPTURE_PAGE + (++fc)});
		ipcRenderer.once(Enum.EVENTS.CAPTURE_PAGE + fc, function(event, imageData) {
			callback(imageData);
		});
	},
	on: (event, cb)=> {
		ipcRenderer.on(event, cb);
	}
}