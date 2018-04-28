<template>
		<div class="mt10">
        <div class="bor-box-mt br-none">
            样式设置
        </div>

        <div class="bor-box-mc br-none pad10">
            <ul class="m-option">
                <li>
                    <chart-global :chart="chart.chartOption">
                     <el-form-item label="位置" slot="shap">
                        <el-select v-model="chart.chartOption.radar.shape" @change='updateChartOption'>
                            <el-option v-for="item in shapList" :key="item.value":label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item> 
                </chart-global>
                </li>
                <li><chart-title :chartTitle="chart.chartOption.title"></chart-title></li>
		       <li><chart-legend :option="chart.chartOption.legend"></chart-legend></li>
               <li><angle-axis :axis="chart.chartOption.radar"></angle-axis></li> 
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
import angleAxis from '../chartOptionView/angle-axis.vue';
import {FormItem,Select, Option,} from 'jcloud-ele-ui';
import seriesColor from '../chartOptionView/series-color.vue';
import seriesLabel from '../chartOptionView/series-label';
export default {
	props:[
		'chart'
	],
	components:{
		chartLegend,
		chartTitle,
        chartGlobal,
        angleAxis,
        'el-form-item': FormItem,
        'el-select': Select,
        'el-option': Option,
        seriesColor,
        seriesLabel
	},
    data(){
        return{
            shapList:[{
                value:'circle',
                label:'圆形'
            },
            {
                value:'polygon',
                label:'多边形'
            }
            ]
        }
    },
    methods:{
                updateChartOption () {
            this.$events.emit('updateChartOption');
        },
    }
}
</script>
