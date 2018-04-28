	<template>
		<ul>
		    <li class="h40 mb10"><p class=" fl mr10">X轴</p>
		     <div class="select-box opeDiv-138">
		        <div class="dropdown-btn"><span class="select-value ellipsis">{{selected.x.length?selected.x.toString():'请选择'}}</span><i class="arr"></i></div>
		        <div class="dropdown-list">
		            <ul>
		                <li @click.stop="checkAll('x')">
		                	<i class="check mb10 pl5 ml10" :class="{checked:selected.allSelect}"></i>全选
		                </li>
		                <li class="ellipsis" :title="item.name" v-for="item in field" @click.stop="select('x',item)">
		                	<i class="check mb10 pl5 ml10" :class="{checked:item.to=='x','check-no':item.to == 'y'}"></i>
		                	{{item.name}}
		                </li>
		            </ul>
		        </div>
		    </div>

			</li>
		    <li><p class=" fl mr10">Y轴</p> 
		     <div class="select-box opeDiv-138">
		        <div class="dropdown-btn"><span class="select-value ellipsis">{{selected.y.length?selected.y.toString():'请选择'}}</span><i class="arr"></i></div>
		        <div class="dropdown-list">
		            <ul>
		                <li @click.stop="checkAll('y')">
		                	<i class="check mb10 pl5 ml10" :class="{checked:selected.allSelect}"></i>全选
		                </li>
		                <li class="ellipsis" :title="item.name" v-for="item in field" @click.stop="select('y',item)">
		                	<i class="check mb10 pl5 ml10" :class="{checked:item.to=='y','check-no':item.to == 'x'}"></i>
		                	{{item.name}}
		                </li>
		               
		            </ul>
		        </div>
		    </div>

			</li>
		</ul>

	</template>

	<style>
		.select-value.ellipsis{
			width: 118px;
		}
	</style>

	<script>

	export default {
		props:['field'],
		computed:{
			selected(){
				var obj = {
					x : [],
					y : [],
					allSelect: true
				};

				// var all = true;
				var i ,item ;

				for (i = 0; i < this.field.length; i++) {
					item = this.field[i];
					if(item.to == null){
						obj.allSelect = false;
					}else if(item.to == 'x'){
						obj.x.push(item.name);
					}else if(item.to == 'y'){
						obj.y.push(item.name);
					}
				}
				return obj ;
			}
		},
		methods:{
			select : function(x,item){
				if(item.to == null){
					item.to = x;
				}else if(item.to == x){
					item.to =null
				}
				this.$emit('update',this.field);
			},

			checkAll:function(x){
				var flag = null;
				var val = x;
				if(this.selected.allSelect){
					flag = x;
					val = null
				}
				var i,item;
				for ( i = 0; i < this.field.length; i++) {
					item = this.field[i];
					if(item.to == flag){
						item.to = val;
					}
				}
			}
		}
	}
		
    </script>	
