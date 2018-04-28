<style lang="less">
	.nav-item h3,
	.nav-item dd {
		cursor: pointer;
	}
	.not {
		color: #999;
	}
	.domain-list {
		.nav-item dd {
			color: #666;
		}
	}
	.nav-1 dt.close i {
		transform: rotate(-90deg);
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
			<div class="nav-item" v-for="(folder, index) in displayList">
				<dl>
					<dt :class="{close: folder.close}" @click="toggle">
						<i></i>
						<h3 :title="folder.folderName">{{folder.folderName}}</h3>
					</dt>
					<dd class="on" v-for="(sheet, idx) of folder.list" :class="{hide: folder.close}" :title="sheet.sheetName"  @click="selectSheet(sheet)">
						<i class="radio" :class="{'radio-check': selectId == sheet.sheetId}"></i>
						{{sheet.sheetName}}
					</dd>
					<!-- <dd v-if="!folder.list.length">
						<div class="not">暂无工作表，请从&nbsp;<a href="" class="blueLink" @click.prevent="gotoDatasource">数据源添加</a>！</div>
					</dd> -->
				</dl>
			</div>
			<div class="no-result" v-show="!displayList.length">无结果</div>
			<div class="clear"></div>
		</div>
	</div>	
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		name : 'select-table',
		data :function(){
			return {
				query : '',
				sourceList: [],
				displayList: [],
				selectId: -1,
			}
		},

		computed: {
			...mapGetters(['sheets']),
		},
		watch: {
			sheets () {
				this.initSheet();
			}
		},
		methods:{
			initSheet () {
				let folders = this.sheets.folders || [];
				let sheetList = this.sheets.sheetList || [];

				folders.forEach((folder, index) => {
					folder.list = [];
					folder.close = index == 0 ? false : true;
					sheetList.forEach((sheet) => {
						if (folder.folderId == sheet.folderId) {
							folder.list.push(sheet);
						}
					});
				});
				this.sourceList = folders;
				this.search(this.query);
			},
			search (searchKey) {
				// clear displayList
				this.displayList = [];
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
						for (let j = 0, length = folder.list.length; j < length; j++) {	
							var sheet = folder.list[j];
							if(sheet.sheetName.includes(searchKey)) {
								tempChild.push(sheet);	
							}
						}
						if(tempChild.length) {
							$.extend(true, tempFolder, folder);
							tempFolder.list = tempChild;
							tempFolder.close = false;
							this.displayList.push(tempFolder);
						}
					}				
				}
			},
			selectSheet (sheet) {
				this.selectId = sheet.sheetId;
				this.$store.commit('selectSheet', sheet);
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