<template>
  <div class="app">
<LazyImage/><Flip/><Flip/><LazyImage/><Disk/><GameBar/><Flip/><Disk/><GameBar/><Disk/><GameBar/><LazyImage/><Flip/><XText/>
  </div>
</template>
<script>
  import vue from 'vue';
  import 'quill/dist/quill.core.css';
  import LazyImage from "business/LazyImage/index.vue";
  import Flip from "business/Flip/index.vue";
  import Disk from "business/Disk/index.vue";
  import GameBar from "business/GameBar/index.vue";
  import XText from "business/XText/index.vue";
  vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ({ "0.0": { "propsData": {}, "staticStyle": {} }, "0.0.4": { "propsData": {}, "staticStyle": {} }, "0.0.4.0": { "propsData": { "txt": "按钮sdfsdfdsafd" }, "staticStyle": { "transform": "translate(167px,-9px)", "webkitTransform": "translate(167px,-9px)" } }, "0.0.11": { "propsData": {}, "staticStyle": {} }, "0.0.10": { "propsData": {}, "staticStyle": {} }, "0.0.9": { "propsData": {}, "staticStyle": {} }, "0.0.8": { "propsData": {}, "staticStyle": {} }, "0.0.7": { "propsData": {}, "staticStyle": {} }, "0.0.6": { "propsData": {}, "staticStyle": {} }, "0.0.12": { "propsData": {}, "staticStyle": {} }, "0.0.13": { "propsData": {}, "staticStyle": {} }, "0.0.5": { "propsData": {}, "staticStyle": {} } });
    }
  });
  export default {
    data: function() {
      return {};
    }, 
    components: {
      LazyImage,Flip,Disk,GameBar,XText
    }
  }
</script>