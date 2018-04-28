<style lang="less">
.nav-item:last-child {
	paddind-bottom: 20px;
}
.nav-item dl {
	overflow: initial !important;
}
.nav dt {
	clear: both;
}
.nav dd {
    padding-left: 30px;
    line-height: 34px;
}
.nav dt h3,
.report-name {
	display: inline-block;
	width: 98px;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
	height: 40px;
	line-height: 40px;
}
.nav span {
	margin-right: 8px;
}
.dashboard .nav dd{
	height: 40px;
    padding-left: 0;
	display: block;
}
.dashboard .hide{
	display: none !important;
}
.not-txt {
	color: #ccc;
	padding-left: 20px;
}

</style>
<template>
	<div class="sidebar">
		<div class="s-leftMenu dashboard">
			<div class="mt">
				报表
				<span class="fold-txt">+新建
					<ul class="fold-drop mt10">
						<li>
							<a href="#" @click.prevent="createFolder">新建文件夹</a>
						</li>
						<li>
							<a href="#" @click.prevent="createReport">新建报表</a>
						</li>
					</ul>
				</span>
			</div>
			<div class="mc">
				<div class="s-search">
					<input type="text" class="s-searchInput" placeholder="请输入关键词搜索" v-model="query" @change="search(query)">
					<a href="javascript:;" class="s-searchBtn" @click.prevent="search(query)"><i class="i31"></i></a>
				</div>
				<div class="nav">
					<div class="nav-item" :id="item.folder.folderId" v-for="(item, index) of displayList">
						<dl>
							<dt :class="{close: item.folder.close}" @click="toggle(item)">
								<i></i>
								<h3 :title="item.folder.folderName">
									{{item.folder.folderName}}
								</h3>
								<span class="fold-txt">
									<span>...</span>
									<ul class="fold-drop">
										<li>
											<a href="#" @click.prevent="rename(item.folder)">重命名</a>
										</li>
										<li>
											<a href="#" @click.prevent.stop="deleteFolder(item.folder, index)">删除</a>
										</li>
									</ul>
								</span>
							</dt>
							<dd v-for="(rep, idx) of item.reports"
								:id="rep.reportId" 
	                        	:class="{on: currentReport.reportId == rep.reportId, hide: item.folder.close}">
								<a href="" class="report-name"  @click.prevent="selectReport(rep, idx)" :title="rep.reportName">{{rep.reportName}}</a>
								<span class="fold-txt">
									<span>...</span>
									<ul class="fold-drop">
									<li><a href="#" @click.prevent="renameReport(rep)">重命名</a></li>
									<li><a href="#" @click.prevent="copyReport(rep)">复制</a></li>
									<li><a href="#" @click.prevent="moveReport(rep, idx)">移动至</a></li>
									<li><a href="#" @click.prevent="deleteReport(rep, idx)">删除</a></li>
									</ul>
								</span>
							</dd>
							<dd :class="{hide: item.folder.close}" v-show="!item.reports.length">
								<div class="not-txt">此文件夹无报表</div>
							</dd>
						</dl>
					</div>
					 <div class="no-result" v-show="!displayList.length && folders.length">无搜索结果</div>
					 <loading v-show="!folders.length"></loading>
				</div>
			</div>
		</div>
		
		<new-report-layer :foldersAndReport="foldersAndReport"></new-report-layer>
		
		<new-folder-layer></new-folder-layer>
	</div>
</template>
<script>
import api from '@/api'
import { mapGetters } from 'vuex'
import newFolder from '@/components/new-folder'
import newReport from '@/components/new-report'

import loading from '@/components/loading'

export default {
	name: 'side-nav',
	data () {
		return {
			query: '',
			sourceList: [],
			displayList: [],
			count: 0,
			currentReportIndex: -1,
			pin: this.$cookie.get('pin'),
			lastReport: null,
			changeReport: {folderId: 0}
		}
	},
	
	components: {
		'new-folder-layer': newFolder,
		'new-report-layer': newReport,
		loading,
	},
	computed: {
		...mapGetters(['newFolder','newReport','reNameFolderId', 'deleteLayer','folders','reports','currentReport']),

		foldersAndReport(){
			return this.initData();
		}
	},
	created () {
		this.$on('create-report', this.createReport);
		this.$on('set-currReport', this.setCurrReport);
	},
	watch: {
		folders () {
			this.initData();
		},
		reports (n) {
			if(n) {
				setTimeout(() => {
					this.$localforage.getItem('report-' + this.pin).then(data => {
						if(!data || data.folderId === '') {
							this.selectReport(n[0], 0);
						} else {
							this.sourceList.forEach((item, index) => {
								item.folder.close = true;
								if(item.folder.folderId == data.folderId) {
									item.folder.close = false;
								}
							});
							this.$store.commit('set_currentReport_key', data);
							this.setCurrReport();
						}
					});
				}, 300);
			}
		}
	},
	methods: {
		toggle (item) {
			item.folder.close = !item.folder.close;
		},
		setLoaclR(item, index) {
            let pin = this.pin;
            this.$localforage.setItem('report-' + pin, {
				folderId: item.folderId,
				reportId: item.reportId,
				reportName: item.reportName,
				index: index,
			});
        },
		initData () {
			var folders = this.folders || [];
			var reportList = this.reports || [];
			var arr = [];
			var obj = {};
			var i ,item;
			for (i = 0; i < folders.length; i++) {
			    item = folders[i];
			    obj[item.folderId] =  []; 
				
				var itemObj = {
					reports : obj[item.folderId],
					folder : item
				}
				arr.push(itemObj);
			}
			for (i = 0; i < reportList.length; i++) {
			    item = reportList[i];
			   
			    if(obj[item.folderId]){
			        obj[item.folderId].push(item);
			    }
			}

			this.sourceList = arr;
			this.search(this.query);

			this.sourceList.forEach(item => {
				if(item.folder.folderId === this.changeReport.folderId) {
					this.lastReport = item.reports[item.reports.length - 1];
					this.lastReport.index = item.reports.length;
				};
			});
			return arr;
		},
		/**
		* 搜素报表
		 */
		search (searchKey) {
			// clear displayList
			this.displayList.length = 0;
			for(let i = 0, length = this.sourceList.length; i < length; i++) {
				var sourceList = this.sourceList[i];
				// filter folder
				if(sourceList.folder.folderName.includes(searchKey)){
					this.displayList.push(sourceList);
				}
				// filter sheet
				else {
					var tempChild = [];
					var tempFolder = {};
					for (let j = 0, length = sourceList.reports.length; j < length; j++) {	
						var report = sourceList.reports[j];

						if(report.reportName.includes(searchKey)) {
							tempChild.push(report);	
						}
					}
					if(tempChild.length) {
						$.extend(true, tempFolder, sourceList);
						tempFolder.reports = tempChild;
						// tempFolder.close = false;
						this.displayList.push(tempFolder);
					}
				}				
			}
		},
		/**
		*选择报表
		* */
		selectReport (item, index) {
			if(item.reportId == this.currentReport.reportId) return;
			this.$store.commit('set_currentReport_key',{
				reportId : item.reportId,
				reportName : item.reportName,
				folderId: item.folderId,
				index: index
			});

			this.setCurrReport();
       		this.setLoaclR(item, index);
		},
		setCurrReport () {
			let item = this.currentReport;

			this.currentReportIndex = item.index;
			this.$store.dispatch('setLoadingStatus', true);
			api.reportDetail({id: item.reportId }).then(res => {
				if(res.code == 0) {
					this.$store.dispatch('selectReport', res.data);
					this.$store.dispatch('setLoadingStatus', false);
				} else {
					this.layerMsg(res.message, 5);	
				}
			}, error => {
				console.log(error)
			});
		},
		/**
		* 重命名文件夹
		 */

		rename(item){
			let data = {
				value: item.folderName,
				status: false,
				verfiy: true,
			}
			this.$store.dispatch('setNewFolder', data);
			this.$store.dispatch('setRenameFolderID', item.folderId);

			this.layerNewFolder('重命名文件夹',(layero, index) => {
				if(this.newFolder.verfiy) {
					let data = {
						newName: this.newFolder.value,
						id : this.reNameFolderId
					};
					let loading = layer.load(1);

					api.modifyFolderName(data).then(res => {
						layer.close(loading);
						if(res.code == 0) {
							layer.close(index);
							// this.resetState();
							this.$events.emit('get-report-list', true);
							this.layerMsg('重命名文件夹成功！', 1);
						}
						else {
							this.layerMsg(res.message, 5);	
						}
					}, error => {
						layer.close(loading);
						// this.resetState();
						console.log(error);
					})
				}
				else {
					this.$events.$emit('verfiy-new-folder');
				}
			}, cancel => {
			})
		},
		/**
		*创建文件夹
		 */
		createFolder () {
			this.layerNewFolder('新建文件夹', (layero, index) => {
				if(this.newFolder.verfiy) {
					let data = {
						folderName: this.newFolder.value,
						type: 1
					}
					let loading = layer.load(1);

					api.createNewFolder(data).then(res => {
						layer.close(loading);
						if(res.code == 0) {
							// this.resetState();
							this.$events.emit('get-report-list', true);
							this.layerMsg('新建文件夹成功！', 1);
							layer.close(index);
						}
						else {
							this.layerMsg(res.message, 5);	
						}
					}, error => {
						// this.resetState();
						layer.close(loading);
						console.log(error);
					})
				}
				else {
					this.$events.$emit('verfiy-new-folder')
				}
			}, cancel => {
				let data = {
					value: '',
					status: false,
					verfiy: false,
				}
				this.$store.dispatch('setNewFolder', data);
			})
		},
		/*
			删除文件夹
		*/
		deleteFolder (item, idx){
			var data = {
				name : item.folderName,
				id : item.folderId,
				type : '文件夹'
			};
			this.$store.dispatch('setDeleteLayer', data);
			this.deleteLayerPro((layero, index) => {
				let loading = layer.load(1);

				api.deleteFolder({id:this.deleteLayer.id}).then(res => {
					layer.close(loading);
					if(res.code == 0) {
						layer.close(index);
						this.folders.forEach((folder) => {
							if(folder.folderId === item.folderId) {
								this.folders.splice(idx, 1);
							}
							if(item.folderId === this.currentReport.folderId) {
								const display = this.displayList[0];
								this.selectReport({
									reportId : display.reports[0].reportId,
									reportName : display.reports[0].reportName,
									folderId: display.reports[0].folderId,
								}, 0);
								display.folder.close = false;
							}
						});
						this.layerMsg('删除文件夹成功', 1);
					} else {
						this.layerMsg(res.message, 5);
					}
				}, error => {
					console.log(error)
				});
			});
		},
		/**
		* 新建报表
		 */
		createReport () {
			this.$store.commit('set_report_key',{
				active : 'create',
				folderId: this.folders[0].folderId,
				folderName: this.folders[0].folderName
			});
			layer.closeAll();

			this.layerNewReport('新建报表', (layero, index) => {
				if(this.newReport.verfiy) {
					let data = {
						name: this.newReport.reprotName,
						folderId: this.newReport.folderId
					}

					let loading = layer.load(1);
					api.createReport(data).then(res => {
						this.changeReport = data;
						layer.close(loading);

						if(res.code == 0) {
							layer.close(index);
							this.$events.emit('get-report-list', true);
							this.layerMsg('新建报表成功！', 1);
							
							setTimeout(() => {
								this.selectReport(this.lastReport, this.lastReport.index);
							}, 200);
						}
						else {
							this.layerMsg(res.message, 5);
						}
					}, error => {
						layer.closeAll();
						console.log(error);
					})
				}
				else {
					this.$events.$emit('verfiy-new-report');
				}
				
			}, cancel => {
				this.$store.dispatch('setNewReport');
			})
		},
		/*
		*重命名报表
		*/

		renameReport(item){
			this.$store.commit('set_report_key', {
				active : 'rename',
				reprotName: item.reportName,
            	reprotId : item.reportId
			});

			this.layerNewReport('重命名报表', (layero, index) => {
				if(this.newReport.verfiy) {
					let data = {
						id: this.newReport.reprotId,
						newName : this.newReport.reprotName
					};
					let newReport = {
						reportId: data.id,
						reportName: data.newName
					}
					
					let loading = layer.load(1);

					api.renameReport(data).then(res => {
						layer.close(loading);
						if(res.code == 0) {
							layer.close(index);
							// this.resetState();
							this.$store.commit('set_currentReport_key', newReport);
							this.$events.emit('get-report-list', true);
							this.layerMsg('重命名报表成功！', 1);
						}
						else {
							this.layerMsg(res.message, 5);
						}
					}, error => {
						layer.close(loading);
						// this.resetState();
						console.log(error);
					})
				}
				else {
					this.$events.$emit('verfiy-new-report');
				}
				
			}, cancel => {
				this.$store.commit('set_report_key',{
					active : 'rename',
					reprotName: '',
					reprotId : item.reportId
				});
			})

		},

		/*
		*复制报表
		*/

		copyReport(item){
			this.$store.commit('set_report_key',{
				active : 'copy',
				currentName: item.reportName,
				reprotId : item.reportId,
				folderId: item.folderId
			});

			this.layerNewReport('复制报表', (layero, index) => {

				if(this.newReport.verfiy) {
					let data = {
						id: this.newReport.reprotId,
						name : this.newReport.reprotName,
						folderId: this.newReport.folderId
					};
					let loading = layer.load(1);
					
					api.copyReport(data).then(res => {
						layer.close(loading);
						if(res.code == 0) {
							layer.close(index);
							// this.resetState()
							this.$events.emit('get-report-list', true);
							this.layerMsg('复制报表成功！', 1)
							// window.location.reload();
						}
						else {
							this.layerMsg(res.message, 5)
						}
					}, error => {
						layer.close(loading);
						// this.resetState();
						console.log(error);
					})
				}
				else {
					this.$events.$emit('verfiy-new-report')
				}
				
			}, cancel => {
				this.$store.commit('set_report_key', {
					active : 'copy',
					currentName: item.reportName,
					reprotId : item.reportId,
					folderId: item.folderId,
					reprotName: ''
				});
			})
		},

		/*
		*移动报表
		*/

		moveReport(item){
			this.$store.commit('set_report_key',{
				active : 'move',
				currentName: item.reportName,
				reprotName: item.reportName,
				verfiy : true,
				reprotId : item.reportId
			});

			this.layerNewReport('移动报表', (layero, index) => {

				if(this.newReport.verfiy) {
					let data = {
						id: this.newReport.reprotId,
						folderId:this.newReport.folderId
					};
					let loading = layer.load(1);
					
					api.moveReport(data).then(res => {
						layer.close(loading);
						if(res.code == 0) {
							layer.close(index);
							// this.resetState();
							this.$events.emit('get-report-list', true);
							this.layerMsg('移动报表成功！', 1);
						}
						else {
							this.layerMsg(res.message, 5);
						}
					}, error => {
						layer.close(loading);
						// this.resetState();
						console.log(error);
					})
				}
				else {
					this.$events.$emit('verfiy-new-report');
				}
				
			}, cancel => {
			})

		},
		/*
			删除报表
		*/
		deleteReport (item, idx){
			var data = {
				name : item.reportName,
				id : item.reportId,
				type : '报表'
			};
			this.$store.dispatch('setDeleteLayer', data);

			this.deleteLayerPro((layero, index) => {
				const data = {id: this.deleteLayer.id };
				const loading = layer.load(1);

				api.deleteReport(data).then(res => {
					layer.close(loading);
					if(res.code == 0) {
						layer.close(index);
						this.$events.emit('get-report-list', true);
						this.displayList.forEach(source => {
							if(source.folder.folderId === item.folderId) {
								source.reports.forEach((report, index) => {
									if(report.reportId === this.currentReport.reportId) {
										source.reports.splice(idx, 1);
										const i = idx - 1 <= 0 ? 0 : idx - 1;
										let currReport = null;
										if(source.reports[i]) {
											currReport =  source.reports[i];
										} else {
											const firstFolder = this.displayList[0];
											currReport = firstFolder.reports[i];
											firstFolder.folder.close = false;
										}
										this.selectReport(currReport, i);

									} else if (report.reportId === item.reportId) {
										source.reports.splice(idx, 1);
									}
								});
							};
						});
						this.layerMsg('删除报表成功!', 1);
					}else{
						this.layerMsg(res.message, 5);
					}
				}, error => {
					layer.close(loading);
					console.log(error);
				})
			});
		}
	}
}
</script>