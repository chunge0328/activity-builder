<template>
  <div class="app" v-bind:style="{'background-color': appBgColor}">
<Disk/><Flip/><Disk/><FloatTile/>
  </div>
</template>
<script>
  import vue from 'vue';
  import 'style/common.less';
  import 'quill/dist/quill.core.css';
  import Enum from 'common/enum';
  import Disk from 'business/Disk/index.vue';
  import Flip from 'business/Flip/index.vue';
  import FloatTile from 'business/FloatTile/index.vue';
  vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ({ "App": { "propsData": { "psdWidth": 1080, "appBgColor": "#ffffff" } }, "0.0": { "propsData": {}, "staticStyle": {} }, "0.0.0": { "propsData": {}, "staticStyle": {} }, "0.0.0.0": { "propsData": { "bgColor": "rgba(217, 26, 26, 1)", "fontColor": "rgba(197, 30, 30, 1)" }, "staticStyle": {} }, "0.0.3": { "propsData": {}, "staticStyle": { "transform": "translate(87px,75px)", "webkitTransform": "translate(87px,75px)", "height": "42px" } } });
    }
  });
  export default {
    name: 'App',
    $global: true,
    props: {
      psdWidth: {
        type: Number,
        default: 1080,
        $rule: {
          name: '设计图宽度'
        }
      },
      appBgColor: {
        type: String,
        default: '#fff',
        $rule: {
          name: 'app背景颜色',
          clazz: Enum.CLAZZ.COLOR
        }
      }
    },
    data: function() {
      return {}
    }, 
    components: {
      Disk,Flip,FloatTile
    }
  }
</script>