<style lang="less">
    .text {
        word-break: break-all;
        word-wrap: break-word;
        background-color: #e5e5e5;
    }
    .text.single {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
<template>
    <div class="text" v-bind:class="{single: single}"><span>{{ content }}</span></div>
</template>
<script>
    export default {
        name: 'XText',
        props: {
			content: {
				type: String,
                default: '文本内容',
                $rule: { name: '内容' }
			},
            single: {
                type: Boolean,
                default: false,
                $rule: { name: '单行' }
            }
		}
    }
</script>