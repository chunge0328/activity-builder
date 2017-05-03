import Dialog from './Dialog.vue';
import Builder from './Builder';
import Vue from 'vue';
import ModalManager from './ModalManager';
class DialogBuilder extends Builder {
	constructor(ctx) {
		super(ctx, Dialog);
	}
	confirm(title, content, onConfirm, onCancel, opts) {
		if(Vue.util.isObject(onCancel)) {
			opts = onCancel;
			onCancel = undefined;
		}
		if(Vue.util.isObject(onConfirm)) {
			opts = onConfirm;
			onConfirm = undefined;
		}
		if(typeof content == 'function') {
			onConfirm = content;
			content = '';
		}
		// if(typeof content != 'String') {
		// 	onConfirm = content;
		// 	content = '';
		// }

		// if(Vue.util.isObject(onConfirm)) {
		// 	opts = onConfirm;
		// 	onConfirm = undefined;
		// }
		
		// if(Vue.util.isObject(onCancel)) {
		// 	opts = onCancel;
		// 	onCancel = undefined;
		// }
		opts = opts || {};
		opts.title = title;
		opts.content = content;
		if(!opts.mode) opts.mode = 'confirm';
		opts.onConfirm = onConfirm;
		opts.onCancel = onCancel;
		ModalManager.add(()=> this.createComp(opts));
	}
	alert(title, content, onConfirm, opts) {
		opts = opts || {};
		this.confirm(title, content, onConfirm, Vue.util.extend(opts, {mode: 'alert'}));
	}

	static of(ctx) {
		return new DialogBuilder(ctx);
	}
}
export default DialogBuilder;
