<template>
  <div class="app">
<Disk/><Disk/><Disk/><Disk/>
  </div>
</template>
<script>
  import vue from 'vue';
  import Disk from "business/Disk/index.vue";
  vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ({ "0.0.2": { "propsData": {}, "staticStyle": {} }, "0.0.0": { "propsData": {}, "staticStyle": {} }, "0.0.1": { "propsData": {}, "staticStyle": {} }, "0.0.1.0": { "propsData": { "fontColor": "rgba(183, 58, 58, 1)", "bold": false, "shape": "OVAL" }, "staticStyle": { "transform": "translate(134px,9px)", "webkitTransform": "translate(134px,9px)" } }, "0.0": { "propsData": {}, "staticStyle": {} }, "0.0.2.0": { "propsData": {}, "staticStyle": {} } });
    }
  });
  export default {
    data: function() {
      return {};
    }, 
    components: {
      Disk
    }
  }
</script>