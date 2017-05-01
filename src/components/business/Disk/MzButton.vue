<style lange="less">
	.btn {
		display: inline-block;
		border: 1px solid #ececec;
		padding: 5px 10px;
		font-size: 0.444444rem;
	}
</style>
<template>
	<button class="btn">{{ txt }}</div>
</template>
<script>
	export default {
		name: 'MZButton',
		props: {
			txt: {
				type: String,
				default: '按钮',
				$rule: { name: '按钮文本' }
			}
		}
	}
</script>