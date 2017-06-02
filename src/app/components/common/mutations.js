import VueResource from 'vue-resource'
import Vue from 'vue'

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
// function requestJsonp(context,url,mutation,params) {
//    context.$store.commit('tryAbortRequest',url);
//    return context.$http.jsonp(url,params).then((response)=>{
//       if(response.status == 200 && response.data.code == 200){

//       }
//    })
// }
export const state = {
  myaward: {},
  winnerList: {},
  addressInfo: {},
  pendingRequests: []
};
export const mutations = {
	// showDialog(state, context) {
	// 	DialogBuilder.of(context).confirm('AAA', 'BBB');
	// }
  setMyAward(state,myaward) {
    state.myaward = myaward
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
  setAddressInfo(state,addressinfo) {
     state.addressInfo = addressinfo
  }
};
export const actions = {
  fetchMyAward({commit},context) {
    //return request(context,'','setMyAward')
  },
  fetchWinnerList({commit},context) {
    //return request(context,'','setMyAward')
  },
  fetchAddressInfo({commit},content) {

  }
}