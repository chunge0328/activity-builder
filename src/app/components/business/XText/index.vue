<style lang="less">
    .ql-editor {
        height: auto;
        padding: 0;
        background-color: #e5e5e5;
        min-height: 10px;
    }
    /*.text {
        word-break: break-all;
        word-wrap: break-word;
        background-color: #e5e5e5;
        min-height: 10px;
    }
    .text.single {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    */
</style>
<template>
    <div class="ql-editor" v-bind:style="{'background-color': bgColor}" v-html="ritchText"></div>
</template>
<script>
    import Enum from '../../common/enum';
    export default {
        name: 'XText',
        props: {
			// content: {
			// 	type: String,
            //     default: '文本内容',
            //     $rule: { name: '内容' }
			// },
            // single: {
            //     type: Boolean,
            //     default: false,
            //     $rule: { name: '单行' }
            // },
            bgColor: {
                type: String,
                default: '#ececec',
                $rule: {
                    name: '背景颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            ritchText: {
                type: String,
                default: '请输入文本',
                $rule: {
                    name: '富文本',
                    clazz: Enum.CLAZZ.RITCH_TEXT
                }
            }
		}
    }
</script>