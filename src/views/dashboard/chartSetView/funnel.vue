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
					<series-color :extend="chart.chartOption.extend"></series-color>
				</li>
                <li>
                    <series-label :extend="chart.chartOption.extend"></series-label>
                </li>
			</ul>
		</div>
	</div>
</template>

<script>
import chartGlobal from '../chartOptionView/chart-global';
import chartTitle from '../chartOptionView/chart-title';
import chartLegend from '../chartOptionView/chart-legend';
import seriesColor from '../chartOptionView/series-color';
import seriesLabel from '../chartOptionView/series-label';

export default {

	props: [
		'chart'
	],
	components: {
		chartGlobal,
		chartTitle,
		chartLegend,
        seriesLabel,
        seriesColor,
	}

}
</script>
