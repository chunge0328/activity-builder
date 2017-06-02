import EventEmitter from 'eventemitter3';
import Enum from '../common/enum';
import Vue from 'vue';
// import Promise from 'vue-resource/src/promise';
// import Http from 'vue-resource/src/http';
import util from '../common/util';

let Http = Vue.http;
let Promise = Vue.Promise;
let global = typeof window != 'undefined' ? window : (function() {return this})();
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

if(!global.MzPrivateJavascriptInterface) {
    global.MzPrivateJavascriptInterface = {
        getSN: function() { return '100000000' }
    }
}

global.notifyDownProgress = function(pkg, btnText, textColor, bgColor, clickEnable, isInstalled) {
    emitter.emit(Enum.INTERFACE_EVENT.APP_PROGRESS, pkg, btnText, textColor, bgColor, clickEnable, isInstalled);
}

global.onLotteryStart = function() {
    emitter.emit(Enum.INTERFACE_EVENT.START_LOTTERY);
}

global.onLotteryStop = function(result) {
    emitter.emit(Enum.INTERFACE_EVENT.STOP_LOTTERY, result);
    let promise = global.__PROMISE_MAP__[_lotteryTag];
    if(promise) {
        try {
            promise.resolve(JSON.parse(result));
        } catch(err) {
            promise.reject(err);
        }
        delete global.__PROMISE_MAP__[_lotteryTag];
    }
}

global.onWindowHide = function() {
    emitter.emit(Enum.INTERFACE_EVENT.PAGE_HIDE);
}

global.onPaySucess = function(appId, pkgName) {
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
    let promise = global.__PROMISE_MAP__[tag];
    if(promise) {
        promise.reject(errorCode);
        delete global.__PROMISE_MAP__[tag];
    }
}

global.onOauthResponse = function(tag, responseJson) {
    emitter.emit(Enum.INTERFACE_EVENT.OAUTH_RESPONSE, tag, responseJson);
    let promise = global.__PROMISE_MAP__[tag];
    if(promise) {
        try {
            promise.resolve(JSON.parse(responseJson));
        } catch(err) {
            promise.reject(err);
        }
        delete global.__PROMISE_MAP__[tag];
    }
}

global.onOauthError = function(tag, errorMsg) {
    emitter.emit(Enum.INTERFACE_EVENT.OAUTH_ERROR, tag, errorMsg);
    let promise = global.__PROMISE_MAP__[tag];
    if(promise) {
        promise.reject(errorMsg);
        delete global.__PROMISE_MAP__[tag];
    }
}

global.Activity = {
    notifyLotteryTimes() {
        emitter.emit(Enum.INTERFACE_EVENT.UPDATE_TIMES);
    }
}

global.__PROMISE_MAP__ = {};

const Interface = {};

let _isMzBrower = global.MzJavascriptInterface ? true : false;

let _lotteryTag = '';

Interface.login = function() {
    if(_isMzBrower) {
        localStorage['mz_game_access_token'] = ''
        location.href = 'https://login.flyme.cn/authorize/cert.html?'
                        + 'appuri=' + location.protocol + '//' +  location.host + location.pathname 
                        +  (util.getUrlParam('channel_id') ? '?channel_id='+util.getUrlParam('channel_id') : '')
                        + '&service=uc&scope=trust&clientId=pkj6DgyJooci9hkcijtwfnfctbtiqcdh&clientSecret=ptdje0meulhrvEsb8webmjNziztszwsc'
                        + '&imei=' + MzJavascriptInterface.getIMEI()
                        + '&sn=' + MzPrivateJavascriptInterface.getSN()
    } else {
        EventJavascriptInterface.login()
    }
}

Interface.getUserInfoBy = function() {
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

Interface.getUserId = function() {
    return isMzBrower ? obj.getUserInfoBy('uid')() : EventJavascriptInterface.getUserId() 
}

Interface.getUserToken = Interface.getUserInfoBy('access_token');

Interface.oauthRequest = function(url, dataStr) {
    let tag = util.genId()
    if(_isMzBrower) {
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
        return Http.jsonp(`https://api-game.meizu.com/games${url}`, {
            jsonp: 'jsonpCallback',
            //jsonpCallback: 'callbackMap["' + tag + '"]',
            body: dataObj
        });
        //todo
        // $.ajax({
        //     url: 'https://api-' + Activity.dataType + '.meizu.com/'
        //         + Activity.dataType + 's' + url,
        //     dataType: 'jsonp',
        //     jsonpCallback: 'callbackMap["' + tag + '"]',
        //     data: dataObj
        // });
    } else {
        global.__PROMISE_MAP__[tag] = new Promise()
        EventJavascriptInterface.oauthRequest(tag, url, dataStr)
        return global.__PROMISE_MAP__[tag]
    } 
}

Interface.lottery = function(zippoArr) {
    if(_isMzBrower) {
        var param = {
            uid: obj.getUserId(),
            access_token: obj.getUserToken(),
            imei: MzJavascriptInterface.getIMEI(),
            sn: MzPrivateJavascriptInterface.getSN(),
            zippo_ids: zippoArr.join(',')
        }
        return Http.jsonp(`'https://api-game.meizu.com/games/oauth/activity/zippo/do/${global.__ACTIVITY_ID__}`, {
            before: global.onLotteryStart,
            jsonp: 'jsonpCallback',
            //jsonpCallback: 'onLotteryStop',
            body: param
        })
        // $.ajax({
        //     url: 'https://api-' + Activity.dataType + '.meizu.com/'
        //         + Activity.dataType + 's' + '/oauth/activity/zippo/do/' + Activity.activityId,
        //     dataType: 'jsonp',
        //     beforeSend: onLotteryStart,
        //     jsonpCallback: 'onLotteryStop',
        //     data: param
        // });
    } else {
        _lotteryTag = util.getId()
        global.__PROMISE_MAP__[_lotteryTag] = new Promise()
        EventJavascriptInterface.lottery(zippoArr)
        return global.__PROMISE_MAP__[_lotteryTag]
    }
}

Interface.gotoAppInfoPage = function() {
    if(isMzBrower) {
        location.href = 'https://game-res.meizu.com/resources/gameh5/html/app/details.html?' 
                        + 'packageName=' + pkg + '&'  
                        + 'channel_id=' + util.getUrlParam('channel_id') + '&'
                        + '_=' + Date.now()
    }
    else {
        EventJavascriptInterface.gotoAppInfoPage(pkg)
    }
}

Interface.isAppInstalled = function(pkg) {
    return isMzBrower ? EventJavascriptInterface.isAppInstalled(pkg, 0) : EventJavascriptInterface.isAppInstalled(pkg) 
}

Interface.onAppShowInPage = function() {
    return isMzBrower ? null : EventJavascriptInterface.onAppShowInPage(pkgs) 
}

Interface.launchApp = function(pkg) {
    return isMzBrower ? EventJavascriptInterface.installApp(1, pkg, 0) || true : EventJavascriptInterface.launchApp(pkg) 
}

Interface.onInstallButtonClick = function(id, pkg) {
    var c = util.getUrlParam('channel_id')
    return isMzBrower ? EventJavascriptInterface.installApp(1, (c ? pkg + '_channelId' + c : pkg), 0) : EventJavascriptInterface.onInstallButtonClick(Number(id), pkg) 
}

if(typeof window != 'undefined') {
    if(process.env.NODE_ENV == 'production') {
        if(_isMzBrower) {
            var access_token_url = util.getUrlParam('access_token') && JSON.parse(decodeURIComponent(util.getUrlParam('access_token')))
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
                    Interface.login()
                }
            }
        }
    }
}


export default Interface;