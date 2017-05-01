<template>
  <div class="app">
<Flip/><GameBar/>
  </div>
</template>
<script>
  import Flip from "business/Flip/index.vue";
  import GameBar from "business/GameBar/index.vue";
  window.__STORAGE__ = {"0.0":{"propsData":{},"staticStyle":{}}};
  export default {
    data: function() {
      return {};
    }, 
    components: {
      Flip,GameBar
    }
  }
</script>