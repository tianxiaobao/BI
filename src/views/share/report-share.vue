<style>
.easy-editor {
	padding: 10px 10px;
}
.easy-editor a {
    color: #0098f7;
}
.easy-editor a:hover {
	text-decoration: underline;
}
.statement-data .grid-stack-item-content h3 {
	cursor: default;
}
</style>
<template>
	<div>
		<section class="content padtop50" v-show="status == 0">
		    <!-- 主内容区begin -->
		    <div class="bor-box pad20 white-bg margin10">
		    	<div class="statement-mt">
		        	<h3>{{report.name}}</h3>
		            <p>分享者：<span>{{report.owner}}</span>&nbsp;&nbsp;最后编辑：{{report.time}}</p>
		    	</div>
		        <div class="statement-data mb20">
		        	<div class="grid-stack"></div>
		        </div>
		    </div>
		    <!-- 主内容区end -->
			<div class="footer-statement">
				<p>Powered by&nbsp;&nbsp;<span><a href="https://xdata.jcloud.com/exp/index.html#/dashboard">京东云-数知（BI报表）</a></span></p>
		    </div>
		</section>

		<section class="content padtop50" v-show="status == 12 || status == 13">
		    <!-- 主内容区begin -->
		    <div class="bor-box pad20 white-bg margin10">
		      <div class="connection-fail">
		       	  <p class="mt30 mb20"><img src="../../images/statement.png"></p>
		          <p class="mb20">该分享链接已被取消或不存在！</p>
		      </div>
		    </div>
		    <!-- 主内容区end -->
			<div class="footer-statement">
		    	<p>Powered by&nbsp;&nbsp;<span>京东云-数知（BI报表）</span></p>
		    </div>
		</section>

		<section class="content padtop50" v-show="status == 11 ">
		    <!-- 主内容区begin -->
		    <div class="bor-box pad20 white-bg margin10">
		      <div class="connection-fail">
		       	  <p class="mt30 mb20"><img src="../../images/statement.png"></p>
		          <p class="mb20">需登录京东云账号后方可访问该分享链接！</p>
		          <p class="mb20"><a :href="url" class="glBtn">京东云登录</a></p>
		      </div>
		    </div>
		    <!-- 主内容区end -->
			<div class="footer-statement">
		    	<p>Powered by&nbsp;&nbsp;<span>京东云-数知（BI报表）</span></p>
		    </div>
		</section>
	</div>
</template>


<script>
import '@/style/gridstack.css'
import '@/style/right-grid.less';
import api from '@/api'
import echarts from 'echarts'
import * as chartKind from '@/views/dashboard/chartKind.js'
import{staticDataChart, apiDataChart } from '@/views/dashboard/exampleTable.js'

import{
    draw,
    initChartOptionForReport
 } from '../dashboard/drawChart.js'

export default {
	name : 'report-share',
	data(){
		return {
			status : 0,  // 0=> 成功 11 => 未登录   12 13 => 分享不存在 或 取消
			layout: [],
			report : {
				name : '',
				owner : '',
				time : ''
			},
			url : '//uc.jcloud.com/login?returnUrl=' + encodeURIComponent(window.location.href),
			grid: null,
			gridOpts: {
                float: true,
                disableDrag : true,
                disableResize: true
            }
		}
	},

	mounted(){
        const shareId = this.$route.query.id;
        const $gridStack = $('.grid-stack');

    	$gridStack.gridstack(this.gridOpts);
    	this.grid = $gridStack.data('gridstack');

        this.getShare(shareId)
        .then(this.updateCount)
        .then(this.getReportData)
        .then(this.initLayout)
        .then(this.loadGrid).then(this.initCharts);
	},
	methods: {
		getShare (shareId) {
			return new Promise((resolve, reject) => {
				api.getShare({id : shareId}).then(res => {
		    			this.status = res.code;
		    			if(res.code == 0){
			    			this.report.owner = res.data.owner;
			    			this.report.time = res.data.updateTime;
			    			resolve(res.data);
		    			}
		    		},
		    		error => {reject(error)}
	            );
			}) 
		},
		updateCount (data) {
			return new Promise((resolve, reject) => {
				api.updateCount({
		        	targetId : data.targetId,
					shareType : 0
		        }).then(res =>{}, error => {reject(error);});
		        resolve (data);
			});
		},
		getReportData (data) {
			return new Promise((resolve, reject) => {
				api.reportDetail({id : data.targetId }).then(res => {
					if(res.code == 0) {
						this.report.name = res.data.name;
						resolve(this.tansData(res.data));
					}
				}, error => {
					reject(error);
				});
			});
		},
		tansData (data) {
			const charts = data.charts;
	        const layout = data.layout;

	        if(typeof layout == 'string') {
	            data.layout = JSON.parse(data.layout);
	        }
	        if(charts && charts.length) {
	            charts.forEach(item => {
	                item.layout = JSON.parse(item.layout);
	                item.columns = JSON.parse(item.columns);
	            });
	        }
	        return data;
		},
		initLayout (report) {
			const layout = report.layout;
            const charts = report.charts;

            charts.forEach((item, index) => {
                if(layout) {
                    const data = layout[item.chartId];
                    if(data && 'x' in data && 'y' in data) {
                        this.layout.push(data);
                    } else {
                        this.layout.push(this.setNewGrid(item, index, true, 'chart'));
                    }
                }
            });
            return new Promise((resolve) => {
                setTimeout(() => {resolve(report); }, 200);
            });
		},
		loadGrid (report) {
            const charts = report.charts;
            this.layout.forEach((node, index) => {
                this.grid.addWidget(this.addHtml(node), node.x, node.y, node.width, node.height, node.position);
            });
            return report;
        },
        setNewGrid (item, index, position, type) {
            return {x: 0, y: 0, width: 4, height: 3, position: position, chartId: item.chartId, name: item.chartName, type: type};
        },
        addHtml (node) {
            const content = (node) => {
                const str = `<div class="grid-stack-item-content">
                <div class="item-charts" id="${node.chartId}"> 
                    <div class="loader">
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                            <circle cx="50" cy="50" ng-attr-r="{{config.radius}}" fill="none" r="30" stroke="#b9071c" stroke-width="10"></circle>
                            <circle cx="50" cy="50" fill="none" r="30" stroke="#ffffff" stroke-width="20" stroke-linecap="square" transform="rotate(27 50 50)">
                              <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;180 50 50;720 50 50" keyTimes="0;0.5;1" dur="2s" begin="0s" repeatCount="indefinite"></animateTransform>
                              <animate attributeName="stroke-dasharray" calcMode="linear" values="18.84955592153876 169.64600329384882;94.2477796076938 94.24777960769377;18.84955592153876 169.64600329384882" keyTimes="0;0.5;1" dur="2" begin="0s" repeatCount="indefinite"></animate>
                            </circle>
                        </svg>
                        <div>loading...</div>
                    </div>
                </div>`;
                return str;
            };
            const template = `<div id="grid-${node.chartId}" data-id="${node.chartId}">
                ${content(node)}`;
            return template;
        },
        initCharts (selectReport) {
            const charts = selectReport.charts;
            charts.forEach((item, index) => {
                const layout = item.layout;
                if(layout && layout.type === 'text') {
                    this.initText(this.layout);
                } else {
                    this.initChart(item);
                }
            });
        },
        initChart (chart) {
            const layout = chart.layout;
            if(layout && ('dataType' in layout) && layout.dataType === 'static') {
                const data = $.extend(true, {}, chartKind[layout.type]);
                data.chartId = chart.chartId;
                staticDataChart(data);
                this.addDefaultChart(data);
            } else {
                api.getData({id: chart.chartId }).then(res => {
                    if(res.code == 0) {
                        this.drawChart(res.data, chart);
                    } else {
                        $(`#${chart.chartId}`).html(res.message);
                    }
                }, error => {
                    console.log(error);
                });
            }
        },
        initText (layout) {
            layout.forEach((item, index) => {
                if(item.type == 'text') {
                	const content = `<div class="easy-editor">${item.content}</div>`;
                    $(`#${item.chartId}`).html(content);
                }
            });
        },
        addDefaultChart (chart) {
            if(chart.type === 'table') {
                const data = {
                    headers: chart.chartOption.headers,
                    values: chart.chartOption.values,
                    chartId: chart.chartId
                };
                this.createTable(data);
            } else {
                setTimeout(() => {
                    draw(chart,chart.chartId);
                }, 500);
            }
        },
        drawChart (data, chart) {

            if(chart.layout.type === 'table') {
                this.createTable(data);
            } else {
                let layout = chart.layout;
                let currentChart = {};
                currentChart.type = layout.type;
                // currentChart.chart = layout.chart?layout.chart:$.extend(true, {}, chartKind[layout.type]);

                initChartOptionForReport(currentChart,layout);


                currentChart.chart.chartId = data.chartId;
                let chartSaveJson = {};
                chartSaveJson.categories = chart.categories?chart.categories:[];
                chartSaveJson.dimensions = chart.dimensions?chart.dimensions:[];
                chartSaveJson.series = chart.series?chart.series:[];
                apiDataChart(currentChart,chartSaveJson,data);
                this.addDefaultChart(currentChart.chart);
            }
        },
        createTable (data) {
            const chartId = data.chartId;
            const headers = data.headers;
            const values = data.values;
            const $chart = $(`#${chartId}`);
            const $tableBox = $('<div class="table-box unselectable">');
            const $table = $('<table class="listTable bt-none unselectable">');
            const $thead = $('<thead></thead>');
            const $tbody = $('<tbody></tbody>');
            const $tr = $('<tr class="trGray">').appendTo($thead);

            headers.forEach((item, index) => {
                let $th = $('<th>').html(item);
                $tr.append($th);
            });
            values.forEach((arr, index) => {
                let $tr = $('<tr>');
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
            $tableBox.append($table);
            $chart.html($tableBox);
        }
	}
};
</script>