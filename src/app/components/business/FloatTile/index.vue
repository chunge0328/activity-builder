<style>
    .float-tile {
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        height: 100px;
    }
</style>
<template>
    <div ref="el" class="float-tile" @click="$doMotion(motion)" :style="{'background-color': bgColor, '-webkit-transform': transformValue}"></div>
</template>
<script>
    import Enum from '../../common/enum';
    import util from '../../common/util';
    export default {
        name: 'FloatTile',
        props: {
            motion: {
                type: Object,
                default: ()=>({}),
                $rule: {
                    name: '点击响应动作',
                    clazz: Enum.CLAZZ.MOTION
                }
            }
        },
        data: ()=> {
            return {
                bgColor: process.env.NODE_ENV == 'production' ? 'transparent' : 'rgba(255, 0, 0, 0.25)',
                top: 0,
                left: 0
            }
        },
        mounted: function() {
            if(!this.$config || util.isEmptyObject(this.$config) || !this.$config.staticStyle|| util.isEmptyObject(this.$config.staticStyle)) {
                this.top = (window.scrollY + window.innerHeight / 2 - this.$refs.el.offsetHeight / 2) + 'px';
                this.left = (window.scrollX + window.innerWidth / 2 - this.$refs.el.offsetWidth / 2) + 'px';
            }
        },
        computed: {
            transformValue: function() {
                return (this.top || this.left) ? `translate(${this.left},${this.top})` : false;
            }
        },
        methods: {
            
        }
    }
</script>