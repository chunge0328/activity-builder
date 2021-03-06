import Vue from 'vue';
const fs = nodeRequire('fs');
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
	},
	//matrix(1, 0, 0, 1, -138, -5724)
	parseTrasfromValue(val) {
		if(val == 'none') {
			return [0, 0, 0, 0, 0, 0]
		} else {
			return val.split('(')[1].split(')')[0].split(',').map((str)=> Number(str.trim()));
		}
	},

	getLocalIps: function() {
		var os = nodeRequire('os');
		var interfaces = os.networkInterfaces();
		var addresses = [];
		for (var k in interfaces) {
			for (var k2 in interfaces[k]) {
				var address = interfaces[k][k2];
				if (address.family === 'IPv4' && !address.internal) {
					addresses.push(address.address);
				}
			}
		}
		return addresses;
	},

	hash: function(str) {
		var hash = 5381,
			i    = str.length;

		while(i) {
			hash = (hash * 33) ^ str.charCodeAt(--i);
		}

		/* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
		* integers. Since we want the results to be always positive, convert the
		* signed int to an unsigned by doing an unsigned bitshift. */
		return hash >>> 0;
	},

	loadMetaData: function(file) {
		let meta = {};
		if(fs.existsSync(file)) {
			try {
				meta = JSON.parse(fs.readFileSync(file, 'utf8'));
			} catch(err) {
			}
		}
		return meta;
	},

	saveMetaData: function(file, meta) {
		try {
			fs.writeFileSync(file, JSON.stringify(meta), 'utf8');
		} catch(err) {}
	}
}