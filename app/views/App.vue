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
            height: 48px;
            line-height: 48px;
        }

        &__navbar-list-item--left + &__navbar-list-item--left {
            border-left: 1px solid #e5e5e5;
        }

        &__navbar-list-item--left.last {
            border-right: 1px solid #e5e5e5;
        }

        &__navbar-list-item--left {
            display: inline-block;
            width: 100px;
            height: 100%;
            cursor: default;
            text-align: center;
        }

        &__navbar-list-item--right {
            float: right;
            width: 48px;
            height: 100%;
            text-align: center;
            font-size: 24px;
        }

        &__navbar-list-item--left, &__navbar-list-item--right {
            &:hover {
                background: #e5e5e5;
            }
        }
    }
    
    /*模板库*/
</style>
<template>
	<div class="app">
		<nav class="app__navbar">
            <ul class="app__navbar-list">
                <li class="app__navbar-list-item--left" @click="$router.push('/')">工作区</li>
                <li class="app__navbar-list-item--left last" @click="$router.push('/tplLib')">模板库</li>
                <li class="app__navbar-list-item--right" @click="showSettingDialog"><i class="fa fa-cog"></i></li>
            </ul>      
        </nav>
        <keep-alive>
            <router-view class="app__body"></router-view>
        </keep-alive>
        <el-dialog title="设置" :visible.sync="settingDialogVisible" label-width="80px" label-position="top">
            <el-form :model="form">
                <el-form-item label="活动数据目录">
                    <el-input v-model="form.activityDataDir"></el-input>
                </el-form-item>
                <el-form-item label="活动构建输出目录">
                    <el-input v-model="form.activityOutputDir"></el-input>
                </el-form-item>
                <el-form-item label="服务器端口号">
                    <el-input v-model="form.internalServerPort"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="settingDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="relaunch">重启生效</el-button>
            </div>
        </el-dialog>
	</div>
</template>
<script>
	import Vue from 'vue';
    import config from '../config';
    import remote from '../remote';
    import util from './common/util';
	export default {
		name: 'App',
        data: function() {
            return {
                settingDialogVisible: false,
                form: {
                    activityDataDir: config.DATA_DIR,
                    activityOutputDir: config.ACTIVITY_OUTPUT_DIR,
                    internalServerPort: config.INTERNAL_SERVER_PORT
                }
            }
        },
        mounted: function() {
            this.$store.dispatch('fetchTpls');
            this.$store.dispatch('fetchComponents');
        },
        methods: {
            showSettingDialog: function() {
                this.settingDialogVisible = true;
            },

            relaunch: function() {
                this.settingDialogVisible = false;
                util.saveMetaData(config.META_FILE, this.form);
                setTimeout(function() {
                    remote.relaunch();
                }, 600); 
            }
        }
	}
</script>