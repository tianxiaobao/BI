<style lang="less">
	.select-box {
		.active {
			a {
				color: #fff;
				background-color: #51bcfc;
			}
		}
	}
</style>
<template>
    <div class="select-box shorter">
        <div class="dropdown-btn" :style="{width: w + 'px'}">
        	<span>{{currentOpt.value}}</span>
        	<span class="select-value"></span><i class="arr"></i>
        </div>
        <div class="dropdown-list" :style="{width: (w + 10) +'px'}">
             <ul>
                <li v-for="(opt, index) of showOpts" @click="select(opt, index)" :class="{active: selectIndex == index}">
                	<a href="javascript:;">{{opt.value || opt}}</a>
                </li>
             </ul>
        </div>
    </div>
</template>
<script>
	export default {
		props: {
			value: {
				type: Object
			},
			options: {
				type: Array
			},
			w: {
				type: Number
			}
		},
		data () {
			return {
				selectIndex: 0,
				showOpts: [],
				currentOpt: {
					index: -1,
					value: '请选择'
				}
			}
		},
		mounted () {
			if(this.value) {
				this.currentOpt = this.value;
				this.showOpts = this.options;
			}
			else {
				this.showOpts.push(this.currentOpt);
			}
		},
		watch: {
			options () {
				this.initState();
				this.options.forEach((item, index) => {
					this.showOpts.push(item);
				});
			}
		},
		methods: {
			initState () {
				let def = {
					index: -1,
					value: '请选择'
				};

				this.showOpts = [];
				this.showOpts.push(def);
				this.currentOpt = def;
				this.selectIndex = 0;
			},
			select (item, index) {
				this.currentOpt = item;
				this.selectIndex = index;
				this.$emit('select', item, index);
			}
		}
	}
</script>