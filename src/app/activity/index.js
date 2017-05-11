import Vue from 'vue';
import App from './App.vue';
import Mixin from '../components/base/Mixin';
import Aux from '../components/base/Aux';
import  '../components/common/defines';
Vue.use(Aux);
Vue.mixin(Mixin);
new Vue({
  el: '#app',
  render: h => h(App)
});