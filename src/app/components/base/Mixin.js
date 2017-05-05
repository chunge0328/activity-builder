import Vue from 'vue';
import util from '../common/util';
export default {
	beforeCreate() {
		let ufp = this._updateFromParent;
        this.$newChildren = [];   
        //let location = util.locate(this);
		this.$location = this.$parent ? this.$parent.$location + '.' + this.$parent.$newChildren.length : '0';
		if(this.$parent) {
        	this.$parent.$newChildren.push(this);
        }
        let config = this.__STORE__[this.$location] || {};
		this._updateFromParent = function(propsData, listeners, parentVnode, renderChildren) {
			//propsData
			propsData = Vue.util.extend(propsData || {}, config.propsData || {});
			//staticStyle
			parentVnode.data.staticStyle = Vue.util.extend(parentVnode.data.staticStyle || {}, config.staticStyle || {});
			this.$parent.$newChildren.push(this);
			ufp.apply(this, [propsData, listeners, parentVnode, renderChildren]);
		};
		this.$options.propsData = Vue.util.extend(this.$options.propsData || {}, config.propsData || {});
		if(this.$options._parentVnode) {
			this.$options._parentVnode.data.staticStyle = config.staticStyle;
		}
	},
	beforeUpdate: function() {
		this.$newChildren = [];
	}
}