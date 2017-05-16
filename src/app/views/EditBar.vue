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
	.ql-formats {
		line-height: 24px;
	}
	.ql-tooltip {
		left: 0 !important;
	}
	.ql-snow .ql-tooltip a.ql-preview {
		vertical-align: middle;
	}
	.el-form-item {
		 margin: 11px 0;
	}
</style>
<template>
	<div class="edit-bar">
		<!--<div class="edit-bar-inner">-->
			<el-form label-width="80px" label-position="top">
				<template v-for="(p, index) in props">
					<el-form-item v-if="p.prop.$rule.clazz === Enum.CLAZZ.SELECT" :label="p.prop.$rule.name + '：'">
						<el-select style="width:100%" v-model="instance[p.key]" placeholder="请选择" @handleOptionClick="$forceUpdate()">
							<el-option
								v-for="item in p.prop.$rule.options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === 'String' || p.prop.$rule.clazz === 'Number'" :label="p.prop.$rule.name + '：'">
						<el-input :placeholder="p.prop.$rule.placeholder || '请输入内容'"  v-model="instance[p.key]"  @input="$forceUpdate()"></el-input>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === 'Boolean'" :label="p.prop.$rule.name + '：'">
						<el-switch on-text="是" off-text="否" v-model="instance[p.key]" @input="$forceUpdate()"></el-switch>
					</el-form-item>
					<el-form-item style="line-height: 0" v-else-if="p.prop.$rule.clazz === Enum.CLAZZ.COLOR" :label="p.prop.$rule.name + '：'">
						<el-col :span="19">
							<el-input :placeholder="p.prop.$rule.placeholder || 'eg: #e5e5e5'"  v-model="instance[p.key]"  @input="$forceUpdate()"></el-input>
						</el-col>
						<el-col :span="1">&nbsp;</el-col>
						<el-col :span="4">
							<el-color-picker v-model="instance[p.key]" show-alpha @change="$forceUpdate()"></el-color-picker>
						</el-col>					
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === Enum.CLAZZ.IMAGE" :label="p.prop.$rule.name + '：'">
						<el-upload
							list-type="picture"
							:http-request="handleFileRequest"
							:multiple="false"
							:ref="p.key"
							:disabled="instance[p.key] && instance[p.key].url"
							:on-success="handleFileSuccess(p.key)"
							:on-remove="handleFileRemove(p.key)"
							:file-list="instance[p.key].url ? [{url: path.join(config.INTERNAL_SERVER_HOST, instance[p.key].url)}] : []"
							>
							<el-button>添加图片</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === Enum.CLAZZ.IMAGE_ARRAY" :label="p.prop.$rule.name + '：'">
						<el-upload
							list-type="picture"
							:http-request="handleFileRequest"
							:multiple="false"
							:ref="p.key"
							:disabled="instance[p.key].length >= (p.prop.$rule.max || 99)"
							:on-success="handleFileSuccess(p.key)"
							:on-remove="handleFileRemove(p.key)"
							:file-list="instance[p.key].map((img)=>({url: path.join(config.INTERNAL_SERVER_HOST, img.url)}))"
							>
							<el-button>添加图片</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === Enum.CLAZZ.FONT_SIZE" :label="p.prop.$rule.name + '：'">
						<el-autocomplete
							popper-class="my-autocomplete"
							v-model="instance[p.key]"
							:fetch-suggestions="loadFontSizeSuggestions"
							custom-item="fontsize-item"
							@select="$forceUpdate()"
							:placeholder="p.prop.$rule.placeholder || 'eg: 16px'"
							style="width: 100%"
							></el-autocomplete>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === Enum.CLAZZ.DATE" :label="p.prop.$rule.name + '：'">
						<el-date-picker
							v-model="instance[p.key]"
							type="date"
							:placeholder="p.prop.$rule.placeholder || '选择日期'"
							@input="$forceUpdate()"
							:editable="false"
							format="yyyy-MM-dd"
							style="width: 100%">
						</el-date-picker>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === Enum.CLAZZ.DATE_TIME" :label="p.prop.$rule.name + '：'">
						<el-date-picker
							v-model="instance[p.key]"
							type="datetime"
							:editable="false"
							@input="$forceUpdate()"
							format="yyyy-MM-dd HH:mm:ss"
							:placeholder="p.prop.$rule.placeholder || '选择日期时间'"
							style="width: 100%">
						</el-date-picker>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === Enum.CLAZZ.RITCH_TEXT" :label="p.prop.$rule.name + '：'">
						<quill-editor :options="editorOption" v-model="instance[p.key]"></quill-editor>
					</el-form-item>
					<el-form-item v-else-if="p.prop.$rule.clazz === Enum.CLAZZ.MOTION" :label="p.prop.$rule.name + '：'">
						<el-select style="width:100%" v-model="instance[p.key].motion" placeholder="请选择" @input="handleMotionUpdate(p.key)($event)">
							<el-option
								v-for="item in motions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						<template v-if="instance.__MOTIONS__[instance[p.key].motion] && instance.__MOTIONS__[instance[p.key].motion].params.length">
							<el-form>
								<template v-for="(param, index) in instance.__MOTIONS__[instance[p.key].motion].params">
									<el-form-item>
										<el-input :placeholder="param.$rule.name || param.$rule.placeholder" v-model="instance[p.key].params[index]"  @input="handleMotionParamsUpdate(p.key, paramIndex)($event)"></el-input>
									</el-form-item>
								</template>
							</el-form>
						</template>
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
	import Enum from '../components/common/enum';
	const fs = nodeRequire('fs');
	const path = nodeRequire('path');
	const shortid = nodeRequire('shortid');
	const mkdirp = nodeRequire('mkdirp');
	const sizeOf = nodeRequire('image-size');
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
			instance: {
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
				path,
				Enum,
				editorOption: {
					theme: 'snow',
					modules: {
						toolbar: [
							[{ 'size': ['small', false, 'large'] }],
							[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
							[{ 'color': [] }, { 'background': [] }],
							[{ 'direction': 'rtl' }],
							[{ 'align': [] }],
							['bold', 'italic', 'underline', 'strike'],
							[{ 'list': 'ordered'}, { 'list': 'bullet' }],
							['link', 'image']
						]
					}
				}
			}
		},
		computed: {
			props: function() {
				if(!this.instance) return props;
				let props = [];
				let $props = this.instance.$options.props;
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
				props = props.sort(function(a, b) {
					return a.key > b.key;
				});
				this.watchConfig(props);
				return props;
			},
			motions: function() {
				if(!this.instance) return;
				let motions = [];
				Object.keys(this.instance.__MOTIONS__).forEach((key) =>{
					let motion = this.instance.__MOTIONS__[key];
					motions.push({
						value: key,
						label: motion.name
					});
				});
				return motions;
			}
		},
		methods: {
			watchConfig: function(props) {
				if(this.instance._recorded) return;
				let self = this;
				//let location = util.locate(this.instance);
				let location = this.instance.$options.$global ? this.instance.$options.name : this.instance.$location;
				if(!this.storage[location]) {
					util.initConfig(this.storage, location);
				}
				
				props.forEach(function(p) {
					self.instance.$watch(p.key, function(newVal, oldVal) {
						Vue.set(self.storage[location]['propsData'], p.key, newVal);
					});
				});
				this.instance._recorded = true;
			},
			handleFileRequest: function(opts) {
				let p = new Promise(function(resolve, reject) {
					let rs = fs.createReadStream(opts.file.path);
					let newName = shortid.generate() + path.extname(opts.file.name);
					let dest = path.join(process.cwd(), `src/app/activity/assets/images/${newName}`);
					let dimensions = sizeOf(opts.file.path);
					mkdirp(path.dirname(dest), (err)=> {
						if(err) {
							reject();
							return;
						}
						let ws = fs.createWriteStream(dest);
						rs.pipe(ws);
						ws.on('finish', function() {
							resolve({
								url: `assets/images/${newName}`,
								width: dimensions.width,
								height: dimensions.height
							});
						});
						ws.on('error', function() {
							reject();
						});
						rs.on('error', function() {
							reject();
						});
					});
				});
				return p;
			},
			handleFileSuccess: function(key) {
				function _handleFileSuccess(key, response, file, fileList) {
					if(!Array.isArray(this.instance[key])) {
						this.instance[key] = response;
					} else {
						this.instance[key].push(response);
					}
					this.$forceUpdate();
				}
				return _handleFileSuccess.bind(this, key);
			},
			handleFileRemove: function(key) {
				let self = this;
				function _handleFileRemove(key, file, fileList) {
					if(!Array.isArray(this.instance[key])) {
						self.instance[key] = {};
					} else {
						let len = self.instance[key].length;
						while(len) {
							len--;
							if(path.basename(self.instance[key][len].url) == path.basename(file.url)) {
								self.instance[key].splice(len, 1);
								break;
							}
						}
					}
					this.$forceUpdate();
				}
				return _handleFileRemove.bind(this, key);
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

			handleMotionUpdate: function(key) {
				let self = this;
				function _handleMotionUpdate(key, value) {
					if(!self.instance[key]) {
						self.instance.$set(self.instance, key, {});					
					}
					let prop = self.instance[key];
					prop.motion = value;
					prop.params = [];
					self.instance[key] = Object.assign({}, prop);
					self.$forceUpdate();
				}
				return _handleMotionUpdate.bind(this, key);
			},

			handleMotionParamsUpdate: function(key, index) {
				let self = this;
				function _handleMotionParamsUpdate(key, index, value) {
					let prop = self.instance[key];
					prop.params[index] = value;
					self.instance[key] = Object.assign({}, prop);
					self.$forceUpdate();
				}
				return _handleMotionParamsUpdate.bind(this, key, index)
			}
		}
	}
</script>