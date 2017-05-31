<template>
<div id="app" class="app" v-bind:style="{'background-color': appBgColor}">
<banner/><Disk/>
  </div>
</template>
<script>
  import vue from 'vue';
  import 'style/common.less';
  import 'quill/dist/quill.core.css';
  import Enum from 'common/enum';
  import banner from 'business/banner/index.vue';
  import Disk from 'business/Disk/index.vue';
  vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ({ "App": { "propsData": { "psdWidth": 1080, "appBgColor": "#ffffff" } }, "Root.0.0": { "propsData": { "bgImg": { "url": require("assets/images/B1mS4Ts-W.jpg"), "width": 1080, "height": 1107 } }, "staticStyle": { "transform": "translate(0px,'0px)" } }, "Root.0.1": { "propsData": {}, "staticStyle": {} }, "Root.0.1.0": { "propsData": { "fontSize": "24px" }, "staticStyle": {} } });
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
      banner,Disk
    }
  }
</script>