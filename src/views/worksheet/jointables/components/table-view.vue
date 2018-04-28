<style>
	.table-view {
		margin-top: 40px;
	}
</style>
<template>
	<div class="table-view">
		<div class="white-bg">
            <div class="dataTab chart-right-1 chart-left-1">
                <ul>
                	<li v-for="(tab, index) of tabs" :class="{hover: index === selectIndex}" @click="switchTabs(index)">
                		<p class="w100">{{tab.name}}</p>
                	</li>
                </ul>
            </div>
        </div>

        <div class="bor-box-mc white-bg">
            <!-- 切换内容（数据过滤）begin -->
            <data-filter v-show="selectIndex == 0"></data-filter>	
            <!-- 切换内容（数据过滤）end -->
            <!-- 切换内容（数据预览）begin -->
            <jointables-sheets v-show="selectIndex == 1"></jointables-sheets>
            <!-- 切换内容（数据预览）end -->
        </div>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import dataFilter from './data-filter'
	import jointablesSheets from './jointablesSheets';
	export default {
		name: 'table-view',
		components: {
			dataFilter,
			jointablesSheets
		},
		data () {
			return {
				tabs: [
					{
						name: '数据过滤'
					},
					{
						name: '数据预览'
					}
				],
				selectIndex: 0,
			}
		},
		computed: {
			...mapGetters(['tableData'])
		},
		watch: {
			tableData (n) {
				this.selectIndex = 1;
			},
		},
		methods: {
			switchTabs (index) {
				this.selectIndex = index;
			}
		}
	}
</script>