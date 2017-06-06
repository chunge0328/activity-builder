import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';
import Mixin from 'components/base/Mixin';
import Assit from 'components/base/Assit';
import 'components/common/defines';
import 'components/common/nativeinterface';
import store from 'components/common/store';

Vue.use(VueResource);
Vue.use(Assit);
Vue.mixin(Mixin);

Vue.http.interceptors.push(function(request, next) {
  store.commit('addPendingRequest', request);
  next(function(response) {
    store.commit('removePendingRequest', request);
  });
});

export function createApp() {
  return new Vue({
    name: 'Root',
    $global: true,
    render: h => h(App),
    store
  });
}


