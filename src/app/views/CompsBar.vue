<style lang="less">
	.comps-bar {
        width: 180px;
        box-shadow: 1px 0 3px 0 #ececec;
    }
    .comp-item:hover {
    	background: #ef8c34;
    	color: #fff;
    }
    .comp-item {
    	height: 48px;
    	width: 100%;
    	padding: 0 20px;
    	line-height: 48px;
    	font-size: 16px;
    	overflow: hidden;
    	text-overflow: ellipsis;
    	border-bottom: 1px solid #ececec;
    }
</style>
<template>
	<div class="comps-bar">
    	<ul class="comp-list">
            <template v-for="comp in components">
    		    <li class="comp-item" draggable="true" @dragstart="dragCompStart(comp, $event)" @dragend="dragCompEnd(comp, $event)">{{ comp.name }}</li>
            </template>
    	</ul>
    </div>
</template>
<script>
	export default {
		name: 'CompsBar',
		data: function() {
			return {}
		},
		computed: {
			components: function() {
				return this.$store.state.components;
			}
		},
		methods: {

			dragCompStart: function(comp, $event) {
	            $event.dataTransfer.setData('text', JSON.stringify(comp));
			},

			dragCompEnd: function($event) {

			}
		}
	}
</script>
