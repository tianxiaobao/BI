<template>
    <collapse title="系列标签">
        <el-checkbox slot="text" v-model="extend.label.show" @change="updateChartOption">显示</el-checkbox>
        <el-form :label-position="labelPosition" :label-width="labelWidth">
            <el-form-item label="字号">
                <input-number v-model="extend.label.fontSize" :min="1" @change="updateChartOption"></input-number>
            </el-form-item>
            <el-form-item v-if="labelTypeOptions && labelTypeOptions.length" label="样式">
                <el-select v-model="extend.label.type" @change="updateChartOption">
                    <el-option v-for="item in labelTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="颜色">
                <colorpicker v-model="extend.label.color" @updateChartOption="updateChartOption"></colorpicker>
            </el-form-item>
            <el-form-item label="小数位数">
                <input-number v-model="extend.label.decimal" :min="0" :max="20" @change="updateChartOption"></input-number>
            </el-form-item>
        </el-form>
    </collapse>
</template>
<script>
import { Input, Form, FormItem, Checkbox, Col, Select, Option } from 'jcloud-ele-ui';
import inputNumber from '@/components/jcloud-ele/inputNumber';
import collapse from '../../../components/jcloud-ele/collapse';
import colorpicker from '@/components/jcloud-ele/colorPicker';

export default {
    props: {
        extend: {
            type: Object
        },
        labelTypeOptions: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data () {
        return {
            labelPosition: 'right',
            labelWidth: '60px'
        }
    },
    components: {
        'el-input': Input,
        'el-form': Form,
        'el-form-item': FormItem,
        'el-checkbox': Checkbox,
        'el-col': Col,
        'el-select': Select,
        'el-option': Option,
        collapse,
        inputNumber,
        colorpicker
    },
    methods: {
        updateChartOption () {
            this.$events.emit('updateChartOption');
        }
    }
};
</script>