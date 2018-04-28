<template>
	<collapse title="全局样式">
	    <el-form label-position="right" label-width="60px">
			<el-form-item label="背景颜色">
	           <colorpicker v-model="chart.backgroundColor" @updateChartOption="updateChartOption"></colorpicker>
	        </el-form-item>
	        <slot name="shap"></slot>
	    </el-form>
	</collapse>
</template>
<script>
import Collapse from '@/components/jcloud-ele/collapse.vue'
import colorpicker from '@/components/jcloud-ele/colorPicker.vue'
import { Form, FormItem } from 'jcloud-ele-ui'
export default {
	props: [
		'chart'
	],
	components: {
		Collapse,
		colorpicker,
        'el-form': Form, 
        'el-form-item': FormItem,
	},
	
	methods: {
		updateChartOption () {
			this.$events.emit('updateChartOption');
		}
	}
}
</script>