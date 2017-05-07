<style lang="less">
    @import '../../style/mixin';
	.xbtn {
		display: inline-block;
		padding: 5px 10px;
		font-size: 0.444444rem;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        .one-line();
        width: auto;
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
        v-bind:style="{'width': width, 'background-color': bgColor, 'color': fontColor, 'font-size': fontSize, 'background-image': realBgImg}">{{ txt }}</button>
</template>
<script>
    import Enum from '../../common/enum';
	export default {
		name: 'XButton',
		props: {
            width: {
              type: String, 
              default: '200px'
            },
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
                    clazz: Enum.CLAZZ.SELECT
                }
            },
            bgColor: {
                type: String,
                default: '#ececec',
                $rule: {
                    name: '背景颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            fontColor: {
                type: String,
                default: '#000000',
                $rule: {
                    name: '字体颜色',
                    clazz: Enum.CLAZZ.COLOR
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
                type: Object,
                default: ()=> ({}),
                $rule: {
                    name: '背景图片',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            bgImg2: {
                type: Array,
                default: ()=> [],
                $rule: {
                    name: '背景图片2',
                    clazz: Enum.CLAZZ.IMAGE_ARRAY
                }
            },
            fontSize: {
                type: String,
                $rule: {
                    name: '字体大小',
                    clazz: Enum.CLAZZ.FONT_SIZE
                }
            },
            date: {
                type: String,
                $rule: {
                    name: '日期',
                    clazz: Enum.CLAZZ.DATE
                }
            },
            dateTime: {
                type: String,
                $rule: {
                    name: '时间',
                    clazz: Enum.CLAZZ.DATE_TIME
                }
            }
		},
        computed: {
            realBgImg() {
                return this.bgImg && this.bgImg.url ? `url(${this.bgImg.url})` : '';
            }
        }
	}
</script>