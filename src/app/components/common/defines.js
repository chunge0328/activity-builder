import { defineMotion } from '../base/Assit';
import Enum from './enum';
import DialogBuilder from '../base/DialogBuilder';
import { obj } from '../common/nativeinterface.js';

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
        this.$store.dispatch('fetchWinnerList', this).then((response) => {
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
                        let awardInfo = obj.findAward(value.id);
                        return `<li><div class="award-icon" style="background-image:url('${awardInfo.icon}')"></div><div class="award-info"><span class="award-name">${awardInfo.name}</span></div></li>`;
                        if (awardInfo.type == 'MATERIAL') {
                            isAddress = '<div class="info-tip">收货地址：<a href="javascript:void(0);" id="add-info">填写</a></div>';
                        }
                    })
                    content = '<ul class="my-award-list">' + contentDom.join('') + '</ul>' + isAddress;
                }
            }
            DialogBuilder.of(this).alert('<span class="alert-title">' + title + '</span>', content);
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
        console.log(this.$store.__proto__);
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
      this.$store.dispatch('fetchMyAward', this).then((response) => {
              let title = title || '中奖名单';
              let content = '';
              if (response.code !== 200) {
                  content = '获取失败了，刷新试试～';
              } else {
                  if (response.value.length === 0) {
                      content = '暂无中奖名单～';
                  } else {
                      let contentDom = response.value.map((value) => {
                          return `<li><span class="winner-name">${value.nickname}</span><span class="winner-awards">${value.award_name}</span>`;
                      })
                      content = '<ul class="winner-list">' + contentDom.join('') + '</ul>';
                  }
              }
              DialogBuilder.of(this).alert('<span class="alert-title">' + title + '</span>', content);
          })
    }
})
