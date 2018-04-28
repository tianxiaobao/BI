<template>
    <collapse title="网格线">
        <el-checkbox slot="text" v-model="show" @change="showChange">显示</el-checkbox>
        <el-form :label-position="labelPosition" label-width="60px">
            <el-form-item label="线宽">
               <input-number v-model="options.lineStyle.width" :min="0" @change="updateChartOption"></input-number>
            </el-form-item>
            <el-form-item label="样式">
                <el-select v-model="options.lineStyle.type" placeholder="请选择" @change="updateChartOption">
                    <el-option v-for="item in lineStyle" :key="item.value":label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="颜色">
                <colorpicker v-model="options.lineStyle.color" @updateChartOption="updateChartOption"></colorpicker>
            </el-form-item>   
        </el-form>
    </collapse>
</template>
<script>
import Collapse from '@/components/jcloud-ele/collapse.vue';
import inputNumber from '@/components/jcloud-ele/inputNumber';
import { Input, Form, FormItem, Select, Option, Checkbox } from 'jcloud-ele-ui';
import colorpicker from '@/components/jcloud-ele/colorPicker';

export default {
    props: ['options'],
    components: { 
        Collapse, 
        'el-input': Input, 
        'el-form': Form, 
        'el-form-item': FormItem,
        'input-number': inputNumber,
        'el-select': Select,
        'el-option': Option,
        colorpicker,
        'el-checkbox': Checkbox
    },
    data () {
        return {
            show: this.options.show,
            labelPosition: 'right',
            lineStyle: [
                 {
                    value: 'solid',
                    label: '实线'
                },
                {
                    value: 'dashed',
                    label: '虚线'
                },
                {
                    value: 'dotted',
                    label: '点线'
                }
            ]
        }
    },
    methods: {
        updateChartOption () {
            this.$events.emit('updateChartOption');
        },
        showChange (value) {
            this.options.show = this.show;
            this.updateChartOption();
        }
    }
};
</script>