<template>
<div id="app" class="app" v-bind:style="{'background-color': appBgColor}">
  <div style="position:relative">
<banner/><awardlist/><XButton/>
    </div>
  </div>
</template>
<script>
  import vue from 'vue';
  import 'style/common.less';
  import 'quill/dist/quill.core.css';
  import Enum from 'common/enum';
  import banner from 'business/banner/index.vue';
  import awardlist from 'business/awardlist/index.vue';
  import XButton from 'business/XButton/index.vue';
  vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ({ "App": { "propsData": { "psdWidth": 1080, "appBgColor": "#ffffff" } }, "Root.0.0": { "propsData": { "bgImg": { "url": require("assets/images/BkV8gjkGb.jpeg"), "width": 390, "height": 567 } }, "staticStyle": {} }, "Root.0.1": { "propsData": { "awardImg": [{ "url": require("assets/images/r1RDgsJzW.jpeg"), "width": 390, "height": 567 }, { "url": require("assets/images/S14_xoJGW.jpeg"), "width": 390, "height": 567 }, { "url": require("assets/images/1ht3yt0.jpeg"), "width": 390, "height": 567 }, { "url": require("assets/images/1ht3yt0.jpeg"), "width": 390, "height": 567 }] }, "staticStyle": { "transform": "translate(-0.083333rem,0.305556rem)", "webkitTransform": "translate(-0.083333rem,0.305556rem)" } }, "Root.0.2": { "propsData": { "motion": { "motion": "SHOW_DIALOG", "params": ["55656", "56565"] }, "fontColor": "rgba(252, 249, 249, 1)", "bgColor": "rgba(83, 112, 26, 1)", "shape": "OVAL", "bold": true, "fontSize": "18px" }, "staticStyle": { "width": "4.444444rem", "height": "1.000000rem", "transform": "translate(2.777778rem,0.638889rem)", "webkitTransform": "translate(2.777778rem,0.638889rem)" } } });
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
      banner,awardlist,XButton
    }
  }
</script>