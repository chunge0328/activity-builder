<style lang="less">
  .gourl{
    width: 200px;
    height: 100px;
  }
</style>
<template>
  <div class="gourl" @click="$doMotion(motion)">
  </div>
</template>
<script>
  import Enum from '../../common/enum'
  export default{
    name: 'anchor',
    props: {
      motion: {
          type: Object,
          default: ()=> {
              return {motion: Enum.MOTION.OPEN_URL, params: ['http://www.meizu.com']}
          },
          $rule: {
              name: '点击响应动作',
              clazz: Enum.CLAZZ.MOTION
          }
      }
    }
  }
</script>