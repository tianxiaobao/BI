<template>
    <collapse title="角度轴">
        <el-checkbox slot="text" v-model="axis.axisLine.show" @change="showChange">显示</el-checkbox>
        <el-form :label-position="labelPosition" :label-width="labelWidth">
            <el-form-item label="文本字号">
                <input-number v-model="axis.name.textStyle.fontSize" :min="1" @change="updateChartOption"></input-number>
            </el-form-item>
            <el-form-item label="文本颜色">
                <colorpicker v-model="axis.name.textStyle.color" @updateChartOption="updateChartOption"></colorpicker>
            </el-form-item>
            <el-form-item label="轴线宽度">
                <input-number v-model="axis.axisLine.lineStyle.width" :min="0" @change="updateChartOption"></input-number>
            </el-form-item>
            <el-form-item label="轴线颜色">
                <colorpicker v-model="axis.axisLine.lineStyle.color" @updateChartOption="updateChartOption"></colorpicker>
            </el-form-item>
            <el-form-item label="旋转角度">
               <slider :min='1' :max='360' :step='1' v-model="axis.startAngle" :showinput='true' @updateChartOption="updateChartOption"></slider>
            </el-form-item>
        </el-form>
    </collapse>
</template>
<script>
import { Input, Form, FormItem, Checkbox} from 'jcloud-ele-ui';
import inputNumber from '@/components/jcloud-ele/inputNumber';
import collapse from '../../../components/jcloud-ele/collapse';
import colorpicker from '@/components/jcloud-ele/colorPicker';
import slider from '@/components/jcloud-ele/slider';
export default {
    props: ['axis'],
    components: {
        'el-input': Input,
        'el-form': Form,
        'el-form-item': FormItem,
        'el-checkbox': Checkbox,
        collapse,
        inputNumber,
        colorpicker,
        slider,
    },
    data () {
        return {
            labelPosition: 'right',
            labelWidth: '60px',
        }
    },
    methods: {
        updateChartOption () {
            this.$events.emit('updateChartOption');
        },
        showChange () {
            this.axis.name.show=this.axis.axisLine.show;
            this.updateChartOption ();
        }
    }
};
</script>