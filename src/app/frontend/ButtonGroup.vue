<style lang="less">
	@import "./style/common.less";
	.btn-group {
		display: inline-block;
	}
	.btn-group .btn+.btn {
		border-left-style: none;
	}
	.btn-group .selected {
		background: #ef8c34;
		color: #fff;
	}
</style>
<template>
	<div class="btn-group">
		<template v-for="btn in btns">
			<button class="btn" v-bind:class="{ selected: btn.selected }" @click="onHandleSelect(btn.id, $event)">{{ btn.name }}</button>
		</template>
	</div>
</template>
<script>
	export default {
		name: 'ButtonGroup',
		props: {
			btns: {
				type: Array,
				default: function() {
					return [
						{id: 'btn1', name: '按钮1', selected: false},
						{id: 'btn2', name: '按钮2', selected: false}
					]
				}
			},
			onSelect: {
				type: Function,
				default: function() {}
			} 
		},
		methods: {
			onHandleSelect: function(id, $event) {
				for(var i = 0; i < this.btns.length; i++){
					var btn = this.btns[i];
					if(btn.id == id) {
						if(btn.selected) return;
						btn.selected = true;
					} else {
						btn.selected = false;
					}
				}
				this.onSelect(id, $event);
			}
		}
	}
</script>