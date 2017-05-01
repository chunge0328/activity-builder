<style lang="less">
	@import "../style/variables.less";
	@import "../style/mixin.less";

	.popup-list {
		position: absolute;
		top: 0;
		left: 0;
		background: #fff;
		box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
	}

	.popup-item {
		padding: 0 0.444444rem;
	}

	.popup-item-inner {
		width: 4.555556rem;
		padding: .5rem 0.222222rem;
		.font-dpr(16px);
		font-weight: 500;
	}
</style>
<template>
	<!-- <div class="popup-container" v-bind:style="{'z-index': zIndex}" ref="container" @click="handleOuterClick"> -->
		<transition @name="transition" @after-leave="afterLeave" type="transition" appear>
			<div class="popup-list" v-show="open" v-bind:style="{'z-index': zIndex, top: top, left: left}" @click.stop>
				<template v-for="(data, $index) in datas">
					<div class="popup-item">
						<div class="popup-item-inner" v-bind:class="{hr: $index + 1 != datas.length }" @click="onSelect($index)">{{ data.text }}</div>
					</div>
				</template>
			</div>
		</transition>
	<!-- </div> -->
</template>
<script>
	import Vue from 'vue';
	import HistoryTracker from './HistoryTracker';
	import OverlayManager from './OverlayManager';
	import util from 'common/util';
	export default {
		name: 'Popup',
		props: {
			onOuterClickDismiss: {
				type: Boolean,
				default: true
			},
			onDismissDestroy: {
				type: Boolean,
				default: true
			},
			transition: {
				type: String,
				default: 'slide'
			},
			bindingEl: {
			},
			datas: {
				type: Array,
				default: []
			},
			onHandleSelect: {
				type: Function
			},
			destroy: {
				type: Boolean,
				default: true
			}
		},
		data: function() {
			return {
				open: true,
				zIndex: util.genZIndex()
			}
		},
		computed: {
			rect: function() {
				return this.bindingEl.getBoundingClientRect();
			},
			top: function() {
				return this.rect.bottom + window.flexible.rem2px(0.5) + 'px';
			},
			left: function() {
				var marginRight = Number(window.getComputedStyle(this.bindingEl).marginRight.replace('px', ''));
				return this.rect.right - window.flexible.rem2px(5.453704) + marginRight + 'px';
			}
		},
		beforeMount: function() {
			OverlayManager.requestOverlay(this, {
				zIndex: this.zIndex - 1,
				backgroundColor: 'rgb(255, 255, 255)', //hack scroll
				opacity: 0.01,
				onOverlayClick: ()=> this.handleOuterClick()
			});
		},
		mounted: function() {
			// this.$refs.container.addEventListener('touchstart', function(event) {
			// 	event.stopPropagation();
			// })	
			HistoryTracker.trace(this, 'dismiss');
		}, 
		beforeDestroy: function() {
			OverlayManager.closeOverlay(this);
		},
		destroyed: function() {
			this.$el.remove();
		},
		methods: {
			handleOuterClick: function($event) {
				if(this.onOuterClickDismiss) {
					this.dismiss(this.onDismissDestroy);
				}
			},
			dismiss: function() {
				this.open = false;
			},
			// afeterEnter: function() {				
				
			// },
			afterLeave: function() {
				if(this.destroy) {
					this.$destroy();
				}
			},
			onSelect: function($index) {
				this.onHandleSelect && this.onHandleSelect(this.datas[$index]);
			}
		}
	}
</script>