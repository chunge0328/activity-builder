export default {
	addComponent(state, comp) {
		state.components.push(comp)
	},
	delAllComponents(state) {
		state.components.splice(0, state.components.length)
	},
	addTpl(state, tpl) {
		state.tpls.push(tpl)
	},
	delAllTpls(state) {
		state.tpls.splice(0, state.tpls.length)
	},
	setActiveTpl(state, tpl) {
		state.activeTpl = tpl
	},
	setActiveTab(state, tab) {
		state.activeTab = tab;
	}
}