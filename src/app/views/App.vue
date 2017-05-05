<style lang="less">
	@import "./style/common.less";
    .navbar {
        height: 48px;
        box-shadow: 0 1px 3px 0 #ececec;
    }
    .body {
        display: flex;
        height: calc(~"100% - 48px");
        overflow: hidden;
    }
    .navbar-list {
        display: flex;
        height: 48px;
    }
    .navbar-list-item + .navbar-list-item {
        border-left: 1px solid #e5e5e5;
    }
    .navbar-list :last-child {
        border-right: 1px solid #e5e5e5;
    }
    .navbar-list-item {
        display: flex;
        width: 100px;
        height: 100%;
        align-items: center;
        justify-content: center;
        cursor: default;
    }
    .navbar-list-item:hover {
        background: #e5e5e5;
    }
    /*模板库*/
</style>
<template>
	<div class="app">
		<nav class="navbar">
            <ul class="navbar-list">
                <li class="navbar-list-item" @click="$router.push('/')">工作区</li>
                <li class="navbar-list-item" @click="$router.push('/tplLib')">模板库</li>
            </ul>      
        </nav>
        <keep-alive>
            <router-view class="body"></router-view>
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