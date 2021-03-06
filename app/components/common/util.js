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
	},

	isEmptyObject(obj) {
		return Object.keys(obj).length === 0;
	},

	getUrlParam(key) {
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURI(r[2]);
		return null;
	},

	genId() {
		return Math.random().toString(36).substr(2);
	}
} 