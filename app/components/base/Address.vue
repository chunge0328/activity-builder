<style lang="less" scoped>
  .user-info {
    position: fixed;
    top: 0;
    z-index: 104;
    width: 100%;
    margin: 0 auto;
    padding: .972222rem 5% 0;
    line-height: 1.111111rem;
    color: #646464;
    font-size: .388889rem;
    background: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .info {
    margin-bottom: 10px;
    padding: 0;
    border-bottom: solid 1px #ccc;
    input{
      width: 70%;
      border: 0;
      outline: 0;
      font-size: .444444rem;
    }
  }
  .user-info .submit-btn {
    display: inline-block;
    margin: .555556rem 4.5%;
    width: 40%;
    height: .972222rem;
    background: #bd2418;
    color: #fff;
    font-size: .444444rem;
    text-align: center;
    line-height: .972222rem;
    border-radius: .555556rem
  }

  .user-info .cancel {
    background: #e4e3e0;
    color: #353228
  }

  .info-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.7);
    z-index: 10;
    color: #fff;
    text-align: center;
    font-size: .555556rem;
    padding-top: 6.111111rem
  }

  .info.success:after {
    content: '√';
    float: right;
    color: #080;
    font-size: .555556rem;
    font-weight: 700
  }

  .info.error:after {
    content: '!';
    float: right;
    color: #a00;
    font-size: .555556rem;
    font-weight: 700;
    -webkit-transform: scale(1.2,1.2)
  }
  .info-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.7);
    z-index: 10;
    color: #fff;
    text-align: center;
    font-size: .555556rem;
    padding-top: 6.111111rem
  }
</style>
<template>
  <div>
    <div class="info-mask"></div>
     <transition name="address" appear>
      <form id="info-form" v-show="open" class="user-info" @submit.prevent="submit">
        <div class="info notnull">收件人：<input name="recipient" id="recipient" maxlength="20" v-model="defaultInfo.recipient"></div>
        <div class="info notnull phone">手机号码：<input name="mobile" id="mobile" maxlength="20" class="number" v-model="defaultInfo.mobile"></div>
        <div class="info notnull">收件地址：<input name="address" id="address" maxlength="100" v-model="defaultInfo.address"></div>
        <div class="info postcode">邮政编码：<input name="postcode" id="postcode" maxlength="10" class="number" v-model="defaultInfo.postcode"></div>
        <div class="submit-btn cancel" id="cancel" @click="cancel()">取消</div>
        <div class="submit-btn" id="submit" @click="submit()">提交</div>
      </form>
     </transition>
  </div>
</template>
<script>
  import totast from './TotastBuilder'

  export default {
    name: 'AddressInfo',
    data() {
      return {
        open:true
      }
    },
    props: {
      defaultInfo:{}
    },
    methods: {
      submit() {
        let params = this.defaultInfo;
        //console.log(this.defaultInfo,this);
        //this.$store.dispatch()
        totast.of(this).show('保存成功',1500);

      },
      cancel() {
        let _that=this;
        _that.open=false;
        setTimeout(function(){
         _that.$el.remove();
        },500)
      }
    }
  }
</script>