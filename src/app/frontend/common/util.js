import Vue from 'vue';
export default {
	locate(node) {
		if(node.$parent) {
			return this.locate(node.$parent) + '.' + node.$parent.$children.indexOf(node);
		} else {
			return '0';
		}
	},
    initConfig(storage, location) {
        Vue.set(storage, location, {});
        Vue.set(storage[location], 'propsData', {});
        Vue.set(storage[location], 'staticStyle', {});
    },
	formatDate(date, format) {
	    var o = {
	        'M+': date.getMonth() + 1,
	        'd+': date.getDate(),
	        'h+': date.getHours(),
	        'm+': date.getMinutes(),
	        's+': date.getSeconds(),
	        'q+': Math.floor((date.getMonth() + 3) / 3),
	        'S': date.getMilliseconds()
	    };

	    if (/(y+)/.test(format)) {
	        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	    }

	    for (var k in o) {
	        if (new RegExp("(" + k + ")").test(format)) {
	            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
	                : ("00" + o[k]).substr(("" + o[k]).length));
	        }
	    }
	    return format;
	}
}