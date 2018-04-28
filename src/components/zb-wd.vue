<style>
	.b-left-2{
		height: 28px;
		border-left: 2px solid #00cede;
	}

	.view-value{
		min-height: 28px;
    	line-height: 28px;
    	zoom : 1;
	}
	.view-value:after{display:block;clear:left;content:"";visibility:hidden;height:0} 

	.view-value .top-operation_1:hover .detailDrop{
		top:28px;
	}

	.selectLine{
		padding-top: 20px;
		margin-bottom: 0;
	}

	.border-no{
		border: 1px dashed #fff;
	}

   .drag-border{
      border:1px dashed #2bacff;
   }

</style>
<template>
	<div class="pr20 border-no">
	    <div class="selectLine wdClass">
	        <div class="view-title">
	            维度
	        </div>
	        <div class="view-value">
	        	<!-- <div class="fl mr5 mt1 b-left-2"></div> -->
	            <div class="fl mr5 mt1" v-for="(wd,index) in wds" @mousedown.prevent="dragFromwd(wd)">
	                <div class="top-operation_1" v-if="wd.type == 'DATE'">
	                    {{wd.columnAlias}}（{{wd.opName}}） <i></i><b></b>
	                    <div class="detailDrop">
	                        <ul>
	                            <li v-for="wdDate in wdDateList"><a href="javascript:;" @mousedown.stop=";" @click.prevent="setWd(index,wdDate)">{{wdDate.text}}</a></li>
	                            <li ><a href="javascript:;" @mousedown.stop=";" @click.prevent="setField(index,'wds')">设置字段</a></li>
	                        </ul>
	                    </div>
	                 </div>
	                <div class="top-operation_1" v-else>{{wd.columnAlias}}<i></i><b></b>
	                        <div class="detailDrop">
	                            <ul>
	                                <li ><a href="javascript:;" @mousedown.stop=";" @click.prevent="setField(index,'wds')">设置字段</a></li>
	                            </ul>
	                        </div>
	                </div>
	            </div>

	            <div class="fr remove" v-show="addlegend" @click="addlegend=!addlegend"><a href="javascript:;" class="blueLink">添加图例</a></div>
	            
	           
	        </div>
	    </div>


	    <div class="selectLine seriesClass" v-show="!addlegend">
	        <div class="view-title">
	            图例
	        </div>
	        <div class="view-value">
	        	<!-- <div class="fl mr5 mt1 b-left-2"></div> -->
	            <div class="fl mr5 mt1" v-for="(wd,index) in series" @mousedown.prevent="dragFromseries(wd)">
	                <div class="top-operation_1" v-if="wd.type == 'DATE'">
	                    {{wd.columnAlias}}（{{wd.opName}}） <i></i><b></b>
	                    <div class="detailDrop">
	                        <ul>
	                            <li v-for="wdDate in wdDateList"><a href="javascript:;" @mousedown.stop=";" @click.prevent="setlegend(index,wdDate)">{{wdDate.text}}</a></li>
	                            <li ><a href="javascript:;" @mousedown.stop=";" @click.prevent="setField(index,'series')">设置字段</a></li>
	                        </ul>
	                    </div>
	                 </div>
	                <div class="top-operation_1" v-else>{{wd.columnAlias}}<i></i><b></b>
	                        <div class="detailDrop">
	                            <ul>
	                                <li ><a href="javascript:;" @mousedown.stop=";" @click.prevent="setField(index,'series')">设置字段</a></li>
	                            </ul>
	                        </div>
	                </div>
	            </div>

	            <div class="fr remove" v-show="!addlegend" @click="removeSereis"><a href="javascript:;" class="blueLink">移除图例</a></div>
	            
	           
	        </div>
	    </div>
		

		
		

	    <div class="selectLine zbClass">
	        <div class="view-title">
	            指标
	        </div>
	        <div class="view-value">
	            <div class="fl mr5 mt1" v-for="(zb,index) in zbs" @mousedown.prevent="dragFromzb(zb)">
	                 <div class="top-operation_1" v-if="zb.type == 'NUMBER'">
	                    {{zb.columnAlias}}（{{zb.opName}}） <i></i><b></b>
	                    <div class="detailDrop">
	                        <ul>
	                            <li v-for="math in mathList"><a @mousedown.stop=";" @click.prevent="setZb(index,math)">{{math.text}}</a></li>
	                            <li ><a href="javascript:;" @mousedown.stop=";" @click.prevent="setField(index,'zbs')">设置字段</a></li>
	                        </ul>
	                    </div>
	                 </div>
	                 <div class="top-operation_1" v-else>
	                    {{zb.columnAlias}}（{{zb.opName}}） <i></i><b></b>
	                    <div class="detailDrop">
	                        <ul>
	                            <li v-for="count in countList"><a @mousedown.stop=";" @click.prevent="setZb(index,count)">{{count.text}}</a></li>
	                            <li ><a href="javascript:;" @mousedown.stop=";" @click.prevent="setField(index,'zbs')">设置字段</a></li>
	                        </ul>
	                    </div>
	                 </div>
	            </div>
	            <div class="fr remove" v-show="addSort" @click="addSort=!addSort"><a href="javascript:;" class="blueLink">添加排序</a></div>
	            
	        </div>
	        
	    </div>
	    <div class="selectLine sortField" v-show="!addSort">
	        <div class="view-title">
	            排序
	        </div>
	        <div class="view-value">
	            <span class="view-add">
	                <i class="i45"></i>
	                <!-- 排序勾选 -->
	                <div class="detailDrop selectField">
	                    <ul>
	                        <li v-for="(sort,index) in sortList" class="ellipsis"><span class="check" :class="{checked:sort.checked}" @click="setSortCheck(index)"></span>
	                        <template v-if="sort.opName!=''">{{sort.columnAlias}}（{{sort.opName}}）</template>
	                        <template v-else>{{sort.columnAlias}}</template></li>
	                    </ul>
	                </div>
	            </span>
	            <div class="fl mr5 sortList" v-for="(sort,index) in sortList">
	                 <div class="top-operation_1" v-if="sort.checked">
	                    <span :class="{desc:sort.orderType=='DESC',asc:sort.orderType=='ASC'}"></span>
	                    <template v-if="sort.opName!=''">{{sort.columnAlias}}（{{sort.opName}}）</template>
	                    <template v-else>{{sort.columnAlias}}</template><i></i><b></b>
	                    <div class="detailDrop">
	                        <ul>
	                            <li ><a href="javascript:;" @click.prevent="setOrderBy(index,'')">默认</a></li>
	                            <li ><a href="javascript:;" @click.prevent="setOrderBy(index,'ASC')">升序</a></li>
	                            <li ><a href="javascript:;" @click.prevent="setOrderBy(index,'DESC')">降序</a></li>
	                        </ul>
	                    </div>
	                 </div>
	            </div>
	            <div class="fr remove" v-show="!addSort" @click="removeSort"><a href="javascript:;" class="blueLink">移除排序</a></div>
	            
	        </div>
	    </div>


	    <!-- 设置字段 弹出层开始 -->
	    <div class="popup setField" style="display:none;">
	        <ul class="listItem">
	            <li class="first"><p class="tit pal">当前名称：</p>
	              <div class="con">
	                  {{ field.oldName }}
	              </div>
	            </li>
	            <li><p class="tit"><span>字段名称：</span></p><p class="con"><input type="text" class="inputMode w430" v-model="field.newName" maxlength="30"></p>
	                <p class="tips">支持英文，数字，30字符内</p>
	            </li>
	        </ul>
	    </div>
	    <!-- 设置字段 弹出层结束 -->
	</div>
</template>


<script>

   const fromLeft = 'fromLeft';
   const fromzb = 'fromzb';	
   const fromwd = 'fromwd';	
   const fromLegend = 'fromLegend';	
   let ins = null;


   let dragMsg = {
   		from : '',
   		item : null
   };

   let $_dragging;
   let $_dragging_width;


   let sortArr = function(event){
		var str ; 		
   		if(dragMsg.from == fromzb){
   			str = '.zbClass';
   		}else if(dragMsg.from == fromwd){
   			str = '.wdClass';
   		}else{
   			return false;
   		}
   		$(str + " .fl.mr5").each(function(index, el) {
   			var $this = $(this);
   			var width = $this.width();
   			var height = $this.height();
   			var offset = $this.offset();
   			var top = offset.top;
   			var left = offset.left;
   			var buttom = top + height;
   			var right = left + width;
   			var mid = left + width/2;

   			if(event.clientY > top && event.clientY < buttom && event.clientX > left && event.clientX < right){
   				var $b2 = $('.b-left-2');
   				if(!$b2.length){
   					$b2 = $('<div class="fl mr5 mt1 b-left-2"></div>');
   				}
   				if(event.clientX < mid){
   					$this.before($b2);
   				}else{
   					$this.after($b2);
   				}
   				return false;
   			}else{
   				$('.b-left-2').remove();
   			}
   		});
   };

   function mousedown(){
        $('.border-no').addClass('drag-border');

        $_dragging = $('<div>'+dragMsg.item.columnName+'</div>');
        $_dragging.css({'position':'fixed','top':10000,'left':0})
        $('.s-leftMenu').append($_dragging);
        $_dragging_width = $_dragging.width()/2;
        document.onmousemove = move;
        document.onmouseup = up;
   }

   function move(event){
   	 	event = event || window.event;
   	 	$_dragging.css({'top':event.clientY - 15,'left':event.clientX - $_dragging_width});
   	 	sortArr(event);

   }

   function up(event){
    	event = event || window.event;
        checkPos(event);
        $_dragging.remove();
        document.onmouseup = null;
        document.onmousemove = null;
   }

   let checkPos = function(event){
   		var box = $('.border-no');
         box.removeClass('drag-border');

   		var offset = box.offset();
   		var top = offset.top;
   		var left = offset.left;
   		var bottom  = top + box.outerHeight();
   		var right = left + box.outerWidth();
   		if(event.clientY > top && event.clientY < bottom && event.clientX > left && event.clientX < right){
   			var $flag = $('.b-left-2');
   			if($flag.length){
   				var arr = [];
   				if(dragMsg.from == fromzb){
   					arr = ins.zbs;
   				}
   				else if(dragMsg.from == fromwd){
   					arr = ins.wds;
   				}
   				var index = arr.indexOf(dragMsg.item);
   				var flag_index = $flag.index();
   				var obj = arr.splice(index,1)[0];
   				if(flag_index > index){
   					flag_index-- ; 
   				}
   				arr.splice(flag_index , 0 ,obj);
   				$flag.remove();
   			}
   			else{
   				createCheck(event,'.wdClass',checkwd);
   				createCheck(event,'.zbClass',checkzb);
   				createCheck(event,'.seriesClass',checkseries);
   				createCheck(event,'.sortField',checksort);
   			}
   		}
   		else{
   			if(dragMsg.from == fromzb){
   				removezb();
   				ins.removeSortList(dragMsg.item);
   			}
   			else if(dragMsg.from == fromwd){
   				removewd();
   				ins.removeSortList(dragMsg.item);
   			}
   			else if(dragMsg.from == fromLegend){
   				removesereis();
   				ins.removeSortList(dragMsg.item);
   			}
   		}

   		ins.$emit('updateScene');
   }

   let createCheck = function(event,checkclass,callback){
   		var box = $(checkclass);
   		var offset = box.offset();
   		var top = offset.top;
   		var left = offset.left;
   		var bottom  = top + box.outerHeight();
   		var right = left + box.outerWidth();
   		if(event.clientY > top && event.clientY < bottom && event.clientX > left && event.clientX < right){
   			callback&&callback();
   		}
   }


   let checksort = function(){
   		if(dragMsg.from == fromLeft){
   			ins.layerMsg('仅支持从维度、指标、图例中拖动字段至此！');	
   		}
   		else if(dragMsg.from == fromwd){
   			ins.upSortCheck(dragMsg.item);
   		}
   		else if(dragMsg.from == fromzb){
   			ins.upSortCheck(dragMsg.item);
   		}
   		else if(dragMsg.from == fromLegend){
   			ins.upSortCheck(dragMsg.item);
   		}
   }


   let checkzb = function(){
   		if(dragMsg.from == fromLeft){
   			pushzb(dragMsg.item);
   		}
   		else if(dragMsg.from == fromwd){
   			var suc = pushzb(dragMsg.item);
   			if(suc){
   				removewd();
   				ins.removeSortList(dragMsg.item);
   			}
   		}
   		else if(dragMsg.from == fromLegend){
   			var suc = pushzb(dragMsg.item);
   			if(suc){
   				removesereis();
   				ins.removeSortList(dragMsg.item);
   			}
   		}
   };

   let checkwd = function(){
   		if(dragMsg.from == fromLeft){
   			pushwd(dragMsg.item);
   		}
   		else if(dragMsg.from == fromzb){
   			var suc = pushwd(dragMsg.item);
   			if(suc){
   				removezb();
   				ins.removeSortList(dragMsg.item);
   			}
   		}
   		else if(dragMsg.from == fromLegend){
   			var suc = pushwd(dragMsg.item);
   			if(suc){
   				removesereis();
   				ins.removeSortList(dragMsg.item);
   			}
   		}
   }

   let checkseries = function(){
   		if(dragMsg.from == fromLeft){
   			pushseries(dragMsg.item);
   		}
   		else if(dragMsg.from == fromzb){
   			var suc = pushseries(dragMsg.item);
   			if(suc){
   				removezb();
   				ins.removeSortList(dragMsg.item);
   			}
   		}
   		else if(dragMsg.from == fromwd){
   			var suc = pushseries(dragMsg.item);
   			if(suc){
   				removewd();
   				ins.removeSortList(dragMsg.item);
   			}
   		}
   };



   let removezb = function(){
   		ins.zbs.splice(ins.zbs.indexOf(dragMsg.item),1);
   }

   let removewd = function(){
   		ins.wds.splice(ins.wds.indexOf(dragMsg.item),1);
   }

   let removesereis = function(){
   		ins.series.splice(ins.series.indexOf(dragMsg.item),1);
   }
   let pushzb = function(obj){
   		let zbs = ins.zbs;
   		for(var i=0;i<zbs.length;i++){
   		    if(zbs[i].columnName == obj.columnName){
   		        return false;
   		    }
   		}
   		var newObj = {};
   		newObj.type = obj.type;
   		newObj.op = obj.type=='NUMBER'?'sum':'count';
   		newObj.opName = obj.type=='NUMBER'?'求和':'计数';
   		newObj.columnName = obj.columnName;
   		newObj.columnAlias = obj.columnName;
   		ins.zbs.push(newObj);
   		ins.addSortList(newObj);
   		return true;
   }

   let pushwd = function(obj){
   		let zbs = ins.wds;
   		for(var i=0;i<zbs.length;i++){
   		    if(zbs[i].columnName == obj.columnName){
   		        return false;
   		    }
   		}
   		var newObj = {};
   		newObj.type = obj.type;
        newObj.op = obj.type=='DATE'? 'day':'';
        newObj.opName = obj.type=='DATE'? '按日':'';
        newObj.columnName = obj.columnName;
        newObj.columnAlias = obj.columnName;
   		ins.wds.push(newObj);
   		ins.addSortList(newObj);
   		return true;
   }

   let pushseries = function(obj){
   		let series = ins.series;
   		if(series.length){
   			ins.layerMsg('仅支持一个图例');	
   			return false;
   		}
   		var newObj = {};
   		newObj.type = obj.type;
        newObj.op = obj.type=='DATE'? 'day':'';
        newObj.opName = obj.type=='DATE'? '按日':'';
        newObj.columnName = obj.columnName;
        newObj.columnAlias = obj.columnName;
   		ins.series.push(newObj);
   		ins.addSortList(newObj);
   		return true;
   }





	export default{

		props:["wds","zbs","series","sortList"],


		created(){
			ins = this;
			// var chart_id = this.$route.query.chartId;
			// var id = this.$route.query.id;
	  //       if(chart_id || id){
	  //           this.addSort = false;
	  //           this.addlegend = false;
	  //       }
		},
		mounted(){
         this.$events.on('mousedown',this.dragFromLeft);
			this.$events.on('setOpen',this.setOpen);
		    // 显示排序列表，解决hover过快显示
		    $('.view-add').click(function (e) {
		        e.stopPropagation();
		        $(".selectField").show();
		    });
		    $(document).click(function(e) {
		        $(".selectField").hide();
		    });
		},
		data(){
			return {
				addSort : true,

				addlegend :true,

				field:{
				    oldName:'',
				    newName:'',
				},

				wdDateList:[
				    {text:'按年',sign:'year'},
				    {text:'按季',sign:'season'},
				    {text:'按月',sign:'month'},
				    {text:'按周',sign:'week'},
				    {text:'按日',sign:'day'},
				    {text:'按时',sign:'hour'},
				    {text:'按分',sign:'minute'},
				    {text:'按秒',sign:'second'}
				],//date类型

				countList:[
				    {text:'计数',sign:'count'},
				    {text:'去重计数',sign:'distinct'}
				],//文本类型
				mathList:[
				    {text:'计数',sign:'count'},
				    {text:'去重计数',sign:'distinct'},
				    {text:'求和',sign:'sum'},
				    {text:'平均值',sign:'avg'},
				    {text:'最大值',sign:'max'},
				    {text:'最小值',sign:'min'}
				],//数字类型

			}
		},

		methods:{


         setOpen(obj){
               this.addSort =  obj.addSort;
               this.addlegend =  obj.addlegend;
         },


			dragFromLeft(item){

				dragMsg = {
					from : fromLeft,
					item
				}

				mousedown();

			},

			dragFromzb(item){

				dragMsg = {
					from : fromzb,
					item
				}

				mousedown();

			},

			dragFromwd(item){

				dragMsg = {
					from : fromwd,
					item
				}

				mousedown();

			},

			dragFromseries(item){
				dragMsg = {
					from : fromLegend,
					item
				}

				mousedown();
			},

			// 维度指标拖拽到排序，更新check
			upSortCheck(obj){
			    for(var i=0;i<this.sortList.length;i++){
			        if(this.sortList[i].columnName == obj.columnName&&this.sortList[i].opName == obj.opName){
			            this.sortList[i].checked = true;
			        }
			    }
			    this.$forceUpdate();
			},


			// 添加排序数组
	        addSortList(obj){
	            let newObj = {};
	            newObj.columnName = obj.columnName;
	            newObj.columnAlias = obj.columnAlias;
	            newObj.opName = obj.opName;
	            newObj.type = obj.type;
	            newObj.orderType = null;
	            newObj.checked = false;
	            this.sortList.push(newObj);
	        },


	       

			// 移除排序数组
			removeSortList(obj){
			    var index;
			    for(var i=0;i<this.sortList.length;i++){
			        if(this.sortList[i].columnName == obj.columnName&&this.sortList[i].opName == obj.opName){
			            index = i;
			        }
			    }
			    this.sortList.splice(index,1);
			},
			//更新排序数组
			upSortList(obj){
			    for(var i=0;i<this.sortList.length;i++){
			        if(this.sortList[i].columnName == obj.columnName&&this.sortList[i].opName == obj.opName){
			            this.sortList[i].columnAlias = obj.columnAlias;
			        }
			    }
			},
			

			setSortCheck(index){
			    this.sortList[index].checked = !this.sortList[index].checked;
			    this.$forceUpdate();
			},
			// 设置排序
			setOrderBy(index,order){
			    this.sortList[index].orderType = order;
			    this.$forceUpdate();
			},
			//移除排序操作
			removeSort(){
			    for(var i=0;i<this.sortList.length;i++){
			        this.sortList[i].checked = false;
			    }
			    this.addSort=!this.addSort;
			},

			removeSereis(){
				if(this.series.length){
					this.removeSortList(this.series.splice(0,1)[0])
				}
				this.addlegend=!this.addlegend;
	        },


			// 设置字段
			setField(ins,id){
			    this.field.oldName = this[id][ins].columnAlias;
			    this.layerSetField((layero, index) => {
			        if(this.checkField(this.field.newName)) {
			            this[id][ins].columnAlias = this.field.newName;
			            this.field.newName = '';
			            // 更新排序数组
			            this.upSortList(this[id][ins]);
			            layer.close(index);
			        }else{
			            this.layerMsg('支持英文，数字，下划线，不能数字开头');
			        }
			    }, cancel => {
			        console.log('cancel')
			    })
			},

			// 检查名称
			checkField(name) {
			    const regex = /^[a-zA-Z_][a-zA-Z0-9_]{1,29}$/;
			    return regex.test(name);
			},


			setZb(index,obj){
			    this.updateSortList(this.zbs[index],obj);
			    this.zbs[index].op = obj.sign;
			    this.zbs[index].opName = obj.text;
             this.$emit('updateFiltrate');
			},
			setWd(index,obj){
			    this.updateSortList(this.wds[index],obj);
			    this.wds[index].op = obj.sign;
			    this.wds[index].opName = obj.text;
			},

			setlegend(index,obj){
			    this.updateSortList(this.series[index],obj);
			    this.series[index].op = obj.sign;
			    this.series[index].opName = obj.text;
			},

			// 选择不同统计方式后更新排序
			updateSortList(obj,obj1){
			    for(var i=0;i<this.sortList.length;i++){
			        if(this.sortList[i].columnName == obj.columnName&&this.sortList[i].opName == obj.opName){
			            this.sortList[i].opName = obj1.text;
			        }
			    }
			},

		},
	}
</script>