import Vue from 'vue';
import App from './App.vue';
import Mixin from '../components/base/Mixin';
import Assit from '../components/base/Assit';
import  '../components/common/defines';
//import _store from '../components/common/store';

let store = {};
Vue.use(Assit);
Vue.mixin(Mixin);

export function createApp() {
  return new Vue({
    name: 'Root',
    $global: true,
    render: h => h(App)
  });
}


