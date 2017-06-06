const lazyImageMap = {};
var lazyImageArray = [];
const TIME_OUT = 64;

export default class LazyImageLoader {

	static inited = false;

	static _onLoadHandler() {
		lazyImageMap[this.src] = true;
		this.onload = null;
	}

	static _onErrorHandler() {
		this.onerror = null;
		this.onload = null;
	}

	static detect(img) {
		if(!img) return;
		if(lazyImageMap[img.dataset['src']]) {
			img.src = img.dataset['src'];
			return;
		}
		lazyImageArray.push(img);
		if(!LazyImageLoader.inited) {
			function check() {
				let winHeight = window.innerHeight;
				let winWidth = window.innerWidth;
				lazyImageArray = lazyImageArray.filter(function(img) {
					if(!img.src) return true;
				});
				lazyImageArray.forEach(function(img) {
					if(img.src) return;
					let rect = img.getBoundingClientRect();
					let {top, right, left, bottom} = rect;
					if(((top > 0 && top < winHeight) || (bottom > 0 && bottom <= winHeight)) 
						&& ((left > 0 && left <= winWidth) || (right > 0 && right <= winWidth))) {
						img.onload = LazyImageLoader._onLoadHandler;
						img.onerror = LazyImageLoader._onErrorHandler;
						img.src = img.dataset['src'];
						delete img.dataset['src'];
					}
				});
				setTimeout(check, TIME_OUT);
			}
			setTimeout(check, TIME_OUT);
			LazyImageLoader.inited = true;
		}
	}
}