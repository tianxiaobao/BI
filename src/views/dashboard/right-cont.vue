<style>
	.gridster {
		overflow: hidden;
    	padding-bottom: 2px;
	}
	.gridster li{
		background-color: #fff;
		border: 1px solid #e7e7e7;
	}
	.gridster li h3{
		position: relative;
		padding-left: 20px;
		height: 30px;
		line-height: 30px;
		cursor: move;
		z-index: 1;
		background-color: #fff;
	}
	.gridster li .canvas{
		width: 100%;
		height: 100%;
		ddpadding: 30px 20px;
		margin-top: -30px;
		box-sizing: border-box;
		overflow: hidden;
		background-color: #fff;
	}
	.gridster li .chart-box {
		width: 100%;
		height: 100%;
		border: 0;
	}
	.gridster li .icon{
		position: absolute;
		right: 10px;
		top: 10px;
		display: none;
		z-index: 2;
	}

	.gridster li:hover .icon{
		display: block;
	}
	
	.gridster li .icon i{
	    background: url(../../images/baobiao.png) no-repeat;
	    width: 18px;
	    height: 16px;
	    display: inline-block;
	    margin-left: 12px;
	    cursor: pointer;
	}
	.gridster li .icon i.ci1 {
   		 background-position: 0 0;
	}
	.gridster li .icon i.ci2 {
   		 background-position:  -33px 0;
	}
	.gridster li .icon i.ci3 {
   		 background-position: -58px 0;
	}

	.gridster .preview-holder {
		border: none !important;
		border-radius: 0 !important;
		background: #b7b7b7 !important;
	}
	.mgleft10{
		margin-left : 10px;
	}
	.echart-tpl {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.plx1 {
		padding-left: 3px;
	}
	.table-canvas th {
		text-align: center;
		padding: 0.5rem;
    	line-height: 1rem;
	}
</style>
<template>
	<div class="s-rightMenu">
		<div class="bor-box-mc white-bg ml2" v-show="loading">
			<div class="no-report">
				<v-loading></v-loading>
			</div>
		</div>
		<div class="bor-box-mc white-bg ml12" v-show="!loading && !reports">
			<div class="no-report">
				<p>无报表数据 可先点击<a href="#" class="blueLink ml10" @click.prevent="createReport">新建报表</a></p>
			</div>
		</div>
		
		<div class="white-bg ml2" v-show="!loading && !selectReport.charts && reports">
            <div class="bor-box-mt">
                {{currentReport.reportName}}<a href="#" class="fr blueLink" @click.prevent="switchTable">+添加图表</a>
            </div>
            <div class="bor-box-mc pad20">
                <ul class="add_selected">
                    <li>
                        <a href="#" @click.prevent="switchTable">
                            <div class="mb20">+</div>
                            <p>添加图表</p>
                        </a>
                    </li>
                </ul>
                <div class="cl"></div>
            </div>
        </div>
	
        <div class="white-bg ml2" :style="visibility">
            <div class="bor-box-mt">
                {{currentReport.reportName}}
                <a href="#" class="refresh fr mgleft10 mt10 mt3" @click.prevent="refresh"><i class="i17"></i></a>
				<a class="fr blueLink mgleft10" @click.prevent="shareReport">分享(PV:{{share.pv}})</a>
                <a href="#" class="fr blueLink" @click.prevent="saveLayout">保存布局</a>
                <a href="#" class="blueLink fr mr10"  @click.prevent="switchTable">+添加图表</a>
            </div>
            <div class="bor-box-mc plx1">
               <div class="gridster">
		          <ul class="grid-list" style="height: 585px; min-width: 100%; max-width: 100%; position: relative; padding: 0px;">
				  	
				  </ul>
		        </div>
            </div>
        </div>

        <select-table :table="tableId" :tableList="tableList" v-on:checked = "checkTable"></select-table>
		<share-layer :share="share" :id="currentReport.reportId"></share-layer>
		
	</div>
</template>

<script>
import api from '../../api'
import router from '../../router'
import { mapGetters } from 'vuex'
import loading from '../../components/loading'
import echarts from 'echarts'
import Chart from './Chart.js'
import selectTable from './select-table.vue'
import shareLayer from '../../components/share-layer'

var gridster;

export default {
	name: 'right-cont',
	components: {
		'v-loading': loading,
		'select-table' : selectTable,
		'share-layer': shareLayer,
	},

	created () {
		this.$events.on('view-report', this.viewReport)
	},
	data () {
		return {
			table : '',
			tableId:'',
			tableList: {
            	folders : [],
                sheetList:[]
            },
			share: {
				type: 0,
				id: 0,
				url: 'https://xdata.jcloud.com/exp/_share.html#/report-share',
				open: false,
				pv : 0
			},
			charts: [],
			visibility: {
				visibility: 'hidden'
			},
			tempCharts: [],
			gridster: null
		}
	},
	computed: {
		...mapGetters(['loading', 'reports','currentReport','deleteLayer', 'newReport', 'selectReport'])
	},
	mounted () {
		var that = this;
		/**
		* 初始化gridster
		* */
		this.initGrid();

		/*
			刷新
		*/
		$(".gridster ul").on('click', '.ci1', function(event) {
			event.preventDefault();
			var $li = $(this).closest('li');
			var item = $li.data('item');
			var type = $li.attr('data-type');

			if(type == 'table') {
				$('#' + item.chartId).find('.canvas').html('');
			}
			
			api.getData({
				id : item.chartId
			}).then(res=>{
				if(0 == res.code){
					var layout = JSON.parse(item.layout);
					Chart.setData(res.data);
					if(layout){
						Chart.create('#' + item.chartId + ' .canvas',layout.type,layout.header);
					}

					// 处理类型为表格的
					if(layout && layout.type == 'table') {
						that.createTable(res.data);
					}
				}
			},error=>{});
		});

		/*
			编辑
		*/

		$(".gridster ul").on('click', '.ci2', function(event) {
			event.preventDefault();

			var $li = $(this).closest('li');

			var item = $li.data('item');
			router.push({ path: '/add-chart', query: {
				chartId : item.chartId,
				tableId : item.sheetId,
				reportId: that.currentReport.reportId
			}});
		});

		/*
		删除
		*/

		$(".gridster ul").on('click', '.ci3', function(event) {
			event.preventDefault();
			var $li = $(this).closest('li');
			var item = $li.data('item');
			var data = {
				name : item.chartName,
				id : item.chartId,
				type : '图表'
			};
			that.$store.dispatch('setDeleteLayer', data);
			that.deleteLayerPro((layero, index) => {
				layer.close(index);
				let indexLoaing = layer.load(1);
				api.deleteChart({id:that.deleteLayer.id})
				.then(res => {
						if(res.code == 0) {
							var gridster = $(".gridster ul").gridster().data('gridster');
							gridster.remove_widget($li);
							layer.close(indexLoaing);
							that.layerMsg('删除图表成功!', 1);
							that.charts.length = that.charts.length - 1;
							if(that.charts.length <= 0) {
								that.$store.commit('set_currentReport_key',{
									charts : false
								});
							}
							that.showReport();
						}else{
							that.layerMsg(res.message, 5)
						}
					}, error => {
						console.log(error)
					})
			}, cancel => {
			})
		});

	},
	watch: {
		selectReport () {
			this.viewReport();
			this.getCount();
		}
	},

	methods: {
		getCount(){
			api.getCount({
				targetId: this.currentReport.reportId,
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

		initGrid () {
			$(".gridster ul").gridster(this.setGrid($(".gridster ul"))).css({'padding': '0'});
		},
		setGrid ($ul) {
			let ulWidth = $ul.width();
			let diffnum = 112;
			// fix 左侧边栏引起的，图表定位差异
			$ul.css({'min-width': ulWidth - diffnum, 'max-width': ulWidth - diffnum});
			return {
				widget_base_dimensions: ['auto', 140],
				autogenerate_stylesheet: true,
				min_cols: 1,
				max_cols: 6,
				widget_margins: [8, 8],
				
				serialize_params: function($w, wgd) {
					return {
						chartId: $w.find('.chart-box').attr('id'),
						col: wgd.col,
						row: wgd.row,
						size_x: wgd.size_x,
						size_y: wgd.size_y
					};
				},
				draggable: {
					handle: 'h3',
				},
				resize: {
					enabled: true,
					stop:function(e,ui){
						var echartsIns;
						var canvas = ui.$helper.siblings('.chart-box').find('.canvas').get(0);
						var $tableBox = $(canvas).find('.table-box');
						if(canvas) {
							echartsIns = echarts.getInstanceByDom(canvas);
							$tableBox.height($(canvas).height() - 30);
						}
						var echartTpl =  ui.$helper.siblings('.echart-tpl').get(0);
						var echartTplIns = echarts.getInstanceByDom(echartTpl);
						if(echartsIns){
							setTimeout(function(){
								echartsIns.resize();
								echartTplIns.resize();
							},200)
						}
					}
				}
			};
		},
		saveLayout(){
			var gridster = $(".gridster ul").gridster().data('gridster');
			var arr = gridster.serialize();
			var obj = {};

			for (var i = 0; i < arr.length; i++) {
				var item = arr[i];
				obj[item.chartId] = item;
			}

			var data = {
				id : this.currentReport.reportId,
				layout : JSON.stringify(obj)
			};

			layer.load(1);
			api.updateReport(data).then(res=>{
				layer.closeAll();
				if(res.code == 0){
		            this.layerMsg('保存成功', 1)
				}
				else {
					this.layerMsg(res.message, 5)
				}
	        },error=>{})
		},
		initChat(charts){
			var that = this;

			for (var i = 0; i < charts.length; i++) {
				var item = charts[i];
				
				(function(item){
					var tempChartEl = document.getElementById('temp' + item.chartId);
					var chartEl = document.getElementById(item.chartId);
					var tempChart = echarts.init(tempChartEl);

					$(tempChartEl).show();
					tempChart.showLoading();
					api.getData({
						id : item.chartId
					}).then(res=>{
						if(0 == res.code){
							var layout = JSON.parse(item.layout);
							
							Chart.setData(res.data);
							if(layout){
								Chart.create('#' + item.chartId + ' .canvas', layout.type, layout.header);
							}
							// 处理类型为表格的
							if(layout && layout.type == 'table') {
								that.createTable(res.data);
							}
							tempChart.hideLoading();
							$(tempChartEl).hide();

							// that.$root.$children[0].initContSize();
						}
					},error=>{
					});
				})(item)
			}
		},
		createTable (data) {
			let chartId = data.chartId;
			let headers = data.headers;
			let values = data.values;
			let $canvas = $('#' + chartId).find('.canvas');
			let $tableBox = $('<div class="table-box">');
			let $table = $('<table class="listTable bt-none">');
			let $thead = $('<thead></thead>');
			let $tbody = $('<tbody></tbody>');
			let $tr = $('<tr class="tcenter trGray">').appendTo($thead);

			headers.forEach((item, index) => {
				let $th = $('<th>').html(item);
				$tr.append($th);
			});
			values.forEach((arr, index) => {
				let $tr = $('<tr class="tcenter">');
				if(index % 2 != 0) {
					$tr.addClass('trGray');
				}
				arr.forEach((item, idx) => {
					let $td = $('<td>').html(item);
					$tr.append($td);
				});
				$tbody.append($tr);
			});
			$table.append($thead).append($tbody);
			$('#' + chartId).parent('li').attr('data-type', 'table');
			$tableBox.append($table).css({
				marginTop: 30,
				height: $canvas.height() - 30,
				'overflow-y': 'scroll',
				'overflow-x': 'hidden'
			});
			$canvas.html($tableBox);
		},
		viewReport(){
			var data = this.selectReport;
			var template = 
					'<li style="margin-top: auto; margin-bottom: auto; position: absolute; min-height: auto;">'+
						'<h3>{{chartName}}</h3>'+
						'<div class="chart-box" id="{{chartId}}"> ' +
							'<div class="canvas"></div>'+
							'<div class="icon">'+
							'	<i class="ci1"></i>'+
							'	<i class="ci2"></i>'+
							'	<i class="ci3"></i>'+
							'</div>'+
						'</div>' +
						'<div id="temp{{chartId}}" class="echart-tpl"></div>' +
					'</li>' ;

			var ishavecharts = false ;
			var charts = data.charts;
			var layout = data.layout;

			this.charts = charts;
			if(charts && charts.length){
				ishavecharts = true;
				this.gridster = $(".gridster ul").gridster().data('gridster');
				this.gridster.remove_all_widgets();
				// test
				// let data = {
				// 	grid: this.gridster,
				// 	initGrid: this.initGrid,
				// 	viewReport: this.viewReport
				// };
				// this.$store.dispatch('setGridster', data);
				
				setTimeout((function(){
					var that = this;
					if(!layout){
						layout = {};
					}else{
						layout = JSON.parse(layout);
					}

					for (var i = 0; i < charts.length; i++) {
						var item = charts[i];
						var item2 = layout[item.chartId];
						var $li = $(template.replace(/\{\{(\w+)\}\}/g,function(v,v2){
								return that.HtmlEncode(item[v2]);
							}));
						if($('#temp' + item.chartId).length) {
							$('#temp' + item.chartId).remove();
						}
						$li.data('item',item);

						if(item2){
							this.gridster.add_widget($li, item2.size_x, item2.size_y, item2.col, item2.row);
						}else{
							this.gridster.add_widget($li, 3, 2);
						}
					}
					
					this.initChat(charts);
					
				}).bind(this),500);

			}
			this.$store.commit('set_currentReport_key',{
				charts : ishavecharts
			});
			this.showReport();
		},
		createReport () {
			this.$parent.$children[0].$emit('create-report');
		},
		switchTable:function(){
	        var currentTable = this.table;
	        var __l = layer.load(1);
	        var that = this;
	        api.sheetList().then(res=>{
	            if(res.code == 0){
	                that.tableList.folders = res.data.folders;
	                that.tableList.sheetList = res.data.sheetList;
	                layer.open({
						title: '选择工作表',
						type: 1,
						content: $('.selectWorksheet'),
						area: '520px',
						btn: ['确定', '取消'],
							yes: function(index, layero){
								if(that.tableId && that.table){
									router.push({ path: '/add-chart', query: {
										table   : that.table,
										tableId : that.tableId,
										reportId: that.currentReport.reportId
									}});
									layer.close(index);
								}
							},cancel: function(index){
							}
					});
	            }else{
	                layer.alert(res.message,{
	                    icon : 2
	                })
	            }
	            layer.close(__l)
	        },error=>{
	            layer.close(__l)
	        })
	    },
	    checkTable:function(item){
            this.table = item.sheetName;
            this.tableId = item.sheetId;
        },
		/**
		* 分享
		 */
		shareReport () {
			let data = {
				type: this.share.type,
				targetId: this.currentReport.reportId,
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
		showReport () {
			if(!this.loading && this.selectReport.charts) {
				this.visibility.visibility = 'visible';
			}
			else {
				this.visibility.visibility = 'hidden';
			}
		},
		/**
		 * 刷新报表
		 */
		refresh () {
			this.$parent.$children[0].$emit('set-currReport');
		}
	}
}
</script>