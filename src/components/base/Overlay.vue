<style lang="less">
	@import "../style/variables.less";
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: @Z-OVERLAY;
		background-color: rgb(0, 0, 0);
		transform: translate3d(0,0,0);
		opacity: 0.04;
	}
</style>
<template>
	<!--背景颜色不要使用RGBA，使用opacity可以提高性能，另外也可以缓存overlay, 设置translate3d(0,-100%,0)隐藏-->
	<div class="overlay" v-bind:style="{'z-index': zIndex, 'background-color': backgroundColor, 'opacity': opacity}" @click.stop="handleClick"></div>
</template>
<script>
	import Vue from 'vue';
	export default {
		name: 'Overlay',
		data: function() {
			return {
				onOverlayClick: null,
				zIndex: 99,
				backgroundColor: '',
				opacity: 0.01
			}
		},
		destroyed: function() {
			this.$el.remove();
		},
		methods: {
			handleClick: function() {
				this.onOverlayClick && this.onOverlayClick();
			},
			change: function(opts) {
				this.onOverlayClick = opts.onOverlayClick;
				this.zIndex = opts.zIndex;
				this.backgroundColor = opts.backgroundColor;
				this.opacity = opts.opacity;
			},
			close: function() {
				this.$destroy();
			}
		}
	}
</script>