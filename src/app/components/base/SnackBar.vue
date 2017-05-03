<style lang="less" scoped>
	@import "../style/common";
	.snackbar {
		position: fixed;
		z-index: @Z-COMP;
		top: 0;
		left: 0;
		width: 100%;
		height: 1.0rem;
		padding: 0 0.444444rem;
		line-height: 1.0rem;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		box-sizing: border-box;
	}
	.snackbar-inner {
		height: 100%;
	}
	.slide-down-enter-active, .slide-down-leave-active {
		transition: all .3s ease;
	}
	.slide-down-enter, .slide-down-leave-active {
		transform: translate3d(0, -100%, 0);
	}
</style>
<template>
	<transition name="slide-down" v-on:after-leave="afterLeave" appear>
		<div class="snackbar" v-show="show" @click="handleClick" :style="{backgroundColor: bgColor,color: fontColor}">
			<component v-if="!!content.cid" v-bind:is="content"></component>
			<div v-else class="snackbar-inner">{{content}}</div>
		</div>
	</transition>
</template>
<script>
	import Vue from 'vue';
	export default {
		name: 'SnackBar',
		props: {
			content: {
				default: '内容'
			},
			transition: {
				type: Boolean,
				default: true
			},
			duration: {
				type: Number,
				default: 3000
			},
			sticked: {
				type: Boolean,
				default: false
			},
			onClick: {
				type: Function
			},
			bgColor: {
				type: String,
				default: '#fff'
			},
			fontColor: {
				type: String,
				default: '#000'
			}
		},
		data: function() {
			return  {
				show: true
			}
		},
		mounted: function() {
			// if(this.transition) {
			// 	var self = this;
			// 	Vue.nextTick(function() {
			// 		self.show = true;
			// 	});
			// }
		},
		destroyed: function() {

			this.$el.remove();	
		},
		methods: {
			handleClick: function() {
				if(this.onClick) {
					this.onClick();
				} else {
					this.hide();
				}
			},
			hide: function() {
				this.show = false;
			},
			afterLeave: function() {
				this.$destroy();
			}
		},
	}
</script>