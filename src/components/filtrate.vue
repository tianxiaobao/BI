<style>
	.w120{
		width: 120px;
	}
</style>
<template>
	<div class="pt20">
	    <h3>筛选设置</h3>
	    <ul class="listItem">
	        <li class="first"><p class="tit start-tips">满足下列：</p>
	            <div class="con mb10">
	                <div class="select-box shorter">
	                    <div class="dropdown-btn"><span>{{conditionText}}</span><span class="select-value"></span><i class="arr"></i></div>
	                    <div class="dropdown-list">
	                         <ul>
	                             <li v-for="(con,index) in conditionOps"><a href="javascript:;" @click.prevent="selectCon(index)">{{con.text}}</a></li>
	                          </ul>
	                    </div>
	                </div>
	            </div>
	            <div class="con mb10" v-for="(item,index) in conditions">
	                <div class="select-box shorter mr10 fl">
	                    <div class="dropdown-btn" v-bind:title="item.name">{{item.name}}<span class="select-value"></span><i class="arr"></i></div>
	                    <div class="dropdown-list">
	                         <ul>
	                            <li v-for="col in columns"><a href="javascript:;" @click.prevent="setOp(index,col)">{{col.name || col.columnName}}</a></li>
	                         </ul>
	                    </div>
	                </div>
	                <div class="select-box shorter mr10 fl" v-if="item.type=='NUMBER'">
	                    <div class="dropdown-btn" style="width:100px;">{{item.opName}}<span class="select-value"></span><i class="arr"></i></div>
	                    <div class="dropdown-list" style="width:110px;">
	                         <ul>
	                            <li v-for="opNum in opListNum"><a href="javascript:;" @click.prevent="setOpVal(index,opNum)">{{opNum.text}}</a></li>
	                         </ul>
	                    </div>
	                </div>
	                
	                <div class="select-box shorter mr10 fl" v-else-if="item.type=='DATE'">
	                    <div class="dropdown-btn" style="width:100px;">{{item.opName}}<span class="select-value"></span><i class="arr"></i></div>
	                    <div class="dropdown-list" style="width:110px;">
	                         <ul>
	                            <li v-for="opNum in opListDate"><a href="javascript:;" @click.prevent="setDateOpVal(index,opNum)">{{opNum.text}}</a></li>
	                         </ul>
	                    </div>
	                </div>

	                <div class="select-box shorter mr10 fl" v-else>
	                    <div class="dropdown-btn" style="width:100px;">{{item.opName}}<span class="select-value"></span><i class="arr"></i></div>
	                    <div class="dropdown-list" style="width:110px;">
	                         <ul>
	                            <li v-for="op in opList"><a href="javascript:;" @click.prevent="setOpVal(index,op)">{{op.text}}</a></li>
	                         </ul>
	                    </div>
	                </div>
					
					<input v-if="item.op =='between' && item.type=='DATE'" type="text" readonly="readonly" class="inputMode w120 fl mr10" :value="item.value1 ? item.value1 : '不限'"  @click="selectDate(index)">
					<input v-if="item.op =='between' && item.type=='DATE'" type="text" readonly="readonly"  class="inputMode w120 fl" :value="item.value2 ? item.value2 : '不限'" @click="selectDate(index)">

					<input v-else type="text" class="inputMode w80 fl mr10" v-model="item.value1" v-bind:disabled="item.op=='null'||item.op=='not null' || item.op == 'recent days'">

					<input v-if="item.op =='between' && item.type=='NUMBER'" type="text" class="inputMode w80 fl" v-model="item.value2">


	                <i class="delIcon" @click.prevent="removeOp(index)"></i>
	            </div>
	            <div class="con">
	                <i class="i45" @click.prevent="addOp"></i>添加一行
	            </div>
	        </li>
	    </ul>
	    <select-date @select="injection"></select-date>
	</div>
</template>

<script>

import selectDate from './select-date.vue'		
export default{

	components: {
		selectDate
	},

	props:['conditions','conditionOp','columns','page'],

	

	data(){
		return {

			opList:[
			    {text:'等于',sign:'='},
			    {text:'不等于',sign:'!='},
			    {text:'包含',sign:'like'},
			    {text:'不包含',sign:'not like'},
			    {text:'为空',sign:'null'},
			    {text:'不为空',sign:'not null'}
			],//筛选选项
			opListNum:[
			    {text:'等于',sign:'='},
			    {text:'不等于',sign:'!='},
			    {text:'大于',sign:'>'},
			    {text:'小于',sign:'<'},
			    {text:'大于等于',sign:'>='},
			    {text:'小于等于',sign:'<='},
			    {text:'区间',sign:'between'},
			    {text:'为空',sign:'null'},
			    {text:'不为空',sign:'not null'}
			],//筛选选项

			opListDate:[
			    {text:'今天',sign:'0'},
			    {text:'昨天',sign:'1'},
			    {text:'最近7天',sign:'7'},
			    {text:'最近30天',sign:'30'},
			    {text:'最近90天',sign:'90'},
			    {text:'最近一年',sign:'365'},
			    {text:'选择日期范围',sign:'between'}
			   
			],//筛选选项

			conditionOps:[
			    {text:'全部条件',sign:'all'},
			    {text:'任意条件',sign:'part'},
			],
			currentRow : 0
		}
	},


	computed:{
		conditionText(){
			return this.conditionOp == 'all' ? '全部条件' : '任意条件';
		}
	},


	methods:{

		/**
		 * 日期组件回调方法
		 * @param  {Object} start 开始时间
		 * @param  {Object} end   结束时间
		 */
		injection (start, end) {
			let index = this.currentRow;
			let startDate = start.date == '不限' ? "" :start.date + ' ' + start.time ;
			let endDate = end.date == '不限' ? "" : end.date + ' ' + end.time ;

			this.conditions[index].value1 = startDate;
			this.conditions[index].value2 = endDate;

			this.$forceUpdate();
		},


		/*选择日期*/
		selectDate(index){
			this.currentRow = index;
			this.layerDate();
		},

		// 添加筛选条件
		addOp(){
		    var type = this.columns[0].type;

		    if(type === 'DATE'){
		       this.conditions.push({ 
		       		columnName:this.columns[0].columnName,
		       		name : this.columns[0].name || this.columns[0].columnName,
		       		op:'recent days',
		       		opName:'今天',
		       		type:type,
		       		value1:0
		       	});
		    }
		    else{
		        this.conditions.push({
		        	columnName:this.columns[0].columnName,
		        	name : this.columns[0].name || this.columns[0].columnName,
		        	op:'=',
		        	opName:'等于',
		        	type:type,
		        	value1:''
		        });
		    }
		},

		// 删除筛选条件
		removeOp(index){
		    this.conditions.splice(index,1);
		},


		selectCon(index){
		    this.conditionText = this.conditionOps[index].text;
		    this.$emit('update-filtrate', this.conditionOps[index].sign);
		},


		//变换第二个筛选条件
		setOp(index,obj){
		    var item = this.conditions[index];
		    item.columnName = obj.columnName;
		    item.name = obj.name || obj.columnName;
		    var type = item.type = obj.type;
		    if(type === 'DATE'){
    	    	item.value1 = 0;
	        	item.opName = '今天';
	        	item.op = 'recent days';
		    }
		    else{
		        item.value1 = '';
		        item.opName = '等于';
		        item.op = '=';
		    }
		},
		setOpVal(index,obj){
		    this.conditions[index].op = obj.sign;
		    this.conditions[index].opName = obj.text;
		    this.conditions[index].value1 = '';
			this.conditions[index].value2 = '';
		},
		setDateOpVal(index,obj){
			if(obj.sign == 'between'){
				this.conditions[index].op = obj.sign;
				this.conditions[index].opName = obj.text;
				this.conditions[index].value1 = '';
				this.conditions[index].value2 = '';
			}else{
				this.conditions[index].op = 'recent days';
			    this.conditions[index].opName = obj.text;
			    this.conditions[index].value1 = obj.sign;
			}
		},

	},
}

</script>