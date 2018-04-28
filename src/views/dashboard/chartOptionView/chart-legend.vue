<template>
    <collapse title="图例">
        <el-checkbox slot="text" v-model="option.show" @change="updateChartOption">显示</el-checkbox>
        <el-form label-position="right" label-width="60px">
            <el-form-item label="文本字号">
                <input-number v-model="option.textStyle.fontSize" :min="1" @change="updateChartOption"></input-number>
            </el-form-item>   
            <el-form-item label="文本颜色">
                <colorpicker v-model="option.textStyle.color" @updateChartOption="updateChartOption"></colorpicker>
            </el-form-item>  
            <el-form-item label="位置">
                <el-select v-model="positionSelect" placeholder="请选择" @change="updatePosition">
                    <el-option v-for="item in positionList" :key="item.value":label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item> 
        </el-form>
    </collapse>
</template>
<script>
import Collapse from '../../../components/jcloud-ele/collapse.vue'
import Colorpicker from '../../../components/jcloud-ele/colorPicker.vue'
import {Form, FormItem, Select, Option,Checkbox} from 'jcloud-ele-ui'
import inputNumber from '@/components/jcloud-ele/inputNumber';
export default {
    props: ['option'],
    components: { 
        Collapse,
        Colorpicker,
        inputNumber,
        'el-form': Form, 
        'el-form-item': FormItem,
        'el-select': Select,
        'el-option': Option,
        'el-checkbox': Checkbox,

    },
    data () {
        return{
            positionSelect:this.option.left+'-'+this.option.top+'-'+this.option.orient,
            labelPosition: 'right',
            positionList:[
                {
                    value:'left-top-horizontal',
                    label:'上'
                },
                {
                    value:'left-bottom-horizontal',
                    label:'下'
                },
                {
                    value:'left-top-vertical',
                    label:'左'
                },
                {
                    value:'right-top-vertical',
                    label:'右'
                },
                {
                    value:'center-top-horizontal',
                    label:'上方居中'
                },
                {
                    value:'center-bottom-horizontal',
                    label:'下方居中'
                },
                {
                    value:'left-middle-vertical',
                    label:'靠左居中'
                },
                {
                    value:'right-middle-vertical',
                    label:'靠右居中'
                },
            ]
        }
    },
    methods: {
        updateChartOption () {
            this.$events.emit('updateChartOption');
        },
        updatePosition () {
           const str=this.positionSelect.split('-');
           this.option.left=str[0];
           this.option.top=str[1];
           this.option.orient=str[2];
           this.updateChartOption();
        }
    }
};
</script>