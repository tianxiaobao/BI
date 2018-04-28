<style>
	.workTable{position: relative;z-index: 1000;}
</style>
<template>
	<div class = "workTable">
		<div class="s-leftMenu">
			<div class="mt">工作表</div>
			<div class="mc">
				<div class="fore mt10">
					<span class="fl blueLink" v-bind:title="sheet_name" @click="preview">{{sheet_name}}</span>
					<span class="fr blueLink" @click="switchTable">切换</span>
				</div>

				<div class="s-search">
					<input type="text" class="s-searchInput" placeholder="请输入关键词搜索" v-model="key">	
					<a href="javascript:;" class="s-searchBtn"> <i class="i31"></i>
					</a>
				</div>
				<ul class="view fuild-list">
					<li v-for="column in filterColumns" class="bor" @mousedown.prevent="mousedown(column)">
						<a href="javascript:;" v-if="column.type=='DATE'" v-bind:title="column.columnName"> <i class="icon1"></i>
							{{column.columnName}}
						</a>
						<a href="javascript:;" v-else-if="column.type=='TEXT'" v-bind:title="column.columnName">
							<i class="icon2"></i>
							{{column.columnName}}
						</a>
						<a href="javascript:;" v-else-if="column.type=='NUMBER'" v-bind:title="column.columnName">
							<i class="icon3"></i>
							{{column.columnName}}
						</a>
						<a href="javascript:;" v-else v-bind:title="column.columnName">
							<i class="icon3"></i>
							{{column.columnName}}
						</a>
					</li>
				</ul>
				<div class="tcenter gray mt10" v-if="!filterColumns.length">无相关数据</div>
			</div>


			<div class="popup preview_sheet" style="display:none;">
				<div class="bor-box">
					<table class="listTable bt-none">
						<thead>
							<tr class="tcenter trGray">
								<th v-for="item in origin_headers">{{item}}</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item,index) in origin_values" v-bind:class="{'trGray': index%2==1}">
								<td v-for="it in item">{{it}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

		</div>
		
		
		<select-table :table="sheet_id" :tableList="tableList" v-on:checked = "checkTable"></select-table>
	</div>
</template>

<script>

	import api from '../api'
	
	import selectTable from '../views/dashboard/select-table.vue'

	import {
	    getQuery
	} from '@/components/tool.js'

	export default {

		props:["wds","zbs","sortList",'columns'],

		components: {
	        'select-table' : selectTable
	    },

	    mounted () {

	    	let query = getQuery();
	    	var tableId = query.tableId;

	        if(tableId && tableId != "0"){
	            this.initSheet(tableId);
	        }
	    },

	    data(){
	    	return {
	    		sheet_name : '',
	    		sheet_id : '',

	    		origin_values: [],
            	origin_headers:[],

	    		tableList :{
	                folders : [],
	                sheetList:[]
	            },
	    		key : '',
	    	}
	    },

	    computed: {
	        filterColumns(){
	        	var columns = this.columns;
	        	var val = this.key;
	        	return columns.filter(function (item) {
	        	    return item.columnName.toLowerCase().indexOf(val.toLowerCase()) != -1;
	        	});
	        },
	    },

	    methods:{
	    	mousedown(item){
	    		this.$events.emit('mousedown',item);
	    	},
	    	/*预览数据*/
	    	preview(){
	    	    var __l = layer.load(1);
	    	    api.preview({
	    	        id : this.sheet_id,
	    	        maxSize:10
	    	    })
	    	    .then(
	    	    res => {
	    	        if(res.code == 0){
	    	            this.origin_headers = res.data.headers;
	    	            this.origin_values = res.data.values;

	    	            this.$nextTick(()=>{
	    	                layer.open({
	    	                    title: '预览数据',
	    	                    type: 1,
	    	                    shade: false,
	    	                    content: $('.preview_sheet'),
	    	                    area: '1100px',
	    	                });
	    	            })
	    	        }else{
	    	            this.layerMsg(res.message);
	    	        }
	    	        layer.close(__l)
	    	    }, 
	    	    error => {
	    	        layer.close(__l);
	    	    })
	    	},

	    	/*初始化字段*/
	    	initSheet(tableId,is_switch){
	    	    this.sheet_id = tableId;
	    	    api
	    	    .getSheetById({sheetId: tableId})
	    	    .then(res => {
    	            if(res.code == 0) {
	    	            this.sheet_name = res.data.sheetName;
	    	            this.$emit('update-sheet-column',{
	    	            	tableId,
	    	            	columns : res.data.columns,
	    	            	is_switch
	    	            });
    	            }
    	        }, error => {
    	            console.log(error)
    	        })
	    	},

	    	/*切换工作表*/
	    	switchTable(){
	    	    var current_sheet_id = this.sheet_id;
	    	    var current_sheet_name = this.sheet_name;
	    	    var __l = layer.load(1);
	    	    var that = this;
	    	    api
	    	    .sheetList()
	    	    .then(
	    	    res=>{
	    	        if(res.code == 0){
	    	            that.tableList.folders = res.data.folders;
	    	            that.tableList.sheetList = res.data.sheetList;
    	                layer.open({
    	                    title: '选择工作表',
    	                    type: 1,
    	                    shade: false,
    	                    content: $('.selectWorksheet'),
    	                    area: '520px',
    	                    btn: ['确定', '取消'],
    	                    yes: function(index, layero){
	                            if(that.sheet_id != current_sheet_id){
	                                that.initSheet(that.sheet_id,true);
	                            }
	                            layer.close(index);
    	                    },
    	                    cancel: function(index){
	                            that.sheet_id = current_sheet_id ;
	                            that.sheet_name = current_sheet_name ;
    	                    }
    	                });
	    	        }else{
	    	            this.layerMsg(res.message);
	    	        }
	    	        layer.close(__l);
	    	    },
	    	    error=>{
	    	        layer.close(__l);
	    	    })
	    	},
	    	/*选择工作表*/
	    	checkTable:function(item){
	            this.sheet_name = item.sheetName;
	            this.sheet_id = item.sheetId;
	        },

	    }
	}

</script>