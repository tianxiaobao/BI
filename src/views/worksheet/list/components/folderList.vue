<style>
	.fold-drop li a{padding-left:10px !important;}
</style>
<template>
	<div id="worksheetlist">
		<div class="s-leftMenu">
			<div style="display:none"> {{trigger}} </div>
	        <div class="mt">
	            工作表
	            <span class="fold-txt" v-show="showAddSpan">+新建
	            	<ul class="fold-drop mt10">
	            		<li>
	            			<a @click="openNewFolderLayer()"
	            				>新建文件夹
	            			</a>
	            		</li>
	            		<li>
	            			<a href="javascript:;" @click.prevent="switchTable">视图创建</a>
	            		</li>
	            		<li>
	            			<a href="#/worksheet/sql">SQL创建</a>
	            		</li>
	            		<li>
	            			<a href="#/worksheet/jointables">多表关联</a>
	            		</li>
	            	</ul>
	            </span>
	        </div>
	        <div class="mc">
	            <div class="s-search">
	                <input type="text" class="s-searchInput" v-model="searchKey" placeholder="请输入关键词搜索" 
	                	@change="search(searchKey)"
	                	>
	            	<a href="javascript:;" @click.prevent="search(searchKey)" class="s-searchBtn">
	            	<i class="i31"></i>
	            	</a>
	            </div>
	            <div class="nav overflow-nav">
	                <div class="nav-item" v-for="(data, pIndex) in displayList">
	                    <dl>
	                        <dt :class="{close: data.close}" 
	                        	>
	                        	<i></i>
	                            <h3 class="mousemove"
	                            	@click="data.close = !data.close; trigger=!trigger"
									@mouseover="showTips($event, data.folderName)" 
	                        		@mouseleave="hideTips($event)"
	                            	>
	                            	{{ data.folderName }}
	                            </h3>
	                            <span class="fold-txt" v-show="showAddSpan">...
	                            	<ul class="fold-drop">
	                            		<li>
	                            			<a @click="openRenameLayer(data.folderId, data.folderName, 'folder', 0)">重命名</a>
	                            		</li>
	                            		<li>
	                            			<a @click="openDeleteLayer(data.folderId, data.folderName, 'folder')">删除</a>
	                            		</li>
	                            	</ul>
	                            </span>
	                        </dt>
	                        <dd :draggable="item.draggable" 
	                        	@dragstart="drag($event, item.sheetId, item.sheetName, pIndex, index)" 
	                        	v-for="(item, index) in data.childrens"
	                        	:class="{on: activeSheet.id == item.sheetId, hide:data.close, undraggable: !item.draggable}"
	                        	>
	                        	<a @click="setActiveSheet(item.sheetId, item.sheetName,item.sheetType,item.dependSheetId)" class="pointer">
	                        		<i :class="{view: item.sheetType == 0, sql: item.sheetType == 1, org: item.sheetType == 2, join: item.sheetType == 3}">
	                        		</i>
	                        		<a class="mousemove"
	                        			@mouseover="showTips($event, item.sheetName)"
	                        			@mouseleave="hideTips($event)"
	                        			>
	                        			{{ item.sheetName }}
	                        		</a>
	                        	</a>
	                        	<span class="fold-txt" v-show="showAddSpan">...
	                        		<ul class="fold-drop">
	                        			<li>
	                        				<a @click="openRenameLayer(item.sheetId, item.sheetName, 'sheet', data.folderId)">重命名</a>
	                        			</li>
	                        			<li>
	                        				<a @click="openCopyLayer(item.sheetId, 
	                        					item.sheetName, data.folderId, data.folderName)">复制</a>
	                        			</li>
	                        			<li>
	                        				<a @click="openMoveLayer(item.sheetId, 
	                        					item.sheetName, data.folderId, data.folderName)">移动至</a>
	                        			</li>
	                        			<li>
	                        				<a @click="openDeleteLayer(item.sheetId, item.sheetName, 'sheet')">删除</a>
	                        			</li>
	                        		</ul>
	                        	</span>
	                        </dd>
	                    </dl>
	                </div>
	                <div class="no-result" v-show="!displayList.length && !loading">无搜索结果</div>
	                <loading v-show="loading"></loading>
	            </div>
	        </div>
	        <div id="tipsBox" v-show="showTipsBox" :style="{left: tipsBoxX + 'px', top: tipsBoxY + 'px'}">
	        	<ul>
	        		<li>
	        			名称: {{ tipsContent }}
	        		</li>
	        	</ul>
	        </div>
	    </div>
	    
	    <!-- 弹出层后续移除去 -->
	    <!-- 新建文件夹 弹出层 -->
		<div class="popup newFolder" style="display:none;">
		    <ul class="listItem">
		        <li class="first"><p class="tit">文件夹名称：</p><p class="con"><input type="text" class="inputMode w430" v-model="newFolderName"></p>
		            <p class="tips">支持中英文，数字，30字符内</p>
		        </li>
		    </ul>
		</div>
		<!-- 重命名 弹出层 -->
		<div class="popup addRechristen" style="display:none;">
	    	<ul class="listItem">
	            <li class="first"><p class="tit pal">当前名称：</p>
	              <div class="con">
	                  {{ sName }}
	              </div>
	            </li>
	        	<li><p class="tit"><span v-show="type == 'folder'">文件夹</span><span v-show="type == 'sheet'">工作表</span>名称：</p><p class="con"><input type="text" class="inputMode w430" v-model="newName"></p>
	            	<p class="tips">支持中英文，数字，30字符内</p>
	            </li>
	        </ul>
		</div>
		<!-- 复制 弹出层 -->
		<div class="popup addCopy" style="display:none;">
	    	<ul class="listItem">
	            <li class="first"><p class="tit pal">当前名称：</p>
	              <div class="con">
	                  {{ sName }}
	              </div>
	            </li>
	        	<li><p class="tit">工作表名称：</p><p class="con"><input type="text" class="inputMode w430" v-model="newName"></p>
	            	<p class="tips">支持中英文，数字，30字符内</p>
	            </li>
	        	<li><p class="tit">文件夹：</p>
	            	<div class="con" v-show="!newFolderShow">
	                	<div class="select-box w335 fl">
	                        <div class="dropdown-btn"><span class="select-value">{{ sFolder }}</span><i class="arr"></i></div>
	                        <div class="dropdown-list">
	                            <ul>
	                                <li v-for="data in sourceList"
	                                	@click="newFolderId = data.folderId;sFolder = data.folderName"
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
		
		<!-- 移动 弹出层 -->
		<div class="popup moveSheet" style="display:none;">
	    	<ul class="listItem">
	            <li class="first"><p class="tit pal">工作表名称：</p>
	              <div class="con">
	                  {{ sName }}
	              </div>
	            </li>
	        	<li>
	        		<p class="tit">文件夹：</p>
	            	<div class="con" v-show="!newFolderShow">
	                	<div class="select-box w335 fl">
	                        <div class="dropdown-btn"><span class="select-value">{{ sFolder }}</span><i class="arr"></i></div>
	                        <div class="dropdown-list">
	                            <ul>
	                                <li v-for="data in sourceList"
	                                	@click="newFolderId = data.folderId;sFolder = data.folderName"
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
		<!-- 视图创建选择工作表开始 -->
		<div class="popup selectWorksheet" style="display:none;">
			<div class="s-search white-bg fr">
				<input type="text" class="s-searchInput" v-model="query" placeholder="请输入关键词搜索">
				<a href="javascript:;" class="s-searchBtn"> <i class="i31"></i></a>
			</div>
			<div  class="clear"></div>
			<div class="nav-1 domain-list">
				<div class="nav-item" v-for="(folder, index) in displaySheet">
					<dl>
						<dt :class="{close: folder.close}" @click="folder.close=!folder.close">
							<i></i>
							<h3 :title="folder.folderName">{{folder.folderName}}</h3>
						</dt>
						<dd class="on" v-for="(sheet, idx) of folder.childrens" :class="{hide: folder.close}" :title="sheet.sheetName"  @click="checkTable(sheet)">
							<i class="radio" :class="{'radio-check':table==sheet.sheetName}"></i>
							{{sheet.sheetName}}
						</dd>
					</dl>
				</div>
				<div class="no-result" v-show="!displaySheet.length">无搜索结果</div>
				<div  class="clear"></div>
			</div>
		</div>
		<!-- 视图创建选择工作表结束 -->
	</div>
</template>
<script>
import api from '../../../../api'
import { mapGetters } from 'vuex'
import loading from '../../../../components/loading'
export default {
	name: 'folder-list',
	components: { loading },
	data() {
		return {
			sourceList: [],		// 原始数据
			displayList: [],	// 处理后用于展示的数据
			trigger: true,		// trigger view to update
			searchKey: '',
			/**
			 * [the below values are used for use for rename, moveSheet, copeSheet...]
			 */
			newFolderName: '',
			sName: '',	 		// source name
			sFolder: '', 		// source folder
			type: '', 
			newName: '',
			newFolderId: '',
			loading: true,
			query:'',//筛选工作表的key
			displaySheet:[],//工作表展示list
			table:'',//选择的工作表名
			tableId:'',//工作表id
			tipsBoxX: 0,
			tipsBoxY: 0,
			showTipsBox: false,
			tipsContent: '',
			newFolderShow: false
		}
	},
	props: {
		showAddSpan: {
			type: Boolean,
			default: false
		}
	},
	created() {
		this.getData();
	},
	watch: {
        // 工作表筛选
        query(val){
            this.searchSheet(val);
        }
    },
	methods: {
		/* 处理过长的字符串，截取并添加省略号
		 * 注：半角长度为1，全角长度为2
		 * str:字符串
		 * len:截取长度
		 * return: 截取后的字符串
		 */
		// cutbytestr(str, len) {
		// 	var str_length = 0;
		// 	var str_len = 0;
		// 	var str_cut = new String();
		// 	str_len = str.length;
		// 	for (var i = 0; i < str_len; i++) {
		// 		let a = str.charAt(i);
		// 		str_length++;
		// 		if (escape(a).length > 4) {
		// 			//中文字符的长度经编码之后大于4
		// 			str_length++;
		// 		}
		// 		str_cut = str_cut.concat(a);
		// 		if (str_length >= len) {
		// 			str_cut = str_cut.concat("…");
		// 			return str_cut;
		// 		}
		// 	}
		// 	//如果给定字符串小于指定长度，则返回源字符串；
		// 	if (str_length < len) {
		// 		return str;
		// 	}
		// },
		addNewFolder() {
 			if(this.newFolderName.length == 0) {
				this.layerMsg('名称不能为空');
			}
			else if(this.checkName(this.newFolderName)) {
				api.worksheet.newFolder(this.newFolderName).then((response) => {
					if(response.code == 0) {
						this.getData();
						this.newFolderShow = false;
						this.newFolderId = response.data;
						this.sFolder = this.newFolderName;
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
		drag(e, id, name, pIndex, index) {
			e.dataTransfer.setData("id", id);
			e.dataTransfer.setData('name', name);
			// e.dataTransfer.setData('pIndex', pIndex);
			// e.dataTransfer.setData('index', index);
		},
		// get worksheet list
		getData() {
			api.worksheet.getWorksheetList().then((response) => {
				this.loading = false;
				if(response.code == 0 && response!=null && response!='') {
					this.sourceList.length = 0;
					$.extend(true, this.sourceList, response.data.folders)
					// this.sourceList = response.data.folders;
					let tempfile = response.data.sheetList || [];
					// add sheet to folder
					this.sourceList.forEach((item, index) => {
						item.close = true;
						// item.alias = this.cutbytestr(item.folderName, 16);
						if(!index) {
							item.close = false;
						}
						item.childrens = [];
						for(let i = 0, length = tempfile.length; i < length; i++) {
							// tempfile[i].alias = this.cutbytestr(tempfile[i].sheetName, 12);
							tempfile[i].draggable = true;
							if(tempfile[i].folderId === item.folderId) {
								item.childrens.push(tempfile[i]);
							}
						}
					});
					// set first sheet as activesheet
					if(this.sourceList[0].childrens[0]){
					let selectedOne = this.sourceList[0].childrens[0];
					this.$store.dispatch('setActiveSheet', {'id': selectedOne.sheetId, 'name': selectedOne.sheetName,'type':selectedOne.sheetType,dependSheetId:selectedOne.dependSheetId});
					}else{
						this.$store.dispatch('setActiveSheet', {'id': '', 'name': '','type':'',dependSheetId:''});
					}
					// generate 'displayList' which is used in template
					this.search(this.searchKey);

				}
				else {
                    let msg = response.message || '接口连接失败';
                    this.layerMsg(msg);
                }
			})
			.catch(function (error) {
                this.layerMsg('接口连接失败');
                // console.log(error);
            });
		},
		/**
		 * [filter data by searchKey, generate 'displayList' which is used in template]
		 * @param  {[String]} searchKey []
		 * @return {[type]}           	[]
		 */
		search(searchKey) {
			// clear displayList
			this.displayList.length = 0;
			for(let i = 0, length = this.sourceList.length; i < length; i++) {
				var folder = this.sourceList[i];
				// filter folder
				if(folder.folderName.includes(searchKey)){
					this.displayList.push(folder);
				}
				// filter sheet
				else {
					var tempChild = [];
					var tempFolder = {};
					for (let j = 0, length = folder.childrens.length; j < length; j++) {	
						var sheet = folder.childrens[j];
						if(sheet.sheetName.includes(searchKey)) {
							tempChild.push(sheet);	
						}
					}
					if(tempChild.length) {
						$.extend(true, tempFolder, folder);
						tempFolder.childrens = tempChild;
						tempFolder.close = false;
						this.displayList.push(tempFolder);
					}
				}				
			}
			this.trigger = !this.trigger;
		},
		reduceResponse(response, index) {
			if(response.code == 0) {
				layer.close(index);
                this.$store.commit('SHOW_OPERATION_SUCCESS');
                this.getData();
            }
            else {
            	let msg = response.message || '操作失败';
                this.layerMsg(msg);
            }
		},
		checkName(name) {
			const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,30}$/;
			return regex.test(name);
		},
		checkNoDuplicateName(name, folderId) {
			return this.sourceList.every((item) => {
				if(item.folderId === folderId) {
					return item.childrens.every((sheet) => {
						if(sheet.sheetName === name) {
							return false;
						}
						return true;
					})
				}
				return true;
			})
		},
		openNewFolderLayer() {
			let action = (layero, index) => {
				if(this.newFolderName.length == 0) {
					this.layerMsg('名称不能为空');
				}
				else if(this.checkName(this.newFolderName)) {
					api.worksheet.newFolder(this.newFolderName).then((response) => {
						this.reduceResponse(response, index);
					})
					.catch(function (error) {
		                this.layerMsg('接口连接失败');
		            });
				}
				else {
					this.layerMsg('命名错误！支持中英文，数字，30字符内');
				}
			}
			this.layerNewFolder('新建文件夹', action);
		},
		openRenameLayer(id, sName, type, folderId) {
			this.newName = '';
			this.sName = sName;
			this.type = type;
			let renameType = 'renameSheet';
			if(this.type == 'folder') {
				renameType = 'renameFolder';
			}
			let rename = (layero, index) => {
				if(this.newName != this.sName) {
					if(this.newName.length == 0) {
						this.layerMsg('名称不能为空');
					} else if(type === 'sheet' && !this.checkNoDuplicateName(this.newName, folderId)) {
						this.layerMsg('工作表重名');
					} else if(this.checkName(this.newName)) {
						api.worksheet[renameType](id, this.newName).then((response) => {
							this.reduceResponse(response, index);
						})
						.catch(function (error) {
			                this.layerMsg('接口连接失败');
			            });
					}
					else {
						this.layerMsg('命名错误！支持中英文，数字，30字符内');
					}
					
				}
				else {
					this.layerMsg('与当前名称相同');
				}
			};
			this.layerRename(rename);	
		},
		openCopyLayer(sheetId, sheetName, folderId, newFolderName) {
			this.newName = '';
			this.sName = sheetName;
        	this.sFolder = newFolderName;
        	this.newFolderId = folderId;
        	this.newFolderShow = false;
        	this.newFolderName = '';
			let copyAction = (layero, index) => {
				if(this.newFolderShow) {
					this.layerMsg('新建文件夹未保存');
				} else if(this.newName.length == 0) {
					this.layerMsg('名称不能为空');
				} else if(!this.checkNoDuplicateName(this.newName, this.newFolderId)) {
					this.layerMsg('工作表重名');
				} else if(this.checkName(this.newName)) {
					api.worksheet.copySheet(sheetId, this.newName, this.newFolderId).then((response) => {
						this.reduceResponse(response, index);
					})
					.catch(function (error) {
		                this.layerMsg('接口连接失败');
		            });
				} else {
					this.layerMsg('命名错误！支持中英文，数字，30字符内');
				}	
			};
			this.layerCopySheet(copyAction);	
		},
		openDeleteLayer(id, name, type) {
			this.type = type;
			let deleteType = 'deleteSheet';
			if(this.type == 'folder') {
				deleteType = 'deleteFolder';
			}
			let deleteAction = (layero, index) => {
				api.worksheet[deleteType](id).then((response) => {
					this.reduceResponse(response, index);
				})
				.catch(function (error) {
	                this.layerMsg('接口连接失败');
	            });
			}
            this.layerConfirm('删除', '确认删除：' + name + '？', deleteAction);
        },
        openMoveLayer(sheetId, sheetName, folderId, newFolderName) {
        	this.newFolderShow = false;
        	this.newFolderName = '';
        	this.sName = sheetName;
        	this.sFolder = newFolderName;
        	this.newFolderId = folderId;
        	let moveAction = (layero, index) => {
        		if(this.newFolderShow) {
        			this.layerMsg('新建文件夹未保存')
        		} else if(!this.checkNoDuplicateName(sheetName, this.newFolderId)) {
					this.layerMsg('工作表重名');
				} else {
        			api.worksheet.moveSheet(sheetId, this.newFolderId).then((response) => {
						this.reduceResponse(response, index);
					})
					.catch(function (error) {
		                this.layerMsg('接口连接失败');
		            });
        		}
				
			};
        	this.layerMoveSheet(moveAction);
        },

        setActiveSheet(id, name,type,dependSheetId) {
        	this.$store.dispatch('setActiveSheet', {'id': id, 'name': name, 'type':type,dependSheetId});
        },
        // 视图创建选择工作表
        switchTable(){
        	this.query = '';
        	this.searchSheet(this.query);
        	this.layerSelectWorksheet((layero, index) => {
				if(this.tableId && this.table){
					this.$router.replace({
						path: '/worksheet/view',
						query: {
							tableId : this.tableId,
							table: this.table
						}
					});
					layer.close(index);
				}
            }, cancel => {
                console.log('cancel')
            })
        },
		checkTable (item) {
			if(this.table == item.sheetName){
				return false;
			}else{
				this.table = item.sheetName;
				this.tableId = item.sheetId;
			}
		},
		// 工作表筛选
		searchSheet(searchKey) {
			// clear displaySheet
			this.displaySheet.length = 0;
			for(let i = 0, length = this.sourceList.length; i < length; i++) {
				var folder = this.sourceList[i];
				// filter folder
				if(folder.folderName.includes(searchKey)){
					this.displaySheet.push(folder);
				}
				// filter sheet
				else {
					var tempChild = [];
					var tempFolder = {};
					for (let j = 0, length = folder.childrens.length; j < length; j++) {
						var sheet = folder.childrens[j];
						if(sheet.sheetName.includes(searchKey)) {
							tempChild.push(sheet);
						}
					}
					if(tempChild.length) {
						$.extend(true, tempFolder, folder);
						tempFolder.childrens = tempChild;
						tempFolder.close = false;
						this.displaySheet.push(tempFolder);
					}
				}
			}
			// copy数组，避免与左侧的工作表筛选共用一个数组
			this.displaySheet = copyArr(this.displaySheet);
			// 数组深度copy函数
			function copyArr(arr){
				return arr.map((e)=>{
					if(typeof e === 'object'){
						return Object.assign({},e)
					}else{
						return e
					}
				})
			}
		},
		showTips(e, name) {
			this.tipsContent = name;
			this.tipsBoxX = 202;
			this.tipsBoxY = e.clientY - e.offsetY - 107;
			this.showTipsBox = true;
			e.stopPropagation();
		},
		hideTips(e) {
			this.showTipsBox = false;
			e.stopPropagation();
		}
	},
	computed: {
		...mapGetters(['activeSheet']),
	}
}
</script>
<style>
	#worksheetlist .nav dd.on a, #worksheetlist .nav dd a{
		padding-left: 0;
	}
	#worksheetlist .nav dd{
		display: block;
	}
	#worksheetlist .hide{
		display: none !important;
	}
	.no-result {
		color: #ddd;
		text-align: center;
		padding: 20px;
	}
	#tipsBox {
		position: absolute;
		background-color: #fff;
		z-index: 1000;
		border: 1px solid #ddd;
		padding: 6px 12px;
		border-radius: 3px;
		min-width: 100px;
	}
	a.mousemove {
		padding: 8px 0;
	}
	.pointer {
		cursor: pointer;
	}
	.overflow-nav {
        position: absolute;
        top: 90px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .overflow-nav .nav-item dl {
        overflow: initial;
    }
    #worksheetlist .tit {
    	word-break: break-all;
    }
    #worksheetlist .con {
    	word-break: break-all;
    }
    .textCon {
    	word-break: break-all;
    }
    #worksheetlist .nav dd i {
	    width: 16px;
	    height: 19px;
	    display: inline-block;
	    vertical-align: middle;
	    margin-right: 5px; 
	}
	#worksheetlist i.view {
		background: url(../../../../images/view.png) no-repeat
	}
	#worksheetlist i.sql {
		background: url(../../../../images/sql.png) no-repeat
	}
	#worksheetlist i.org {
		background: url(../../../../images/org.png) no-repeat
	}
	#worksheetlist i.join {
		background: url(../../../../images/join.png) no-repeat
	}
	/*#worksheetlist .nav dd.on:hover span.fold-txt {
		display: block;
	}*/
	#worksheetlist .s-leftMenu {
		overflow: initial !important;
    	z-index: 1!important;
	}
	#worksheetlist .s-leftMenu .nav {
	    overflow-x: hidden;
	    overflow-y: auto;
	    position: absolute;
	    padding-bottom: 150px;
	}
	.undraggable {
		border: 2px solid #2aafff;
		background-color: #fff;
		margin-top: -2px;
	}
	.undraggable:before {
		content: '√';
		position: absolute;
		left: 14px;
		color: #2aafff;
	}
	dl dd.undraggable:nth-child(2) {
		margin-top: 0;
	}
	#worksheetlist .overflow-nav dd a.pointer {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 120px;
		display: inline-block;
		vertical-align: middle;
	}
	#worksheetlist .overflow-nav dt h3 {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		display: inline-block;
		vertical-align: middle;
	}

</style>