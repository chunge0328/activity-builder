<style lang="less">
    .award-footer-sub {
        margin: 0 18px;
        font-size: 0.444rem;
        font-weight: 500;
        text-align: center;
    }
    .footer {
        padding-bottom: 5%
    }
    .award-footer-sub .vertical-line {
        padding: 0 1% ;
        line-height: 22px;
        height: 15px;
        display: inline-block;
        overflow: hidden
    }
    .award-footer-sub .horizontal-line{
        position: relative;
        display: inline-block;
        width: 1rem ;
        height: 1px;
    }
    .horizontal-line.left-line{
        float:left;
        top:.27rem
    }
    .horizontal-line.right-line{
        float:right;
        top:.27rem
    }
</style>
<template>
  <div class="dialog_button">
    <div class="award-footer-sub" v-bind:style="{'color':color}">
      <span class="horizontal-line left-line" v-bind:style="{'background-color':color}"></span>
      <a id="award-mine" class="operation" @click="myAward">我的奖品</a>
      <span class="vertical-line">|</span>
      <a id="activity-desc" class="operation desc" @click="ruleTxt">活动说明</a>
      <span class="vertical-line">|</span>
      <a id="winner" class="operation" @click="winnerList">中奖名单</a>
      <span class="horizontal-line right-line" v-bind:style="{'background-color':color}"></span>
    </div> 
  </div>  
</template>
<script>
  import Enum from '../../common/enum'
  import DialogBuilder from 'base/DialogBuilder'
  export default{
    name: 'ruletxt',
    props: {
        color: {
          type: String,
          default: '#000000',
          $rule: {
            name: '色值',
            clazz: Enum.CLAZZ.COLOR
          }
        }
    },
    methods: {
      myAward() {
         DialogBuilder.of(this).alert('我的奖品');
      },
      ruleTxt() {
         DialogBuilder.of(this).alert('活动说明');
      },
      winnerList() {
         DialogBuilder.of(this).alert('中奖名单');
      }
    }


  }
</script>