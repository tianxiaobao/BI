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
                    <chart-legend :option="chart.chartOption.legend"></chart-legend>
                </li>
                <li>
                    <series-label :extend="chart.chartOption.extend" :labelTypeOptions="option"></series-label>
                </li>
                <li><series-color :extend="chart.chartOption.extend" ></series-color></li>
            </ul>
        </div>
    </div>
</template>

<script>
import chartGlobal from '../chartOptionView/chart-global.vue';
import chartTitle from '../chartOptionView/chart-title.vue';
import chartLegend from '../chartOptionView/chart-legend';
import seriesColor from '../chartOptionView/series-color.vue';
import seriesLabel from '../chartOptionView/series-label';

export default {
	props:[
		'chart'
	],
    components: {
        chartGlobal,
        chartTitle,
        chartLegend, 
        seriesColor,
        seriesLabel
    },
    data(){
        return{
            option:[
            {
                label:'类别',
                value:'name'
            },
            {
                label:'资料值',
                value:'percent'
            },
            {
                label:'两者',
                value:'name_percent'
            },
            ]
        }
    }


};
</script>
