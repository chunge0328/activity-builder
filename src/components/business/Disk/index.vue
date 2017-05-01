<style lange="less">
	.disk { 
		height: auto;
		background: black;
		color: white;
	}
</style>
<template>
	<div class="disk">
		<p>转盘 {{ content }}</p>
		<MZButton/>
	</div>
</template>
<script>
	import { urlValidator } from '../../common/validators';
	import MZButton from './MZButton.vue';
	export default {
		name: 'Disk',
		props: {
			content: {
				type: String,
				default: '取消',
				validator: urlValidator,
				$rule: {
					name: '取消按钮文本',
					placeholder: 'http://|https://',
					$error: '请输入URL'
				}
			},
			awardImgs: {
				type: Array,
				default: ()=> [],
				$rule: {
					name: '奖品图片',
					clazz: 'ImageArray'
				}
			}
		},
		components: {
			MZButton
		}
	}
</script>