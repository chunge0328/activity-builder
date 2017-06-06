<style lang="less">
  .awardlist{
    overflow-x: scroll;
    white-space: nowrap;
    overflow-y: hidden;
    padding: 0.2rem 0.4444rem;
    li{
      display: inline-block;
      img{
        display: block;
      }
    }
  }
</style>
<template>
    <ul class="awardlist">
     <li v-for="img in awardImg">
       <img v-bind:src="img.url" v-bind:style="{'height':(img.height/1080*10).toFixed(6)+'rem'}">
     </li>
    </ul>
</template>
<script>
  import Enum from '../../common/enum'
  export default{
    name: 'awardlist',
    props: {
     awardImg: {
       type: Array,
       default: ()=> ([]),
       $rule: {
        name: '奖品图',
        clazz: Enum.CLAZZ.IMAGE_ARRAY
      }
     }
    },
    computed: {
      // realImg(url) {
      //   return this.awardImg && this.awardImg.url ? `${this.awardImg.url}` : '';
      // }
    }


  }
</script>