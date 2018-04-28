<style lang="less">
	.ells {
		
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.data-filter {
		padding-bottom: 100px;
		.dropdown-btn {
			span {
				width: 82%;
				display: inline-block;
				.ells;
			}
		}
		.dropdown-list {
			li {
				a {
					.ells;
				}
			}
		}
	}
	.add-row-btn {
		margin-top: 20px;
	}
</style>
<template>
	<div class="buildCon data-filter">
        <ul class="listItem pad10">

            <li><p class="tit start-tips">满足下列：</p>
                <div class="con mb10">
                	<div class="select-box shorter">
				        <div class="dropdown-btn">
				        	<span>{{currentOpt.value}}</span>
				        	<span class="select-value"></span><i class="arr"></i>
				        </div>
				        <div class="dropdown-list">
				             <ul>
				                <li v-for="(opt, index) of condite" @click="selectCondite(opt, index)" :class="{active: selectIndex == index}">
				                	<a href="javascript:;">{{opt.value}}</a>
				                </li>
				             </ul>
				        </div>
				    </div>
                </div>
                <!-- 选择表 -->
                <div class="con mb10" v-for="(row, index) of dataRow">
                	<div class="select-box shorter mr10 fl">
				        <div class="dropdown-btn">
				        	<span>{{ row.selectTable.name }}</span>
				        	<span class="select-value"></span><i class="arr"></i>
				        </div>
				        <div class="dropdown-list">
				             <ul>
				                <li v-for="(opt, optIndex) of row.table" :class="{active: row.selectTable.id == opt.id}">
				                	<a href="javascript:;"  @click="selectTable(opt, index)">{{opt.name}}</a>
				                </li>
				             </ul>
				        </div>
				    </div>
				   <!-- 选择字段 -->
				    <div class="select-box shorter mr10 fl">
				        <div class="dropdown-btn" style="width: 100px">
				        	<span>{{row.selectHead.name}}</span>
				        	<span class="select-value"></span><i class="arr"></i>
				        </div>
				        <div class="dropdown-list" style="width: 110px">
				             <ul>
				                <li v-for="(head, hidx) of row[row.selectTable.id]" :class="{active: row.selectHead.index == hidx}" @click="selectHead(head, index, hidx)">
				                	<a href="javascript:;">{{head.name}}</a>
				                </li>
				             </ul>
				        </div>
				    </div>
				    <!-- 选择比较 -->
				    <div class="select-box shorter mr10 fl">
				        <div class="dropdown-btn" style="width: 100px">
				        	<span>{{row.selectCompare.value}}</span>
				        	<span class="select-value"></span><i class="arr"></i>
				        </div>
				        <div class="dropdown-list" style="width: 110px">
				             <ul>
				                <li v-for="(compare, cidx) of dataRow[index].compare" :class="{active: row.selectCompare.index == cidx}" @click="selectCompare(compare, index, cidx)">
				                	<a href="javascript:;">{{compare.value}}</a>
				                </li>
				             </ul>
				        </div>
				    </div>
				    <input type="text" class="inputMode mr10 fl" style="width: 262px;" v-model="dataRow[index].rowText.value" :disabled="dataRow[index].rowText.status" v-if="!dataRow[index].selectDate.status" @change="watchValue">

				    <!-- 选择日期 -->
				    <span class="inputMode mr10 fl" style="width: 120px;"
				    	v-if="dataRow[index].selectDate.status"
				    	 @click.prevent="selectDate(index)">

				    		{{dataRow[index].selectDate.startDate}}
				    </span>
				    <span class="inputMode mr10 fl" style="width: 120px;" 
				    	v-if="dataRow[index].selectDate.status" 
				    	@click.prevent="selectDate(index)">
				    	{{dataRow[index].selectDate.endDate}}
				    </span>


                    <i class="delIcon" @click="removeRow(index)"></i>
                </div>
                <div class="con add-row-btn">
                    <i class="i45" @click="addRow"></i>添加一行
                </div>
            </li>
        </ul>
        <select-date @select="injection"></select-date>
    </div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import vSelect from './v-select'
	import selectDate from '../../../../components/select-date'
	export default {
		name: 'data-filter',
		components: {
			vSelect,
			selectDate
		},
		data () {
			return {
				// 行数列表
				dataRow: [],
				// 满足条件
				condite: [{value: '全部条件', alias: 'all'}, {value: '任意条件', alias: 'part'} ],
				conditionOp: 'all',
				currentOpt: {value: '全部条件', alias: 'all'},
				selectIndex: 0,

				// 下拉菜单默认对象:
				defaults: {
					// 比较值列表
					compare: [], 
					// 工作表
					table: [{id: 0, name: '请选择表', }],
					// 默认字段
					'0': [{id: 0, name: '请选择字段'} ],
					// 选择的表
					selectTable: {name: '请选择表', id: 0, },
					// 选择的(表头)字段
					selectHead: {name: '请选择字段', id: 0, type: '', index: 0 },
					// 选择的比较值
					selectCompare: {value: '', type: '', id: '', index: 0, alias: ''},
					//文本框对象
					rowText: {status: false, value: ''},
					// 选择日期对象
					selectDate: {status: false, startDate: '', endDate: '', time: ''}
				},
				// 比较值初始化列表
				compareList: [
					{
						type: 'TEXT',
						list: [{value: '等于', alias:'='},{value: '不等于', alias:'!='},{value: '包含', alias:'like'},{value: '不包含', alias:'not like'},{value: '为空', alias:'null'},{value: '不为空', alias:'not null'}
						]
					},
					{
						type: 'NUMBER',
						list: [{value: '等于', alias:'='},{value: '不等于', alias:'!='},{value: '大于', alias:'>'},{value: '小于', alias:'<'},{value: '大于等于', alias:'>='},{value: '小于等于', alias:'<='},{value: '为空', alias:'null'},{value: '不为空', alias:'not null'} 
						]
					},
					{
						type: 'DATE',
						list: [{value: '等于', alias:'='},{value: '不等于', alias:'!='},{value: '大于', alias:'>'},{value: '小于', alias:'<'},{value: '大于等于', alias:'>='},{value: '小于等于', alias:'<='},{value: '为空', alias:'null'},{value: '不为空', alias:'not null'}, {value: '选择日期范围', alias: 'between'} 
						]
					}
				],
				// 当前操作的哪一行(选择日期时会用到)
				currentRow: 0,
				// 监测筛选条件的变化
				watchIndex: 0,

			}
		},
		computed: {
            ...mapGetters(['sheetElement', 'tableData', 'conditions']),
        },
        created() {
        	this.dataRow.push(this.defaults);
        },
        watch: {
        	sheetElement (n, o) {
        		this.getTables(n);
        	},
        	conditions (n) {
        		if(n.reload) {
        			let list = n.list;

        			n.reload = false;
        			this.editSetConditionOp(n);

        			list.forEach((item, index) => {
        				this.addRow();
        				let sItem = item.columnName.split('.');
        				let currentRow = this.dataRow[index];
        				
        				// set table
        				this.editSetTable(currentRow, sItem);
        				// set head
        				this.editSetHead(currentRow, sItem, item, index);
        				// set compare
        				this.editSetCompare(item, sItem, index);
        				// set input or date
        				this.editSetDateAndText(currentRow, item);
        			});
        			this.dataRow.splice(this.dataRow.length - 1, 1);
        		}
        	},
        	watchIndex () {
        		let conditions = {
        			conditionOp: this.conditionOp,
        			list: []
        		};
        		this.$store.dispatch('setConditions', conditions);
        		this.setConditions(conditions);
        	},
        },
		methods: {
			editSetConditionOp (n) {
				this.conditionOp = n.conditionOp;
    			if(n.conditionOp == 'all') {
    				this.currentOpt = {value: '全部条件', alias: 'all'};
    				this.selectIndex = 0;
    			}
    			else if(n.conditionOp == 'part') {
    				this.currentOpt = {value: '任意条件', alias: 'part'}
    				this.selectIndex = 1;
    			}
			},
			editSetTable (currentRow, sItem) {
				let table = currentRow.table;
				currentRow.selectTable.id = sItem[0];
				table.forEach((tb, idx) => {
					if(tb.id == sItem[0]) {
						currentRow.selectTable.name = tb.name;
					}
				});
			},
			editSetHead (currentRow, sItem, item, index) {
				this.setHead(currentRow.selectTable.id, index);
				let currHead = currentRow[sItem[0]];
				let currHeadIdx = 0;
				currHead.forEach((item, hidx) => {
					if(item.name  == sItem[1]) {
						currHeadIdx = hidx;
					}
				});
				currentRow.selectHead = {
					id: sItem[0],
					index: currHeadIdx,
					name: sItem[1],
					type: item.type
				};
			},
			editSetCompare (item, sItem, index) {
				let compareIdx = 0;
				this.compareList.forEach((comp, i) => {
					if(comp.type == item.type) {
						let list = comp.list;
						list.forEach((lt, n) => {
							if(lt.value == item.opName) {
								compareIdx = n;
							}
						});
					}
				});
				let obj = {
					value: item.opName,
					type: item.type,
					id: sItem[0],
					index: compareIdx,
					alias: item.op
				};
				this.initCompare(obj, index);
			},
			editSetDateAndText (currentRow, item) {
				if(item.op == 'between') {
					currentRow.selectDate = {
						status: true,
						startDate: item.value1 === '' ? '不限' : item.value1,
						endDate: item.value2 === '' ? '不限' : item.value2
					};
				}
				else {
					currentRow.rowText.value = item.value1;
				}
			},
			setConditions (conditions) {
				this.dataRow.forEach((row, index) => {
        			let rowText = row.rowText;
        			let date = row.selectDate;
        			let head = row.selectHead;
        			let table = row.selectTable;
        			let compare = row.selectCompare;

        			if(table.id != 0) {
        				let obj = {
        					columnName: table.id + '.' + head.name,
        					op: compare.alias || '',
        					opName: compare.value || '',
        					type: compare.type || ''
        				};
        				if(compare.alias == 'between') {
        					obj.value1 = date.startDate === '不限' ? '' : date.startDate;
        					obj.value2 = date.endDate === '不限' ? '' : date.endDate;
        				}
        				else {
        					obj.value1 = rowText.value;
        				}
        				conditions.list.push(obj);
        			}
        		});
        		this.$store.dispatch('setConditions', conditions);
			},
			getTables (sheets) {
				let list = sheets || [];

				this.table = [];
				this.table = [{name: '请选择表', id: 0}];
				list.forEach((item, index) => {
					let header = item.header;
					this.table.push({
						id: item.id,
						name: item.sheetName,
					});
				});
				this.dataRow.forEach((item, index) => {
					item.table = this.table;
					item.table.forEach((tb, idx) => {
						let id = tb.id;
						if(!item[id]) {
							item[id] = [];
						}
					});
				});
			},
			/**
			 * 选择条件
			 * @param  {Object} item
			 * @param  {number} index
			 */
			selectCondite (item, index) {
				// console.log(item, index);
				this.conditionOp = item.alias;
				this.currentOpt = item;
				this.selectIndex = index;
				this.watchIndex++;
			},
			/**
			 * 选择工作表
			 * @param  {Object} item
			 * @param  {number} index
			 */
			selectTable (item, index) {
				let id = item.id;
				this.watchIndex++;
				this.dataRow[index].selectTable = item;
				this.setHead(id, index);
			},
			/**
			 * [设置字段]
			 * @param {number} id    设置的具体对象是哪个
			 * @param {number} index 设置的哪一行的数据
			 */
			setHead (id, index) {
				let header = [];
				let sheetElement = this.sheetElement;

				this.watchIndex++;
				sheetElement.forEach((sheet, sidx) => {
					if(id == sheet.id) {
						header = sheet.header;
					}
				});
				// reset
				this.resetValue(index, id);

				header.forEach((head, idx) => {
					this.dataRow[index][id].push({
						name: head.columnAlias,
						id: id,
						type: head.type
					});
				});
			},
			/**
			 * 重置字段、比较值、日期的值
			 * @param  {number} index 重置的哪一行
			 * @param  {number} id    重置具体的对象
			 */
			resetValue (index, id) {
				let reRowText = {status: false, value: ''};
				let reHead = {name: '请选择字段', id: 0, type: ''};
				let reDate = {status: false, startDate: '不限', endDate: '不限', time: '不限'};

				this.dataRow[index][id].length = 0;
				this.dataRow[index][id].push(reHead);
				this.dataRow[index].selectHead = reHead;
				this.dataRow[index].selectHead.index = 0;

				this.dataRow[index].compare = [];
				this.dataRow[index].selectCompare = {};
				this.dataRow[index].selectCompare.index = 0;

				this.dataRow[index].rowText = reRowText;
				this.dataRow[index].selectDate = reDate;
			},
			/**
			 * 选择字段(表头)
			 * @param  {Object} item  当前选择的字段对象
			 * @param  {number} index 当前选择的哪一行
			 * @param  {number} hidx  当前选择字段的下标
			 */
			selectHead (item, index, hidx) {
				let id = item.id;
				let type = item.type;
				// console.log('item', item )
				this.watchIndex++;
				this.dataRow[index].selectHead = item;
				this.dataRow[index].selectHead.index = hidx;
				this.initCompare(item, index, 0);
				this.resetCompareText(index, id);
			},
			initCompare (item, index, flag) {
				let id = item.id;
				let type = item.type;

				this.compareList.forEach((compare, i) => {
					if(compare.type == type) {
						var list = [];
						compare.list.forEach((ls, i) => {
							list.push(ls);
						});
						
						this.dataRow[index].compare = list;
						this.dataRow[index].compare.forEach((cp, j) => {
							cp.type = type;
							cp.id = id;
							cp.index = 0;
						});
						if(flag == 0) {
							this.dataRow[index].selectCompare.value = compare.list[0].value;
							this.dataRow[index].selectCompare.alias = compare.list[0].alias;
							this.dataRow[index].selectCompare.index = 0;
							this.dataRow[index].selectCompare.type = type;
							this.dataRow[index].selectCompare.id = id;
						}
						else {
							this.dataRow[index].selectCompare = item;
						}
					}
				});
			},
			resetCompareText (index, id) {
				if(id == 0) {
					this.dataRow[index].compare = [];
					this.dataRow[index].selectCompare = {value: '', type: '', id: '', index: 0, alias: ''};
				}
				this.dataRow[index].rowText = {value: '', status: false} ;
				this.dataRow[index].selectDate = {status: false, startDate: '不限', endDate: '不限', time: '不限'};
			},
			/**
			 * 选择比较方式
			 * @param  {Object} item  当前选择的比较值对象
			 * @param  {number} index 当前选择的哪一行
			 * @param  {number} cidx  当前选择比较值的下标
			 */
			selectCompare (item, index, cidx) {
				this.watchIndex++;
				this.dataRow[index].selectCompare = item;
				this.dataRow[index].selectCompare.index = cidx;
				this.dataRow[index].rowText.status = false;
				this.dataRow[index].selectDate.status = false;
	
				if(item.alias == 'null') {
					this.dataRow[index].rowText.status = true;
				}

				if(item.type == 'DATE' && item.alias == 'between') {
					this.dataRow[index].selectDate.status = true;
				}
			},
			/**
			 * 添加一行
			 */
			addRow () {
				let defaults = this.defaults;
				let obj = {};

				let initValue = (obj) => {
					obj.compare = [];
					obj['0'] = [{id: 0, name: '请选择字段'} ];
					obj.rowText = {value: '', status: false};
					obj.selectTable = {name: '请选择表', id: 0};
					obj.selectHead = {name: '请选择字段', id: 0, type: ''};
					obj.selectCompare = {value: '', type: '', id: '', index: 0, alias: ''};
					obj.selectDate = {status: false, startDate: '不限', endDate: '不限', time: '不限'}
				}

				this.watchIndex++;
				if(this.dataRow.length) {
					this.dataRow.forEach((row, index) => {
						Object.assign(obj, row);
					});
				}
				else {
					obj.table = [{id: 0, name: '请选择表', }];
				}
				initValue(obj);
				this.dataRow.push(obj);
				if(this.sheetElement.length) {
					this.getTables(this.sheetElement);
				}
			},
			/**
			 * 删除一行
			 * @param  {number} index 
			 */
			removeRow (index) {
				this.dataRow.splice(index, 1);
				this.watchIndex++;
			},
			/**
			 * 日期组件回调方法
			 * @param  {Object} start 开始时间
			 * @param  {Object} end   结束时间
			 */
			injection (start, end) {
				let index = this.currentRow;
				let startDate = start.date != '不限' ? start.date + ' ' + start.time : start.date;
				let endDate = end.date != '不限' ? end.date + ' ' + end.time : end.date;

				this.dataRow[index].selectDate.startDate = startDate;
				this.dataRow[index].selectDate.endDate = endDate;
				this.watchIndex++;
			},
			/**
			 * 打开选择日期弹层
			 * @param  {number} index 当前日期所在的行数
			 */
			selectDate (index) {
				this.currentRow = index;
				this.layerDate();
			},
			watchValue () {
				this.watchIndex++;
			}
		}
	}
</script>