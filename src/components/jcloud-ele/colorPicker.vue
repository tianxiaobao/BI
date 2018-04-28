<template>
		   <div class='color-picker'>
		   	<span class="color-span"></span>
		   	<span class="input-span">{{value}}</span>
		   	<el-color-picker v-model="color" @change="activeChange" show-alpha></el-color-picker>
	       </div>
</template>

<script>
	import {ColorPicker,Input} from 'jcloud-ele-ui';
	export default {
		props:[
			'value'
		],
		 components: {
        'el-color-picker': ColorPicker,
        'el-input': Input
        },


        data(){
        	return {
        		color : this.value
        	}
        },

        methods:{
        	activeChange(v){
        		this.$emit('input',v);
        		this.$emit('updateChartOption');
        	}
        }
	}
</script>
<style>
    .color-picker{
    	position:relative;
    	display: inline-block;
    	width: 100%;
    }
    .color-picker .el-color-picker{
    	width: 100%
    }
	.color-picker .el-color-picker__trigger{
		border-radius: 0;
		height: 30px;
        width: 100%;
		border: 1px solid #e7e7e7;
		padding: 4.5px;
	}
	.color-picker .el-color-picker__icon:before{
        content:"";
        display: table;
        clear: both;
		position: absolute;
      
	}
	.color-picker .el-color-picker__trigger .el-color-picker__color{
		border:0px solid #666;
		height: 20px;
		width: 20px;
	}
	.color-span{
		border: 1px solid #e7e7e7;
		width: 30px;
		height: 30px;
		position:absolute;
		display: inline-block;
		box-sizing: border-box;
		background-color: white;
		left:0;
		top:0;
	}
	.input-span{
		display: inline-block;
		box-sizing: border-box;
		position: absolute;
		top:0;
		left:30px;
		height: 30px;
		line-height: 30px;
		width:100%;
		padding-right:30px; 
		text-align: center;
		background-color: white;
	}
	.el-color-dropdown__btns a{
		display: none;
	}
</style>
