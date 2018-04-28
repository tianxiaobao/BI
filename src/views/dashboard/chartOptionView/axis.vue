<template>
    <collapse :title="title">
        <el-checkbox slot="text" v-model="show" @change="showChange">显示</el-checkbox>
        <el-form :label-position="labelPosition" :label-width="labelWidth">
            <el-form-item label="文本字号">
                <input-number v-model="axis.axisLabel.fontSize" :min="1" @change="updateChartOption"></input-number>
            </el-form-item>
            <el-form-item label="文本颜色">
                <colorpicker v-model="axis.axisLabel.color" @updateChartOption="updateChartOption"></colorpicker>
            </el-form-item>
            <el-form-item label="轴线宽度">
                <input-number v-model="axis.axisLine.lineStyle.width" :min="0" @change="updateChartOption"></input-number>
            </el-form-item>
            <el-form-item label="轴线颜色">
                <colorpicker v-model="axis.axisLine.lineStyle.color" @updateChartOption="updateChartOption"></colorpicker>
            </el-form-item>
            <el-form-item label="小数位数">
                <input-number v-model="decimal" :min="0" :max="20" @change="decimalChange"></input-number>
            </el-form-item>
            <el-form-item label="标题">
                <el-checkbox v-model="showName" :disabled="!show" @change="showNameChange">显示</el-checkbox>
            </el-form-item>
            <el-form-item label="标题名称">
                <el-input v-model="name" @change="nameChange"></el-input>
            </el-form-item>
            <el-form-item label="标题字号">
                <input-number v-model="axis.nameTextStyle.fontSize" :min="1" @change="updateChartOption"></input-number>
            </el-form-item>
            <el-form-item label="标题颜色">
                <colorpicker v-model="axis.nameTextStyle.color" @updateChartOption="updateChartOption"></colorpicker>
            </el-form-item>
            <el-form-item label="位置">
                <el-col :span="12">
                    <div class="coord-col coord-x">
                        <input-number v-model="x" @change="coordChange"></input-number>
                        <div class="coord-label">横坐标</div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="coord-col coord-y">
                        <input-number v-model="y" @change="coordChange"></input-number>
                        <div class="coord-label">纵坐标</div>
                    </div>
                </el-col>
            </el-form-item>
        </el-form>
    </collapse>
</template>
<script>
import { Input, Form, FormItem, Checkbox, Col } from 'jcloud-ele-ui';
import inputNumber from '@/components/jcloud-ele/inputNumber';
import collapse from '../../../components/jcloud-ele/collapse';
import colorpicker from '@/components/jcloud-ele/colorPicker';

export default {
    props: ['axis', 'title'],
    components: {
        'el-input': Input,
        'el-form': Form,
        'el-form-item': FormItem,
        'el-checkbox': Checkbox,
        'el-col': Col,
        collapse,
        inputNumber,
        colorpicker
    },
    data () {
        return {
            labelPosition: 'right',
            labelWidth: '60px',
            decimal: 0,
            show: true,
            showName: false,
            name: '',
            x: 0,
            y: 0
        }
    },
    watch: {
        'axis.axisLabel.formatter': {
            immediate: true,
            handler (formatter) {
                const number = this.getDecimal(formatter);
                this.decimal = number;
            }
        },
        'axis.axisLine.show': {
            immediate: true,
            handler (show) {
                this.show = show;
            }
        },
        'axis.axisLine.name': {
            immediate: true,
            handler (name) {
                if (this.show) {
                    if (name) {
                        this.showName = true;
                    }
                    if (this.showName) {
                        this.name = name;
                    }
                }
            }
        },
        'axis.nameTextStyle.padding': {
            immediate: true,
            handler (padding) {
                this.x = padding[3];
                this.y = padding[2];
            }
        }
    },
    methods: {
        getFormatter (num) {
            const functionBody = `const valueNumber = Number(value);
                if (Number.isNaN(valueNumber)) {
                    return value;
                } else {
                    return valueNumber.toFixed(${num});
                }`;
            return new Function('value', functionBody);
        },
        getDecimal (formatter) {
            const functionBody = formatter.toString();
            const match = /.toFixed\((\d+)\)/g.exec(functionBody);
            const num = match ? Number(match[1]) : Number.NaN;
            // console.log('decimal:', num);
            return Number.isNaN(num) ? 0 : num;
        },
        decimalChange () {
            // console.log('decimalChange');
            this.axis.axisLabel.formatter = this.getFormatter(this.decimal);
            this.updateChartOption();
        },
        showChange () {
            this.axis.axisLine.show = this.show;
            this.axis.axisLabel.show = this.show;
            this.axis.axisTick.show = this.show;
            if (this.show && this.showName) {
                this.axis.name = this.name;
            } else if (!this.show) {
                this.axis.name = '';
            }
            this.updateChartOption();
        },
        showNameChange () {
            if (this.show && this.showName) {
                this.axis.name = this.name;
            } else if (!this.showName) {
                this.axis.name = '';
            }
            this.updateChartOption();
        },
        nameChange () {
            if (this.show && this.showName) {
                this.axis.name = this.name;
                this.updateChartOption();
            }
        },
        coordChange () {
            this.axis.nameTextStyle.padding = [0, 0, this.y, this.x];
            this.updateChartOption();
        },
        updateChartOption () {
            this.$events.emit('updateChartOption');
        }
    }
};
</script>

<style>
.coord-col.coord-y {
    padding-left: 2px;
}
.coord-col .coord-label {
    text-align: center;
    line-height: 18px;
}
.coord-col .el-input-number {
    width: 80px !important;
}
.coord-col .el-input-number .el-input {
    width: 57px !important;
}
</style>
