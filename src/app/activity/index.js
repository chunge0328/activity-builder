import Vue from 'vue';
import App from './App.vue';
import Mixin from '../../components/base/Mixin';
Vue.mixin(Mixin);
new Vue({
  el: '#app',
  render: h => h(App)
});