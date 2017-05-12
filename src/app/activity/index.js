import Vue from 'vue';
import App from './App.vue';
import Mixin from '../components/base/Mixin';
import Assit from '../components/base/Assit';
import  '../components/common/defines';
Vue.use(Assit);
Vue.mixin(Mixin);
new Vue({
  el: '#app',
  render: h => h(App)
});