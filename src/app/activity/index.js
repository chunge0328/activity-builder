import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';
import Mixin from '../components/base/Mixin';
import Assit from '../components/base/Assit';
Vue.use(VueResource);
Vue.use(Assit);

import '../components/common/defines';
import '../components/common/nativeinterface';
import store from '../components/common/store';

Vue.mixin(Mixin);

export function createApp() {
  return new Vue({
    name: 'Root',
    $global: true,
    render: h => h(App),
    store
  });
}


