<style lang="less">
  .award-icon {
    display: inline-block;
    width: 2.777778rem;
    height: 2.777778rem;
    background-repeat: no-repeat;
    background-position: 50% 25%;
    -webkit-background-size: 100% 100%;
    background-size: 100%;
    vertical-align: bottom;
    vertical-align: top;
    margin: 0 auto;
  }
  .info-tip {
    margin-top: .555556rem;
    font-size: .333333rem;
    a {
      padding-left: .277778rem;
      color: #f15036;
    }
  }
</style>
<template>
     <div>
        <ul class="my-award-list">
          <li v-for="info in infos">
            <div class="award-icon" :style="{'background-image':'url(' + info.icon + ')'}">
            </div>
            <div class="award-info">
              <span class="award-name">{{info.name}}</span>
            </div>
          </li>
        </ul>
        <div class="info-tip" v-if="infos[0].type == 'MATERIAL'">收货地址：<a href="javascript:void(0);" id="add-info" @click="$doMotion(motion)">填写</a></div>
     </div>
</template>
<script>
  import Vue from 'vue';
  import Enum from '../../common/enum';
  export default {
    name: 'MyAwards',
    data() {
      return {
        motion: {'motion':Enum.MOTION.ADDRESS}
      }
    },
    props: {
      infos: {
      }
    }
  }
</script>