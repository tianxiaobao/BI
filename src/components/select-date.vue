<style lang="less">
	.filter {
		background-color: #ebebe4;
		-webkit-filter: grayscale(100%);
	    -moz-filter: grayscale(100%);
	    -ms-filter: grayscale(100%);
	    -o-filter: grayscale(100%);
	    filter: grayscale(100%);
	    filter: #ebebe4;
	}
	.selectDate {
		min-height: 150px;
		.listItem {
			.tit {
				line-height: 46px;
			}
		}
	}
	.custom-date {
	    margin: 10px;
	    line-height: 24px;
	    position: relative;
	    .inputMode {
	    	width: 150px;
	    }
	    .disabled {
	    	.dropdown-btn,
	    	.dropdown-list {
	    		.filter;
	    	}
	    	.dropdown-list {
	    		display: none !important;
	    	}
	    }
	    input[type="text"]:disabled {
    		.filter;
    	}
	}
	.datepicker {
		input {
			border: 0;
		}
	}
</style>
<template>
	<div class="selectDate" style="display:none;">
	    <ul class="listItem">
	        <li>
	        	<p class="tit">开始日期：</p>
	        	<div class="custom-date">
                    <datepicker class="inputMode fl mr10" 
                        language="zh"
                        :value="start.today"
                        :format="format"
                        @selected="start.selected" 
                        v-if="!start.checked"
                    >
                    </datepicker>
                    <div class="fl mr10" v-if="start.checked">
                    	<input type="text" class="inputMode" disabled v-model="start.date">
                    </div>
                    <div class="select-box shorter mr10 fl" :class="{disabled: start.checked}">
				        <div class="dropdown-btn" style="width: 100px">
				        	<span>{{start.time}}</span>
				        	<span class="select-value"></span><i class="arr"></i>
				        </div>
				        <div class="dropdown-list" style="width: 110px">
				             <ul>
				                <li v-for="(gmt, index) of time" @click="selectStartTime(gmt)">
				                	<a href="javascript:;">{{gmt}}</a>
				                </li>
				             </ul>
				        </div>
				    </div>
                    <i class="check mr5" @click="unlimited(0)" :class="{checked: start.checked}"></i>不限
                </div>
	        </li>
	        <li>
	        	<p class="tit">结束日期：</p>
	        	<div class="custom-date">
                    <datepicker class="inputMode fl mr10" 
                        language="zh"
                        :value="end.today"  
                        :format="format"
                        @selected="end.selected" 
                        v-if="!end.checked"
                    >
                    </datepicker>
                    <div class="fl mr10" v-if="end.checked">
                    	<input type="text" class="inputMode" disabled v-model="end.date">
                    </div>
                    <div class="select-box shorter mr10 fl" :class="{disabled: end.checked}">
				        <div class="dropdown-btn" style="width: 100px">
				        	<span>{{end.time}}</span>
				        	<span class="select-value"></span><i class="arr"></i>
				        </div>
				        <div class="dropdown-list" style="width: 110px">
				             <ul>
				                <li v-for="(gmt, index) of time" @click="selectEndTime(gmt)">
				                	<a href="javascript:;">{{gmt}}</a>
				                </li>
				             </ul>
				        </div>
				    </div>
                    <i class="check mr5" @click="unlimited(1)" :class="{checked: end.checked}"></i>不限
                </div>
	        </li>
	    </ul>
	    <div class="layui-layer-btn">
	    	<a class="layui-layer-btn0" @click.prevent="select">确定</a>
	    	<a class="layui-layer-btn1" @click.prevent="cancel">取消</a>
	    </div>
	</div>
</template>
<script>
	import moment from 'moment'
	import Datepicker from './datepicker'
	export default {
		name: 'select-date',
		components: {
			Datepicker
		},
		props: ['startDate', 'endDate'],
		data () {
			return {
				datepicker: null,
				format: 'yyyy-MM-dd',
				start: {
					date: '',
					dateTemp: '',
					time: '00:00',
					timeTemp: '',
					checked: false,
					selected: this.startSelect,
					today: new Date(2016, 9,  16),
				},
				end: {
					date: '',
					dateTemp: '',
					time: '23:59',
					timeTemp: '',
					checked: false,
					selected: this.endSelect,
					today: new Date(2016, 9,  16),
				},
				time: [],
			}
		},
		mounted () {
			// console.log(this.startDate);
			// console.log(this.endDate);
			this.initDate();
		},
		methods: {
			initDate () {
				let today = moment().format('YYYY,M,D');
				let showToday = moment().format('YYYY-MM-DD');

				this.start.today = new Date(today);
				this.start.date = showToday;
				this.start.dateTemp = showToday;
				this.start.checked = false;

				this.end.today = new Date(today);
				this.end.date = showToday;
				this.end.dateTemp = showToday;
				this.end.checked = false;

				this.time = this.formatTime();
				this.start.time = this.time[0];
				this.end.time = this.time[this.time.length - 1];
				this.start.timeTemp = this.time[0];
				this.end.timeTemp = this.time[this.time.length - 1];
			},
			startSelect (val, datepicker) {
				this.datepicker = datepicker;
				this.start.date = datepicker.formattedValue;
				this.start.dateTemp = datepicker.formattedValue;

			},
			endSelect (val, datepicker) {
				this.datepicker = datepicker;
				this.end.date = datepicker.formattedValue;
				this.end.dateTemp = datepicker.formattedValue;
			},
			select () {
				let start = {
					date: this.start.date,
					time: this.start.time
				};
				let end = {
					date: this.end.date,
					time: this.end.time
				};
				let startStamp = new Date(start.date);
				let endStamp = new Date(end.date);

				if(startStamp > endStamp || start.time > end.time) {
					this.layerMsg('开始日期不能大于结束日期');
					return;
				}

				this.$emit('select', start, end);
				layer.closeAll();
				this.initDate();
			},
			cancel () {
				this.initDate();
			},
			formatTime () {
				let len = 24;
				let time = [];
				for(var i = 0; i < 24; i++) {
					if(i < 10) {
						time.push('0'+ i +':00');
					}
					else if(i == 23) {
						time.push(i + ':59');
					}
					else {
						time.push(i + ':00');
					}
				}
				return time;
			},
			selectStartTime (gmt) {
				if(this.start.checked) return;
				this.start.time = gmt;
				this.start.timeTemp = gmt;
			},
			selectEndTime (gmt) {
				if(this.end.checked) return;
				this.end.time = gmt;
				this.end.timeTemp = gmt;
			},
			unlimited (index) {
				if(index == 0) {
					this.start.checked = !this.start.checked;
					this.setDateTime('start');
				}
				else if(index == 1) {
					this.end.checked = !this.end.checked;
					this.setDateTime('end');
				}
			},
			setDateTime(key) {

				if(this[key].checked) {
					this[key].date = '不限';
					this[key].time = (key == 'start') ? this.time[0] : this.time[this.time.length - 1];
				}
				else {
					this[key].date = this[key].dateTemp;
					this[key].time = this[key].timeTemp;
				}
			}
		}
	}
</script>