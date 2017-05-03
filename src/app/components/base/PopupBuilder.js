import Popup from './Popup.vue';
import Builder from './Builder';
import Vue from 'vue';
class PopupBuilder extends Builder {

	constructor(ctx) {
		super(ctx, Popup);
	}

	show(bindingEl, datas, onHandleSelect) {
		this.createComp({bindingEl, datas, onHandleSelect})
	}

	static of(ctx) {
		return new PopupBuilder(ctx);
	}
}
export default PopupBuilder;
