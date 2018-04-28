<template>
	<div class="mainCon">
	    <div class="indexTit">
	        <h2 class="fl"><i class="titIcon"></i>工作表</h2>
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
	    <!-- 基本信息 begin -->
	    <div class="innerCon">
	        <div class="statement">
	        	<folder-list :showAddSpan="true"></folder-list>
	        	<right-table></right-table>
	        </div>
	    </div>
	    <!-- 基本信息 end -->
	</div>
</template>
<script>
import folderList from './components/folderList';
import rightTable from './components/rightTable';
import disappearTips from '../../datasource/components/disappearTips';
export default {
	name: 'worksheet-list',
	components: { folderList, rightTable, disappearTips },
	computed: {
        operationTipsF() {
            return this.$store.getters.operationFailed;
        },
        operationTipsS() {
            return this.$store.getters.operationSuccess;
        }
    }
}
</script>
<style>
.break-word td {
    word-break: break-word;
}
</style>