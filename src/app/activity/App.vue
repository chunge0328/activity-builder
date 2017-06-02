<template>
<div id="app" class="app" v-bind:style="{'background-color': appBgColor}">
  <div style="position:relative">
<awardlist/><awardlist/><shake/>
    </div>
  </div>
</template>
<script>
  import vue from 'vue';
  import 'style/common.less';
  import 'quill/dist/quill.core.css';
  import Enum from 'common/enum';
  import awardlist from 'business/awardlist/index.vue';
  import shake from 'business/shake/index.vue';
  vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ({ "App": { "propsData": { "psdWidth": 1080, "appBgColor": "rgba(146, 72, 72, 1)" } }, "Root.0.0": { "propsData": { "awardImg": [{ "url": require("assets/images/BkahdTCZb.png"), "width": 527, "height": 330 }, { "url": require("assets/images/ryXpuTRZW.png"), "width": 527, "height": 330 }, { "url": require("assets/images/B1QGK6CZZ.png"), "width": 527, "height": 330 }] }, "staticStyle": {} }, "Root.0.1": { "propsData": { "awardImg": [{ "url": require("assets/images/SymLYpAbW.png"), "width": 527, "height": 330 }, { "url": require("assets/images/HJvUYTAZW.png"), "width": 527, "height": 330 }, { "url": require("assets/images/r1CUFa0-Z.png"), "width": 527, "height": 330 }, { "url": require("assets/images/SJbwKTCb-.png"), "width": 527, "height": 330 }] }, "staticStyle": { "transform": "translate(0.694444rem,0.416667rem)", "webkitTransform": "translate(0.694444rem,0.416667rem)", "width": "9.000000rem", "height": "3.444444rem" } }, "Root.0.2": { "propsData": { "bgColor": "rgba(234, 136, 136, 1)" }, "staticStyle": { "transform": "translate(0.166667rem,3.888889rem)", "webkitTransform": "translate(0.166667rem,3.888889rem)" } } });
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
      awardlist,shake
    }
  }
</script>