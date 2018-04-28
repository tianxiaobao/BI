<template>
   <div class='bi-slider'>
      <el-slider :min='min' :max='max' :step='step' v-model="valslider" @change="sliderChange"></el-slider>
      <div v-show='showinput'>
        <div class='inputwrap' >
            <input class='bi-input self' disabled="true" v-model="min"></input>
            <input class='bi-input self' v-model="valinput" @keyup="inputChange"></input>
            <input class='bi-input self' disabled="true" v-model="max"></input>
        </div>
        <div class='inputwrap' style="margin-top:-10px">
            <span class='bi-input'>最小值</span>
            <span class='bi-input'></span>
            <span class='bi-input'>最大值</span>
        </div>
    </div>
</div>
    
</template>

<script>
	import {Slider,Input} from 'jcloud-ele-ui';
	export default {
		props:['min','max','step','value','showinput'],
		 components: {
        'el-slider': Slider,
        'el-input':Input
        },
        data(){
        	return {
        		valslider:this.value,
                valinput:this.value,
        	}
        },
        methods:{
        	sliderChange(v){
                this.valinput=v;
        		this.$emit('input',v);
        		this.$emit('updateChartOption');
        	},
            inputChange(){
                const reg=/^[0-9]*$/;
                const val=this.valinput;
                if(!reg.test(val)){
                   this.valinput =this.valslider;
                }
                else if(val<this.min){
                    this.valinput=this.min;
                }else if(val>this.max){
                    this.valinput=this.valslider;
                }
                this.$forceUpdate();
                this.valslider=parseFloat(this.valinput);
            }
        }
	}
</script>
<style >
.bi-slider .el-slider__runway {
    height: 4px;
    border-radius: 3px;
    vertical-align: middle;
    background:#e4e8f1;
}
.bi-slider .el-slider__bar {
    height: 4px;
    background: #20a0ff;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    top: 0;
}
.bi-slider .el-slider__button-wrapper{
    height: 36px;
    top: -16px;
}
.bi-slider .el-slider__button-wrapper .el-tooltip {
	border:0 solid red;
	background: #20a0ff;
}
.bi-slider .el-slider__button-wrapper .el-slider__button {
    height: 12px;
    background-color: #20a0ff;
    border-radius: 50%;
    transition: .2s;
}
.bi-slider .el-slider__button-wrapper .el-slider__button:hover {
    transform: scale(1.5);
    background-color: #1c8de0;
}
.bi-slider .el-slider__button-wrapper .el-slider__button.hover,.bi-slider .el-slider__button-wrapper .el-slider__button.dragging{
	cursor: grabbing;
	transform: scale(1.5);
    background-color: #1c8de0;
}
.bi-slider .bi-input{
width: 30%;
text-align:center;
}
.bi-slider .inputwrap{
 display: flex;
 justify-content: space-between;
 align-items: center;
}
.self{
    position: relative;
    display: inline-block;
    border: 1px solid #e7e7e7;
    box-sizing: border-box;
    display: inline-block;
    height: 30px;
    line-height: 1;
    outline: none;
    padding: 3px 10px;
    transition:border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;    
}
.self:focus {
    outline: none;
    border-color: #2aafff;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
    color: #333;
}
</style>
