<style lang="less">
  .award-body {
    position: relative;
    width: 100vw;
    height: 87vw;
  }
  .shake-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 76vw;
    height: 76vw;
    padding: 5vw;
    box-sizing: border-box;;
    -webkit-transform: translate(-50%, -50%);
  }
  .shake-container .shake-bg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .shake {
    display: block;
    position: absolute;
    top: 5.5%;
    left: 5.5%;
    width: 88%;
  }
  .shake-arc {
    position: absolute;
    top: 18%;
    right: 30%;
    width: 5vw;
    height: 5vw;
    -webkit-transform-origin: 0 100%;
    -webkit-animation: shake-arc .3s ease-out infinite;
  }
  .shake-arc.shake-animate {
    -webkit-animation-duration: .2s;
  }
  .shake-arc.arc-2 {
    top: auto; 
    bottom: 16%;
    left: 28%;
    right: auto;
    -webkit-transform-origin: 100% 0;
  }
  @-webkit-keyframes shake-arc {
    0% {-webkit-transform: rotateZ(0);}
    25% {-webkit-transform: rotateZ(12deg);}
    50% {-webkit-transform: rotateZ(0);}
    75% {-webkit-transform: rotateZ(-12deg);}
    100% {-webkit-transform: rotateZ(0);}
  }
  @-webkit-keyframes lottery-play {
    0% {-webkit-transform: rotateZ(0);}
    25% {-webkit-transform: rotateZ(12deg);}
    50% {-webkit-transform: rotateZ(0);}
    75% {-webkit-transform: rotateZ(-12deg);}
    100% {-webkit-transform: rotateZ(0);}
  }
  .shake-animate {
    -webkit-animation: lottery-play linear .2s infinite;
  }
</style>
<template>
  <div class="award-body" v-bind:style="{'background':bgColor}">
    <div class="shake-container"><img :class="shakeAnimate" ref="img" id="shake" :src="shakeImg.url" @click="shake"><img class="shake-arc arc-1"  :src="shakeTopimg.url"><img class="shake-arc arc-2"  :src="shakeDownimg.url">
    </div>
  </div>
</template>
<script>
  import Enum from '../../common/enum'
  import nativeinterface from '../../common/nativeinterface'
  import DialogBuilder from 'base/DialogBuilder'
  function onLotteryStart(){
  }
  function onLotteryStop(result){
    var msg, title, sureFn, cancelFn, lottery, award;
    function stop() {
      try {
        var data = JSON.parse(result);
        document.getElementById('shake').className='shake';
        if (data.code == 200) {
          award = data.value[0];
          if (award.award_id == 0) {
            var thanks = nativeinterface.obj.findThanks();
            lottery = thanks[Math.floor(Math.random() * thanks.length)];
            mess = '更多抽奖机会，请关注魅族游戏中心活动，祝游戏愉快！';
            title = '囧，手气不好没中奖';
            // sureName = '打开游戏';
            // cancelFn = Activity.lotteryEnd;
            // sureFn = function() {
            //   Activity.lotteryEnd();
            //   var pkg = $('#app-list li').eq(0).attr('data-pkg');
            //   EventJavascriptInterface.launchApp(pkg)
            // }
            // DialogBuilder.of(this).confirm(mess, function() {
            //   this.dismiss();
            //   setTimeout(function() {
            //     context.$auth.login();
            //   }, 300);
            // }, {confirmBtnTxt: '打开游戏'})
          }else {
            lottery = nativeinterface.obj.findAward(award.award_id);
            if(!lottery) {
              throw new Error('No this award ' + award_id);
            }
          }
        }
        else {
          msg = data.message;
          DialogBuilder.of(this).alert(msg);
          return;
        }
      }
      catch (e) {
        DialogBuilder.of(this).alert('出错了！');
        return;
      }
      if(award.award_id == 0) {
        DialogBuilder.of(this).alert(title,mess);
      }
      else if(award.award_id != 0) {
        //Activity.showAwardsDialog(lottery);
        // if(lottery.type == 'MATERIAL'){

        // }else{
        //   DialogBuilder.of(this).confirm('恭喜你,获得以下奖品','<div>fsdfdsfds</div>');
        // }  
      }
      else {
        DialogBuilder.of(this).alert('出错了！');
      }
      //Activity.notifyLotteryTimes();
    }
    setTimeout(stop, 1600);
  }
  export default {
    name: 'shake',
    data(){
     return {
       shakeAnimate:'shake'
     }
    },
    props: {
      bgColor: {
          type: String,
          default: '#ececec',
          $rule: {
              name: '背景颜色',
              clazz: Enum.CLAZZ.COLOR
          }
      },
      shakeImg: {
        type: Object,
        default: ()=> ({}),
        $rule: {
          name: '摇一摇背景图',
          clazz: Enum.CLAZZ.IMAGE
        }
      },
      shakeTopimg: {
        type: Object,
        default: ()=> ({}),
        $rule: {
          name: '摇一摇动图1',
          clazz: Enum.CLAZZ.IMAGE
        }
      },
      shakeDownimg: {
        type: Object,
        default: ()=> ({}),
        $rule: {
          name: '摇一摇动图2',
          clazz: Enum.CLAZZ.IMAGE
        }  
      }
    },
    mounted() {
        var shakeThreshold = window._shakeThreshold || 2300; // 定义一个摇动的阈值
        var lastUpdate = 0; // 记录上一次摇动的时间
        var x, y, z, lastX, lastY, lastZ,canLottery=false; // 定义x、y、z记录三个轴的数据以及上一次触发的数据
        window.addEventListener('devicemotion', function (eventData) {
            // if(Activity.isLottery || !Activity.canLottery || $('.dialog-box:visible').length || $('.material-info').is(':visible') 
            //     || $('.address-info').is(':visible') || !$('#info-form').hasClass('slide-hide')) {
            //     return;
            // }
            if(canLottery){return;}
            var acceleration = eventData.accelerationIncludingGravity; // 获取含重力的加速度
            var curTime = Number(new Date());
            if ((curTime - lastUpdate) > 100) {

                var diffTime = curTime - lastUpdate;
                lastUpdate = curTime;

                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;

                var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
                // 前后x, y, z间的差值的绝对值和时间比率超过了预设的阈值，则判断设备进行了摇晃操作
                if (speed > shakeThreshold) {
                    //Activity.canLottery = false;
                    // $('body').animate({scrollTop: $('.award-container').offset().top}, function() {               
                    //     Activity.doLottery();
                    // });
                    canLottery=true;
                    // let shake=document.getElementById('shake')
                    // shake.className=shake.className+' shake-animate'
                    this.shakeAnimate='shake-animate shake'
                    //let zippos=document.getElementById('award-data').getAttribute('data-zippo')
                    nativeinterface.obj.lottery(window.zippos)
                }
                lastX = x;
                lastY = y;
                lastZ = z;
            }
        }, false);
        //初始化奖项
        //nativeinterface.obj.setAwardData(this)
    },
    methods: {
      shake() {
        // DialogBuilder.of(this).confirm('更多抽奖机会，请关注魅族游戏中心活动，祝游戏愉快！','囧，手气不好没中奖',function(){this.dismiss();},function(){console.log(12223)},{confirmBtnTxt:'dfsdfds',cancelBtnTxt:'dfsdfsdxx'});
        //DialogBuilder.of(this).confirm('恭喜你,获得以下奖品','<div>fsdfdsfds</div>');
        // console.log(this.$refs);
        this.shakeAnimate='shake-animate shake'
        let shake=document.getElementById('shake')
        if(shake.className.indexOf('shake-animate')>-1){return}
        let zipdom=document.getElementById('award-data')
        if(zipdom) {
          let zippos=zipdom.getAttribute('data-zippo')
          nativeinterface.obj.lottery(window.zippos)    
        }
      }
  }
}
</script>