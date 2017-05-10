import Vue from 'vue';
import App from './App.vue';
import Mixin from '../components/base/Mixin';
import Motions from '../components/baseMotions';
Vue.use(Motions);
Vue.mixin(Mixin);
new Vue({
  el: '#app',
  render: h => h(App)
});