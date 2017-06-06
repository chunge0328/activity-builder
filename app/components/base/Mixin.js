import Vue from 'vue';
import util from '../common/util';
function _broadcast(componentName, eventName, params) {
  this.$children.forEach(function (child) {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      _broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
	props: {
		$pos: {
			type: Boolean,
			default: true,
			$rule: {
				name: '占位'
			}
		}
	},
	beforeCreate() {
		//let ufp = this._updateFromParent;
    this.$newChildren = [];   
    //let location = util.locate(this);
		this.$location = this.$parent ? this.$parent.$location + '.' + this.$parent.$newChildren.length : (this.$options.$global && this.$options.name ? this.$options.name : this._uid);
		if(this.$parent) {
			this.$parent.$newChildren.push(this);
		}
    
		if(!this.$options.$global) {
			this.$config = this.__STORE__[this.$location] || {};
		} else {
			this.$config = this.__STORE__[this.$options.name] || {};
		}
		this._updateFromParent = function(propsData, listeners, parentVnode, renderChildren) { //vue2.3.0 hack
			//propsData
			Vue.util.extend(propsData, this.$config.propsData || {});
			//staticStyle
			parentVnode.data.staticStyle = Vue.util.extend(parentVnode.data.staticStyle || {}, this.$config.staticStyle || {});
			this.$parent.$newChildren.push(this); //添加新组件时候
			//ufp.apply(this, [propsData, listeners, parentVnode, renderChildren]);
		};

		this.$options.propsData = Vue.util.extend(this.$options.propsData || {}, this.$config.propsData || {});
		if(this.$options._parentVnode) {
			this.$options._parentVnode.data.staticStyle = this.$config.staticStyle;
		}
	},
	beforeUpdate: function() {
		this.$newChildren = [];
	},
	methods: {
		dispatch: function dispatch(componentName, eventName, params) {
			var parent = this.$parent || this.$root;
			var name = parent.$options.componentName;

			while (parent && (!name || name !== componentName)) {
				parent = parent.$parent;

				if (parent) {
				name = parent.$options.componentName;
				}
			}
			if (parent) {
				parent.$emit.apply(parent, [eventName].concat(params));
			}
		},
		broadcast: function broadcast(componentName, eventName, params) {
			_broadcast.call(this, componentName, eventName, params);
		}
  }
}