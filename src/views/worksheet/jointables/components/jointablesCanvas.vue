<style lang="less">
.canvas-box {
	height: 400px;
}
</style>
<template>
	<div class="canvas-box">
		<div class="bor-box-mt">
            {{ sheetName }}
            <a class="blueLink ml10" @click="openEditSheetLayer">编辑</a>
            <div class="fr">
            	<a class="ml10 blueLink" @click="run()">运行</a>
            	<a class="ml10 blueLink" @click="save()">保存</a>
            </div>
        </div>
        <div class="white-bg mb20 innerdiv">
            <canvas id="jointables" @click="clickCanvas" @drop="drop" @dragover="allowDrop"></canvas>
            <div id="modifyBox" v-show="showModifyBox" :style="{left: modifyBoxX + 'px', top: modifyBoxY + 'px'}">
	        	<ul>
        			<!--li>
	        			替换
	        		</li-->
	        		<li @click="deleteAction">
	        			删除
	        		</li>
	        	</ul>
	        </div> 
	        <!-- 设置关联关系 弹出层 -->
			<div class="setRelation layer-ext-moon" v-show="showSetRelation" :style="{left: setRelationX + 'px', top: setRelationY + 'px'}">
		        <ul class="listItem">
		            <li class="first"><p class="tit">关联关系：</p>
		                <div class="con">
		                    <div class="select-box">
		                        <div class="dropdown-btn"><span class="select-value">{{ activeJoinType }}</span><i class="arr"></i></div>
		                        <div class="dropdown-list fix-width">
		                            <ul>
		                                <!-- <li><a @click="activeJoinType = 'left join'">left join</a></li>
		                                <li><a @click="activeJoinType = 'left join'">left join</a></li>
		                                <li><a @click="activeJoinType = 'left join'">left join</a></li> -->
										<li><a @click ="activeJoinType = 'left join'">left join</a></li>
										<li><a @click ="activeJoinType ='inner join'">inner join</a></li>
		                                <li><a @click="activeJoinType = 'full join'">full join</a></li>
		                            </ul>
		                        </div>
		                    </div>
		                </div>
		            </li>
		            <li><p class="tit">字段关系：</p>
		                <div class="con">
		                	<table class="bg-grey">
		                        <colgroup>
		                            <col width="42%">
		                            <col width="5%">
		                            <col width="42%">
		                            <col width="11%">
		                        </colgroup>
		                        <thead>
		                        	<tr>
		                        		<th><div class="thdiv" :title="activeJoinLeft && activeJoinLeft.content">{{ activeJoinLeft && activeJoinLeft.content }}</div></th>
		                        		<th></th>
		                        		<th><div class="thdiv" :title="activeJoinRight && activeJoinRight.content">{{ activeJoinRight && activeJoinRight.content }}</div></th>
		                        		<th></th>
		                        	</tr>
		                        </thead>
		                    </table>
		                    <table class="mt10 scroll-table">
		                        <colgroup>
		                            <col width="42%">
		                            <col width="5%">
		                            <col width="42%">
		                            <col width="11%">
		                        </colgroup>
		                        <tbody>
		                            <tr v-for="item,$index in activeRelation">
		                                <td>
		                                    <div class="select-box addDiv select-style">
		                                        <div class="dropdown-btn"><span class="select-value">{{ item.left }}</span><i class="arr"></i></div>
		                                        <div class="dropdown-list">
		                                            <ul>
		                                                <li v-for="data in (activeJoinLeft && activeJoinLeft.header) || []">
		                                                	<a @click="item.left = data.columnName; trigger =! trigger">{{ data.columnName }}</a>
		                                                </li>
		                                            </ul>
		                                        </div>
		                                    </div>
		                                </td>
		                                <td>
		                                    <span>&nbsp;=</span>
		                                </td>
		                                <td>
		                                    <div class="select-box addDiv select-style">
		                                        <div class="dropdown-btn"><span class="select-value">{{ item.right }}</span><i class="arr"></i></div>
		                                        <div class="dropdown-list">
		                                            <ul>
		                                                <li v-for="data in (activeJoinRight && activeJoinRight.header) || []">
		                                                	<a @click="item.right = data.columnName; trigger =! trigger">{{ data.columnName }}</a>
		                                                </li>
		                                            </ul>
		                                        </div>
		                                    </div>
		                                </td>
		                                 <td>
		                                    <i class="i16" @click="deleteRelation($index)"></i>
		                                </td>
		                            </tr>
		                        </tbody>
		                    </table>
		                    <p class="pt10"><a @click="addRelation" class="blueLink" id="add_one"><i class="i45"></i>添加</a></p>
		                </div>
		            </li>
		        </ul>
		        <div class="layui-layer-btn">
		        	<a class="layui-layer-btn0" @click="submitJoin">确定</a>
		        	<a class="layui-layer-btn1" @click="cancelJoin">取消</a>
		        </div>
			</div>                      
            <div class="cl"></div>
            <div style="display:none">{{ trigger }}</div>
        </div>
        <!-- 编辑 弹出层 -->
		<div class="popup editWorksheet2" style="display:none;">
	    	<ul class="listItem">
	        	<li><p class="tit">工作表名称：</p><p class="con"><input type="text" class="inputMode w430" v-model="sheetName" placeholder="支持中英文，数字，30字符内"></p>
	            	<p class="tips">支持中英文，数字，30字符内</p>
	            </li>
	        	<li>
	        		<p class="tit">文件夹：</p>
	            	<div class="con" v-show="!newFolderShow">
	                	<div class="select-box w335 fl">
	                        <div class="dropdown-btn"><span class="select-value">{{ folderName }}</span><i class="arr"></i></div>
	                        <div class="dropdown-list">
	                            <ul>
	                                <li v-for="data in sourceList"
	                                	@click="folderId = data.folderId;folderName = data.folderName"
	                                	>
	                                	<a>{{ data.folderName }}</a>
	                                </li>
	                            </ul>
	                        </div>
	                    </div>
	                    <a href="javascript:;" class="blueLink" style="margin-left: 10px;" @click="newFolderShow = true">新建文件夹</a>
	                </div>
	                <div class="b-edit-bd" v-show="newFolderShow" style="width:439px; left:6px">
	                	<div class="b-editinput">
	                		<input type="text" class="inputName" v-model="newFolderName">
	                	</div>
	                	<div class="btns">
	                		<a href="javascript:void(0);" class="qd" @click="addNewFolder">确定</a>
	                		<a href="javascript:void(0);" class="qx" @click="newFolderShow = false; newFolderName = ''">取消</a>
	                	</div>
	                </div>
	            </li>
	        </ul>
		</div>
		<div class="loading-container" v-show="loading">
			<div class="loading-innerbox">
				<img src="../../../../images/loading-max.gif">
			</div>
		</div>
	</div>
	
</template>
<script>
import api from '../../../../api'
import { mapMutations } from 'vuex'
import { mapGetters } from 'vuex'
export default {
	name: 'jointables-canvas',
	mounted() {
		document.addEventListener('click', () => (this.showModifyBox = false));
		this.canvas = document.getElementById('jointables');	
		this.ctx = this.canvas.getContext('2d');
		this.findVueIndex();
        this.displayList = this.$parent.$children[this.vueIndex].$data.displayList;
        this.sourceList = this.$parent.$children[this.vueIndex].$data.sourceList;
        if(this.$route.query.id){
            let id = this.$route.query.id;
            this.sheetId = id;
            this.getData(id);
        }
        this.maxCanvasWidth = document.body.clientWidth - 403;
		this.reDraw(this.root);

	},
	data() {
		return {
			ctx: '',
			canvas: '',
			boxHeight: 30,
			boxPHeight: 10,
			pWidth: 30,
			letterWidth: 6.3, // 单字符宽度
			endLineWidth: 10,
			arrowSize: 8,
			boxPadding: 11,
			boxLeftSpacing: 300,
			boxTopSpacing: 30,
			yPoint: 20,
			root: null,
			maxLevel: 0,
			maxContentLength: 20,
			joinHeight: 16,
			joinWidth: 60,
			joinRadius: 3,
			showSetRelation: false,
			setRelationX: 0,
			setRelationY: 0,
			nodeArea: [],
			joinArea: [],
			showModifyBox: false,
			modifyBoxX: 0,
			modifyBoxY: 0,
			hoverNode: null,
			mouseLocation: null,
			sendData: {},
			canRun: 0,
			activeJoinLeft: null,
			activeJoinRight: null,
			dispalyJoinRight: null,
			dispalyJoinLeft: null,
			activeJoinType: '',
			activeRelation: [{}],
			trigger: false,
			folderName: '',
			sheetName: '未命名工作表',
			folderId: '',
			displayList: [],
			hasRun: false,
			relations: [],
			selectedColumns: [],
			sheetId: null,
			maxCanvasWidth: 0,
			newFolderShow: false,
			newFolderName: '',
			saved: true,
			sourceList: [],
			loading: false,
			sheetElementStore: [],
		}
	},
	methods: {
		// ...mapMutations([
	 //    	'types.SET_TABLE_DATA' // 映射 this.increment() 为 this.$store.commit('increment')
	 //    ]),
	 	addHeader(id) {
	 		let header = [];
	 		this.selectedColumns.forEach((item) => {
	 			if(item.sheetId === id) {
	 				header.push(item);
	 			}
	 		});
	 		return header;
	 	},
	 	checkName(name) {
			const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,30}$/;
			return regex.test(name);
		},
	 	addNewFolder() {
 			if(this.newFolderName.length == 0) {
				this.layerMsg('名称不能为空');
			}
			else if(this.checkName(this.newFolderName)) {
				api.worksheet.newFolder(this.newFolderName).then((response) => {
					if(response.code == 0) {
						this.$parent.$children[this.vueIndex].getData();
						this.newFolderShow = false;
						this.folderId = response.data;
						this.folderName = this.newFolderName;
						this.newFolderName = '';
					} else {
						let msg = response.message || '接口连接失败';
	    				this.layerMsg(msg);
					}
				})
				.catch(function (error) {
	                this.layerMsg('接口连接失败');
	            });
			}
			else {
				this.layerMsg('命名错误！支持中英文，数字，30字符内');
			}
		},
	 	findJoinFields(obj) {
	 		let joinFields = [];
	 		for (let key in obj) {
	 			let temp = {};
	 			temp.left = key.split('.')[1];
	 			temp.right = obj[key].split('.')[1];
	 			joinFields.push(temp);
	 		}
	 		return joinFields;
	 	},
	 	constructNode(id) {
	 		let node = {};
	 		node.id = id;
	 		this.displayList.every((item) => {
				return item.childrens.every((sheet) => {
					if(sheet.sheetId === node.id) {
						sheet.draggable = false;
						return false;
					}
					return true;
				})
			});
			this.$parent.$children[this.vueIndex].$data.trigger = !this.$parent.$children[this.vueIndex].$data.trigger
	 		node.header = this.addHeader(id);
	 		this.relations.forEach((item) => {
	 			if(item.fromSheetId === id) {
	 				if(node.content === undefined) {
	 					node.content = item.fromSheetName;
	 					node.width = this.computeWidth(node) + this.boxPadding * 2 + 18;
	 				}
	 				let child = this.constructNode(item.toSheetId);
	 				child.joinType = this.unFormateJoinType(item.joinType);
	 				child.joinFields = this.findJoinFields(item.joinFields);
	 				child.parentId = node.id;
	 				child.parent = node;
	 				if(!node.childs) {
	 					node.childs = [];
	 				}
	 				node.childs.push(child);
	 			} 
	 			else if(item.toSheetId === id && node.content === undefined) {
	 				node.content = item.toSheetName;
	 				node.width = this.computeWidth(node) + this.boxPadding * 2 + 18;
	 			}
	 		});
	 		return node;
	 	},
	 	getData(id) {
	 		api.worksheet.getSheetDetail(id).then((response) => {
	 			if(response.code == 0) {
	 				this.relations = response.data.relations;
	 				this.selectedColumns = response.data.selectedColumns;
	 				this.folderId = response.data.folderId;
	 				this.sheetName = response.data.sheetName;
	 				this.root = this.constructNode(response.data.usedSheetIds[0]);
	 				response.data.selectedColumns.forEach((item) => {
	 					if(item.checked == 'false' || item.checked == false) {
	 						item.checked = false;
	 					}
	 					else {
	 						item.checked = true
	 					}
	 				})
	 				let obj = {
	 					header: response.data.selectedColumns,
	 					value: response.data.data.values
	 				};
	 				this.$store.dispatch('setTableData', obj);
	 				if(response.data.conditions && response.data.conditionOp) {
		 				let obj = {
		 					conditionOp: response.data.conditionOp,
		 					list: response.data.conditions,
		 					reload: true
		 				};
		 				this.$store.dispatch('setConditions', obj);
		 			}
	 				this.reDraw(this.root);
	 			} else {
	 				let msg = response.message || '接口连接失败';
	    			this.layerMsg(msg);
	 			}
	 		});
	 	},
	 	formateJoinType(type) {
	 		type = type.replace(' ', '_');
	 		type = type.toUpperCase();
	 		return type;
	 	},
	 	unFormateJoinType(type) {
	 		type = type.replace('_', ' ');
	 		type = type.toLowerCase();
	 		return type;
	 	},
	 	checkDuplicate(header) {
	 		let obj = {}
	 		return header.every((item) => {
	 			if(obj[item.columnAlias] !== true) {
	 				if(item.checked) {
	 					obj[item.columnAlias] = true;
	 				}
	 				return true;
	 			}
	 			return false;
	 		});
	 	},
		checkName(name) {
			const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,30}$/;
			return regex.test(name);
		},
		openEditSheetLayer() {
			let oldSheetName = this.sheetName;
			if(this.sheetName === '未命名工作表') {
				this.sheetName = '';
			}
			if(this.folderId === '') {
				this.folderId = this.sourceList[0].folderId;
    			this.folderName = this.sourceList[0].folderName;
			}
			let oldFolderName = this.folderName;
			let oldFolderId = this.folderId;
			let submit = (layero, index) => {
				if(this.sheetName.length === 0) {
					this.layerMsg('名称不能为空');
				}
				else if(!this.checkName(this.sheetName)) {
					this.layerMsg('命名错误！支持中英文，数字，30字符内');
				}
				else if(!this.checkNoDuplicateSheetName(this.sheetName, this.folderId, this.sheetId)) {
					this.layerMsg('重名');
				}
				else {
					layer.close(index);
				}
			}
			let cancel = (layero, index) => {
				this.sheetName = oldSheetName;
				this.folderName = oldFolderName;
				this.folderId = oldFolderId;
			}
			this.layerEditWorksheet2(submit, cancel);
		},
		allowDrop(e) {
			e.preventDefault();
			this.mouseLocation = this.findLocation(e.offsetX, e.offsetY);
			if(this.mouseLocation && this.mouseLocation.type === 'onNode') {
				this.hoverNode = this.mouseLocation.parent;
				this.drawHover(this.hoverNode);	 
			} else if(this.hoverNode){
				this.clearHover(this.hoverNode);
				this.hoverNode = null;
			}
		},
		findLocation(x, y) {
			let location = null;
			if(!this.root) {
				return {type: 'init'};
			} else {
				this.nodeArea.every((item) => {
					if(x > item.fromx
				 	&& x < item.tox
				 	&& y > item.fromy
				 	&& y < item.toy) {
						location = {type: 'onNode', parent: item.node};
						return false;
				 	}
				 	return true;
				});
			}
			return location;
		},
		clearFolderListActive(node) {
			this.displayList.every((item) => {
				return item.childrens.every((sheet) => {
					if(sheet.sheetId === node.id) {
						sheet.draggable = true;
						return false;
					}
					return true;
				})
			});
            this.$parent.$children[this.vueIndex].$data.trigger = !this.$parent.$children[this.vueIndex].$data.trigger;
            if(node.joinType === 'EMPTY') {
				this.canRun -= 1;
			}
            if(node.childs && node.childs.length > 0) {
            	node.childs.forEach((item) => {
            		this.clearFolderListActive(item);
            	});
            }
		},
		deleteAction() {
			this.deleteNode(this.activeNode);
			this.$emit('saved', false);
			this.reDraw(this.root);
		},
		deleteNode(node) {
			let parent = node.parent;
			if (parent) {
				let index = parent.childs.indexOf(node);
				parent.childs.splice(index, 1);
				this.clearFolderListActive(node);
			} else {
				this.root = null;
				this.clearFolderListActive(node);
			}
		},
		findVueIndex() {
			this.$parent.$children.every((item, index) => {
				if(item.$el.id === 'worksheetlist') {
					this.vueIndex = index;
					return false;
				}
				return true;
			});
		},
		drop(e) {
			let location = this.mouseLocation;
			if(!location) {
				this.layerMsg('请拖拽到节点上');
				return;
			};
			let node = {};
			node.id = e.dataTransfer.getData("id");
			node.content = e.dataTransfer.getData("name");
			node.childs = null;
			node.width = this.computeWidth(node) + this.boxPadding * 2 + 18;
			// get header
			api.worksheet.getSheetElements(node.id).then((response) => {
                if(response.code == 0) {
                	this.$emit('saved', false);
                    node.header = response.data.columns;
                    if(location.type === 'init') {
                    	node.parent = null;
                    	node.parentId = null;
                    	this.root = node;
                    	this.reDraw(this.root);
                    	this.displayList.every((item) => {
							return item.childrens.every((sheet) => {
								if(sheet.sheetId === node.id) {
									sheet.draggable = false;
									return false;
								}
								return true;
							})
						});
                    	this.$parent.$children[this.vueIndex].$data.trigger = !this.$parent.$children[this.vueIndex].$data.trigger;
                    } else {
                    	if(!this.hoverNode.childs) {
                    		this.hoverNode.childs = [];
                    	}
                    	this.hoverNode.childs.push(node);
                    	node.parent = this.hoverNode;
                    	node.parentId = this.hoverNode.id;
                    	this.addJoinFields(node);
                    	if(node.joinFields.length === 0) {
                    		this.canRun += 1;
                    		node.joinType = 'EMPTY';
                    	} else {
                    		node.joinType = 'left join';
                    	}
                    	this.reDraw(this.root);
                    	this.displayList.every((item) => {
							return item.childrens.every((sheet) => {
								if(sheet.sheetId === node.id) {
									sheet.draggable = false;
									return false;
								}
								return true;
							})
						});
                    	this.$parent.$children[this.vueIndex].$data.trigger = !this.$parent.$children[this.vueIndex].$data.trigger
                    }
                } else {
                    let msg = response.message || '接口连接失败';
                    this.layerMsg(msg);
                }
            });
            // .catch(function (error) {
            //     console.log(error);
            // });
		},
		addJoinFields(node) {
			let left = node.parent.header;
			let right = node.header;
			let hashMap = {};
			node.joinFields = [];
			left.forEach((item) => {
				hashMap[item.columnName] = true;
			});
			right.every((item) => {
				if(hashMap[item.columnName] === true) {
					let obj = {};
					obj.left = item.columnName;
					obj.right = item.columnName;
					node.joinFields.push(obj);
					return false;
				}
				return true
			});
		},
		clickNode(obj, e) {
			if(this.activeNode && this.activeNode.id === obj.node.id && this.showModifyBox) {
				this.showModifyBox = false;
				this.activeNode = null;
			} else {
				this.activeNode = obj.node;
				this.showModifyBox = true;
				this.modifyBoxX = obj.fromx;
				this.modifyBoxY = obj.toy;
			}
			e.stopPropagation();
		},
		cancelJoin() {
			this.showSetRelation = false;
			this.activeJoinLeft = null;
			this.activeJoinRight = null;
		},
		submitJoin() {
			this.$emit('saved', false);
			let submitRelation = this.activeRelation.filter((item) => {
				if(item.left !== undefined && item.right !== undefined) {
					return true;
				}
				return false;
			});
			if(submitRelation.length === 0 || this.activeJoinType === 'EMPTY') {
				this.layerMsg("关联关系不能为空");
			} else {
				this.activeJoinRight.joinFields.length = 0;
				$.extend(true, this.activeJoinRight.joinFields, submitRelation);
				if(this.activeJoinRight.joinType !== this.activeJoinType) {
					if(this.activeJoinRight.joinType === 'EMPTY') {
						this.canRun -= 1;
					}
					this.activeJoinRight.joinType = this.activeJoinType;
					this.drawJoin(this.activeJoinRight, this.activeJoinLeft);
				}
				this.showSetRelation = false;
			}
		},
		addRelation() {
			this.activeRelation.push({});
		},
		deleteRelation(index) {
			this.activeRelation.splice(index, 1);
		},
		clickJoin(obj, e) {
			this.activeJoinRight = obj.fromNode;
			this.activeJoinLeft = obj.toNode;
			this.activeJoinType = obj.fromNode.joinType;
			this.activeRelation.length = 0;
			this.activeRelation.push({});
			$.extend(true, this.activeRelation, this.activeJoinRight.joinFields);
			this.showSetRelation = true;
			this.setRelationX = obj.fromx;
			this.setRelationY = obj.toy + 10;
			e.stopPropagation();
		},
		clickCanvas(event) {
			this.nodeArea.forEach((item) => {
				if(event.offsetX > item.fromx
			 	&& event.offsetX < item.tox
			 	&& event.offsetY > item.fromy
			 	&& event.offsetY < item.toy) {
					item.callBack(item, event);
					return;
			 	}
			});
			this.joinArea.forEach((item) => {
				if(event.offsetX > item.fromx
			 	&& event.offsetX < item.tox
			 	&& event.offsetY > item.fromy
			 	&& event.offsetY < item.toy) {
					item.callBack(item, event);
					return;
			 	}
			});
		},
		computeLocation(node, level) {
			if(node) {
				node.level = level;
				if(this.maxLevel < level) {
					this.maxLevel = level;
				}
				node.x = this.boxLeftSpacing * level + 20;
				if(node.childs && node.childs.length > 0) {
					node.childs.forEach((item) => {
						this.computeLocation(item, level + 1);
					});
					let index = Math.floor(node.childs.length / 2);
					node.y = node.childs[index].y;
				} else {
					node.y = this.yPoint;
					this.yPoint += (this.boxTopSpacing + this.boxHeight);
				}
				return;
			}
		},
		initTree(nodes) {
			nodes.forEach((node) => {
				node.width = this.computeWidth(node) + this.boxPadding * 2 + 18;
	            if (node.parentId !== null && node.parentId !== undefined) {
	                node.parent = this.getNodeById(node.parentId, nodes);
	                if (!node.parent.childs) {
	                    node.parent.childs = [];
	                }
	                node.parent.childs.push(node);
	            } else {
	            	this.root = node;
	            }
	        });
		},
		getNodeById(id, nodes) {
	        for (let i = 0, len = nodes.length; i < len; i += 1) {
	            if (nodes[i].id == id) {
	                return nodes[i];
	            }
	        }
	    },
		computeWidth(node) {
			let content = node.content;
			let alias = '';
			let str_length = 0
			for(let i = 0, len = content.length; i < len; i += 1) {
				let a = content.charAt(i);
				alias = alias.concat(a);
				str_length += 1;
				if(escape(a).length > 4) {
					//中文字符的长度经编码之后大于4
					str_length += 1;
				} else if(!isNaN(parseInt(a))) {
					str_length += 0.2;
				}
				if(str_length >= this.maxContentLength) {
					node.alias = alias.concat('..');
					return (str_length + 2) * this.letterWidth;
				}
			}
			node.alias = alias;
			return str_length * this.letterWidth;
		},
		drawHover(node) {
			let x = node.x;
			let y = node.y;
			let width = node.width;
			let pWidth = width - this.pWidth;
			this.ctx.fillStyle = "rgb(255, 255, 96)";
			this.ctx.beginPath();
			this.ctx.moveTo(x + pWidth, y);
			this.ctx.lineTo(x + width, y);
			this.ctx.lineTo(x + width, y + this.boxPHeight);
			this.ctx.closePath();
			this.ctx.fill();
		},
		clearHover(node) {
			let x = node.x;
			let y = node.y;
			let width = node.width;
			let pWidth = width - this.pWidth;
			this.ctx.fillStyle = "rgb(255, 255, 255)";
			this.ctx.beginPath();
			this.ctx.moveTo(x + pWidth, y);
			this.ctx.lineTo(x + width, y);
			this.ctx.lineTo(x + width, y + this.boxPHeight);
			this.ctx.closePath();
			this.ctx.fill();
		},
		drawNode(node) {
			let x = node.x;
			let y = node.y;
			let content = node.alias;
			let width = node.width;
			let pWidth = width - this.pWidth;
			// draw
			this.ctx.fillStyle = "rgb(42,166,255)";
			this.ctx.beginPath();
			this.ctx.moveTo(x, y);
			this.ctx.lineTo(x + pWidth, y);
			this.ctx.lineTo(x + width, y + this.boxPHeight);
			this.ctx.lineTo(x + width, y + this.boxHeight);
			this.ctx.lineTo(x, y + this.boxHeight);
			this.ctx.lineTo(x, y);
			this.ctx.fill();
			this.ctx.font = "12px";
			this.ctx.fillStyle = "rgb(255, 255, 255)"; 
			this.ctx.fillText(content, x + 11, y + this.boxHeight - 11);
			// draw icon
			this.ctx.strokeStyle = "rgb(250, 250, 250)";
			this.ctx.beginPath();
			this.ctx.moveTo(x + pWidth + 5, y + this.boxHeight / 2 - 1);
		    this.ctx.lineTo(x + pWidth + 4 + 5, y + this.boxHeight / 2 + 3);
		    this.ctx.lineTo(x + pWidth + 8 + 5, y + this.boxHeight / 2 - 1);
		    this.ctx.stroke();
		    // push to clickArea
		    let obj = {};
		    obj.fromx = node.x;
		    obj.fromy = node.y;
		    obj.tox = node.x + node.width;
		    obj.toy = node.y + this.boxHeight;
		    obj.node = node;
		    obj.type = 'node';
		    obj.callBack = this.clickNode;
		    this.nodeArea.push(obj);
		    let objStore = {
		    	header: node.header,
		    	id: node.id,
		    	sheetName: node.content
		    };
		    this.sheetElementStore.push(objStore);
		},
		drawLine(fromNode, toNode) {
			let startx = fromNode.x;
			let starty = fromNode.y + this.boxHeight / 2;
			let fromx = fromNode.x - this.endLineWidth;
			let fromy = starty;
			let tox = toNode.x + toNode.width + this.endLineWidth;
			let toy = toNode.y + this.boxHeight / 2;
			// draw
			this.ctx.strokeStyle = "rgb(42,166,255)";
			this.ctx.beginPath();
			this.ctx.moveTo(startx, starty);
		    this.ctx.lineTo(fromx, fromy);
		    this.ctx.lineTo(tox, toy);
		    this.ctx.stroke();
		},
		drawJoin(fromNode, toNode) {
			let fromx = fromNode.x - this.endLineWidth;
			let fromy = fromNode.y + this.boxHeight / 2;
			let tox = toNode.x + toNode.width + this.endLineWidth;
			let toy = toNode.y + this.boxHeight / 2;
			let x = (fromx + tox) / 2 - this.joinWidth / 2;
			let y = (fromy + toy) / 2 - this.joinHeight / 2;
			let width = this.joinWidth;
			let height = this.joinHeight;
			let radius = this.joinRadius;
			let content = fromNode.joinType;
			// draw
			this.ctx.fillStyle = "rgb(255, 255, 255)";
			this.ctx.strokeStyle = "rgb(160, 160, 160)";
			if(content === 'EMPTY') {
				this.ctx.fillStyle = "rgb(255, 40, 10)";
				this.ctx.strokeStyle = "rgb(255, 40, 10)";
			}	
			this.ctx.beginPath();  
	        this.ctx.moveTo(x + radius, y);  
	        this.ctx.lineTo(x + width - radius, y);  
	        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);  
	        this.ctx.lineTo(x + width, y + height - radius);  
	        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y+ height);  
	        this.ctx.lineTo(x + radius, y + height);  
	        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);  
	        this.ctx.lineTo(x, y + radius);  
	        this.ctx.quadraticCurveTo(x, y, x + radius, y);  
	        // this.ctx.closePath(); 
	        this.ctx.stroke();
	        this.ctx.fill();
	        // text
	        this.ctx.font = "12px";
	        this.ctx.fillStyle = "rgb(50, 50, 50)";
	        if(content === 'EMPTY') {
	        	this.ctx.fillStyle = "rgb(255, 255, 255)";
	        	this.ctx.fillText(content, x + 8 - (content.length - 9) * 5 - 16, y + height - 4);
	        }
	        else {
				this.ctx.fillText(content, x + 8 - (content.length - 9) * 5, y + height - 4);
			}
			// push to clickArea
		    let obj = {};
		    obj.fromx = x;
		    obj.fromy = y;
		    obj.tox = x + this.joinWidth;
		    obj.toy = y + this.joinHeight;
		    obj.fromNode = fromNode;
		    obj.toNode = toNode;
		    obj.type = 'left join';
		    obj.callBack = this.clickJoin;
		    this.joinArea.push(obj);
		},
		drawArrow(node) {
			let x = node.x + node.width;
			let y = node.y + this.boxHeight / 2;
			let size = this.arrowSize;
			// draw
			this.ctx.fillStyle = "rgb(42,166,255)";
		    this.ctx.beginPath();
		    this.ctx.moveTo(x, y);
		    this.ctx.lineTo(x + size, y - size / 2);
		    this.ctx.lineTo(x + size, y + size / 2);
		    this.ctx.lineTo(x, y);
		    this.ctx.fill();
		    this.ctx.strokeStyle = "rgb(42,166,255)";
			this.ctx.beginPath();
			this.ctx.moveTo(x, y);
			this.ctx.lineTo(x + this.endLineWidth, y);
		    this.ctx.stroke();
		},
		draw(node) {
			if(node) {
				if(node.childs && node.childs.length > 0) {
					node.childs.forEach((item) => {
						this.draw(item);
					});
					this.drawArrow(node);
				}
				this.drawNode(node);
				if(node.parent) {
					this.drawLine(node, node.parent);
					this.drawJoin(node, node.parent);
				}
			}
		},
		reDraw(node) {
			this.maxLevel = 0;
        	this.yPoint = 20;
        	this.nodeArea.length = 0;
        	this.joinArea.length = 0;
        	this.sheetElementStore.length = 0;
			this.computeLocation(node, 0);
			this.canvas.width = Math.max((this.maxLevel + 1) * this.boxLeftSpacing, this.maxCanvasWidth);
			this.canvas.height = Math.max(this.yPoint, 398);
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			if(node === null) {
				this.ctx.fillStyle = "rgb(102, 102, 102)";
				this.ctx.font="12px Microsoft YaHei";
	        	this.ctx.fillText('请拖拽工作表至此区域', this.maxCanvasWidth / 2 - 55, 200);
			}
			else {
				this.draw(node);
				//let arr = [].concat(this.sheetElementStore);
				this.$store.dispatch('setSheetElement', this.sheetElementStore);
			}
		},
		addToSendData(node) {
			this.sendData.usedSheetIds.push(node.id);
			node.header.forEach((item) => {
				let obj = {};
				obj.sheetId = node.id;
				obj.sheetName = node.content;
				obj.columnNameTemp = obj.columnName = item.columnName;
				obj.columnAlias = item.columnAlias;
				obj.edited = false;
				obj.type = item.type;
				obj.checked = item.checked || true;
				//if(this.tableData.header && this.tableData.header.length)
				this.sendData.selectedColumns.push(obj);
			});
			if(node.parent) {
				let obj = {};
				obj.fromSheetId = node.parent.id;
				obj.fromSheetName = node.parent.content;
				obj.toSheetId = node.id;
				obj.toSheetName = node.content;
				obj.joinType = this.formateJoinType(node.joinType);
				obj.joinFields = {};
				node.joinFields.forEach((item) => {
					let key = obj.fromSheetId + '.' + item.left;
					obj.joinFields[key] = obj.toSheetId + '.' + item.right;
				});
				this.sendData.relations.push(obj);
			}
			if(node.childs && node.childs.length > 0) {
				node.childs.forEach((item) => {
					this.addToSendData(item);
				});
			}
		},
		run() {
			if(this.canRun === 0 && this.root) {
				this.sendData = {};
				this.sendData.usedSheetIds = [];
				this.sendData.selectedColumns = [];
				this.sendData.relations = [];
				this.addToSendData(this.root);
				// if(this.tableData.header && this.tableData.header.length > 0) {
				// 	this.sendData.selectedColumns = this.tableData.header;
				// }
				this.sendData.conditions = this.conditions.list;
				this.sendData.conditionOp = this.conditions.conditionOp;
				let index = layer.load(1);
				api.worksheet.runJoined(this.sendData).then((response) => {
					layer.close(index);
					if(response.code == 0) {
						let obj = {
							header: this.sendData.selectedColumns
						};
						obj.value = response.data.values;
						this.$store.dispatch('setTableData', obj);
						this.canSave = true;
					} else {
						let msg = response.message || '接口连接失败';
    					this.layerMsg(msg);
					}
				});
				
			} else if(!this.root){
				this.layerMsg("请先选择节点");
			} else {
				this.layerMsg("请先完善关联关系");
			}
		},
		checkNoDuplicateSheetName(sheetName, folderId, sheetId) {
			return this.sourceList.every((item) => {
				if(item.folderId === folderId) {
					if(item.childrens && item.childrens.length >= 0) {
						return item.childrens.every((sheet) => {
							if(sheet.sheetName === sheetName && sheet.sheetId !== sheetId) {
								return false;
							}
							return true
						});
					}
					return true;
				}
				return true;
			});
		},
		save() {
			if(this.canRun === 0 && this.root) {
				this.sendData = {};
				this.sendData.usedSheetIds = [];
				this.sendData.selectedColumns = [];
				this.sendData.relations = [];
				this.addToSendData(this.root);
				this.sendData.conditions = this.conditions.list;
				this.sendData.conditionOp = this.conditions.conditionOp;
				if(this.tableData.header && this.tableData.header.length > 0) {
					this.sendData.selectedColumns = this.tableData.header;
				}
				this.sendData.sheetName = this.sheetName;
				this.sendData.folderId = this.folderId;
				if(this.sheetId !== null) {
					this.sendData.sheetId = this.sheetId;
				}
				if(this.folderId === '') {
					this.folderId = this.sourceList[0].folderId;
        			this.folderName = this.sourceList[0].folderName;
				}
				if(!this.checkNoDuplicateSheetName(this.sheetName, this.folderId, this.sheetId)) {
					this.layerMsg('工作表重名');
					return;
				}
				if(!this.checkDuplicate(this.sendData.selectedColumns)) {
					this.layerMsg('字段名重复');
					return;
				}
				else {
					let index = layer.load(1);
					api.worksheet.saveJoined(this.sendData).then((response) => {
						layer.close(index);
						if(response.code == 0) {
							this.layerMsg('保存成功');
							//this.$router.push({path:'/worksheet/list'});
						} else {
							let msg = response.message || '接口连接失败';
	    					this.layerMsg(msg);
						}
					});	
				}			
			} else if (!this.root) {
				this.layerMsg("请先选择节点");
			} else {
				this.layerMsg("请先完善关联关系");
			}
		}
	},
	computed: {
        ...mapGetters(['tableData', 'sheetElement', 'conditions'])
    },
}
</script>
<style>
	.innerdiv {
		height: 400px;
		overflow: auto;
		position: absolute;
		left: 223px;
    	right: 13px;
	}
	#jointables {
		position: absolute;
		left: 0;
		right: 0;
	}
	#modifyBox {
		position: relative;
		background-color: #fff;
		width: 70px;
	}
	#modifyBox ul {
		border: 1px solid #ddd;
	}
	#modifyBox ul li {
		padding: 8px 10px;
		cursor: pointer;
	}
	#modifyBox ul li:hover {
		background-color: #eee;
	}
	.setRelation {
		width: 530px;
	    border: 1px solid #ddd;
	    padding: 20px;
	    padding-left: 0px;
	    padding-right: 30px;
	    padding-bottom: 0px;
	    position: relative;
	    background-color: #fff;
	}
	.setRelation .bg-grey th {
		background-color: #ebf1f5;
		padding-left: 10px;
	}
	.setRelation table.bg-grey {
		width: 100%;
	}
	.setRelation .dropdown-btn {
		width: auto;
	}
	.setRelation .fix-width {
		width: 99.5%
	}
	.setRelation .layui-layer-btn {
		padding: 0;
		text-align: right;
		margin-right: -30px;
	}
	.setRelation .layui-layer-btn a {
		cursor: pointer;
	}
	.setRelation .layui-layer-btn1 {
		margin-right: 0px;
	}
	.bor-box-mt {
	    border: 1px solid #e7e7e7;
	    height: 38px;
	    line-height: 38px;
	    padding: 0 10px;
	    background: #f3f7fb;
	}
	.canvas-box {
		height: 420px;
	}
	.loading-container {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 10001;
		/*background-color: rgba(0, 0, 0, 0.5);*/
	}
	.loading-container .loading-innerbox {
		position: relative;
		height: 100%;
		width: 100%;
	}
	.loading-container .loading-innerbox img {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
	}
	.thdiv {
	    width: 169px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	}
</style>