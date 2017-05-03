import SnackBar from './SnackBar.vue';
import Builder from './Builder';
import Vue from 'vue';
class SnackBarBuilder extends Builder {
	constructor(ctx) {
		super(ctx, SnackBar);
		this.instances = [];
	}
	show(content, opts) {
		opts = Vue.util.extend(opts || {}, {only: true});
		opts.content = content;
		if(opts.only) {
			this.hideAll();
		}
		var instance = this.createComp(opts);
		instance.sticked = !!opts.sticked;
		this.instances.push(instance);
	}
	hide() {
		this.instances.pop().$refs.comp.hide();
	}
	hideAll(force) {
		var stickedInstances = [];
		var instance = this.instances.pop();
		while(instance) {
			if(!force && instance.sticked) {
				stickedInstances.push(instance);
			} else {
				instance.$refs.comp.hide();
			}
			instance = this.instances.pop();
		}
		this.instances = stickedInstances;
	}
	static of(ctx) {
		return new SnackBarBuilder(ctx);
	}
}
export default SnackBarBuilder;