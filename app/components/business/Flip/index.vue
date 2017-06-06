<style lange="less">
	.flip { 
		height: 0.555556rem;
		background: green;
	}
</style>
<template>
	<div class="flip">翻牌</div>
</template>
<script>
	export default {
		props: {
			cancelBtnTxt: {
				type: String,
				default: '取消',
				$rule: { name: '取消按钮文本DD' }
			}
		},
		name: 'Flip'
	}
</script>