<style lang="less">
	.edit-bar {
        width: 360px;
        box-shadow: -1px 0 3px 0 #ececec;
        padding: 10px;
    }
	.el-color-picker__trigger {
		vertical-align: middle;
		line-height: 0;
	}
    /*.form-group {
    	display: flex;
    	height: 32px;
    	margin-bottom: 5px;
    }
    .form-group > label {
    	display: inline-block;
    	width: 100px;
    	height: 100%;
    	padding-right: 10px;
    	line-height: 32px;
    	font-size: 14px;
    	overflow: hidden;
    	text-overflow: ellipsis;
    	white-space: nowrap;
    }
    .form-group > .form-control {
    	flex: 1;
    }
    input.form-control {
    	display: inline-block;
    	border: 1px solid #e5e5e5;
    	padding: 5px 10px;
    	height: 100%;
    }
    input.form-control:focus {
    	border: 1px solid rgba(0, 0, 0, 0.8);
    }*/
</style>
<template>
	<div class="edit-bar">
		<el-form label-width="80px" label-position="top">
		  	<template v-for="(p, index) in props">
				<el-form-item v-if="p.prop.$rule.clazz === 'Select'" :label="p.prop.$rule.name + '：'">
				    <!--<el-switch on-text="是" off-text="否" v-model="node[p.key]" @input="$forceUpdate()"></el-switch>-->
					<el-select style="width:100%" v-model="node[p.key]" placeholder="请选择" @handleOptionClick="$forceUpdate()">
						<el-option
							v-for="item in p.prop.$rule.options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-else-if="p.prop.$rule.clazz === 'String'" :label="p.prop.$rule.name + '：'">
			    	<el-input :placeholder="p.prop.$rule.placeholder || ''"  v-model="node[p.key]"  @input="$forceUpdate()"></el-input>
			  	</el-form-item>
			  	<el-form-item v-else-if="p.prop.$rule.clazz === 'Boolean'" :label="p.prop.$rule.name + '：'">
				    <el-switch on-text="是" off-text="否" v-model="node[p.key]" @input="$forceUpdate()"></el-switch>
				</el-form-item>
				<el-form-item style="line-height: 0" v-else-if="p.prop.$rule.clazz === 'Color'" :label="p.prop.$rule.name + '：'">
					<el-col :span="19">
						<el-input :placeholder="p.prop.$rule.placeholder || ''"  v-model="node[p.key]"  @input="$forceUpdate()"></el-input>
					</el-col>
					<el-col :span="1">&nbsp;</el-col>
					<el-col :span="4">
						<el-color-picker v-model="node[p.key]" show-alpha @change="$forceUpdate()"></el-color-picker>
					</el-col>					
				</el-form-item>
				<!-- <div v-else-if="p.prop.type === inspectedContext['Image']" class="form-group">
					上传图片
				</div> -->
				<!-- <div v-else-if="p.prop.type === inspectedContext['Boolean']" class="form-group"> -->
					<!-- <lablel><input type="radio" name="{{ p.key }}" value="1" v-model="node[p.key]">是</lablel> -->
					<!-- <lablel><input type="radio" name="{{ p.key }}" value="" v-model="node[p.key]">否</lablel> -->
				<!-- </div> -->
			</template>
		</el-form>	
	</div>
</template>
<script>
	import Vue from 'vue';
	import util from './common/util';
	export default {
		name: 'EditBar',
		props: {
			node: {
				type: Object
			},
			storage: {
				type: Object
			},
			inspectedContext: {
				type: Object
			}
		},
		data: function() {
			return {}
		},
		computed: {
			props: function() {
				if(!this.node) return props;
				let props = [];
				let $props = this.node.$options.props;
				let oToStr = Object.prototype.toString;
				for(let key in $props) {
					let p = $props[key];
					let $rule = p.$rule = p.$rule || {};
					if($props.hasOwnProperty(key) && (typeof $props[key].configurable == 'undefined' || $props[key].configurable)) {
						if(!$rule.clazz && p.type) {
							if(oToStr.call(p.type) == '[object Array]') {
								$rule.clazz = p.type[0].name;
							} else {
								$rule.clazz = p.type.name;
							}
						} else if(!p.type) {
							continue;
						}
						props.push({key: key, prop: p});
					}
				}
				props.sort(function(a, b) {
					return a.key > b.key;
				});
				this.watchConfig(props);
				return props;
			}
		},
		methods: {
			watchConfig: function(props) {
				if(this.node._recorded) return;
				var self = this;
				var location = util.locate(this.node);
				if(!this.storage[location]) {
					util.initConfig(this.storage, location);
				}
				props.forEach(function(p) {
					self.node.$watch(p.key, function(newVal, oldVal) {
						Vue.set(self.storage[location]['propsData'], p.key, newVal);
					});
				});
				this.node._recorded = true;
			}
		}
	}
</script>