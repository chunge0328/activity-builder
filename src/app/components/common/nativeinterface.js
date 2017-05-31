/*
1 把本文件中的代码置于业务代码最上面
2 把业务代码中的字符串EventJavascriptInterface全部替换为字符串NativeInterface
3 修改onLotteryStop函数处理参数的方式:var data = (typeof result == 'string') ? $.parseJSON(result) : result
*/   
    var obj = {},
    Activity={
      dataType: 'game',
      activityId: 0
    }
    var isMzBrower = window.MzJavascriptInterface ? true : false
    var getUrlParam = function (key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
    if(!window.EventJavascriptInterface) {
        var noop = function() {};
        window.EventJavascriptInterface = {
            oauthRequest: noop,
            isAppInstalled: noop,
            onAppShowInPage: noop,
            requestChance: noop,
            getUserId: function () {return 0;},
            login: noop,
            getPhoneNumber: function () {return '10000000000'},
            launchApp: noop,
            gotoAppInfoPage: noop,
            onInstallButtonClick: noop,
            lottery: noop
        }
    }

    obj.login = function() {
        if(isMzBrower) {
            localStorage['mz_game_access_token'] = ''
            location.href = 'https://login.flyme.cn/authorize/cert.html?'
                          + 'appuri=' + location.protocol + '//' +  location.host + location.pathname 
                          +  (getUrlParam('channel_id') ? '?channel_id='+getUrlParam('channel_id') : '')
                          + '&service=uc&scope=trust&clientId=pkj6DgyJooci9hkcijtwfnfctbtiqcdh&clientSecret=ptdje0meulhrvEsb8webmjNziztszwsc'
                          + '&imei=' + MzJavascriptInterface.getIMEI()
                          + '&sn=' + MzPrivateJavascriptInterface.getSN()
        }
        else {
            EventJavascriptInterface.login()
        }
    }

    if(isMzBrower) {
        var access_token_url = getUrlParam('access_token') && JSON.parse(decodeURIComponent(getUrlParam('access_token')))
        var access_token_local = localStorage['mz_game_access_token'] && JSON.parse(localStorage['mz_game_access_token'])
        if(access_token_url) {
            if(!access_token_local) {
                var access_token = access_token_url.access_token
                var expires_in = access_token_url.expires_in
                var uid = access_token_url.user_id
                var phone = access_token_url.phone
                localStorage['mz_game_access_token'] = JSON.stringify({access_token: access_token, expires: Date.now()+expires_in*1000, uid: uid, phone: phone})            
            }
        }
        else {
            if(!access_token_local || access_token_local.expires <= Date.now()) {
                obj.login()
            }
        }
    }

    obj.getUserInfoBy = function(param) {
        return function() {
            var access_token_local = localStorage['mz_game_access_token'] && JSON.parse(localStorage['mz_game_access_token'])
            if(!access_token_local || access_token_local.expires <= Date.now()) {
                localStorage['mz_game_access_token'] = ''
                login()
                return null
            }

            return access_token_local[param]
        }    
    }

    obj.getUserId = function() {
        return isMzBrower ? obj.getUserInfoBy('uid')() : EventJavascriptInterface.getUserId()
    }

    obj.getPhoneNumber = function() {
        return isMzBrower ? obj.getUserInfoBy('phone')() : EventJavascriptInterface.getPhoneNumber()
    }

    obj.getUserToken = obj.getUserInfoBy('access_token')

    obj.oauthRequest = function(tag, url, dataStr) {
        if(isMzBrower) {
            var dataObj = JSON.parse(dataStr)
            dataObj.uid = obj.getUserId()
            dataObj.access_token = obj.getUserToken()
            dataObj.imei = MzJavascriptInterface.getIMEI()
            dataObj.sn = MzPrivateJavascriptInterface.getSN()
            for(var i in dataObj) {
                if(typeof dataObj[i] == 'object') {
                    dataObj[i] = JSON.stringify(dataObj[i])
                }
            }

            $.ajax({
                url: 'https://api-' + Activity.dataType + '.meizu.com/'
                    + Activity.dataType + 's' + url,
                dataType: 'jsonp',
                jsonpCallback: 'callbackMap["' + tag + '"]',
                data: dataObj
            });
        }
        else {
            EventJavascriptInterface.oauthRequest(tag, url, dataStr)
        }
    }
    

    obj.lottery = function(zippoArr) {
        if(isMzBrower) {
            var param = {
                uid: obj.getUserId(),
                access_token: obj.getUserToken(),
                imei: MzJavascriptInterface.getIMEI(),
                sn: MzPrivateJavascriptInterface.getSN(),
                zippo_ids: zippoArr.join(',')
            }
            $.ajax({
                url: 'https://api-' + Activity.dataType + '.meizu.com/'
                    + Activity.dataType + 's' + '/oauth/activity/zippo/do/' + window.activityId,
                dataType: 'jsonp',
                beforeSend: onLotteryStart,
                jsonpCallback: 'onLotteryStop',
                data: param
            });
        }
        else {
            EventJavascriptInterface.lottery(zippoArr)
        }
    }

    obj.gotoAppInfoPage = function(pkg) {
        if(isMzBrower) {
            location.href = 'https://game-res.meizu.com/resources/gameh5/html/app/details.html?' 
                          + 'packageName=' + pkg + '&'  
                          + 'channel_id=' + getUrlParam('channel_id') + '&'
                          + '_=' + Date.now()
        }
        else {
            EventJavascriptInterface.gotoAppInfoPage(pkg)
        }
    }

    obj.isAppInstalled = function(pkg) {
        return isMzBrower ? EventJavascriptInterface.isAppInstalled(pkg, 0) : EventJavascriptInterface.isAppInstalled(pkg)
    }

    obj.onAppShowInPage = function(pkgs) {
        return isMzBrower ? null : EventJavascriptInterface.onAppShowInPage(pkgs)
    }

    obj.launchApp = function(pkg) {
        return isMzBrower ? EventJavascriptInterface.installApp(1, pkg, 0) || true : EventJavascriptInterface.launchApp(pkg)
    }

    obj.onInstallButtonClick = function(id, pkg) {
        var c = getUrlParam('channel_id')
        return isMzBrower ? EventJavascriptInterface.installApp(1, (c ? pkg+'_channelId'+c : pkg), 0) : EventJavascriptInterface.onInstallButtonClick(Number(id), pkg)
    }
    obj.findThanks=()=> {
        var awards = [];
        for (var i = 0, len = window.AWARDS.length; i < len; i++) {
            var award = window.AWARDS[i];
            if (award.type == 'INTEGRATION') {
                awards.push({
                    name: award.name,
                    index: i,
                    icon: award.icon,
                    type: award.type
                });
            }
        }
        return awards;
    }
    obj.findAward=(id)=> {
      for (var i = 0, len = window.AWARDS.length; i < len; i++) {
        var award = window.AWARDS[i];
        if(award.id == id){
          return {
            name: award.name,
            index: i,
            icon: award.icon,
            type: award.type
          };
        }
      }
    }
    // obj.setAwardData=()=>{
    //   Array.prototype.slice.call(document.querySelectorAll('#award-data li')).map(function(dom) {
    //     window.AWARDS.push( {
    //       id: dom.getAttribute('data-id'),
    //       name: dom.getAttribute('data-name'),
    //       icon: dom.getAttribute('data-icon'),
    //       type: dom.getAttribute('data-type')
    //     })
    //   })
    // }
   export default {
      obj
   }