<template>
  <div class="app">
<Disk/><Flip/><Flip/><Disk/><GameBar/><Flip/>
  </div>
</template>
<script>
  import vue from 'vue';
  import 'style/common.less';
  import 'quill/dist/quill.core.css';
  import Disk from "business/Disk/index.vue";
  import Flip from "business/Flip/index.vue";
  import GameBar from "business/GameBar/index.vue";
  vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ({ "0.0": { "propsData": {}, "staticStyle": {} }, "0.0.5": { "propsData": {}, "staticStyle": {} }, "0.0.4": { "propsData": {}, "staticStyle": { "height": "148px", "transform": "translate(0px,0px)", "webkitTransform": "translate(0px,0px)" } }, "0.0.3": { "propsData": {}, "staticStyle": {} }, "0.0.3.0": { "propsData": { "txt": "按钮sdfsdfdsafd", "bgImg": {}, "shape": "SQUARE", "bold": false, "bgColor": "rgba(242, 176, 176, 1)", "fontSize": "14px", "motion": { "motion": "ShowDailog", "params": ["sdfsdfsd", "sdfasdfsadf"] } }, "staticStyle": { "width": "208px", "height": "49px", "transform": "translate(132px,-7px)", "webkitTransform": "translate(132px,-7px)" } }, "0.0.2": { "propsData": {}, "staticStyle": {} }, "0.0.1": { "propsData": {}, "staticStyle": {} }, "0.0.0": { "propsData": {}, "staticStyle": {} }, "0.0.0.0": { "propsData": { "bgColor": "rgba(227, 62, 62, 1)" }, "staticStyle": {} } });
    }
  });
  export default {
    data: function() {
      return {};
    }, 
    components: {
      Disk,Flip,GameBar
    }
  }
</script>