<style>
	#canvas{
		height: 500px;
	}
</style>
<template>
	<div>
		<section class="content padtop50" v-show="status == 0">
		    <!-- 主内容区begin -->
		     <div class="bor-box pad20 white-bg margin10">
		          <div class="statement-mt">
		              <!-- <h3>{{chart.name}}</h3> -->
		              <p>分享者：<span>{{chart.owner}}</span>&nbsp;&nbsp;最后编辑：{{chart.time}}</p>
		          </div>
		          <div class="tcenter-statement">
		          		<div id="canvas" v-show="chart.type != 'table'"></div>

		          		<div class="border-radius0 bor-box ht-over" style="height:500px;" v-show="chart.type == 'table'">
							<vue-dragtable :max="100"></vue-dragtable>

		          		    <!-- <table class="listTable bt-none">
		          		        <thead>
		          		            <tr class="tcenter trGray">
		          		                <th v-for="item in headers">{{item}}</th>
		          		            </tr>
		          		        </thead>
		          		        <tbody>
		          		            <tr v-for="(item,index) in values" v-bind:class="{'trGray': index%2==1}">
		          		                <td v-for="it in item">{{it}}</td>
		          		            </tr>
		          		        </tbody>
		          		    </table> -->
		          		</div>
		          </div>
		    </div>
		    <!-- 主内容区end -->
			<div class="footer-statement">
				<p>Powered by&nbsp;&nbsp;<span>京东云-数知（BI报表)</span></p>
		    </div>
		</section>

		<section class="content padtop50" v-show="status == 12 || status == 13">
		    <!-- 主内容区begin -->
		    <div class="bor-box pad20 white-bg margin10">
		      <div class="connection-fail">
		       	  <p class="mt30 mb20"><img src="../../images/statement.png"></p>
		          <p class="mb20">该分享链接已被取消或不存在！</p>
		      </div>
		    </div>
		    <!-- 主内容区end -->
			<div class="footer-statement">
		    	<p>Powered by&nbsp;&nbsp;<span>京东云-数知（BI报表）</span></p>
		    </div>
		</section>

		<section class="content padtop50" v-show="status == 11 ">
		    <!-- 主内容区begin -->
		    <div class="bor-box pad20 white-bg margin10">
		      <div class="connection-fail">
		       	  <p class="mt30 mb20"><img src="../../images/statement.png"></p>
		          <p class="mb20">需登录京东云账号后方可访问该分享链接！</p>
		          <p class="mb20"><a :href="url" class="glBtn">京东云登录</a></p>
		      </div>
		    </div>
		    <!-- 主内容区end -->
			<div class="footer-statement">
		    	<p>Powered by&nbsp;&nbsp;<span>京东云-数知（BI报表）</span></p>
		    </div>
		</section>
	</div>
</template>


<script>

	import echarts from 'echarts'
    import api from '../../api'
    import vueDragtable from '../../components/vue-dragtable'
   

    import{
     	staticDataChart,
     	apiDataChart
     } from '../dashboard/exampleTable.js'

     import{
        draw,
        initChartOptionForReport
     } from '../dashboard/drawChart.js'

     

     const chartMsg = {};
     const __static = 'static';
     const sql = 'sql';

	export default {
		name : 'chart-share',
		data(){
			return {
				status : 0,  // 0=> 成功 11 => 未登录   12 13 => 分享不存在 或 取消

				chart : {
					name : '',
					owner : '',
					time : '',
					type : ''
				},

				headers:[],
				values : [],

				url : '//uc.jcloud.com/login?returnUrl=' + encodeURIComponent(window.location.href)
			}
		},
		components: {
		    vueDragtable
		},
		mounted(){
			var query = this.$route.query;
            var share_id = query.id;
            api.getShare({id : share_id}).then(
	    		res =>{
	    			this.status = res.code;
	    			if(res.code == 0){
		    			this.chart.owner = res.data.owner;
		    			this.chart.time = res.data.updateTime;
	    				this.getData(res.data.targetId);
	    				this.updateCount(res.data.targetId);
	    			}
	    		},
	    		error => {}
            );
		},
		methods:{
			updateCount(id){
		        api.updateCount({
		        	targetId : id,
					shareType : 1
		        }).then(
		    		res =>{
		    		},
		    		error => {}
		        );
			},
			getData(id){
			    var layout = null;
			    // 获取chart配置信息
			    api.getChart({id : id })
			    .then(res => {
			        if(res.code == 0){
			           let data = res.data;
			           layout = JSON.parse(data.layout);
			           chartMsg.dataType = layout.dataType?layout.dataType:sql;
			           // chartMsg.chart = layout.chart?layout.chart:chartKind[layout.type];

			           initChartOptionForReport(chartMsg,layout);

			           chartMsg.type = this.chart.type = layout.type;
			           chartMsg.name = this.chart.name = data.chartName;
			           chartMsg.dimensions = data.dimensions?data.dimensions:[];
			           chartMsg.categories = data.categories?data.categories:[];
			           chartMsg.series = data.series?data.series : [];
			           if(chartMsg.dataType == sql){
			           		this.getChartData(id)
			           }
			           else{ //静态数据
			           		staticDataChart(chartMsg.chart);
			           		this.drawChart(chartMsg.chart);
			           }
			        }else{
			            this.layerMsg(res.message);
			        }
			    }, error => {
			    });
			},

			getChartData(id){

			    let type = chartMsg.type;


			    if(type !== 'table'){
			        this.showChartLoading();    
			    }
			    else{
			        let obj = {
			            header: [], //表头
			            value: [],  //值
			            loading: true, //为true时显示‘正在加载数据...’
			            total: 10 //总数
			        }
			        this.$store.dispatch('setDragTableData', obj);
			    }
				// 获取chart 数据
				api.getData({id : id })
				.then(res => {
				    if(res.code == 0){
				        apiDataChart(chartMsg,chartMsg,res.data);
				        this.drawChart(chartMsg.chart);
				    }else{
				        this.layerMsg(res.message);
				    }
				}, error => {
				});
			},

	        showChartLoading(){
	        	this.$nextTick(() => {
		        	let ele = document.getElementById('canvas');
		        	let ins = echarts.getInstanceByDom(ele);
		        	if(!ins){
		        		ins = echarts.init(ele);
		        	}
		        	ins.showLoading();
	        	})
	        },


            drawChart(chart){
            	if('table' == chart.type){
            		let obj = {
            		    header: chart.chartOption.headers,
            		    value: chart.chartOption.values,
            		    loading: false,
            		    total: chart.chartOption.values.length // 这里由于后端不支持分页，所以做了特殊处理
            		};
            		this.$store.dispatch('setDragTableData', obj);
            	}
            	else{
    	        	this.$nextTick(() => {
    	        		draw(chart,'canvas');
    	        	})
            	}
            },


		}

	}

</script>