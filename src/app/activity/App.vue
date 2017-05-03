<template>
  <div class="app">
<Flip/><Disk/><Disk/><GameBar/><LazyImage/>
  </div>
</template>
<script>
  import Flip from "business/Flip/index.vue";
  import Disk from "business/Disk/index.vue";
  import GameBar from "business/GameBar/index.vue";
  import LazyImage from "business/LazyImage/index.vue";
  window.__STORAGE__ = {"0":{"propsData":{},"staticStyle":{"webkitTransform":"translate(102px,-4px)","transform":"translate(102px,-4px)","width":"170px","height":"150px"}},"0.0":{"propsData":{},"staticStyle":{}},"0.0.0":{"propsData":{},"staticStyle":{}},"0.0.1":{"propsData":{"content":"取sfs","name":""},"staticStyle":{"height":"115px","transform":"translate(0px,0px)","webkitTransform":"translate(0px,0px)"}},"0.0.1.0":{"propsData":{"txt":"按钮sddddddd4564564","shape":"OVAL","bgColor":"rgba(156, 44, 44, 1)","fontColor":"rgba(24, 204, 105, 1)"},"staticStyle":{"width":"210px","height":"45px","transform":"translate(67px,20px)","webkitTransform":"translate(67px,20px)"}},"0.0.2":{"propsData":{},"staticStyle":{"height":"168px","webkitTransform":"translate(0px,0px)","transform":"translate(0px,0px)"}},"0.0.3":{"propsData":{},"staticStyle":{}},"0.0.2.0":{"propsData":{"shape":"OVAL"},"staticStyle":{"width":"153px","height":"47px","transform":"translate(131px,28px)","webkitTransform":"translate(131px,28px)"}}};
  export default {
    data: function() {
      return {};
    }, 
    components: {
      Flip,Disk,GameBar,LazyImage
    }
  }
</script>