<style lang="less">
	@import "../style/import";
	.dialog-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: @Z-MODAL;
		background: rgba(0, 0, 0, 0.4);
	}

	.dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 8.666667rem;
		background: @defaultBgColor;
		border: 1px solid #ececec;
		padding: 0.333333rem;
		border-radius: 0.111111rem;
		transform: translate3d(-50%, -50%, 0);
		/*box-shadow: 0 0 0.277778rem rgba(0, 0, 0, 0.3);*/

		.cancel-btn, .confirm-btn {
			border: 0;
			height: 1.0rem;
			min-width: 2.444444rem;
			padding: 0 0.444444rem;
			background: @defaultBgColor;
			outline: none;
			/*font-size: 0.444444rem;*/
			.font-dpr(16px);
			font-weight: 500;
			line-height: 1.0rem;
			border-radius: 2px;
		}

		.cancel-btn:active, .confirm-btn:active {
			background: darken(@defaultBgColor, 10%);
		}

		.cancel-btn {
			color: @depressColor;
		}

		.confirm-btn {
			color: @primaryColor;
		}
	}

	.dialog-header {
		padding: 0.25rem 0;
		text-align: center;
		/*font-size: 0.444444rem;*/
		.font-dpr(16px);
		font-weight: 500;
		line-height: 0.592593rem;
	}

	.dialog-body {
		padding: 0.277778rem;
		text-align: center;
	}
	
	.dialog-footer {
		text-align: center;
	}
</style>
<template>
	<!-- <div class="dialog-container" @click="handleOuterClick"> -->
		<transition :name="transition" @after-leave="afterLeave" appear>
			<div class="dialog" v-show="open" @click.stop v-bind:style="{'z-index': zIndex}">
				<div class="dialog-header">
					<component v-if="!!title.cid" v-bind:is="title"></component>
					<slot v-else name="title">{{title}}</slot>
				</div>
				<div class="dialog-body" v-if="!!content">
					<component v-if="!!content.cid" v-bind:is="content"></component>
					<slot v-else name="content">{{content}}</slot>
				</div>
				<div class="dialog-footer">
					<button class="cancel-btn" v-show="mode == 'confirm'" @click="handleCancel">{{cancelBtnTxt}}</button>
					<button class="confirm-btn" @click="handleConfirm">{{confirmBtnTxt}}</button>
				</div>
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
		name: 'Dialog',
		props: {
			mode: {
				type: String,
				default: 'confirm'
			},
			onOuterClickDismiss: {
				type: Boolean,
				default: true
			},
			onDismissDestroy: {
				type: Boolean,
				default: true
			},
			cancelBtnTxt: {
				type: String,
				default: '取消'
			},
			confirmBtnTxt: {
				type: String,
				default: '确定'
			},
			onCancel: {
				type: Function,
			},
			onConfirm: {
				type: Function,
			},
			title: {},
			content: {},
			transition: {
				type: String,
				default: 'zoom'
			}
		},
		data: function() {
			return {
				open: true,
				destroy: true,
				zIndex: util.genZIndex()
			}
		},
		beforeMount: function() {
			OverlayManager.requestOverlay(this, {
				zIndex: this.zIndex - 1,
				backgroundColor: 'rgb(0, 0, 0)',
				opacity: 0.4,
				onOverlayClick: ()=> this.handleOuterClick()
			});
		},
		mounted: function() {
			HistoryTracker.trace(this, 'dismiss');
		},
		beforeDestroy: function() {
			OverlayManager.closeOverlay(this);
		},
		destroyed: function() {
			this.$el.remove();
		},
		methods: {
			handleCancel: function(evt) {
				if(this.onCancel) {
					this.onCancel(evt);
				} else {
					this.dismiss(this.onDismissDestroy);
				}
			},
			handleConfirm: function(evt) {
				if(this.onConfirm) {
					this.onConfirm(evt);
				} else {
					this.dismiss(this.onDismissDestroy);
				}
			},
			handleOuterClick: function() {
				if(this.onOuterClickDismiss) {
					this.dismiss(this.onDismissDestroy);
				}
			},
			dismiss: function() {
				this.open = false;
			},
			afterLeave: function() {
				if(this.destroy) {
					this.$destroy();
				}
			}
		}
	}
</script>