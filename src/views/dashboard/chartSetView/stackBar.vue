<template>
    <div class="mt10">
        <div class="bor-box-mt br-none">
            样式设置
        </div>

        <div class="bor-box-mc br-none pad10">
            <ul class="m-option">
                <li>
                    <chart-global :chart="chart.chartOption"></chart-global>
                </li>
                <li>
                    <chart-title :chartTitle="chart.chartOption.title"></chart-title>
                </li>
                
                <li>
                    <axis :axis="chart.chartOption.xAxis" title="X轴"></axis>
                </li>
                <li>
                    <axis :axis="chart.chartOption.yAxis" title="Y轴"></axis>
                </li>
                <li>
                    <chart-legend :option="chart.chartOption.legend"></chart-legend>
                </li>
                
                <li>
                    <series-color :extend="chart.chartOption.extend"></series-color>
                </li>
                <li>
                    <series-label :extend="chart.chartOption.extend"></series-label>
                </li>

                <li>
                    <subline axis="y" :options="chart.chartOption.extend.yMarkLine" title="辅助线"></subline>
                </li>
                <li>
                    <grid-line :options="chart.chartOption.yAxis.splitLine"></grid-line>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import chartGlobal from '../chartOptionView/chart-global.vue';
import chartTitle from '../chartOptionView/chart-title.vue';
import gridLine from '../chartOptionView/grid-line';
import subline from '../chartOptionView/subline';
import chartLegend from '../chartOptionView/chart-legend.vue';
import axis from '../chartOptionView/axis.vue';

import seriesColor from '../chartOptionView/series-color';
import seriesLabel from '../chartOptionView/series-label';

export default {

    props:[
        'chart'
    ],

    components:{
        chartGlobal,
        chartTitle,
        gridLine,
        chartLegend,
        subline,
        seriesLabel,
        seriesColor,
        axis
    }
}
</script>
