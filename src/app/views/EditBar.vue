<style lang="less">
	.edit-bar {
        width: 380px;
        box-shadow: -1px 0 3px 0 #ececec;
        padding: 10px;
		overflow: auto;
    }
	.el-color-picker__trigger {
		vertical-align: middle;
		line-height: 0;
	}
	.el-upload-list__item {
		transition: none !important;
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
		<!--<div class="edit-bar-inner">-->
			<el-form label-width="80px" label-position="top">
				<template v-for="(p, index) in props">
					<el-form-item v-if="p.prop.$rule.clazz === 'Select'" :label="p.prop.$rule.name + '：'">
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
						<el-input :placeholder="p.prop.$rule.placeholder || '请输入内容'"  v-model="node[p.key]"  @input="$forceUpdate()"></el-input>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === 'Boolean'" :label="p.prop.$rule.name + '：'">
						<el-switch on-text="是" off-text="否" v-model="node[p.key]" @input="$forceUpdate()"></el-switch>
					</el-form-item>
					<el-form-item style="line-height: 0" v-else-if="p.prop.$rule.clazz === 'Color'" :label="p.prop.$rule.name + '：'">
						<el-col :span="19">
							<el-input :placeholder="p.prop.$rule.placeholder || 'eg: #e5e5e5'"  v-model="node[p.key]"  @input="$forceUpdate()"></el-input>
						</el-col>
						<el-col :span="1">&nbsp;</el-col>
						<el-col :span="4">
							<el-color-picker v-model="node[p.key]" show-alpha @change="$forceUpdate()"></el-color-picker>
						</el-col>					
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === 'Image'" :label="p.prop.$rule.name + '：'">
						<el-upload
							list-type="picture"
							:httpRequest="handleFileRequest"
							:multiple="false"
							:ref="p.key"
							:on-change="changeUploadView(p.key, 1)"
							:on-success="handleFileSuccess(p.key)"
							:on-remove="handleFileRemove(p.key)"
							:file-list="node[p.key] ? [{url: path.join(config.INTERNAL_SERVER_HOST, node[p.key])}] : []"
							@hook:mounted="changeUploadView(p.key, 1)()">
							<el-button>添加图片</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === 'FontSize'" :label="p.prop.$rule.name + '：'">
						<el-autocomplete
							popper-class="my-autocomplete"
							v-model="node[p.key]"
							:fetch-suggestions="loadFontSizeSuggestions"
							custom-item="fontsize-item"
							@select="$forceUpdate()"
							:placeholder="p.prop.$rule.placeholder || 'eg: 16px'"
							style="width: 100%"
							></el-autocomplete>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === 'Date'" :label="p.prop.$rule.name + '：'">
						<el-date-picker
							v-model="node[p.key]"
							type="date"
							:placeholder="p.prop.$rule.placeholder || '选择日期'"
							@input="$forceUpdate()"
							:editable="false"
							format="yyyy-MM-dd"
							style="width: 100%">
						</el-date-picker>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === 'DateTime'" :label="p.prop.$rule.name + '：'">
						<el-date-picker
							v-model="node[p.key]"
							type="datetime"
							:editable="false"
							@input="$forceUpdate()"
							format="yyyy-MM-dd HH:mm:ss"
							:placeholder="p.prop.$rule.placeholder || '选择日期时间'"
							style="width: 100%">
						</el-date-picker>
					</el-form-item>
				</template>
			</el-form>
		<!--</div>	-->
	</div>
</template>
<script>
	import Vue from 'vue';
	import util from './common/util';
	import config from '../config';
	const fs = nodeRequire('fs');
	const path = nodeRequire('path');
	const shortid = nodeRequire('shortid');
	Vue.component('fontsize-item', {
		functional: true,
		render: function (h, ctx) {
			var item = ctx.props.item;
			return h('li', ctx.data, [
				h('div', { attrs: {} }, [`${item.name}(${item.value})`]),
			]);
		},
		props: {
			item: { type: Object, required: true }
		}
	});
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
			return {
				config,
				path
			}
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
				let self = this;
				//let location = util.locate(this.node);
				let location = this.node.$location;
				if(!this.storage[location]) {
					util.initConfig(this.storage, location);
				}
				
				props.forEach(function(p) {
					self.node.$watch(p.key, function(newVal, oldVal) {
						Vue.set(self.storage[location]['propsData'], p.key, newVal);
					});
				});
				this.node._recorded = true;
			},
			handleFileRequest: function(opts) {
				let p = new Promise(function(resolve, reject) {
					let rs = fs.createReadStream(opts.file.path);
					let newName = shortid.generate() + path.extname(opts.file.name);
					let ws = fs.createWriteStream(path.join(process.cwd(), `src/app/activity/assets/images/${newName}`));
					rs.pipe(ws);
					ws.on('finish', function() {
						resolve({name: newName});
					});
					ws.on('error', function() {
						reject();
					});
					rs.on('error', function() {
						reject();
					});
				});
				return p;
			},
			handleFileSuccess: function(key) {
				function _handleFileSuccess(key, response, file, fileList) {
					this.node[key] = `assets/images/${response.name}`;
				}
				return _handleFileSuccess.bind(this, key);
			},
			handleFileRemove: function(refKey) {
				let self = this;
				function _handleFileRemove(refKey, file, fileList) {
					self.node[refKey] = '';
					this.$refs[refKey][0].disabled = false;
				}
				return _handleFileRemove.bind(this, refKey);
			},
			// handleFileListChange: function(refKey, max, file, fileList) {
			// 	function _handleFileListChange(refKey, max, file, fileList) {
			// 		let $vm = this.$refs[refKey][0].$refs['upload-inner'];
			// 		if(this.$refs[refKey][0].uploadFiles.length >= max) {
			// 			$vm.$el.style.display = 'none';
			// 		}
			// 	}
			// 	return _handleFileListChange.bind(this, refKey, max)
			// },
			loadFontSizeSuggestions: function(queryString, cb) {
				cb([
					{value: '12px', name: '超小号字'},
					{value: '14px', name: '小号字'},
					{value: '16px', name: '中号字'},
					{value: '18px', name: '大号字'},
					{value: '20px', name: '超大号字'},
					{value: '22px', name: '超超大号字'},
					{value: '24px', name: '超超超大号字'}
				]);
			},
			changeUploadView: function(refKey, max) {
				function _handleUploadMounted() {
					if(this.$refs[refKey][0].uploadFiles.length >= max) {
						this.$refs[refKey][0].disabled = true;
						this.$forceUpdate();
					}
				}
				return _handleUploadMounted.bind(this, refKey, max);
			}
		}
	}
</script>