<template>
  <div class="app">
<Flip/><Disk/><Disk/><GameBar/><LazyImage/>
  </div>
</template>
<script>
  import vue from 'vue';
  import Flip from "business/Flip/index.vue";
  import Disk from "business/Disk/index.vue";
  import GameBar from "business/GameBar/index.vue";
  import LazyImage from "business/LazyImage/index.vue";
  vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ({ "0": { "propsData": {}, "staticStyle": { "webkitTransform": "translate(102px,-4px)", "transform": "translate(102px,-4px)", "width": "170px", "height": "150px" } }, "0.0": { "propsData": {}, "staticStyle": {} }, "0.0.0": { "propsData": {}, "staticStyle": {} }, "0.0.1": { "propsData": {}, "staticStyle": { "height": "168px", "webkitTransform": "translate(0px,0px)", "transform": "translate(0px,0px)" } }, "0.0.1.0": { "propsData": { "shape": "OVAL", "bgColor": "rgba(24, 26, 164, 1)", "fontColor": "rgba(133, 49, 49, 1)", "bold": false, "bgImg": require("assets/images/BJnuu0K1Z.png"), "bgImg2": require("assets/images/Syl6O0Kkb.jpg"), "txt": "下载", "date": "2017-05-08T16:00:00.000Z", "dateTime": "2017-05-24T10:52:06.089Z", "fontSize": "24px" }, "staticStyle": { "width": "153px", "height": "47px", "transform": "translate(131px,28px)", "webkitTransform": "translate(131px,28px)" } }, "0.0.2": { "propsData": { "content": "取哈哈哈哈哈", "name": "" }, "staticStyle": { "height": "115px", "transform": "translate(0px,0px)", "webkitTransform": "translate(0px,0px)" } }, "0.0.3": { "propsData": {}, "staticStyle": {} }, "0.0.2.0": { "propsData": { "txt": "按钮sddddddd4564564", "shape": "OVAL", "bgColor": "rgba(171, 69, 69, 1)", "fontColor": "rgba(44, 94, 222, 1)", "fontSize": "14px", "bold": false, "date": "2017-05-09T16:00:00.000Z", "bgImg": "", "bgImg2": "" }, "staticStyle": { "width": "115px", "height": "29px", "transform": "translate(210px,42px)", "webkitTransform": "translate(210px,42px)" } }, "0.0.4": { "propsData": {}, "staticStyle": {} } });
    }
  });
  export default {
    data: function() {
      return {};
    }, 
    components: {
      Flip,Disk,GameBar,LazyImage
    }
  }
</script>