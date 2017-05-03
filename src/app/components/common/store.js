import Vuex from 'vuex'
import Vue from 'vue'
import {state, mutations} from './mutations'

Vue.use(Vuex);

export default new Vuex.Store({
	state,
	mutations
})

