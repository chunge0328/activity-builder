<style lang="less">
    .workspace {
        &__comps-bar, &.__inner, &__edit-bar {
            height: 100%;
        }

        &__inner {
            position: relative;
            display: flex;
            min-width: 360px;
            padding-top: 48px;
            flex: 1;
            justify-content: center;
            align-items: center;
        }

        &__edit-bar {
            width: 360px;
            box-shadow: -1px 0 3px 0 #ececec;
        }

        &__design-area, &__preview-area {
            position: relative;
            width: 360px;
            height: 640px;
            /*box-shadow: 0 0 3px 3px #ececec;*/
            border: 1px solid #e5e5e5;
            box-sizing: content-box;
            left: 40px;
        }

        &__config-area {
            width: 480px;
            min-height: 640px;
        }

        &__preview, &__preview-container, &__design-container, &__design {
            width: 100%;
            height: 100%;
        }

        &__qrcode-container {
            position: absolute;
            display: flex;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255,255, 255, .7);
            align-items: center;
            justify-content: center;
        }

        &__qrcode {
            width: 240px;
            height: 240px;
        }

        &__selected-comp-item {
            height: 48px;
            width: 100%;
            padding: 0 20px;
            line-height: 48px;
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            border-bottom: 1px solid #ececec;
            transition: transform .3s ease;

             &--moving {
                transform: translate3d(0, 48px, 0);
            }
        }

        &__selected-comp-item {
            position: relative;
    	    border-bottom: 1px dashed #e5e5e5;

            &--hightlight {
                color: #fff;
                background: #ef8c34;
            }
        }

        &__comp-item {
            height: 48px;
            width: 100%;
            padding: 0 20px;
            line-height: 48px;
            font-size: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            border-bottom: 1px solid #ececec;

            &:hover {
                background: #ef8c34;
    	        color: #fff;
            }
        }

        &__status-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 48px;
            padding: 8px 12px;
        }

        &__tpl-title {
            width: 480px;
            height: 32px;
            border: 1px solid transparent;
            padding: 0 10px;
            font-size: 18px;

            &:focus {
                border-color: #000;
            }
        }

        &__selected-comps-bar {
            position: absolute;
            width: 180px;
            height: 576px;
            top: 0;
            left: -190px;
            border: 1px solid #e5e5e5;
            overflow: auto;
        }

        &__selected-comp-list {
            min-height: 100%;
            padding-bottom: 48px;
        }

        &__del-btn {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            width: 20px;
            height: 100%;
            font-size: 16px;
            align-items: center;
            justify-content: center;
            background: #d9534f;
            color: #fff;

            &:hover {
                background: #c9302c;
            }
        }

        &__tools-bar {
            position: absolute;
            width: 32px;
            top: 60px;
            right: -42px;
            border: 1px solid #e5e5e5;
        }

        &__tool-item {
            display: flex;
            height: 30px;
            justify-content: center;
            align-items: center;

            &:hover {
                background: #e5e5e5;
            }

            &--activated {
                color: #fff;
                background: #ef8c34;
            }

            &--working {
                color: #fff;
                background: #00E5FF;
            }
        }
    }
</style>
<template>
	<section class="workspace">
        <comps-bar @dragend="dragUnSelectedCompEnd"></comps-bar>
        <div class="workspace__inner">
        	<div class="workspace__status-bar">
        		<input class="workspace__tpl-title" type="text" v-model="tpl.title" @blur="save()" placeholder="请输入模板名称..." />        	
				<button-group class="pull-right" :btns="modebtns" :onSelect="onSelectMode"></button-group>
        	</div>
            <div class="workspace__config-area" v-bind:class="{none: !modebtns[0].selected}">
                <el-form>
                    <el-form-item label="设计图宽度：">
                        <el-input v-model="configStorage.App.propsData.psdWidth" placeholder="默认1080"></el-input>
                    </el-form-item>
                    <el-form-item label="页面背景颜色：">
                        <el-col :span="20">
							<el-input v-model="configStorage.App.propsData.appBgColor" placeholder="eg: #e5e5e5"></el-input>
						</el-col>
						<el-col :span="1">&nbsp;</el-col>
						<el-col :span="3">
							<el-color-picker v-model="configStorage.App.propsData.appBgColor" show-alpha></el-color-picker>
						</el-col>
                    </el-form-item>
                </el-form>
            </div>
        	<div class="workspace__design-area" v-bind:class="{none: !modebtns[1].selected}">
        		<div class="workspace__selected-comps-bar">
        			<ul class="workspace__selected-comp-list" @dragover.self="allowDrop($event)" @drop.self="addComp($event)">
                        <template v-for="(comp, index) in selectedComponents">
        				    <li class="workspace__selected-comp-item" v-bind:class="{'workspace__selected-comp-item--moving': index >= dragMoveFlag}" draggable="true" @dragstart="dragSelectedCompStart(index, $event)" @dragover="dragSelectedCompOver(index, $event)" @dragenter="dragEnterSelectedComp(index, $event)" @dragleave="dragLeaveSelectedComp(index, $event)" @dragend="dragSelectedCompEnd($event)" @drop="replaceSelectedComp(index, $event)">{{ comp.name }}<button class="workspace__del-btn" @click="delSelectedComp(index)"><i class="fa fa-times"></i></button></li>
                        </template>
        			</ul>
        		</div>
                <div class="workspace__design-container">
        		    <iframe ref="design" class="workspace__design" src=""></iframe>
                    <div class="workspace__qrcode-container" v-show="designQRCodeShowed">
                        <canvas ref="designQRCode" class="workspace__qrcode" width="240" height="240"></canvas>
                    </div>
                </div>
                <div class="workspace__tools-bar">
                    <ul class="workspace__tool-list">
                        <li class="workspace__tool-item" v-bind:class="{'workspace__tool-item--activated': isInspectingInstance}" @click="inspectInstance($event)"><i class="fa fa-crosshairs"></i></li>
                        <li class="workspace__tool-item" v-bind:class="{'workspace__tool-item--activated': isSelectingResizeInstance, 'workspace__tool-item--working': isResizingInstance}" @click="resize($event)"><i class="fa fa-arrows"></i></li>
                        <li class="workspace__tool-item" @click="showDesignQRCode()"><i class="fa fa-qrcode"></i></li>
                        <li class="workspace__tool-item" @click="reload()"><i class="fa fa-repeat"></i></li>
                        <li class="workspace__tool-item" @click="create()"><i class="fa fa-plus"></i></li>
                        <li class="workspace__tool-item" @click="save()"><i class="fa fa-save"></i></li>
                        <li class="workspace__tool-item" @click="del()"><i class="fa fa-trash"></i></li>
                    </ul>
                </div>
            </div>
            <div class="workspace__preview-area" v-bind:class="{none: !modebtns[2].selected}">
                <div class="workspace__preview-container">
            	    <webview ref="preview" class="workspace__preview" :src="previewSrc"></webview>
                    <div class="workspace__qrcode-container" v-show="previewQRCodeShowed">
                        <canvas ref="previewQRCode" class="workspace__qrcode" width="240" height="240"></canvas>
                    </div>
                </div>
                <div class="workspace__tools-bar">
                    <ul class="workspace__tool-list">
                        <li class="workspace__tool-item" @click="exportActivity()"><i class="fa fa-paper-plane"></i></li>
                        <li class="workspace__tool-item" @click="showPreviewQRCode()"><i class="fa fa-qrcode"></i></li>
                        <li class="workspace__tool-item" @click="reloadPreview()"><i class="fa fa-repeat"></i></li>
                    </ul>
                </div>
            </div>
        </div>
        <edit-bar class="workspace__edit-bar" :instance="inspectedInstance" :storage="configStorage"></edit-bar>
    </section>
</template>
<script>
	import Vue from 'vue';
	import ButtonGroup from './ButtonGroup.vue';
    import CompsBar from './CompsBar.vue';
    import EditBar from './EditBar.vue';
	import remote from '../remote';
	import support from '../support';
    import Resizing from './common/resizing';
    import util from './common/util';
    import Enum from '../../common/enum';
    import Config from '../config';
    let QRCode = nodeRequire('qrcode');
    export default {
    	name: 'Workspace',
        data: function() {
            return {
                modebtns: [ 
                    {id: 'params', name: '全局', selected: false},
                    {id: 'design', name: '设计', selected: true},
                    {id: 'preview', name: '预览', selected: false}
                ],
                isDragingSelectedComp: false,
                isInspectingInstance: false,
                isSelectingResizeInstance: false,
                isResizingInstance: false,
                inspectedInstance: null,
                inspectedContext: null,
                configStorage: {},
                selectedComponents: [],
                needReload: false,
                dragMoveFlag: -1,
                unsyncedMsgInstance: null,
                designQRCodeShowed: false,
                previewQRCodeShowed: false,
                previewSrc: `${Config.INTERNAL_SERVER_HOST}/build/index.html`
            }
        },
        mounted: function() {
            var self = this
            support.initServer(function() {
                self.$refs.design.src = `${Config.INTERNAL_SERVER_HOST}/index.html`;
                // support.getCompiler().plugin('done', function() {
                //     if(self.needReload) {
                //         self.reload();
                //     }
                // });
            });
            remote.on(Enum.EVENTS.SAVE, function() {
                self.save();
            });
            remote.on(Enum.EVENTS.RELOAD, function() {
                window.location.reload();
            });

            this.$store.watch(function(state) {
                return state.state;
            }, function(newVal) {
                switch(newVal) {
                    case Enum.STATE.SYNCED:
                            self.unsyncedMsgInstance && self.unsyncedMsgInstance.close();
                            self.unsyncedMsgInstance = null;
                        break;
                    case Enum.STATE.EDITING:
                            if(self.unsyncedMsgInstance) return;
                            self.unsyncedMsgInstance = self.$message({
                                message: '有未保存改动',
                                type: 'warning',
                                duration: 0
                            });
                        break;
                }
            });
        },     
    	activated: function() {
    		var self = this;
            function setUpListener() {
	            self.$refs.design.contentWindow.addEventListener('message', function(e) {
	            	if(e.data.type == 'webpackOk') {                       
	            		setTimeout(function() {
	            			self.capture();
	            		}, 300)
	            	}
	            });

                self.$refs.design.contentWindow.onunload = function() {
                    support.clear();
                }
	        }

			this.$refs.preview.addEventListener('did-get-response-details', function() {
				self.$refs.preview.getWebContents()
				    .enableDeviceEmulation({screenPosition:'mobile',screenSize:{width: 360, height:640}});
			});

            this.$refs.design.onload = function() {
                setUpListener();
                //self.$refs.design.contentWindow._STORAGE_ = self.configStorage;
                // setTimeout(function() {
                //     self.needReload = false;
                // }, 300);       
            }; 

            this.clearState();
		},	
        // deactivated: function() {
        //     this.needReload = true; 
        // },
        beforeRouteLeave: function(to, from, next) {
            this.saveResizeState();
            next();
        },
		computed: {
			tpl: function() {
				return this.$store.state.activeTpl || {};
			}
		},
		watch: {
            tpl: {
                handler : function(newVal, oldVal) {
                    if(oldVal && newVal._id == oldVal._id && newVal.modifiedTime == oldVal.modifiedTime) return;
                    this.selectedComponents = this.tpl.components ? JSON.parse(this.tpl.components) : [];
                    this.dragMoveFlag = this.selectedComponents.length;
                    this.configStorage = this.tpl.storage ? JSON.parse(this.tpl.storage) : {App: {propsData: {psdWidth: 1080, appBgColor: '#ffffff'}}};
                    this.makeActivity();
                },
                immediate: true
            }
		},
		methods: {
            inspectInstance: function() {
                let doc = this.$refs.design.contentWindow.document;
                this.isInspectingInstance = !this.isInspectingInstance;
                if(!this.isInspectingInstance) {
                    this.clearInspectState();
                    return;
                }
                let self = this;
                let allInstances = support.getAllInstances(doc);
                this.clearResizeState();
                this.saveResizeState();
                doc.documentElement.onmousemove = function(event) {
                    if(support.isFixedNode()) return;
                    var got = self._isInInstance(event.clientX, event.clientY, allInstances);
                    if(got) {
                        support.setHighlightColor('rgba(104, 182, 255, 0.35)');
                        support.highlight(got);
                        //self.inspectedContext = self.$refs.design.contentWindow;
                        self.inspectedInstance = support.getInstance(got);
                    } else {
                        support.unHighlight();
                    }
                }
            },

            clearInspectState: function() {
                let doc = this.$refs.design.contentWindow.document;
                support.unHighlight();
                support.unFixedNode();
                this.inspectedInstance = null;
                this.isInspectingInstance = false;
                doc.documentElement.onmousemove = null;
            },

            _isInInstance: function(x, y, all) {
                function walk(instance) {
                    for(var i = instance.children.length - 1; i >= 0; i--) {
                        var c = instance.children[i];
                        var got = walk(c);
                        if(got) {
                            return got;
                        }
                        c.rect = support.getInstanceRect(c);
                        if(c.rect && ((x >= c.rect.left) && (x <= c.rect.right) 
                            && (y >= c.rect.top) && (y <= c.rect.bottom))) {
                            return c;
                        }
                    }
                    return false;
                }
                for(var j = all.length - 1; j >= 0; j--) {
                    var got = walk(all[j]);
                    if(got) return got;
                }
            },

            _relocateStorage: function(op, src, to) {
                let prefix = 'Root.0.';
                let srcLevels = [];
                let toLevels = [];
                let self = this;
                switch(op) {
                    case 'INSERT':
                        let len = this.selectedComponents.length - 1;
                        while(len >= src) {
                            this._relocateStorage('REPLACE', len, len + 1);
                            len--;
                        }
                        break;
                    case 'REPLACE':
                        for(var p in this.configStorage) {
                            if(this.configStorage.hasOwnProperty(p)) {
                                if(p.indexOf(`${prefix}${src}`) >= 0) {
                                    srcLevels.push(p);
                                    continue;
                                }
                                if(p.indexOf(`${prefix}${to}`) >= 0) {
                                    toLevels.push(p);
                                }
                            }
                        }
                        srcLevels.forEach(function(l) {
                            var _ = l.replace(`${prefix}${src}`, `${prefix}${to}`);
                            var tmp;
                            if(self.configStorage[_]) {
                                tmp = self.configStorage[_];
                                self.configStorage[_] = self.configStorage[l];
                                self.configStorage[l] = tmp;
                            } else {
                                self.configStorage[_] = self.configStorage[l];
                                delete self.configStorage[l];
                            }
                        });
                        toLevels.forEach(function(l) {
                            var _ = l.replace(`${prefix}${to}`, `${prefix}${src}`);
                            if(self.configStorage[_]) {
                                return;
                            } else {
                                self.configStorage[_] = self.configStorage[l];
                                delete self.configStorage[l];
                            }
                        });
                        break;
                    case 'DEL':
                        for(var p in this.configStorage) {
                            if(this.configStorage.hasOwnProperty(p)) {
                                if(p.indexOf(`${prefix}${src}`) >= 0) {
                                    this.configStorage[p] = undefined;
                                    continue;
                                }
                                var r = /^Root\.\d+\.(\d+)/.exec(p);
                                if(r && Number(r[1]) > src) {
                                    srcLevels.push({idx: Number(r[1]), l: p});
                                }
                            }
                        }
                        srcLevels.sort(function(a, b) {
                            return a.idx > b.idx;
                        });
                        srcLevels.forEach(function(level) {
                            self.configStorage[level.l.replace(`${prefix}${level.idx}`, `${prefix}${level.idx - 1}`)] = self.configStorage[level.l];
                            delete self.configStorage[level.l];
                        });
                        break;
                }
            },

            _transformRect: function(rect) {
                return {x: parseInt(rect.left), y: parseInt(rect.top), width: parseInt(rect.width), height: parseInt(rect.height)};
            },

			onSelectMode: function(id) {
				switch(id) {
					case 'design':
						this.openDesignView();
						break;
					case 'preview':
						this.openPreviewView();
						break;
				}
			},

            makeActivity: function() {
                support.clear();
                support.flushFile(this.selectedComponents, this.configStorage);
            },

            capture: function() {
                let self = this;
                remote.capturePage(this._transformRect(this.$refs.design.getBoundingClientRect()), function(imageData) {
	                let data = {
                        type: 'TPL',
                        title: self.tpl.title, 
                        createdTime: self.tpl.createdTime, 
                        modifiedTime:  self.tpl.modifiedTime, 
                        components: JSON.stringify(self.selectedComponents),
                        storage: JSON.stringify(self.configStorage),
                        snapshot: imageData,
                        local: true
                    };
	                if(!self.tpl._id) {
		                support.getDB().insert(data, function (err, newDoc) {
		                	if(err) return;
                            self.$store.commit('setActiveTpl', newDoc);
                            self.$message({
                                message: '更新成功',
                                type: 'success'
                            });
	                    });
		            } else {
		            	support.getDB().update({_id: self.tpl._id}, data, {returnUpdatedDocs: true}, function(err, numReplaced, doc) {
                            if(err) return;
                            if(numReplaced) {
                                self.$store.commit('setActiveTpl', doc);
                                self.$message({
                                    message: '更新成功',
                                    type: 'success'
                                });
                            }
		            	});
		            }
                });   
            },

            save: function() {
                var self = this;
                this.clearState();
                let data = {
                    type: 'TPL',
                    title: self.tpl.title, 
                    createdTime: self.tpl.createdTime || Date.now(), 
                    modifiedTime: Date.now(), 
                    components: JSON.stringify(self.selectedComponents),
                    storage: JSON.stringify(self.configStorage),
                    snapshot: self.tpl.snapshot,
                    local: true
                };
                //this.$store.replaceState({state: Enum.STATE.SYNCING});
                this.$store.commit('setState', Enum.STATE.SYNCING);
                if(!self.tpl._id) {
                    support.getDB().insert(data, function (err, newDoc) {
                        if(err) return;
                        self.$store.commit('setActiveTpl', newDoc);
                        //self.$store.replaceState({state: Enum.STATE.SYNCED});
                        self.$store.commit('setState', Enum.STATE.SYNCED);
                        self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    });
                } else {
                    support.getDB().update({_id: self.tpl._id}, data, {returnUpdatedDocs: true}, function(err, numReplaced, doc) {
                        if(err) return;
                        if(numReplaced) {
                            self.$store.commit('setActiveTpl', doc);
                            //self.$store.replaceState({state: Enum.STATE.SYNCED});
                            self.$store.commit('setState', Enum.STATE.SYNCED);
                            self.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                        }
                    });
                }
                // remote.capturePage(this._transformRect(this.$refs.design.getBoundingClientRect()), function(imageData) {
	            //     let data = {
                //         title: self.tpl.title, 
                //         createdTime: self.tpl.createdTime || Date.now(), 
                //         modifiedTime: Date.now(), 
                //         components: JSON.stringify(self.selectedComponents),
                //         storage: JSON.stringify(self.configStorage),
                //         snapshot: imageData,
                //         local: true
                //     };
	            //     if(!self.tpl._id) {
		        //         support.getDB().insert(data, function (err, newDoc) {
		        //         	if(err) return;
                //             self.$store.commit('setActiveTpl', newDoc);
                //             self.$message({
                //                 message: '保存成功',
                //                 type: 'success'
                //             });
	            //         });
		        //     } else {
		        //     	support.getDB().update({_id: self.tpl._id}, data, {returnUpdatedDocs: true}, function(err, numReplaced, doc) {
                //             if(err) return;
                //             if(numReplaced) {
                //                 self.$store.commit('setActiveTpl', doc);
                //                 self.$message({
                //                     message: '保存成功',
                //                     type: 'success'
                //                 });
                //             }
		        //     	});
		        //     }
                // });   
            },

			openPreviewView: function() {
                let $msg = this.$message({
                    message: '正在编译...请稍后',
                    duration: 0
                })
				support.ssrRender(()=> {
                    $msg.close();
                    this.$message({
                        message: 'Done! 编译成功!',
                        type: 'success'
                    });
                    this.$refs.preview.reloadIgnoringCache();
                });
			},

			openDesignView: function() {
				
			},

			allowDrop: function($event) {
				$event.preventDefault();
				return true;
			},

            dragSelectedCompOver: function(index, $event) {            
                if(this.isDragingSelectedComp) {
                    $event.target.classList.add('workspace__selected-comp-item--hightlight');
                } else {
                    return false;
                }
                $event.preventDefault();
                return true;
            },

            dragEnterSelectedComp: function(index, $event) {
                if(this.isDragingSelectedComp) return;
                if($event.target.classList.contains('workspace__selected-comp-item--moving')) {
                    this.dragMoveFlag = index + 1;
                } else {
                    this.dragMoveFlag = index;
                }
                this.$forceUpdate();
                $event.preventDefault();
            },

            dragLeaveSelectedComp: function(index, $event) {
                if(this.isDragingSelectedComp) {
                    event.target.classList.remove('workspace__selected-comp-item--hightlight');
                }
            },

			addComp: function($event) {
                if(this.isDragingSelectedComp) return;
                this.selectedComponents.splice(this.dragMoveFlag, 0, JSON.parse($event.dataTransfer.getData('text')));
                this._relocateStorage('INSERT', this.dragMoveFlag);
                this.dragMoveFlag = this.selectedComponents.length;
                this.$forceUpdate();
                this.makeActivity();
			},

            replaceSelectedComp: function(to, $event) {
                var src = $event.dataTransfer.getData('text');
                var tmp = this.selectedComponents[src];
                Vue.set(this.selectedComponents, src, this.selectedComponents[to]);
                Vue.set(this.selectedComponents, to, tmp);
                this._relocateStorage('REPLACE', src, to);
                $event.target.classList.remove('workspace__selected-comp-item--hightlight');
                this.$forceUpdate();
                this.makeActivity();
            },

            delSelectedComp: function(index) {
                this.selectedComponents.splice(index, 1);
                this._relocateStorage('DEL', index);
                this.$forceUpdate();
                this.makeActivity();
            },

            dragSelectedCompStart: function(index, $event) {
                this.isDragingSelectedComp = true;
                $event.dataTransfer.setData('text', index);
            },

            dragSelectedCompEnd: function($event) {
                this.isDragingSelectedComp = false;
            },

            dragUnSelectedCompEnd: function() {
                Vue.nextTick(()=> {
                    this.dragMoveFlag = this.selectedComponents.length;
                    this.$forceUpdate();
                });
            },

            reload: function() {
            	//this.$refs.design.contentWindow.location.reload();
                this.clearState();
                let location = this.$refs.design.contentWindow.location;
                this.$refs.design.src = location.href.replace(location.search, '') + '?_=' + Date.now();
            },

            del: function() {
            	if(this.tpl._id) {
            		this.$store.dispatch('delTpl', this.tpl._id);
            	} else {
            		this.$store.commit('setActiveTpl', {});
            	}
            },

            create: function() {
                this.clearState();
            	this.save();
            	this.$store.commit('setActiveTpl', {});
            },

            resize: function() {
                var doc = this.$refs.design.contentWindow.document;
                this.isSelectingResizeInstance = !this.isSelectingResizeInstance;
                if(!this.isSelectingResizeInstance || this.isResizingInstance) {
                    this.clearResizeState();
                    this.save();
                    return;
                }
                let self = this;
                let allInstances = support.getAllInstances(doc);
                this.clearInspectState();
                doc.documentElement.onmousemove = function(event) {
                    if(support.isFixedNode()) return;
                    var got = self._isInInstance(event.clientX, event.clientY, allInstances);
                    if(got) {                      
                        support.setHighlightColor('rgba(24, 255, 255, 0.35)');
                        support.highlight(got, function() {
                            self.isResizingInstance = true;
                            new Resizing(got, self.configStorage[support.getInstance(got).$location], function() {
                                self.$store.commit('setState', Enum.STATE.EDITING);
                            }).activate();
                            support.unHighlight();
                        });
                    } 
                }
            },

            clearResizeState: function() {
                let doc = this.$refs.design.contentWindow.document;
                support.unHighlight();
                support.unFixedNode();
                this.saveResizeState();
                Resizing.deactivateAll();
                this.inspectedInstance = null;
                doc.documentElement.onmousemove = null;
                this.isSelectingResizeInstance = false;
                this.isResizingInstance = false;          
            },

            saveResizeState: function() {
                let obj = Resizing.getTop();
                if(obj) {
                    let instance = support.getInstance(obj.instance);
                    if(instance) {
                        let location = instance.$options.$global ? instance.$options.name : instance.$location;
                        if(!this.configStorage[location]) {
                            util.initConfig(this.configStorage, location);
                        }
                        Vue.set(this.configStorage[location], 'staticStyle', Object.assign({}, this.configStorage[location]['staticStyle'], obj.posData));
                    }
                    Resizing.deactivateAll();
                }
            },

            clearState: function() {
                this.clearResizeState();
                this.clearInspectState();
            },

            showDesignQRCode: function() {
                let ips = util.getLocalIps();
                if(ips.length) {
                    this.designQRCodeShowed = !this.designQRCodeShowed;
                    QRCode.toCanvas(this.$refs.designQRCode, `http://${ips[0]}:${Config.INTERNAL_SERVER_PORT}/index.html`, function (error) {
                        if (error) console.error(error)
                    });
                } else {
                    this.$message.error('网络异常！请检查');
                }
            },
            
            showPreviewQRCode: function() {
                let ips = util.getLocalIps();
                if(ips.length) {
                    this.previewQRCodeShowed = !this.previewQRCodeShowed;
                    QRCode.toCanvas(this.$refs.previewQRCode, `http://${ips[0]}:${Config.INTERNAL_SERVER_PORT}/build/index.html`, function (error) {
                        if (error) console.error(error)
                    });
                } else {
                    this.$message.error('网络异常！请检查');
                }
            },

            reloadPreview: function() {
                this.$refs.preview.reloadIgnoringCache();
            },

            exportActivity: function() {

            }
		},

		components: {
			ButtonGroup,
            CompsBar,
            EditBar
		}
    }
</script>