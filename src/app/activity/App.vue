<template>
  <div class="app" v-bind:style="{'background-color': appBgColor}">
<XButton/><FloatTile/>
  </div>
</template>
<script>
  import vue from 'vue';
  import 'style/common.less';
  import 'quill/dist/quill.core.css';
  import Enum from 'common/enum';
  import XButton from 'business/XButton/index.vue';
  import FloatTile from 'business/FloatTile/index.vue';
  vue.use({
    install(vue) {
      vue.prototype.__STORE__ = ({ "App": { "propsData": { "psdWidth": 1080, "appBgColor": "#ffffff" } }, "0.0.1": { "propsData": {}, "staticStyle": { "transform": "translate(153px,97px)", "webkitTransform": "translate(153px,97px)", "width": "69px", "height": "92px" } } });
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
      XButton,FloatTile
    }
  }
</script>