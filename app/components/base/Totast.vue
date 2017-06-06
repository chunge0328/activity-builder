<style lang="less">
	@import "../style/variables.less";
	.toast {
		position: fixed;
		left: 50%;
		bottom: 3.333333rem;
		z-index: @Z-OVERLAY;
		background-color: rgba(51, 51, 51, .85);
		transform: translate3d(-50%, 0, 0);
		border-radius: 2px;
		color: #fff;
		font-size: 0.388889rem;
		font-weight: 500;
		padding: 0.25rem 1.111111rem;
		white-space: nowrap;
	}
</style>
<template>
	<transition name="fade" @after-leave="afterLeave" appear>
		<div class="toast" v-show="open">{{ msg }}</div>
	</transition>
</template>
<script>
	import Vue from 'vue';
	export default {
		name: 'Toast',
		props: {
			msg: {
				type: String,
				default: 'msg'
			},
			duration: {
				type: Number,
				default: 800
			}
		},
		data: function() {
			return {
				open: true
			}
		},
		mounted: function() {
			let context = this;
			setTimeout(function() {
				context.open = false;
			}, this.duration);
		},
		destroyed: function() {
			this.$el.remove();
		},
		methods: {
			afterLeave: function() {
				this.$destroy();
			}
		}
	}
</script>