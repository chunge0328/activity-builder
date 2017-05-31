<style lang="less">
   .lottery{
    padding: 6vw 0;
    .lottery-container {
      position: relative;
      width: 71.6vw;
      height: 71.6vw;
      margin: 0 auto;
    }

    .lottery-disk {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .lottery-btn {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 22.3vw;
      -webkit-transform: translate(-50%, -62%);
    }
  }
</style>
<template>
<div class="lottery" v-bind:style="{'background-color':bgColor}">
  <div class="lottery-container">
  <img class="lottery-disk lottery-play" :src="wheelImg.url">
    <img id="lottery-btn" class="lottery-btn" :src="wheelGuide.url">
  </div>
</div>
</template>
<script>
    import Enum from '../../common/enum'
  export default{
    name: 'shake',
    props: {
      bgColor: {
          type: String,
          default: '#ececec',
          $rule: {
              name: '背景颜色',
              clazz: Enum.CLAZZ.COLOR
          }
      },
      wheelImg: {
        type: Object,
        default: ()=> ({}),
        $rule: {
          name: '转盘背景图',
          clazz: Enum.CLAZZ.IMAGE
        }
      },
      wheelGuide: {
        type: Object,
        default: ()=> ({}),
        $rule: {
          name: '转盘指针',
          clazz: Enum.CLAZZ.IMAGE
        }
      }
    },
    methods: {

    }
  }
</script>