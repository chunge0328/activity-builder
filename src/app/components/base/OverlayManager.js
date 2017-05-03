import Overlay from './Overlay.vue';
import Vue from 'vue';
const queue = [];
var id = 1024;
var currentInstance = null;

class OverlayManager {

	static _genId() {
		return id++;
	}

	static _createOverlay() {
		var anchor = document.createElement('a');
		document.body.appendChild(anchor);
		return currentInstance = new Vue({
			el: anchor,
			render: h => h(Overlay)
		}).$children[0];
	}

	static requestOverlay(context, opts) {
		if(!context._overlayId) {
			context._overlayId = this._genId();
			queue.push({context, opts});
			if(!currentInstance) {
				this._createOverlay();
			} 
			currentInstance.change(opts);	
		}
	}

	static closeOverlay(context) {
		var len = queue.length;
		if(context._overlayId && queue.length) {
			if(queue[len - 1].context == context) {
				queue.pop();
				if(!queue.length) {
					currentInstance.close();
					currentInstance = null;
				} else {
					currentInstance.change(queue[queue.length - 1].opts);
				}
			} else {
				while(len--) {
					if(queue[len].context == context) {
						queue.splice(len, 1);
						break;
					}
				}
			}
		}
	}
}

export default OverlayManager;