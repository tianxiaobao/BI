<style>
    .edit-name {
        border: none;
        border-bottom: 1px solid #e7e7e7;
        background-color: transparent;
        outline: 0;
    }
    .fuild-list.view{
        position: fixed;
        top: 240px;
        bottom: 0;
        overflow: auto;
        width: 200px;
        box-sizing: border-box;
    }
    .chart-left{
        padding-left: 10px;
        margin-top: 10px;
    }
    .ellipsis{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .wid110{
        width: 110px;
    }
    #canvas{
        width: 100%;
        height: 500px;
    }
    .bi-list{
    	padding-left: 8px;
    }
	.u-update{
		width: 174px;
	}
    .ht-over{
        height: 320px;
        overflow: auto;
        position: relative;
        padding-top: 30px;
    }
    .el-notification__content{
        float: right;
        padding: 5px;
        border: 1px solid #e15a5f;
        background: #fff2f4;
        color: #e15a5f;
        height: 26px;
        height: 26px;
        width: 80px;
        text-align: center;
        line-height: 26px;
        display: none;
    }

    .chart-right{
        width: 284px;
    }

    .chart-left{
        margin-right: 294px;
    }
    .bor-box-mc .el-form-item {
        margin-bottom: 10px;
    }
    .bor-box-mc .el-input-number {
        display: block;
    }

    .u-rotate{
        position: absolute;
        right: 20px;
        top: 2px;
        width: 25px;
        height: 25px;
        cursor: pointer;
        background:url(../../images/sprites.png) -200px 0px no-repeat;
    }


</style>
<template>
    <div>
            <div class="indexTit">
                <h2 class="fl"><a href="#" class="goback" @click.prevent="go_dashboard"></a>报表<i class="i42"></i><span class="f14">编辑图表</span></h2>
                <div class="tip fr" v-if="operationSuccess">温馨提示：操作成功</div>
                <div class="tip-warning fr" v-if="operationFailed">温馨提示：操作失败</div>
            </div>
            <!-- 基本信息 begin -->
            <div class="innerCon">
            <div class="statement worksheet-view">
                <sheet-column :wds="chartSaveJson.dimensions" :zbs="chartSaveJson.categories" :sortList="chartSaveJson.orderBys" :columns="currentTable.columns" @update-sheet-column="update_sheet_column"></sheet-column>
                <div class="s-rightMenu">
                    <div class="bor-box-mt">
                        <!-- 图表名称: <input type="text" class="edit-name" v-model="chartSaveJson.name" placeholder="支持中英文、数字"> -->
                        <span class="el-notification__content" >保存成功</span>
                        <a href="javascript:;" @click.prevent="shareReport"  class="blueLink fr mgleft10">分享(PV:{{share.pv}})</a>
                        <a href="javascript:;" @click.prevent="save" class="blueLink fr">保存</a>
                    </div>
                    <div class="bor-box-mc white-bg cl">
                        
                        <div class="width100" style="padding-bottom:120px;margin-top:0px">
                            <div class="chart-right">
                                <div class="bor-box-mt br-none">
                                     图表类型
                                </div>
                                <div class="bor-box-mc br-none pt10">
                                    <ul class="bi-list cl">
                                        <li 
                                         :title="item.name" 
                                         v-for="item in chartKind" 
                                         :class="[
	                                         item.type,
	                                         item.highlight?'highlight':'',
	                                         currentChart.type == item.type ? 'selected':'' 
                                         ]"
										 @click="setChart(item)"				
                                         >
                                         </li>
                                        
                                    </ul>
                                    <div class="mt20 mb20 tcenter">
                                    	<a href="javascript:;" class="glBtn u-update" @click="updateChart">更新图表</a>
                                    </div>
                                </div>


                                
                                
                                <component v-bind:is="currentView" :chart="currentChart.chart">
                                  <!-- 组件在 vm.currentview 变化时改变！ -->
                                </component>
                                
                             </div>
                            
                            <div class="chart-left pl20" style="margin-top:0px;">
                                <zb-wd :series="chartSaveJson.series" :wds="chartSaveJson.dimensions" :zbs="chartSaveJson.categories" :sortList="chartSaveJson.sortList" @updateScene="updateScene" @updateFiltrate="updateFiltrate"></zb-wd> 

                                <div id="canvas" style="height:400px" v-show="currentChart.type != 'table'"></div>
                                <div class="border-radius0 ht-over" v-show="currentChart.type == 'table'">
                                   <i class="u-rotate" @click="rotateData"></i> 
                                   <vue-dragtable v-on:loadData="runView" :max="100"></vue-dragtable>
                                </div>
                                <!-- 执行结果结束 -->
                                
                                <filtrate :conditions="chartSaveJson.conditions" :conditionOp="chartSaveJson.conditionOp" :columns="currentTable.filtrateColumns" page="chart" v-on:update-filtrate="update_filtrate"></filtrate>
                                <div class="cl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 基本信息 end -->
        </div>
        
        <!-- 图表名称 -->
       <!--  <div class="popup new-chart" style="display:none;">
            <ul class="listItem">
                <li class="first">
                    <p class="tit">图表名称：</p>
                    <p class="con">
                        <input type="text" class="inputMode w430" placeholder="请输入图表名称" v-model="chartSaveJson.name">
                    </p>
                </li>
            </ul>
        </div> -->


        <share-layer  :share="share" :id="chartSaveJson.chartId"  ></share-layer>

        <!-- 主内容区end -->
    </div>
</template>
<script>
import '@/style/bi-list.css'
import api from '../../api'
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import shareLayer from '../../components/share-layer.vue'
import sheet_column from '../../components/sheet-column.vue'
import filtrate from '../../components/filtrate.vue'
import zb_wd from '../../components/zb-wd.vue'
import router from '../../router'
import vueDragtable from '../../components/vue-dragtable'

import tableView from './chartSetView/table.vue'
import lineView from './chartSetView/line.vue'
import barView from './chartSetView/bar.vue'
import colBarView from './chartSetView/colBar.vue'
import funnelView from './chartSetView/funnel.vue'
import areaView from './chartSetView/area.vue'
import pieView from './chartSetView/pie.vue'
import radarView from './chartSetView/radar.vue'
import scatterView from './chartSetView/scatter.vue'
import stackBarView from './chartSetView/stackBar.vue'
import markLine from './chartSetView/markLine';

import {
    getQuery
} from '@/components/tool.js'


import {
	table,
	line,
	area,
	bar,
	colBar,
	stackBar,
	pie,
	funnel,
	scatter,
	radar
 } from './chartKind.js'

 import{
 	staticDataChart,
 	apiDataChart,
    mergeExtend
 } from './exampleTable.js'


 import{
    draw,
    initChartOption
 } from './drawChart.js'

var chartKind = {
	table,
	line,
	area,
	bar,
	colBar,
	stackBar,
	pie,
	funnel,
	scatter,
	radar
};

const __static = 'static';
const sql = 'sql';



export default {
    name: 'chart1_1',
    components: {
        'sheet-column': sheet_column,
        'share-layer'  : shareLayer,
        'zb-wd'  : zb_wd,
        filtrate,
        tableView,
        lineView,
        barView ,
        colBarView ,
        funnelView ,
        areaView ,
        pieView ,
        radarView ,
        scatterView ,
        stackBarView ,
        vueDragtable
    },
    data () {
        return {
           chartKind : [ //图表的种类
           		table,
           		line,
           		area,
           		bar,
           		colBar,
           		stackBar,
           		pie,
           		funnel,
           		scatter,
           		radar
           ],	
           chartSaveJson:{ //保存到后端的数据
			    chartId : '',
			    sheetId : '', 
			    reportId: '',
			    name: 'name', 
			    conditionOp: 'all',
			    layout:{},
			    series:[],
			    conditions: [], 
			    dimensions: [], 
			    categories: [],
			    sortList:[] , //前端额外添加的字段
			    orderBys: []
			},

			currentTable:{ //数据表的信息
				columns : [],
				filtrateColumns:[]
			},

			currentChart : { //当前选择的图表
				type : '',
				dataType: __static,
				chart: {}
			},


            share: { //分享相关的
                type: 1,
                id: 0,
                url: 'https://xdata.jcloud.com/exp/_share.html#/chart-share',
                open: false,
                pv : 0
            },
          
            is_save : false,
            isrotateData:false,
            currentView : '',
            operationSuccess:false,
            operationFailed:false
        }
    },
    mounted () {
    	let chartId;

        let query = getQuery();
        this.chartSaveJson.reportId = query.reportId || '';
        this.chartSaveJson.chartId = chartId = query.chartId || '';
        
        //编辑
        if(chartId){
            this.getData(chartId);
            this.getCount(chartId);
        }
    },


    created(){
        this.$events.on('updateChartOption',this.updateChartOption)
    },
    
    computed: {
        ...mapGetters(['dragTableData'])
    },


    watch:{
        "currentChart.type":function(val){
            this.currentView = val + 'View';
        }
    },
    
    methods: {
        rotateData(){
            let chart = this.currentChart.chart;
            if(this.isrotateData){
                let obj = {
                    header: chart.chartOption.headers,
                    value: chart.chartOption.values,
                    loading: false,
                    total: chart.chartOption.values.length // 这里由于后端不支持分页，所以做了特殊处理
                };
                this.$store.dispatch('setDragTableData', obj);
            }
            else{
                let arr = [];
                chart.chartOption.headers.forEach(function(item,index){
                    let tem = [item];
                    chart.chartOption.values.forEach(function(item2){
                        tem.push(item2[index]);
                    });
                    arr.push(tem);
                });
                let h = arr[0];
                let v = arr.slice(1);

                let obj = {
                    header: h,
                    value: v,
                    loading: false,
                    total: v.length // 这里由于后端不支持分页，所以做了特殊处理
                };
                this.$store.dispatch('setDragTableData', obj);
            }
            this.isrotateData = !this.isrotateData;
        },
        getCount(id){
            api.getCount({
                targetId: id,
                shareType: this.share.type
            })
            .then(
                res=>{
                    if(res.code == 0){
                        this.share.pv = res.data;
                    }
                },
                error=>{}
            )
        },

        /*更新筛选设置*/
        update_filtrate(val){
            this.chartSaveJson.conditionOp = val;
        },
        /*更新表、字段*/
        update_sheet_column(obj){
            this.chartSaveJson.sheetId = obj.tableId;
            this.currentTable.columns = obj.columns;
            if(obj.is_switch){
                this.emptyOption();
            }
        },
        /**
        * 分享
        */
        shareReport () {
            if(!this.chartSaveJson.chartId){
                layer.alert('保存过的图表才能进行分享',{
                    icon : 2
                })
                return ;
            };
            let data = {
                type: this.share.type,
                targetId: this.chartSaveJson.chartId,
                url: this.share.url,
            }
            api.shareGenerate(data).then(res => {
                if(res.code == 0) {
                    this.share.id = res.data.targetId
                    this.share.url = res.data.shareUrl
                    this.share.open = res.data.isOpen
                }
            }, error => {
            })
            this.layerShare(yes => {
                window.open(this.share.url,'_blank')
            }, end => {
            })
        },

 
        go_dashboard(){
            if(this.is_save){
                window.location = './index.html#/dashboard';
            }else{
                this.layerSaveData((layero, index)=>{
                    layer.close(index);
                    window.location = './index.html#/dashboard';
                },error=>{
                })
            }
        },
        // 处理为后端数据
        handleSort(){
            var arr=[];
            var sortList = this.chartSaveJson.sortList;
            for(var i=0;i<sortList.length;i++){
                if(sortList[i].checked == true){
                    arr.push(sortList[i]);
                }
            }
            return arr;
        },
        // 编辑视图初始化排序
        initSortList(orders){
        	var chartSaveJson = this.chartSaveJson;
            chartSaveJson.sortList = chartSaveJson.dimensions.concat(chartSaveJson.categories,chartSaveJson.series);
            for(var i=0;i<chartSaveJson.sortList.length;i++){
                chartSaveJson.sortList[i].checked = false;
                chartSaveJson.sortList[i].orderType = null;
                for(var j=0;j<orders.length;j++){
                    if(chartSaveJson.sortList[i].columnName ==orders[j].columnName&&chartSaveJson.sortList[i].columnAlias ==orders[j].columnAlias){
                        chartSaveJson.sortList[i].checked = true;
                        chartSaveJson.sortList[i].orderType = orders[j].orderType;
                    }
                }
            }
        },


        updateChartOption(){
            let chart = this.currentChart.chart;
            mergeExtend(chart);
            let option = chart.chartOption;
            let ele = document.getElementById('canvas');
            let ins = echarts.getInstanceByDom(ele);
            if(!ins){
                ins = echarts.init(ele);
            }
            ins.setOption(option,true);
        },




        drawChart(chart){
        	if('table' == chart.type){
        		let obj = {
        		    header: chart.chartOption.headers,
        		    value: chart.chartOption.values,
        		    loading: false,
        		    total: chart.chartOption.values.length // 这里由于后端不支持分页，所以做了特殊处理
        		};
        		this.$store.dispatch('setDragTableData', obj);
        	}
        	else{
                this.$nextTick(() => {
                    draw(chart,'canvas');
	        	})
        	}
        },

        showChartLoading(){
        	this.$nextTick(() => {
	        	let ele = document.getElementById('canvas');
	        	let ins = echarts.getInstanceByDom(ele);
	        	if(!ins){
	        		ins = echarts.init(ele);
	        	}
	        	ins.showLoading();
        	})
        },

        updateChart(){
        	var x = this.chartSaveJson.dimensions.length;
        	var y = this.chartSaveJson.categories.length;
        	var type = this.currentChart.type;

        	if(0 == x && 0 == y){
        		return false;
        	}

        	if(type){
        		var chart = chartKind[type];
        		if(false == chart.highlight){
        			this.layerMsg('已选择的图表类型在当前条件下不可使用');
        			return false
        		}
        	}
        	else{
        		this.currentChart.type = 'table';
        		this.currentChart.chart = table;
        	}
        	this.setChart(this.currentChart.chart);
        },

        setChart(chart){

        	if(false == chart.highlight){ //没有高亮
        		return ;
        	};

        	this.currentChart.type = chart.type;
        	this.currentChart.chart = chart;

        	var x = this.chartSaveJson.dimensions.length;
        	var y = this.chartSaveJson.categories.length;

        	if(0 == x && 0 == y && __static == this.currentChart.dataType){
        		staticDataChart(chart);
        		this.drawChart(chart);
        	}
        	else{

        	  

        	   this.runView(chart);
        	   this.currentChart.dataType = 'sql';
        	}
            this.$store.commit('setChartStatus', new Date().getTime());
        },

        updateScene(){
        	this.setChartIcon();
        	this.updateFiltrate();
        },

        updateconditions(){
        	var zb = this.chartSaveJson.categories;
        	var con = this.chartSaveJson.conditions;
        	for (var i = 0; i < con.length; i++) {
        		var item = con[i];
        		var reg = /\((\w+)\)/;
        		var match = reg.exec(item.columnName);
        		if(match){
        			var flag = false;
        			for (var j = 0; j < zb.length; j++) {
        				var itemy = zb[j];
        				if(match[1] == itemy.columnName){
        					flag = true;
        					item.columnName = itemy.op + '(' + itemy.columnName + ')';
        					item.name = itemy.columnName + '(' + itemy.opName + ')';
        					break;
        				}
        			}
        			if(!flag){
        				con.splice(i,1);
        				i--;
        			}
        		}
        	}
        },

        updateFiltrate(){
        	var cols = this.currentTable.columns;
        	var zb = this.chartSaveJson.categories;
        	var arr = cols.slice();
        	zb.forEach(function(element) {
        		arr.push({
        			type : 'NUMBER',
        			columnName:element.op + '(' + element.columnName + ')',
        			name : element.columnName + '(' + element.opName + ')'
        		});
        	});
        	this.currentTable.filtrateColumns = arr;
        	this.updateconditions();

        },

        setChartIcon(){
            var x = this.chartSaveJson.dimensions.length;
            var y = this.chartSaveJson.categories.length;

            if(0==x && 0==y && __static == this.currentChart.dataType){
            	table.highlight = true;
            	line.highlight = true;
            	bar.highlight = true;
            	area.highlight = true;
            	pie.highlight = true;
            	colBar.highlight = true;
            	stackBar.highlight = true;
            	scatter.highlight = true;
            	radar.highlight = true;
            	funnel.highlight = true;
            	return false;
            }

            if(0==x&&0==y){
            	table.highlight = false;
            }else{
            	table.highlight = true;
            }

            if(x > 0 && y > 0){
            	line.highlight = true;
            	bar.highlight = true;
            	area.highlight = true;
            	colBar.highlight = true;
            	stackBar.highlight = true;
            }else{
            	line.highlight = false;
            	bar.highlight = false;
            	area.highlight = false;
            	colBar.highlight = false;
            	stackBar.highlight = false;
            }
            if(x ==1 && y == 1 || x==0&&y>1){
            	pie.highlight = true;
            	funnel.highlight = true;
               
            }else{
            	pie.highlight = false;
            	funnel.highlight = false;
            }
            if(y == 2){
            	scatter.highlight = true;
            }else{
            	scatter.highlight = false;
            }
            if(x == 1 && y > 1){
            	radar.highlight = true;
            }else{
            	radar.highlight = false;
            }
        },
        // 保存视图
        save () {

            this.chart_save();

            // var that = this;
            // var reg = /^[\u4E00-\u9FA5\uF900-\uFA2D\w]{1,}$/;
            // var name = this.chartSaveJson.name
            // if(!name){
            //     layer.open({
            //         title: '保存图表',
            //         type: 1,
            //         content: $('.new-chart'),
            //         area: '610px',
            //         btn: ['确定', '取消'],
            //         yes: function(index, layero) {
            //             if(reg.test(that.chartSaveJson.name)){
            //                 layer.close(index);
            //                 that.chart_save();
            //             }else{
            //                 that.layerMsg('请输入正确的图表名称');
            //             }
            //         },
            //         end: function() {
            //         }
            //     });    
            // }else if(reg.test(name)){
            //     this.chart_save();
            // }else{
            //     this.layerMsg('请输入正确的图表名称');
            // }
        },
        chart_save(){
            var postJson = $.extend({},this.chartSaveJson);
            postJson.orderBys = this.handleSort();
            postJson.layout = JSON.stringify(this.currentChart);
            var __l = layer.load(1);
            api.chartSave(postJson)
            .then(res=>{
                if(res.code == 0){
                    this.chartSaveJson.chartId = res.data;
                    this.is_save = true;
                    $('.el-notification__content').css('display','inline');
                    setTimeout("$('.el-notification__content').css('display','none')",3000);
                }else{
                    this.layerMsg(res.message)
                }
                layer.close(__l);
            },error=>{
                layer.close(__l);
            })
        },
        runView(chart){
        	var x = this.chartSaveJson.dimensions.length;
        	var y = this.chartSaveJson.categories.length;
        	if(0 == x && 0 == y){
        		return false;
        	}


            if(chart.type !== 'table'){
                this.showChartLoading();    
            }
            else{
            	let obj = {
            	    header: [], //表头
            	    value: [],  //值
            	    loading: true, //为true时显示‘正在加载数据...’
            	    total: 10 //总数
            	}
            	this.$store.dispatch('setDragTableData', obj);
            }



        	let chartSaveJson = this.chartSaveJson;
            var params = {
                dependSheetId :chartSaveJson.sheetId,
                conditionOp   :chartSaveJson.conditionOp,
                conditions    :chartSaveJson.conditions,
                dimensions    :chartSaveJson.dimensions,
                categories    :chartSaveJson.categories,
                series        :chartSaveJson.series,
                orderBys      :this.handleSort(),
                maxSize       :100,
            };
            api.chart_design(params).then(res => {
                if(res.code == 0) {
                    

                    apiDataChart(this.currentChart,this.chartSaveJson,res.data);
                    this.drawChart(chart);


                    // 设置提示
                    this.operationSuccess = true;
                    setTimeout(() => {this.operationSuccess = false;}, 3000);
                }else{
                    let msg = res.message || '接口连接失败';
                    this.layerError(msg);
                }
            })
            .catch(error => {
                 this.layerMsg('接口连接失败');
            })
        },
       
        getData(id){
            var flag = 0;
            var layout = null;
            // 获取chart配置信息
            api.getChart({id : id })
            .then(res => {
                if(res.code == 0){
                   let data = res.data;
                   let currentChart = this.currentChart;
                   let chart = this.chartSaveJson;
                   layout = JSON.parse(data.layout);
                   
                   currentChart.dataType = layout.dataType?layout.dataType:sql;

                   initChartOption(currentChart,layout);

                   currentChart.type = layout.type;

                   chart.name = data.chartName;

                   if(data.dimensions == null){
                   		console.log('已升级图表制作方式，请按新的制作方式重新制作图表');	
                   }


                   chart.dimensions = data.dimensions?data.dimensions:[];
                   chart.categories = data.categories?data.categories:[];

                   chart.conditions = data.conditions?data.conditions:[];
                   chart.conditionOp = data.conditionOp?data.conditionOp:[];

                   chart.series = data.series?data.series : [];

                   chart.orderBys = data.orderBys?data.orderBys : [];


                   this.$events.emit('setOpen',{
                        addSort : chart.orderBys.length ? false : true ,
                        addlegend :  chart.series.length ? false : true
                   });

                   this.initSortList(chart.orderBys);
                   this.setChartIcon();

                   if(currentChart.dataType == sql){
                   		this.getChartData(id)
                   }
                   else{ //静态数据
                   		staticDataChart(this.currentChart.chart);
                   		this.drawChart(this.currentChart.chart);
                   }

                }else{
                    this.layerMsg(res.message);
                }
            }, error => {
            });
        },


        getChartData(id){

            let type = this.currentChart.type;


            if(type !== 'table'){
                this.showChartLoading();    
            }
            else{
                let obj = {
                    header: [], //表头
                    value: [],  //值
                    loading: true, //为true时显示‘正在加载数据...’
                    total: 10 //总数
                }
                this.$store.dispatch('setDragTableData', obj);
            }
        	// 获取chart 数据
        	api.getData({id : id })
        	.then(res => {
        	    if(res.code == 0){
        	        apiDataChart(this.currentChart,this.chartSaveJson,res.data);
        	        this.drawChart(this.currentChart.chart);
        	    }else{
        	        this.layerMsg(res.message);
        	    }
        	}, error => {
        	});
        },


        // 清空条件
        emptyOption(){
        	var chartSaveJson = this.chartSaveJson;
            chartSaveJson.conditionOp='all';
            chartSaveJson.conditions=[];
            chartSaveJson.dimensions=[];
            chartSaveJson.categories=[];
            chartSaveJson.sortList = [];
            chartSaveJson.series = [];

            this.setChartIcon();
            // this.type = 'table';
            let obj = {
                header: [], //表头
                value: [],  //值
                loading: false, //为true时显示‘正在加载数据...’
                total: 10 //总数
            }
            this.$store.dispatch('setDragTableData', obj);
        }
    },
}
</script>