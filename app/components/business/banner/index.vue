<style lang="less">
  .banner{
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    height: 100px;
  }
</style>
<template>
  <div class="banner" v-bind:style="{'background-image': realImg,'height':(bgImg.height/1080*10).toFixed(6)+'rem'}">
  </div>
</template>
<script>
  import Enum from '../../common/enum'
  export default{
    name: 'banner',
    props: {
     bgImg: {
       type: Object,
       default: ()=> ({}),
       $rule: {
        name: '背景图片',
        clazz: Enum.CLAZZ.IMAGE
      }
     }
    },
    computed: {
      realImg() {
        return this.bgImg && this.bgImg.url ? `url(${this.bgImg.url})` : '';
      }
    }


  }
</script>