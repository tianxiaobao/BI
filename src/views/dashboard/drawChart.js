import echarts from 'echarts'
import markLine from './chartSetView/markLine';
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
    mergeExtend
 } from './exampleTable.js'

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

export function draw(chart,id){

	markLine(chart);
    mergeExtend(chart);
    let option = chart.chartOption;
    let ele = document.getElementById(id);
    let ins = echarts.getInstanceByDom(ele);
	if(!ins){
		ins = echarts.init(ele);
	}
	ins.clear();
	ins.setOption(option);
	ins.hideLoading();
}

export function initChartOption(currentChart,layout){

	if(layout.chart){
	     currentChart.chart = $.extend(true,chartKind[layout.type],layout.chart);
	}
	else{
	     currentChart.chart = chartKind[layout.type];
	}
	
}

export function initChartOptionForReport(currentChart,layout){
	if(layout.chart){
	     currentChart.chart = $.extend(true,{},chartKind[layout.type],layout.chart);
	}
	else{
	     currentChart.chart = $.extend(true,{},chartKind[layout.type]);
	}
}