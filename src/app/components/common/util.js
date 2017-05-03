import Vue from 'vue';
export default {
	createComponentProxy(S, data) {
		var Stub = Vue.extend(S);
		var Proxy = function(options) {
			var propsData = options.propsData = Vue.util.extend(options.propsData || {}, data);
			var vm = new Stub(options);
			var ufp = vm._updateFromParent;
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
	}
} 