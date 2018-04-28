<template>
	<div class="mainCon">
		<div class="indexTit">
			<h2><i class="titIcon"></i>报表</h2>
		</div>
		<div class="innerCon">
			<div class="statement">
				<side-nav></side-nav>
				<right-cont></right-cont>
			</div>
		</div>
		<delete-layer></delete-layer>
		<select-table></select-table>
	</div>
</template>
<script>
import api from '../../api'
import sideNav from './side-nav'
import rightCont from './right-grid'
import deleteLayer from '@/components/delete-layer'
import selectTable from './select-table1.vue';

export default {
	name: 'dashboard',
	components: {
		'side-nav': sideNav,
		'right-cont': rightCont,
		deleteLayer,
		selectTable
	},
	created () {
		this.$events.on('get-report-list', this.getReportList)
	},
	mounted () {
		this.getReportList();
		this.$store.commit('set_currentReport_key',{
	        reportId : '',
	        reportName : '',
	        charts : false
		})
	},
	methods: {
		getReportList (flag) {
			!flag && this.$store.dispatch('setLoadingStatus', true)
			api.reportList().then(res => {
				!flag && this.$store.dispatch('setLoadingStatus', false)
				if(res.code == 0) {
					for(var i = 0; i < res.data.folders.length; i++) {
						res.data.folders[i].close = (i == 0) ? false : true;
					}
					this.$store.commit('set_folders', res.data.folders);
					this.$store.commit('set_reports', res.data.reportList);
				}
				else {
					this.layerMsg(res.message)
				}
			})
			.catch(error => {
				console.log(error)
			})
		}
	}
}
</script>