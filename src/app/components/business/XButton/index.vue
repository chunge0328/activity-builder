<style lang="less">
    @import '../../style/mixin';
	.xbtn {
		display: inline-block;
		padding: 5px 10px;
		font-size: 0.444444rem;
        .one-line();
	}
    .xbtn--round {
        border-radius: 50%;
    }
    .xbtn--oval {
        border-radius: 999px;
    }
    .xbtn--bold {
        font-weight: 500;
    }
</style>
<template>
	<button class="xbtn" v-bind:class="{'xbtn--round': shape == 'ROUND', 'xbtn--oval': shape == 'OVAL', 'xbtn--bold': bold}"
        v-bind:style="{'background-color': bgColor, 'color': fontColor, 'font-size': fontSize}">{{ txt }}</div>
</template>
<script>
	export default {
		name: 'XButton',
		props: {
			txt: {
				type: String,
				default: '按钮',
				$rule: { 
                    name: '按钮文本' 
                }
			},
            shape: {
                type: String,
                default: 'SQUARE',
                $rule: {
                    name: '形状',
                    options: [
                        {
                            value: 'SQUARE',
                            label: '方块'
                        }, {
                            value: 'ROUND',
                            label: '圆形'
                        }, {
                            value: 'OVAL',
                            label: '腰圆'
                        }
                    ],
                    clazz: 'Select'
                }
            },
            bgColor: {
                type: String,
                default: '#ececec',
                $rule: {
                    name: '背景颜色',
                    clazz: 'Color'
                }
            },
            fontColor: {
                type: String,
                default: '#000000',
                $rule: {
                    name: '字体颜色',
                    clazz: 'Color'
                }
            },
            bold: {
                type: Boolean,
                default: false,
                $rule: {
                    name: '加粗'
                }
            },
            bgImg: {
                type: String,
                default: '',
                $rule: {
                    name: '背景图片',
                    clazz: 'Image'
                }
            },
            fontSize: {
                type: String,
                $rule: {
                    name: '字体大小',
                    clazz: 'FontSize'
                }
            },
            date: {
                type: String,
                $rule: {
                    name: '日期',
                    clazz: 'Date'
                }
            },
            dateTime: {
                type: String,
                $rule: {
                    name: '时间',
                    clazz: 'DateTime'
                }
            }
		}
	}
</script>