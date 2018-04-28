<template>
	<div class="mainCon">
	    <div class="indexTit">
	        <h2 class="fl">
	            <a href="javascript:;" @click="checkIfSaved" class="goback"></a>工作表<i class="i42"></i><span class="f14">多表关联</span>
	        </h2>
	        <disappear-tips :show="operationTipsS"
                            :level="''"
                            :content="'温馨提示:操作成功'"
                            >
            </disappear-tips>
            <disappear-tips :show="operationTipsF"
                            :level="'danger'"
                            :content="'温馨提示:操作失败'"
                            >
            </disappear-tips>
	    </div>
	    <div class="innerCon">
	        <div class="statement">
	        	<folder-list></folder-list>
	        	<div class="s-rightMenu">
	        		<jointables-canvas v-on:saved="hasSaved = arguments[0]"></jointables-canvas>
                    <table-view></table-view>
	        	</div>
	        </div>
	    </div>
	</div>
</template>
<script>
import folderList from '../list/components/folderList';
import jointablesCanvas from './components/jointablesCanvas';
import tableView from './components/table-view';
import disappearTips from '../../datasource/components/disappearTips';
export default {
	name: 'jointables',
	components: { folderList, jointablesCanvas, disappearTips, tableView },
	data() {
		return {
			hasSaved: true
		}
	},
    created () {
        let tableDataInit = {
            header: [],
            vaule: []
        };

        this.$store.dispatch('setTableData', tableDataInit);
    },
	computed: {
        operationTipsF() {
            return this.$store.getters.operationFailed;
        },
        operationTipsS() {
            return this.$store.getters.operationSuccess;
        }
    },
    methods: {
    	checkIfSaved(){
            if(this.hasSaved){
                this.$router.replace('/worksheet/list');
            }else{
                this.layerSaveData((layero, index) => {
                    layer.close(index);
                    this.$router.replace('/worksheet/list');
                }, cancel => {
                })
            }
        }
    }
}
</script>