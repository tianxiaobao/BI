<style>
	.nav-item h3,
	.nav-item dd {
		cursor: pointer;
	}
</style>
<template>
	<div class="popup selectWorksheet" style="display:none;">
		<div class="s-search white-bg fr">
			<input type="text" class="s-searchInput" v-model="query" placeholder="请输入关键词搜索"  @change="search(query)">	
			<a href="javascript:;" class="s-searchBtn" @click.prevent="search(query)"> <i class="i31"></i></a>
		</div>
		<div  class="clear"></div>
		<div class="nav-1 domain-list">
			<div id="tableObj">{{tableObj}}</div>
			<div class="nav-item" v-for="(folder, index) in displayList">
				<dl>
					<dt :class="{close: folder.close}" @click="toggle">
						<i></i>
						<h3 :title="folder.folderName">{{folder.folderName}}</h3>
					</dt>
					<dd class="on" v-for="(sheet, idx) of folder.list" :class="{hide: folder.close}" :title="sheet.sheetName"  @click="checkTable(sheet)">
						<i class="radio" :class="{'radio-check':table==sheet.sheetId}"></i>
						{{sheet.sheetName}}
					</dd>
					<dd v-if="!folder.list.length">
						<div>暂无工作表，请从&nbsp;<a href="" class="blueLink" @click.prevent="gotoDatasource">数据源添加</a>！</div>
					</dd>
				</dl>
			</div>
			<div class="no-result" v-show="!displayList.length">无搜索结果</div>
			<div  class="clear"></div>
		</div>
	</div>	
</template>

<script>
	export default {
		name : 'select-table',
		props:['table','tableList'],
		data :function(){
			return {
				query : '',
				sourceList: [],
				displayList: [],
			}
		},
		computed: {
			tableObj: function(){
				var folders = this.tableList.folders || [];
				var sheetList = this.tableList.sheetList || [];


				for (var i = 0; i < folders.length; i++) {
					var folder = folders[i];
					folder.list = [];
					folder.close = true;
					if(i == 0) {
						folder.close = false;
					}
					for (var j = 0; j < sheetList.length; j++) {
						var sheet = sheetList[j];
						if (folder.folderId == sheet.folderId) {
							folder.list.push(sheet);
						}
					}
				}
				this.sourceList = folders;
				this.search(this.query);
				$('#tableObj').remove();
				return folders;
			}
		},
		methods:{
			search (searchKey) {
				// clear displayList
				this.displayList.length = 0;
				for(let i = 0, length = this.sourceList.length; i < length; i++) {
					var folder = this.sourceList[i];
					// console.log(folder)
					// filter folder
					if(folder.folderName.includes(searchKey)){
						this.displayList.push(folder);
					}
					// filter sheet
					else {
						var tempChild = [];
						var tempFolder = {};
						for (let j = 0, length = folder.list.length; j < length; j++) {	
							var sheet = folder.list[j];
							// console.log(sheet)
							if(sheet.sheetName.includes(searchKey)) {
								tempChild.push(sheet);	
							}
						}
						if(tempChild.length) {
							$.extend(true, tempFolder, folder);
							tempFolder.list = tempChild;
							tempFolder.close = false;
							this.displayList.push(tempFolder);
							console.log(tempFolder)
						}
					}				
				}
			},
			checkTable (item) {
				if(this.table == item.sheetName){
					return false;
				}
				this.$emit('checked',item);
			},
			toggle (e) {
				let $dt = $(e.target).parent('dt');
				$dt.toggleClass("close").siblings("dd").toggle(200);
			},
			gotoDatasource () {
				layer.closeAll();
				this.$router.replace('datasource');
			}
		}
	}
</script>