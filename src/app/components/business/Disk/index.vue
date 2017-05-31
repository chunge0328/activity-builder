<style lange="less">
	.disk { 
		height: auto;
		background: black;
		color: white;
	}
</style>
<template>
	<div class="disk">
		<p>转盘{{ content }}</p>
		<XButton/>
	</div>
</template>
<script>
	import { urlValidator } from '../../common/validators';
	import Enum from '../../common/enum';
	import XButton from '../XButton/index.vue';
	export default {
		name: 'Disk',
		props: {
			content: {
				type: String,
				default: '取消',
				$rule: {
					name: '取消按钮文本',
					placeholder: 'http://|https://',
					$error: '请输入URL'
				}
			},
			name: {
				type: String,
				default: '----',
				$rule: {
					name: '名称',
					placeholder: '名称'
				}
			},
			awardImgs: {
				type: Array,
				default: ()=> [],
				$rule: {
					name: '奖品图片',
					clazz: Enum.CLAZZ.IMAGE_ARRAY
				}
			}
		},
		components: {
			XButton
		}
	}
</script>