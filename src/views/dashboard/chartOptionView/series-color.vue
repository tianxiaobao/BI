<template>
	<collapse title="系列颜色">
	    <el-form label-position="right" label-width="60px">
			<el-form-item  v-for="(item, index) of extend.series" :label="item.name" :key="index">
	           <colorpicker v-model="item.color" @updateChartOption="updateChartOption"></colorpicker>
	        </el-form-item>
	    </el-form>
	</collapse>
</template>
<script>
import Collapse from '@/components/jcloud-ele/collapse.vue'
import colorpicker from '@/components/jcloud-ele/colorPicker.vue'
import { Form, FormItem } from 'jcloud-ele-ui'
export default {
	props: [
		'extend'
	],
	components: {
		Collapse,
		colorpicker,
        'el-form': Form, 
        'el-form-item': FormItem
	},

	methods: {
		updateChartOption () {
			this.$events.emit('updateChartOption');
		}
	}
}
</script>