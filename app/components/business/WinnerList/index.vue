<style lang="less">
     .winner-list{
      max-height: 250px;
      overflow-y: auto;
     }
    .winner-list li{
        height: 45px;
        border-top: 1px solid rgba(0,0,0,.1);
        font-size: 0.3333rem;
        line-height: 45px;
        background: inherit;
        margin-bottom: inherit;
        border-radius: inherit;
        width: inherit;
        .winner-name{
            display: inline-block;
            width: 50%;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-flex: 5;
            -webkit-flex: 5;
            flex: 5;
            text-align: left
        }
        .winner-awards{
          -webkit-box-flex: 4;
          -webkit-flex: 4;
          flex: 4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: right;
          display: inline-block;
          width: 40%;
          color: #000;
        }
    }
    .winner-list li:nth-child(1){
         border-top: none;
    }
</style>
<template>
     <div>
      <ul class="winner-list">
        <li v-for="info in infos">
          <span class="winner-name">{{ info.nickname }}</span>
          <span class="winner-awards">{{ info.award_name }}</span>
        </li>
      </ul>
    </div>
</template>
<script>
  import Vue from 'vue';
  export default {
    name: 'WinnerList',
    props: {
      infos: {
      }
    }

  }
</script>