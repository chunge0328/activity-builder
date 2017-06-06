import Vue from 'vue';
import { defineMotion } from '../base/Assit';
import Enum from './enum';
import DialogBuilder from '../base/DialogBuilder';
import awardinterface from '../common/awardinterface.js';
import Address from '../base/AddressBuilder.js';
import MyAwards from '../business/MyAward/index.vue';
import WinnerList from '../business/WinnerList/index.vue';
import util from '../common/util';

defineMotion(Enum.MOTION.OPEN_URL, {
    name: '跳转地址',
    params: [{
        type: String,
        $rule: {
            name: '链接地址',
        }
    }],
    do: function openUrl(url) {
        window.open(url);
    }
});

defineMotion(Enum.MOTION.SHOW_DIALOG, {
    name: '弹出对话框',
    params: [{
        type: String,
        $rule: {
            name: '标题'
        }
    }, {
        type: String,
        $rule: {
            name: '内容'
        }
    }],
    do: function showDialog(title, content) {
        DialogBuilder.of(this).alert(title, content);
    }
});

defineMotion(Enum.MOTION.INSTALL_APP, {
    name: '下载app',
    params: [{
        type: String,
        $rule: {
            name: '应用id'
        }
    }, {
        type: String,
        $rule: {
            name: '包名'
        }
    }],
    do: function installApp(id, pkg) {
        if (!EventJavascriptInterface.getUserId()) {
            EventJavascriptInterface.login();
            return;
        }
        EventJavascriptInterface.onInstallButtonClick(Number(id), pkg);
    }
});

defineMotion(Enum.MOTION.MY_AWARD, {
    name: '我的奖品',
    params: [{
        type: String,
        $rule: {
            name: 'title'
        }
    }],
    do: function myAward(title) {
        this.$store.dispatch('fetchMyAward', Object.assign(this,{'params':{'xxx':333}}))
        .then((response) => {
            // response={code: 200, value: [
            // {nickname: '波特哈哈', award_name: '移动电源', award_count: 1, award_id: 6105,type:'MATERIAL'}
            // ]};
            let title = title || '我的奖品';
            let content = '';
            let isAddress = '';
            if (response.code !== 200) {
                content = '获取失败了，刷新试试～';
            } else {
                if (response.value.length === 0) {
                    content = '很遗憾～没有奖品';
                } else {
                    let contentDom = response.value.map((value) => {
                        let awardInfo = awardinterface.findAward(value.award_id);
                        return awardInfo;
                        // if (awardInfo.type == 'MATERIAL') {
                        //     isAddress = '<div class="info-tip">收货地址：<a href="javascript:void(0);" id="add-info">填写</a></div>';
                        // }
                        // return `<li><div class="award-icon" style="background-image:url('${awardInfo.icon}')"></div><div class="award-info"><span class="award-name">${awardInfo.name}</span></div></li>`;
                    })
                    // content = '<ul class="my-award-list">' + contentDom.join('') + '</ul>' + isAddress;
                    let _MyAwards = Vue.extend(MyAwards)
                    DialogBuilder.of(this).alert('<span class="alert-title">' + title + '</span>', util.createComponentProxy(_MyAwards, {'infos':contentDom}));
                    return;
                }
            }
            DialogBuilder.of(this).alert('<span class="alert-title">' + title + '</span>', content);
        }).catch((response)=> {
          console.log('fetchMyAward',response);
          //DialogBuilder.of(this).alert('出错了！刷新看看～');
        })
    }
});
defineMotion(Enum.MOTION.RULE_TXT, {
    name: '活动规则',
    params: [{
        type: String,
        $rule: {
            name: '标题'
        }
    }, {
        type: String,
        $rule: {
            name: '规则内容,空为默认值',
            istextarea: true
        }
    }],
    do: function ruleTxt(title, content) {
        //console.log(this.$store.__proto__);
        var title = title || '活动规则';
        DialogBuilder.of(this).alert(title, content);
    }
});
defineMotion(Enum.MOTION.WINNER_LIST, {
  name: '中奖名单',
  params: [{
      type: String,
      $rule: {
          name: 'title'
      }
  }],
  do: function winnerList(title) {
    console.log(this);
      this.$store.dispatch('fetchWinnerList', this).then((response) => {
              response={"code":200,"message":"","redirect":"","value":[{"activity_id":277,"award_count":1,"award_id":1433,"award_name":"7折优惠券","award_time":1495468800000,"nickname":"nini2001","price":0},{"activity_id":277,"award_count":1,"award_id":1433,"award_name":"7折优惠券","award_time":1495468800000,"nickname":"hfxbb","price":0},{"activity_id":277,"award_count":1,"award_id":1433,"award_name":"7折优惠券","award_time":1495468800000,"nickname":"用户80510412","price":0},{"activity_id":277,"award_count":1,"award_id":1433,"award_name":"7折优惠券","award_time":1495468800000,"nickname":"用户558586388","price":0},{"activity_id":277,"award_count":1,"award_id":1433,"award_name":"7折优惠券","award_time":1495468800000,"nickname":"nini2001","price":0},{"activity_id":277,"award_count":1,"award_id":1433,"award_name":"7折优惠券","award_time":1495468800000,"nickname":"hfxbb","price":0},{"activity_id":277,"award_count":1,"award_id":1433,"award_name":"7折优惠券","award_time":1495468800000,"nickname":"用户80510412","price":0},{"activity_id":277,"award_count":1,"award_id":1433,"award_name":"7折优惠券","award_time":1495468800000,"nickname":"用户558586388","price":0}]};
              let title = title || '中奖名单';
              let content = '';
              if (response.code !== 200) {
                  content = '获取失败了，刷新试试～';
              } else {
                  if (response.value.length === 0) {
                      content = '暂无中奖名单～';
                  } else {
                      // let contentDom = response.value.map((value) => {
                      //     return `<li><span class="winner-name">${value.nickname}</span><span class="winner-awards">${value.award_name}</span>`;
                      // })
                      let _WinnerList = Vue.extend(WinnerList)
                      DialogBuilder.of(this).alert('<span class="alert-title">' + title + '</span>', util.createComponentProxy(_WinnerList,{'infos':response.value}));
                      return;
                      // content = '<ul class="winner-list">' + contentDom.join('') + '</ul>';
                  }
              }
              DialogBuilder.of(this).alert('<span class="alert-title">' + title + '</span>', content);
          })
    }
});
defineMotion(Enum.MOTION.ADDRESS,{
  name: '填写地址',
  params:[],
  do: function() {
    this.$parent.dismiss();
    console.log(this);
    this.$store.dispatch('fetchAddressInfo',this).then((response)=>{
       response={"code":200,"message":"","redirect":"","value":{"address":"测试","imei":null,"message":null,"mobile":"10000000000","postcode":"518000","recipient":"邹x","uid":4923972}};
        Address.of(this).show(response.value);
    })
  }
})
