<style>
    .add_selected {
        position: relative;
        z-index: 111;
    }
</style>
<template>
    <div class="s-rightMenu">
        <div class="bor-box-mc white-bg" v-show="loading">
            <div class="no-report">
                <loading></loading> 
            </div>
        </div>
        <!-- 无报表 -->
        <div class="bor-box-mc white-bg ml12" v-if="!loading && !reports">
            <div class="no-report">
                <p>无报表数据 可先点击<a href="#" class="blueLink ml10" @click.prevent="createReport">新建报表</a></p>
            </div>
        </div>

        <!-- 有报表，有/无chart -->
        <div class="white-bg ml12"v-show="!loading">
            <div class="bor-box-mt" :class="{'not-charts': !showCharts.length}">
                {{selectReport.name}}
                <a href ="#" class="fr blueLink mgleft10 mr10" @click.prevent="shareReport" v-if="showCharts.length">分享(PV:{{share.pv}})</a>
                <a href="#" class="fr blueLink" @click.prevent="saveLayout(true)" v-if="showCharts.length">保存</a>
                <a href="#" class="fr blueLink mr10" @click.prevent="addText">+添加文本</a>
                <a href="#" class="blueLink fr mr10" @click.prevent="addChart" @mouseover="showChartPanel = true" @mouseout="showChartPanel = false" style="position: relative;">
                    <span>+添加图表 <i :class="[showChartPanel ? 'icon-angle-up' : 'icon-angle-down']"></i></span>
                    <charts-panel v-show="showChartPanel" @change="addTemplateChart"></charts-panel>
                </a>
            </div>
            
            <div class="bor-box-mc" :class="{'pad20': !showCharts.length}">
                <ul class="add_selected" v-if="!showCharts.length">
                    <li>
                        <a href="#" @click.prevent="addChart">
                            <div class="mb20">+</div>
                            <p>添加图表</p>
                        </a>
                    </li>
                </ul>
                <div class="grid-stack" id="grid-stack-1"></div>
                <div class="cl"></div>
            </div>
        </div>

        <share-layer :share="share" :id="currentReport.reportId"></share-layer>
    </div>
</template>
<script>
import '@/style/right-grid.less';
import api from '@/api';
import '@/style/bi-list.css';
import echarts from 'echarts';
import { mapGetters } from 'vuex';
import loading from '@/components/loading';

import shareLayer from '@/components/share-layer';
import chartsPanel from '@/components/dashboard/charts-panel';
import EasyEditor from '@/components/dashboard/easy-editor';
import * as chartKind from '@/views/dashboard/chartKind.js';
import markLine from './chartSetView/markLine';
import{staticDataChart, apiDataChart, mergeExtend } from './exampleTable.js'

import{
   draw,
   initChartOptionForReport
} from './drawChart.js'

export default {
    name: 'right-cont',
    data () {
        return {
            layout: [],
            share: {
                type: 0,
                id: 0,
                url: 'https://xdata.jcloud.com/exp/_share.html#/report-share',
                open: false,
                pv : 0
            },
            showChartPanel: false,
            grid: null,
            gridOpts: {
                float: true,
                animate: true,
                // handle: '.grid-stack-item-content .layout-head'
            },
            timer: null,
            reportId: 0
        }
    },
    components: {
        loading,
        'share-layer': shareLayer,
        chartsPanel
        
    },
    computed: { 
        ...mapGetters(['loading', 'reports', 'deleteLayer', 'selectReport', 'currentReport', 'resizeCount', 'selectSheet']),
        showCharts () {
            if(!this.selectReport.charts) {
                this.selectReport.charts = [];
            }
            return this.selectReport.charts;

        }
    },
    created () {
        layer.closeAll();
    },
    watch: {
        selectReport (n) {
            if(this.reportId != n.id) {
                this.reportId = n.id;
                this.initGrid();
                this.watchSelectReport();
                this.getSharePv();
            }
        },
        resizeCount () {
            this.resizeLayout();
        },
        'selectReport.charts': function (n) {
            if(n && n.length === 0) {
                $('#grid-stack-1').removeAttr('style');
            }
        }
    },
    methods: {
        initGrid () {
            const $gridStack = $('#grid-stack-1');
            $gridStack.removeAttr('style');
            $gridStack.gridstack(this.gridOpts);
            this.grid = $gridStack.data('gridstack');
            $gridStack.on('resizestop', this.resizestop);
            $gridStack.on('dragstop', this.delaySaveLayout);
            $(window).on('resize', this.resizeLayout);
        },
        getSharePv(){
            api.getCount({
                targetId: this.currentReport.reportId,
                shareType: this.share.type
            }).then(res => {
                if(res.code == 0){
                    this.share.pv = res.data;
                }
            }, error=>{
                console.log(error);
            });
        },
        watchSelectReport () {
            this.layout.length = 0;
            this.grid && this.grid.removeAll();
            if(this.selectReport.charts && this.selectReport.charts.length) {
                const prs = this.initLayout(this.selectReport);
                prs.then(this.loadGrid).then(this.bindHandle).then(this.initCharts);
            }
        },
        initLayout (selectReport) {
            const layout = selectReport.layout;
            const charts = selectReport.charts;
            charts.forEach((item, index) => {
                if(layout) {
                    const data = layout[item.chartId];
                    if(data && 'x' in data && 'y' in data) {
                        data.name = item.chartName;
                        this.layout.push(data);
                    } else {
                        this.layout.push(this.setNewGrid(item, index, true, 'chart'));
                    }
                } else if(!layout || JSON.stringify(layout) == '{}') {
                    this.layout.push(this.setNewGrid(item, index, true, 'chart'));
                }
            });
            return new Promise((resolve) => {
                setTimeout(() => {resolve(selectReport); }, 200);
            });
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
        loadGrid (selectReport) {
            const charts = selectReport.charts;
            this.layout.forEach((node, index) => {
                this.grid.addWidget(this.addHtml(node), node.x, node.y, node.width, node.height, node.position);
            });
            return selectReport;
        },
        setNewGrid (item, index, position, type) {
            return {x: 0, y: 0, width: 4, height: 3, position: position, chartId: item.chartId, name: item.chartName || '', type: type};
        },
        getCurrentChart (arr, targetId) {
            for (let i = 0; i < arr.length; i++) {
                arr[i].index = i;
                if(arr[i].chartId === targetId) return arr[i];
            }
        },
        setLoading (chart) {
            const ele = document.getElementById(chart.chartId);
            const ins = echarts.init(ele);
            ins.showLoading();
        },
        bindHandle (selectReport) {
            let chart = null;
            const self = this;
            const charts = selectReport.charts;
            const methods = ['editChart', 'removeGrid'];
            methods.forEach((item, index) => {
                $('.grid-stack').on('click', `.layout-head .ci${index+2}`, function () {
                    const id = $(this).closest('.grid-stack-item').data('id');
                    chart = self.getCurrentChart(charts, id);
                    chart && self[item](chart);
                });
            });
            return selectReport;
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
        addTemplateChart (chart) {
            const req = {
                sheetId: 0,
                reportId: this.selectReport.id,
                name: chart.name,
                layout: JSON.stringify({
                    type: chart.type,
                    dataType: 'static'
                })
            };
            const newChart = {chartId: 0, chartName: chart.name, layout: {}, sheetId: 0, status: 0, dataType: 'static', type: chart.type };
            const node = {chartId: 0, x: 0, y: 0, width: 4, height: 3, position: true, name: chart.name, type: chart.type };
            const loadIndex = layer.load(1);

            return new Promise((resolve, reject) => {
                api.chartSave(req).then(res => {
                    layer.close(loadIndex);
                    if(res.code == 0) {
                        node.chartId = chart.chartId = newChart.chartId = res.data;
                     
                        this.layout.push(node);
                        if(!this.selectReport.charts) {
                            this.selectReport.charts = [];

                        }
                        this.selectReport.charts.push(newChart);
                        this.bindHandle(this.selectReport);
                        this.grid.addWidget($(this.addHtml(node)), 0, 0, 4, 3, true);
                       if(chart.type != 'text') {
                            staticDataChart(chart);
                            this.addDefaultChart(chart);
                       }
                        this.saveLayout(false);
                        resolve(this.layout);
                    } else {
                        console.log('添加失败', res.message);
                    }
                });
            });
        },
        addHtml (node) {
            const content = (node) => {
                let str = `<div class="item-text" id="${node.chartId}">`;
                if(node.type != 'text') {
                    str = `<div class="grid-stack-item-content"><div class="layout-head">
                        <div class="icon"><i class="ci2" /><i class="ci3" /> </div>
                    </div>
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
                }
                return str;
            };
            const template = `<div id="grid-${node.chartId}" data-id="${node.chartId}">
                ${content(node)}`;
            return template;
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
                // markLine(chart);
                // mergeExtend(chart);
                setTimeout(() => {
                    draw(chart,chart.chartId);
                }, 500);
            }
        },
        addText () {
            this.addTemplateChart({name: 'text', type: 'text'}).then(res => {
                this.initText(res);
            });
        },
        initText (layout) {
            layout.forEach((item, index) => {
                if(!item.editor && item.type == 'text') {
                    item.editor = EasyEditor.init(item.chartId);
                    const $easyEditor = $(item.editor.easyEditor);
                    $easyEditor.html(item.content);
                    item.editor.bindALink($easyEditor);
                    $easyEditor.on('blur', () => {
                        this.delaySaveLayout();
                    });
                }
            });
        },
        /**
         * 创建表格类型的数据
         * @param  {Object}
         */
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
        },
        resizestop (event, ui) {
            const targetId = $(ui.element).data('id');
            const echartDom = echarts.getInstanceByDom($(`#${targetId}`).get(0));
            echartDom && echartDom.resize();
            this.delaySaveLayout();
        },
        delaySaveLayout () {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {this.saveLayout(false);}, 1000);
        },
        /**
         * 删除图表
         * @param  {Object}
         */
        removeGrid (node) {
            const data = {name: node.chartName, id: node.chartId, type: '图表'};
            layer.closeAll();
            this.$store.dispatch('setDeleteLayer', data);
            this.deleteLayerPro((layero, index) => {
                const indexLoaing = layer.load(1);
                const req = {id: this.deleteLayer.id };

                api.deleteChart(req).then(res => {
                    layer.closeAll();
                    if(res.code == 0) {
                        this.removeItem(node);
                        this.saveLayout(false);
                    }else{
                        this.layerMsg(res.message, 5);
                    }
                }, error => {
                    console.log(error);
                });
            }, (index) => {
                layer.close(index);
            });
        },
        removeItem: function(curr) {
            for(let i = 0; i < this.layout.length; i++) {
                if(this.layout[i].chartId == curr.chartId) {
                    this.layout.splice(i, 1);
                    this.selectReport.charts.splice(i, 1);
                }
            }
            this.grid.removeWidget($(`#grid-${curr.chartId}`));
        },
        createReport () {
            this.$parent.$children[0].$emit('create-report');
        },
        addChart () {
            const load = layer.load(1);
            this.showChartPanel = false;
            api.sheetList().then(res => {
                layer.close(load);
                if (res.code == 0) {
                    this.$store.commit('setSheets', res.data);
                    this.openAddChartLayer();
                }
            });
        },
        openAddChartLayer () {
            layer.open({
                title: '选择工作表',
                type: 1,
                content: $('.selectWorksheet'),
                area: '520px',
                btn: ['确定', '取消'],
                yes: (index, layero) => {
                    if(this.selectSheet.sheetId && this.selectSheet.sheetName){
                        this.$router.push({ path: '/add-chart', query: {
                            table   : this.selectSheet.sheetName,
                            tableId : this.selectSheet.sheetId,
                            reportId: this.selectReport.id
                        }});
                        layer.close(index);
                    }
                }
            });
        },
        /**
         * 编辑图表
         * @param  {Object}
         */
        editChart (item) {
            const loadIndex = layer.load(1);
            this.saveLayout(false).then(res => {
                layer.close(loadIndex);
                if(res.code == 0) {
                    const query = {
                        chartId : item.chartId || 0,
                        tableId : item.sheetId || 0,
                        reportId: this.selectReport.id
                    };
                    window.location.href = `_chart_edit.html#/?chartId=${query.chartId}&tableId=${query.tableId}&reportId=${query.reportId}`;
                } else {
                    this.layerMsg('编辑失败，请稍后再试！', 5);
                }
            });
        },
        drawChart (data, chart) {
            const layout = chart.layout || {type: 'table', chart: null};

            if(layout.type === 'table') {
                this.createTable(data);
            } else {
                let currentChart = {};
                currentChart.type = layout.type;
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
        shareReport () {
            const data = {
                type: this.share.type,
                targetId: this.currentReport.reportId,
                url: 'https://xdata.jcloud.com/exp/_share.html#/report-share'
            };
            let shareId = 0;
            api.shareGenerate(data).then(res => {
                if(res.code == 0) {
                    this.share.id = res.data.targetId;
                    this.share.url = res.data.shareUrl;
                    this.share.open = res.data.isOpen;
                    shareId = res.data.shareId;
                }
            }, error => {
                console.log(error);
            });

            this.layerShare(yes => {
                const url =  process.env.NODE_ENV !== 'development' ? this.share.url : `/_share.html#/report-share?id=${shareId}`;
                window.open(url, '_blank');
            });
        },
        saveLayout (flag) {
            let layout = {};
            const data = {id: this.selectReport.id };
            Array.from($('.grid-stack > .grid-stack-item:visible')).forEach((item, index) => {
                    const el = $(item);
                    const node = el.data('_gridstack_node');
                    const chartId = el.data('id');
                    const chartName = el.find('.layout-head h3').text() || '';
                    const type = this.layout[index].chartId == chartId ? this.layout[index].type: '';
                    const $easyEditor = $(`#${chartId}`).find('.easy-editor');
                    const content = $easyEditor.html() || '';

                    layout[chartId] = {
                        x: node.x, 
                        y: node.y, 
                        width: node.width, 
                        height: node.height, 
                        chartId: chartId, 
                        position: false, 
                        name: chartName, 
                        type: type, 
                        content: content
                    };
            });
            
            data.layout = JSON.stringify(layout, null, '');
            flag && layer.load(1);

            return new Promise ((reslove, reject) => {
                api.updateReport(data).then(res => {
                    if(flag) {
                        layer.closeAll();
                        (res.code == 0) ? this.layerMsg('保存成功', 1) : this.layerMsg(res.message, 5);
                    }
                    reslove(res);
                }, error => {
                    reject(error);
                    console.log(error);
                });
            });
        },
        resizeLayout () {
            this.layout.forEach((item, index) => {
                const ele = document.getElementById(item.chartId);
                const ins = echarts.getInstanceByDom(ele);
                if(ins) {
                    setTimeout(() => {ins.resize();}, 500);
                }
            });
        }
    }
}
</script>