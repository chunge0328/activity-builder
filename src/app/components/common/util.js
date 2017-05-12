import Vue from 'vue';
import Mixin from '../base/Mixin';
let ZINDEX = 1234;
export default {
	createComponentProxy(S, data) {
		S._Ctor = null;
		let Stub = Vue.extend(S);
		let Proxy = function(options) {
			let propsData = options.propsData = Vue.util.extend(options.propsData || {}, data);
			let vm = new Stub(options);
			let ufp = vm._updateFromParent;
			vm._updateFromParent = function() {
				arguments[0] = Vue.util.extend(arguments[0] || {}, propsData);
				ufp.apply(this, arguments);
			}
			return vm;
		}
		Vue.util.extend(Proxy, Stub);
		return Proxy;
	},

	locate(node) {
		if(node.$parent) {
			return this.locate(node.$parent) + '.' + node.$parent.$newChildren.indexOf(node);
		} else {
			return '0';
		}
	},

	isObject(obj) {
		return obj !== null && typeof obj === 'object'
	},

	genZIndex() {
		return ZINDEX += 2;
	}
} 