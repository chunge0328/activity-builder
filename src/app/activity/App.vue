<template>
  <div class="app">
<Flip/><GameBar/><XText/><GameBar/>
  </div>
</template>
<script>
  import Flip from "business/Flip/index.vue";
  import GameBar from "business/GameBar/index.vue";
  import XText from "business/XText/index.vue";
  window.__STORAGE__ = {"0.0":{"propsData":{},"staticStyle":{}},"0.0.0":{"propsData":{},"staticStyle":{}},"0.0.1":{"propsData":{},"staticStyle":{}}};
  export default {
    data: function() {
      return {};
    }, 
    components: {
      Flip,GameBar,XText
    }
  }
</script>