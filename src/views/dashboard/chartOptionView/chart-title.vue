<template>
	<collapse title="标题">
		<el-checkbox slot="text" v-model="chartTitle.show" @change="updateChartOption">显示</el-checkbox>
	    <el-form label-position="right" label-width="60px">
	        <el-form-item label="标题文字">
	           <el-input v-model="chartTitle.text" @change="updateChartOption"></el-input>
	        </el-form-item>
			<el-form-item label="文字颜色">
	           <colorpicker v-model="chartTitle.textStyle.color" @updateChartOption="updateChartOption"></colorpicker>
	        </el-form-item>
	        <el-form-item label="背景颜色">
	           <colorpicker v-model="chartTitle.backgroundColor" @updateChartOption="updateChartOption"></colorpicker>
	        </el-form-item>
	        <el-form-item label="对齐方式">
	           <el-select v-model="chartTitle.left" placeholder="请选择" @change="updateChartOption">
                   <el-option v-for="item in align" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
	        </el-form-item>
	        <el-form-item label="字号">
	           <input-number v-model="chartTitle.textStyle.fontSize" :min="0" @change="updateChartOption"></input-number>
	        </el-form-item>
	    </el-form>
	</collapse>
</template>
<script>
import Collapse from '@/components/jcloud-ele/collapse.vue'
import colorpicker from '@/components/jcloud-ele/colorPicker.vue'
import inputNumber from '@/components/jcloud-ele/inputNumber';
import { Input,Checkbox,Select,Option,Form, FormItem } from 'jcloud-ele-ui'
export default {
	props: [
		'chartTitle'
	],
	components: {
		Collapse,
		colorpicker,
		'input-number': inputNumber,
		'el-input': Input, 
        'el-form': Form, 
        'el-select': Select,
        'el-option': Option,
        'el-form-item': FormItem,
        'el-checkbox': Checkbox,
	},
	data(){
		return {
			align : [
				{
                   value: 'left',
                   label: '靠左'
	            },
	            {
                   value: 'center',
                   label: '居中'
	            },
	            {
                   value: 'right',
                   label: '靠右'
	            }
			]
		}
	},
	methods: {
		updateChartOption () {
			this.$events.emit('updateChartOption');
		}
	}
}
</script>