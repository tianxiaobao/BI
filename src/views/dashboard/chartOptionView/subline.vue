<template>
    <collapse :title="title">
        <el-checkbox slot="text" v-model="show" @change="showChange">显示</el-checkbox>
        <el-form :label-position="labelPosition" label-width="60px">
            <el-form-item label="数值">
               <input-number v-model="num" :min="0" @change="updateValue"></input-number>
            </el-form-item>
            <el-form-item label="线宽">
                <input-number v-model="num2" :min="0" @change="updateWidth"></input-number>
            </el-form-item>
            <el-form-item label="样式">
                 <el-select v-model="options.lineStyle.normal.type" placeholder="请选择" @change="updateChartOption">
                    <el-option v-for="item in lineStyle" :key="item.value":label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="颜色">
                <colorpicker v-model="options.lineStyle.normal.color" @updateChartOption="updateChartOption"></colorpicker>
            </el-form-item>
            <el-form-item label="资料标签">
                <el-checkbox v-model="tagChecked" @change="showTag" :disabled="!show">显示</el-checkbox>
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
    props: ['axis','options', 'title'],
    components: { 
        Collapse, 
        'el-input': Input, 
        'el-form': Form, 
        'el-form-item': FormItem,
        'input-number': inputNumber,
        'el-select': Select,
        'el-option': Option,
        'el-checkbox': Checkbox,
        colorpicker
    },
    data () {
       const markLine = this.options;
        return {
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
            ],
            num: this.axis === 'y' ? markLine.data[0].yAxis : markLine.data[0].xAxis,
            num2: this.options.lineStyle.normal.width,
            show: Boolean(this.options.lineStyle.normal.opacity),
            tagChecked: this.options.label.normal.show
        }
    },
    methods: {
        updateChartOption () {
            this.$events.emit('updateChartOption');
        },
        updateValue () {
            if(this.axis === 'y') {
                this.options.data[0].yAxis = this.num;
            } else if(this.axis === 'x') {
                this.options.data[0].xAxis = this.num;
            }
            this.updateChartOption();
        },
        updateWidth () {
            this.options.lineStyle.normal.width = this.num2;
            this.updateChartOption();
        },
        showChange () {
            this.tagChecked = this.options.label.normal.show = this.show;
            this.options.lineStyle.normal.opacity = Number(this.show);
            this.updateChartOption();
        },
        showTag () {
            this.options.label.normal.show = this.tagChecked;
            this.updateChartOption();
        }
    }
};
</script>