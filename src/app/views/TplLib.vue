<style lang="less">
	@import "./style/common.less";
	@import "./style/mixin.less";
	.tpl-lib {
		padding: 10px;
	}
	.tpl-lib > div {
		width: 100%;
		height: 100%; 
		overflow-y: auto;
	}
	.tpl {
		position: relative;
		display: flex;
		flex-direction: column;
		float: left;
		width: calc(~"(100% - 40px) / 5");
		height: 25vw;
		margin: 0 0 10px 10px;
		border: 1px solid #e5e5e5;
	}
	.tpl img {
		width: 100%;
	}
	.tpl:hover {
		border-color: #000;
	}
	.tpl-lib > div :nth-child(5n+1) {
		margin-left: 0;
	}	
	.tpl h2 {
		.one-line();
		font-size: 18px;
		padding: 0 40px 0 10px;
		height: 40px;
		line-height: 40px;
	}
	.tpl .time {
		font-size: 14px;
		text-align: right;
		padding-right: 10px;
	}
	.tpl .snapshot-wrapper {
		position: relative;
		flex: 1;
		background: #efefef;
		overflow: hidden;
	}
	.tpl .snapshot-wrapper:after {
		content: " ";
		position: absolute;
		bottom: 0;
		left: 0;
		height: 24px;
		width: 100%;
		background-image: -webkit-linear-gradient(top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 1));
		background-size: 100% 100%;
	}
	.tpl .del-btn {
		position: absolute;
		display: flex;
		width: 32px;
		height: 32px;
		top: 0;
		right: 0;
    	font-size: 20px;
    	align-items: center;
    	justify-content: center;
    	background: #d9534f;
    	color: #fff;
	}
	.tpl .del-btn:hover {
    	background: #c9302c;
    }
</style>
<template>
	<section class="tpl-lib">
		<div class="clearfix">
			<template v-for="tpl in tpls">
				<div class="tpl" @click="setTpl(tpl)">
					<h2>{{ tpl.title }}</h2>
					<div class="snapshot-wrapper">
						<img class="snapshot" :src="tpl.snapshot">
					</div>
					<p class="time create-time">修改时间：{{ formatDate(new Date(tpl.modifiedTime), 'yyyy/MM/dd hh:mm:ss') }}</p>
					<p class="time update-time">创建时间：{{ formatDate(new Date(tpl.createdTime), 'yyyy/MM/dd hh:mm:ss') }}</p>
					<button class="del-btn" @click.stop="delTpl(tpl._id)"><i class="fa fa-times"></i></button>
				</div>
			</template>
		</div>
	</section>
</template>
<script>
	import util from './common/util';
	export default {
		name: 'TplLib',
		data: function() {
			return {}
		},
		activated: function() {
			this.$store.dispatch('fetchTpls');
		},
		computed: {
			tpls: function() {
				return this.$store.state.tpls;
			}
		},
		methods: {
			formatDate: function(date, format) {
				return util.formatDate(date, format);
			},
			delTpl: function(id) {
				this.$store.dispatch('delTpl', id);
			},
			setTpl: function(tpl) {
				this.$store.commit('setActiveTpl', tpl);
				this.$router.push('/');
			}
		}
	}
</script>