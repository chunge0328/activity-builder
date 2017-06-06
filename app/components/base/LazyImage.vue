<style lang="less">
	@import "../style/variables.less";
	.lazy-img {
		background-color: #e5e5e5;
	}
</style>
<template>
	<img ref="lazyImg" class="lazy-img">
</template>
<script>
	import Vue from 'vue';
	import LazyImageLoader from './LazyImageLoader';
	export default {
		name: 'LazyImage',
		props: {
			src: {
				type: String
			}
		},
		data: function() {
			return {}
		},
		mounted: function() {
			this.$refs.lazyImg.dataset['src'] = this.src;
			LazyImageLoader.detect(this.$refs.lazyImg);
		}
	}
</script>