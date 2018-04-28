<template>
	<div class="mt10">
        <div class="bor-box-mt br-none">
            样式设置
        </div>

        <div class="bor-box-mc br-none pad10">
            <ul class="m-option">
                <li><chart-global :chart="chart.chartOption"></chart-global></li>
                <li><chart-title :chartTitle="chart.chartOption.title"></chart-title></li>
                <li><axis :axis="chart.chartOption.xAxis" title="X轴"></axis></li>
        		<li><axis :axis="chart.chartOption.yAxis" title="Y轴"></axis></li>
        		<!-- <li><chart-legend :option="chart.chartOption.legend"></chart-legend></li> -->
                <li><subline axis="x" :options="chart.chartOption.extend.xMarkLine" title="X辅助线"></subline></li>
                <li><subline axis="y" :options="chart.chartOption.extend.yMarkLine" title="Y辅助线"></subline></li>
                <li><grid-line :options="chart.chartOption.yAxis.splitLine"></grid-line></li>
                <li><series-label :extend="chart.chartOption.extend"></series-label></li>
                <li><series-color :extend="chart.chartOption.extend"></series-color></li>
            </ul>
        </div>
    </div>
</template>
<script>
import chartLegend from '../chartOptionView/chart-legend.vue';
import chartTitle from '../chartOptionView/chart-title.vue';
import chartGlobal from '../chartOptionView/chart-global.vue';
import subline from '../chartOptionView/subline.vue';
import axis from '../chartOptionView/axis.vue';
import gridLine from '../chartOptionView/grid-line';
import seriesColor from '../chartOptionView/series-color.vue';
import seriesLabel from '../chartOptionView/series-label';
export default {
	props:[
		'chart'
	],
	components:{
		chartLegend,
		chartTitle,
        gridLine,
		axis,
        chartGlobal,
        subline,
        seriesColor,
        seriesLabel
	},
    mounted () {
        // console.log(this.chart.chartOption.series);
    }
}
</script>
