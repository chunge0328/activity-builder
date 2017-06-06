import VueResource from 'vue-resource'
import Vue from 'vue'
import Ninterface from './nativeinterface.js';
import DialogBuilder from '../base/DialogBuilder';

function request(context, url, mutation) {
  context.$store.commit('tryAbortRequest', url);
  return context.$http.get(url).then(function(response) {
    if(response.status == 200 && response.data.code == 200) {
      if(typeof mutation == 'string') {
        context.$store.commit(mutation, response.data.value);
      } else {
        mutation(response.data.value);
      }
      return Vue.Promise.resolve(response);
    } else {
      //defaultErrorHandler(context, response);
      return Vue.Promise.reject(response);
    }
  }).catch(function(response) {
    //defaultErrorHandler(context, response);
    return Vue.Promise.reject(response);
  });
}
function oauthRequest(url,context,mutation) {
  //console.log(context);
  context.$store.commit('tryAbortRequest', url);
  return Ninterface.oauthRequest(url,context.params).then((response)=> {
      console.log('=====>>>>333',response);
      if(response.status == 200 && response.data.code == 200) {
        if(typeof mutation == 'string') {
          context.$store.commit(mutation, response.data.value);
        } else {
          mutation(response.data.value);
        }
        return Vue.Promise.resolve(response);
      } else {
      //defaultErrorHandler(context, response);
      return Vue.Promise.reject(response);
    }
  }).catch((response)=> {
    console.log('=====>>>>444',response);
    //return Vue.Promise.reject(response);
    DialogBuilder.of(context).alert('出错了～刷新试试！');
  });
}
export const state = {
  myAward: {},
  winnerList: {},
  addressInfo: {},
  pendingRequests: []
};
export const mutations = {
  // showDialog(state, context) {
  //  DialogBuilder.of(context).confirm('AAA', 'BBB');
  // }
  setMyAward(state,myaward) {
    state.myAward = myaward
  },
  setWinnerList(state,winnerlist) {
    state.winnerList = winnerlist
  },
  tryAbortRequest(state, url) {
    var requests = state.pendingRequests;
    var len = requests.length;
    while(len--) {
      if(requests[len].url.indexOf(url) != -1) {
        requests[len].abort();
        requests.splice(len, 1);
      }
    }
  },
  addPendingRequest(state, request) {
    state.pendingRequests.push(request);
  },
  removePendingRequest(state, request) {
    var pos = state.pendingRequests.indexOf(request);
    if(pos != -1) {
      state.pendingRequests.splice(pos, 1);
    }
  },
  setAddressInfo(state,addressinfo) {
     state.addressInfo = addressinfo
  }
};
export const actions = {
  fetchMyAward({commit},context) {
    return oauthRequest('/public/activity/award/user/'+global.__ACTIVITY_ID__,context,'setMyAward'); 
  },
  fetchWinnerList({commit},context) {
    return oauthRequest('/public/activity/award/latest/'+global.__ACTIVITY_ID__,context,'setWinnerList'); 
  },
  fetchAddressInfo({commit},content) {

  },
  addressInfo({commit},content) {
     
  }
}