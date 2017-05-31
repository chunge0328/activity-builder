import EventEmitter from 'eventemitter3';
import Enum from '../common/enum';
(function(global) {
    let _uid = 0;
    let _callbacks = {};
    let emitter = new EventEmitter();

    if(!global.EventJavascriptInterface) {
        var noop = function() {};
        global.EventJavascriptInterface = {
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

    global.notifyDownProgress = function(pkg, btnText, textColor, bgColor, clickEnable, isInstalled) {
        emitter.emit(Enum.INTERFACE_EVENT.APP_PROGRESS, pkg, btnText, textColor, bgColor, clickEnable, isInstalled);
    }

    global.onLotteryStart = function() {
        emitter.emit(Enum.INTERFACE_EVENT.START_LOTTERY);
    }

    global.onLotteryStop = function(result) {
        emitter.emit(Enum.INTERFACE_EVENT.STOP_LOTTERY);
    }

    global.onWindowHide = function() {
        emitter.emit(Enum.INTERFACE_EVENT.PAGE_HIDE);
    }

    global.onPaySucess = function(appId,pkgName) {
        emitter.emit(Enum.INTERFACE_EVENT.PAY_SUCCESS, appId, pkgName);
    }

    global.onPayError = function onPayError(appId, pkgName, errorCode, errorMsg) {
        emitter.emit(Enum.INTERFACE_EVENT.PAY_ERROR, appId, pkgName, errorCode, errorMsg);
    }

    global.onTokenSuccess = function(tag, isFromLogin) {
        emitter.emit(Enum.INTERFACE_EVENT.TOKEN_SUCCESS, tag, isFromLogin);
    }

    global.onTokenError = function(tag, errorCode) {
        emitter.emit(Enum.INTERFACE_EVENT.TOKEN_ERROR, tag, errorCode);
    }

    global.onOauthResponse = function(tag, responseJson) {
        emitter.emit(Enum.INTERFACE_EVENT.OAUTH_RESPONSE, tag, responseJson);
    }

    global.onOauthError = function(tag, errorMsg) {
        emitter.emit(Enum.INTERFACE_EVENT.OAUTH_ERROR, tag, errorMsg);
    }

    const interface = {};

    let _getUrlParam = function (key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    let _isMzBrower = window.MzJavascriptInterface ? true : false;

    if(_isMzBrower) {
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
                interface.login()
            }
        }
    }

    interface.login = function() {
        if(_isMzBrower) {
            localStorage['mz_game_access_token'] = ''
            location.href = 'https://login.flyme.cn/authorize/cert.html?'
                          + 'appuri=' + location.protocol + '//' +  location.host + location.pathname 
                          +  (getUrlParam('channel_id') ? '?channel_id='+getUrlParam('channel_id') : '')
                          + '&service=uc&scope=trust&clientId=pkj6DgyJooci9hkcijtwfnfctbtiqcdh&clientSecret=ptdje0meulhrvEsb8webmjNziztszwsc'
                          + '&imei=' + MzJavascriptInterface.getIMEI()
                          + '&sn=' + MzPrivateJavascriptInterface.getSN()
        } else {
            EventJavascriptInterface.login()
        }
    }

    interface.getUserInfoBy = function() {
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
})(window);