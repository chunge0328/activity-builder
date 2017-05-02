<template>
  <div class="app">
<Disk/><Disk/><Flip/><GameBar/>
  </div>
</template>
<script>
  import Disk from "business/Disk/index.vue";
  import Flip from "business/Flip/index.vue";
  import GameBar from "business/GameBar/index.vue";
  window.__STORAGE__ = {"0":{"propsData":{},"staticStyle":{"webkitTransform":"translate(102px,-4px)","transform":"translate(102px,-4px)","width":"170px","height":"150px"}},"0.0":{"propsData":{},"staticStyle":{}},"0.0.0":{"propsData":{"content":"取sfs"},"staticStyle":{"height":"115px","transform":"translate(-2px,3px)","webkitTransform":"translate(-2px,3px)"}},"0.0.0.0":{"propsData":{"txt":"按钮sddddddd"},"staticStyle":{"width":"191px","height":"58px","transform":"translate(111px,10px)","webkitTransform":"translate(111px,10px)"}},"0.0.1":{"propsData":{},"staticStyle":{"height":"168px","webkitTransform":"translate(0px,0px)","transform":"translate(0px,0px)"}},"0.0.1.0":{"propsData":{},"staticStyle":{"webkitTransform":"translate(125px,39px)","transform":"translate(125px,39px)","width":"114px","height":"60px"}}};
  export default {
    data: function() {
      return {};
    }, 
    components: {
      Disk,Flip,GameBar
    }
  }
</script>