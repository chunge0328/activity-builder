<style lang="less">
	@import "../style/import.less";
	.scaffold {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 11;
		width: 100%;
		height: 100%;
		padding-top: 1.222222rem;
		background: #fff;
		overflow-y: auto;
	}

	.scaffold .header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 11;
	}

	.scaffold .loading, .scaffold .blank, .scaffold .error {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background: #fff;
		font-size: 0.444444rem;
		font-weight: 500;
		text-align: center;
	}

	.loading-inner {
		font-size: 0.388889rem;
		.loading-spinner {
			width: 0.666666rem;
			height: 0.666666rem;
			margin-bottom: 0.25rem;
		}
	}

	.scaffold .blank {
		align-items: initial;
		
		.blank-inner {
			padding-top: 3.5rem;
		}
	}

	.blank-inner img {
		width: 4.833333rem;
		height: 4.833333rem;
	}
	
</style>
<template>
	<div class="scaffold" ref="scaffold">
		<div class="header">
			<slot name="header"></slot>
		</div>
		<slot v-if="status == Enum.PAGE_STATUS.READY"></slot>
		<div class="loading" v-else-if="status == Enum.PAGE_STATUS.LOADING">
			<div class="loading-inner">
				<img class="loading-spinner" src="~images/loading-spin.svg">
				<p>正在加载..</p>
			</div>
		</div>
		<div class="blank" v-else-if="status == Enum.PAGE_STATUS.BLANK">
			<div class="blank-inner">
				<img src="~images/blank.png">
				<p>暂无相关内容</p>
			</div>
		</div>
		<div class="error" v-else-if="status == Enum.PAGE_STATUS.ERROR">出错了，请刷新重试</div>
	</div>
</template>
<script>
	import Enum from '../../store/enum';
	export default {
		name: 'Scaffold',
		props: {
			status: {
				type: String,
				default: Enum.PAGE_STATUS.LOADING
			}
		},
		data: function() {
			return {
				Enum: Enum,
				scrollTop: 0
			}
		},
		methods: {
			saveScrollPosition: function() {
				return this.scrollTop = this.$refs.scaffold.scrollTop;
			},
			restoreScrollPosition: function(position) {
				this.scrollTop = position || this.scrollTop;
				this.$refs.scaffold.scrollTop = this.scrollTop;
			}
		}
	}
</script>