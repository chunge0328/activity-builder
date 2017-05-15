<style lang="less">
	@import "./style/common.less";
    .app {
        &__navbar {
            height: 48px;
            box-shadow: 0 1px 3px 0 #ececec;
        }

        &__body {
            display: flex;
            height: calc(~"100% - 48px");
            overflow: hidden;
        }

        &__navbar-list {
            display: flex;
            height: 48px;
        }

        &__navbar-list-item + &__navbar-list-item {
            border-left: 1px solid #e5e5e5;
        }

        &__navbar-list :last-child {
            border-right: 1px solid #e5e5e5;
        }

        &__navbar-list-item {
            display: flex;
            width: 100px;
            height: 100%;
            align-items: center;
            justify-content: center;
            cursor: default;
        }

        &__navbar-list-item:hover {
            background: #e5e5e5;
        }
    }
    
    /*模板库*/
</style>
<template>
	<div class="app">
		<nav class="app__navbar">
            <ul class="app__navbar-list">
                <li class="app__navbar-list-item" @click="$router.push('/')">工作区</li>
                <li class="app__navbar-list-item" @click="$router.push('/tplLib')">模板库</li>
            </ul>      
        </nav>
        <keep-alive>
            <router-view class="app__body"></router-view>
        </keep-alive>
	</div>
</template>
<script>
	import Vue from 'vue';
	export default {
		name: 'App',
        mounted: function() {
            this.$store.dispatch('fetchTpls');
            this.$store.dispatch('fetchComponents');
        }
	}
</script>