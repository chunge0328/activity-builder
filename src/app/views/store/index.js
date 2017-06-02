import Vuex from 'vuex';
import Vue from 'vue';
import mutations from './mutations';
import actions from './actions';
import Enum from '../../../common/enum';

Vue.use(Vuex);

const state = {
	tpls: [],
	components: [],
	activeTpl: null,
	state: Enum.STATE.SYNCED
}

export default new Vuex.Store({
	state,
	mutations,
	actions
})
