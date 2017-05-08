<template>
  <div class="app">
<Disk/><Flip/><LazyImage/><Flip/><LazyImage/><Flip/><GameBar/><Flip/><Disk/><GameBar/><Disk/><GameBar/><LazyImage/><Flip/><XText/>
  </div>
</template>
<script>
  import vue from 'vue';
  import 'quill/dist/quill.core.css';
  import Disk from "business/Disk/index.vue";
  import Flip from "business/Flip/index.vue";
  import LazyImage from "business/LazyImage/index.vue";
  import GameBar from "business/GameBar/index.vue";
  import XText from "business/XText/index.vue";
  vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ({ "0.0": { "propsData": {}, "staticStyle": {} }, "0.0.9": { "propsData": {}, "staticStyle": {} }, "0.0.8": { "propsData": {}, "staticStyle": {} }, "0.0.6": { "propsData": {}, "staticStyle": {} }, "0.0.5": { "propsData": {}, "staticStyle": {} }, "0.0.0": { "propsData": {}, "staticStyle": {} }, "0.0.0.0": { "propsData": { "txt": "按钮sdfsdfdsafd", "bgImg": { "url": require("assets/images/HJNG0TpkZ.jpg"), "width": 1536, "height": 764 }, "shape": "OVAL" }, "staticStyle": { "transform": "translate(62px,-3px)", "webkitTransform": "translate(62px,-3px)" } }, "0.0.14": { "propsData": {}, "staticStyle": {} }, "0.0.13": { "propsData": {}, "staticStyle": {} }, "0.0.12": { "propsData": {}, "staticStyle": {} }, "0.0.11": { "propsData": {}, "staticStyle": {} }, "0.0.10": { "propsData": {}, "staticStyle": {} }, "0.0.2": { "propsData": {}, "staticStyle": {} }, "0.0.1": { "propsData": {}, "staticStyle": {} } });
    }
  });
  export default {
    data: function() {
      return {};
    }, 
    components: {
      Disk,Flip,LazyImage,GameBar,XText
    }
  }
</script>