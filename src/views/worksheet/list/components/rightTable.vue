<template>
	<div class="s-rightMenu">
        <div class="ml2">
            <div class="bor-box-mt">
                {{ activeSheet.name }}
                <div class="fr">

                    <router-link :to="{ path: 'sql', query: { id: activeSheet.id}}" class="ml10 blueLink" v-if="activeSheet.type === 1">编辑</router-link>
                    <router-link :to="{ path: 'view', query: { id: activeSheet.id,tableId : activeSheet.dependSheetId}}" class="ml10 blueLink" v-if="activeSheet.type === 0">编辑</router-link>
                    <router-link :to="{ path: '/worksheet/jointables', query: { id: activeSheet.id}}" class="ml10 blueLink" v-if="activeSheet.type === 3">编辑</router-link>
                    &nbsp;
                    <a class="refresh fr mt10 mt3" @click="forceRefresh = true;reload = true;loadData()"><i class="i17"></i></a>

                </div>
            </div>
            <div class="bor-box-mc pad20 white-bg">
                <!--div class="border-radius0" v-show="!loading">
                    <table class="listTable bt-none break-word">
                        <thead>
                            <tr class="tcenter trGray">
                                <th v-for="item in displayData.headers">
                                    {{ item }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(data,index) in displayData.values" v-bind:class="{'trGray': index%2==1}">
                                <td v-for="item in data">
                                    {{ item }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div-->
                <!-- 
                三个参数 
                1.loadData 获取数据的函数，在初始阶段和滚动到底端时会调用（必须）
                2.max 最多请求的行数，超过这个数字滚动到底端时不再触发，默认1000（可选）
                3.step 每次加载的数量，默认20 （可选）
                数据都放在vuex的dragTableData里面
                通过设置这个值改变视图显示的数据
                -->
                <vue-dragtable v-on:loadData="loadData" :max="100" :step="100"></vue-dragtable>
                <div class="cl"></div>
                <!--loading v-show="loading"></loading-->
                <div class="no-report" v-show="nothing">暂无工作表，请从&nbsp;<a href="#/datasource"  class="blueLink">数据源添加</a>！</div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../../../../api'
import { mapGetters } from 'vuex'
import vueDragtable from '../../../../components/vue-dragtable'
export default {
	name: 'right-table',
    components: { vueDragtable },
    data() {
        return {
            nothing: false,
            reload: false,
            forceRefresh: false
        }
    },
    methods: {
        loadData() {
            let id = this.activeSheet.id;
            if(id !== null && id !== "") {
                this.nothing = false;
                // 判断是滚动触发的还是点击右侧列表触发的
                // 点击列表需要重置header和value
                if(this.reload) {
                    let obj = {
                        header: [], //表头 
                        value: [],  //值
                        loading: true, //为true时显示‘正在加载数据...’
                        total: 10 //总数
                    }
                    this.$store.dispatch('setDragTableData', obj);
                    this.reload = false;
                }
                // 请求数据，接口尚未完善
                api.worksheet.worksheetPreview(id,this.forceRefresh).then((response) => {
                    this.forceRefresh = false;
                    if(response.code == 0) {
                        let obj = {
                            header: response.data.headers,
                            value: this.dragTableData.value.concat(response.data.values),
                            loading: false,
                            total: response.data.values.length // 这里由于后端不支持分页，所以做了特殊处理
                        };
                        this.$store.dispatch('setDragTableData', obj);
                    }
                    else {
                        let msg = response.message || '接口连接失败';
                        this.layerError(msg);
                    }
                })
                .catch(function (error) {
                    this.layerMsg('接口连接失败');
                });
            } else {
                this.nothing = true;
            }

        }, 
    },
    computed: {
        ...mapGetters(['dragTableData', 'activeSheet']),
    },
    watch: {
        activeSheet() {
            this.reload = true;
            this.loadData();
        }
    }
}
</script>
<style scoped>
.innerCon {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
}
.statement .vue-dragtable-container {
    height: calc(100vh - 180px);
}
</style>