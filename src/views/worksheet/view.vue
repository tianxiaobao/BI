<style type="text/css">
    .blueLink,.bor,.top-operation_1{
        cursor: pointer;
    }
    .wdClass .view-title,.zbClass .view-title,.sortField .view-title,.seriesClass .view-title{
        float: left;
        height: 28px;
        line-height: 40px;
    }
    .wdClass .view-value .top-operation_1,.zbClass .view-value .top-operation_1{
        top: 0
    }
    .sortField .view-add{
        margin-top: 4px;
        top: 0;
    }
    .sortField .selectField{
        left: -35px;
        top: 24px;
        width: 140px;
    }
    .worksheet-view {
        overflow-y: auto;
        overflow-x: hidden;
    }
    .worksheet-view .s-searchInput{
        width: inherit;
    }
    .worksheet-view .s-searchBtn{
        float: right;
        margin-right: 6px;
    }
    .worksheet-view .bor-box-mc{
        position: static !important;
    }
    .indexTit h2{
        line-height: 29px;
    }
    .fore .fl{
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .view li a{
        display: inline-block;
        width: 150px;
        overflow: hidden;
        height: 45px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .nav-item dl{
        overflow: hidden;
    }
    .nav-1 dd{
        overflow: hidden;
        width: 80%;
        word-break: break-all;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .domain-list{
        min-height: 110px;
    }
    .view-listItem .dropdown-btn{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 20px;
        width: 165px;
    }
    .sortList span.desc {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        background: url(../../images/desc.png) no-repeat
    }
    .sortList span.asc {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
        background: url(../../images/asc.png) no-repeat
    }
    .selectLine{
        height: auto;
        margin-bottom: 20px;
    }
    .remove{
        top: 0;
    }
    .view-value .top-operation_1{
        top: 0;
    }
    body li.ui-draggable-dragging{
        list-style: none;
    }
    body li.ui-draggable-dragging i{
        background:url(../../images/inner-icons_v1.png) no-repeat;
        width:16px;
        height:16px;
        display:inline-block;
        padding-right:5px;
        vertical-align:middle;
    }
    body li.ui-draggable-dragging .icon1{
        background-position:-86px -20px;
    }
    body li.ui-draggable-dragging .icon2{
        background-position:-110px -20px;
    }
    body li.ui-draggable-dragging .icon3{
        background-position:-133px -20px;
    }
    body li.ui-draggable-dragging a{
        display: inline-block;
        width: 150px;
        overflow: hidden;
        height: 45px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .innerCon{
        overflow: hidden;
    }
    .mt1{
        margin-top: 1px;
    }
    .worksheet-view .bor-box{
        overflow-x: auto;
        max-height: 500px;
        min-height: 200px;
    }
    .worksheet-view .pb130{
        padding-bottom: 130px;
    }
</style>
<template>
<!-- 主内容区begin -->
<div class="mainCon">
    <div class="indexTit">
        <h2 class="fl">
            <a href="javascript:;" @click="checkIfSaved" class="goback"></a>工作表<i class="i42"></i><span class="f14">视图创建</span>
        </h2>
        <div class="tip fr tipFixed" v-if="operationSuccess">温馨提示：操作成功</div>
        <div class="tip-warning fr tipFixed" v-if="operationFailed">温馨提示：操作失败</div>
    </div>
    <!-- 基本信息 begin -->
    <div class="innerCon">
        <div class="statement worksheet-view">
            <sheet-column :wds="wds" :zbs="zbs" :sortList="sortList" :columns="columns" v-on:update-sheet-column="update_sheet_column"></sheet-column>
            <!-- 左侧结束 -->
            <div class="s-rightMenu">
                <div class="white-bg ml12">
                    <div class="bor-box-mt">
                        {{worksheetName}}
                        <a href="javascript:;" @click.prevent="editWorksheet" class="ml10 blueLink">编辑</a>
                        <a href="javascript:;" @click.prevent="saveView" class="fr blueLink ml10">保存</a>
                        <a href="javascript:;" @click.prevent="firstIn=false;reload=true;runView()" class="fr blueLink">运行</a>
                    </div>
                    <div class="bor-box-mc pad20 white-bg pb130">
                        <!-- 维度指标排序开始 -->
                        <zb-wd :series="series" :wds="wds" :zbs="zbs" :sortList="sortList" @updateScene="updateScene" @updateFiltrate="updateFiltrate"></zb-wd>
                        <!-- 维度指标排序结束 -->
                        <!-- 执行结果开始 -->
                        <div class="border-radius0 bor-box">
                            <vue-dragtable v-on:loadData="runView" :max="100"></vue-dragtable>
                        </div>
                        <!-- 执行结果结束 -->
                        <filtrate :conditions="conditions" :conditionOp="conditionOp" :columns="filtrateColumns" page="view" v-on:update-filtrate="update_filtrate"></filtrate>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 基本信息 end -->

    <!-- 编辑工作表名称开始 -->
    <div class="popup editWorksheet" style="display:none;">
        <ul class="listItem">
            <li class="first">
                <p class="tit">工作表名称：</p>
                <p class="con"><input type="text" class="inputMode w430" v-model="worksheetNameNew" placeholder="支持中英文，数字，下划线，30字符内" maxlength="30"></p>
                <p class="tips"></p>
            </li>
            <li>
                <p class="tit">文件夹：</p>
                <div class="con">
                    <div class="select-box w335 fl">
                        <div class="dropdown-btn">
                            <span class="select-value">{{folderNameTemp}}</span><i class="arr"></i>
                        </div>
                        <div class="dropdown-list">
                            <ul>
                                <li v-for="item of folders">
                                    <a href="javascript:;" @click.prevent="selectFolder(item)">{{item.folderName}}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <a href="javascript:;" class="blueLink" @click.prevent="newFolder" style="margin-left: 10px;">新建文件夹</a>
                </div>
            </li>
        </ul>
    </div>
    <!-- 编辑工作表名称结束 -->
    <!-- 新建文件夹 弹出层 -->
    <div class="popup newFolder" style="display:none;">
        <ul class="listItem">
            <li class="first"><p class="tit">文件夹名称：</p><p class="con"><input type="text" class="inputMode w430" v-model="newFolderName" maxlength="30"></p>
                <p class="tips">支持中英文，数字，30字符内</p>
            </li>
        </ul>
    </div>

</div>
<!-- 主内容区end -->
</template>
<script>
import api from '../../api'
import axios from 'axios'
import { mapGetters } from 'vuex'
import sheet_column from '../../components/sheet-column.vue'
import filtrate from '../../components/filtrate.vue'
import zb_wd from '../../components/zb-wd.vue'
import vueDragtable from '../../components/vue-dragtable'

export default {
    name: 'worksheetView',
    components: {
        'sheet-column': sheet_column,
        'zb-wd'  : zb_wd,
        filtrate,
        vueDragtable
    },
    data () {
        return {
            dependSheetId:'',
            sheetId:null, //选择的工作表Id
            columns:[], //选择工作表后获取的所有列名

            filtrateColumns:[],

            series:[],

            wds:[],//维度
            zbs:[],//指标

            conditionOp:'all',
            conditions:[],//筛选条件

            hasSaved:false, //是否已保存数据
            folders:null,//文件夹列表
            folderName: null,//工作表所在文件夹名称
            folderNameTemp:null,
            folderId:null,//工作表所在文件夹ID
            folderIdTemp:null,

            worksheetName:'未命名工作表',//工作表名称
            worksheetNameNew:'',//编辑后工作表名称
            operationSuccess:false,
            operationFailed:false,
            sheetNum:0,//记录工作表数量
            disabledSave:false,//拦截请求，防止一次点击多次保存

            sortList:[],//排序数组
            newFolderName: '',//新建文件夹

            firstIn:true,
            reload: false,//判断是点击还是下拉
        }
    },
    created () {
        //编辑视图
        if(this.$route.query.id){
            var id = this.$route.query.id;
            this.getData(id);
        }
        var dependSheetId = this.$route.query.tableId
        if(dependSheetId){
            this.dependSheetId = dependSheetId;
        }
    },
    mounted () {
        this.getWorksheetList();
    },
    computed: {
        ...mapGetters(['dragTableData'])
    },
    methods: {

        updateScene(){
            this.updateFiltrate();
        },

        updateconditions(){
            var zb = this.zbs;
            var con = this.conditions;
            for (var i = 0; i < con.length; i++) {
                var item = con[i];
                var reg = /\((\w+)\)/;
                var match = reg.exec(item.columnName);
                if(match){
                    var flag = false;
                    for (var j = 0; j < zb.length; j++) {
                        var itemy = zb[j];
                        if(match[1] == itemy.columnName){
                            flag = true;
                            item.columnName = itemy.op + '(' + itemy.columnName + ')';
                            item.name = itemy.columnName + '(' + itemy.opName + ')';
                            break;
                        }
                    }
                    if(!flag){
                        con.splice(i,1);
                        i--;
                    }
                }
            }
        },

        updateFiltrate(){
            var cols = this.columns;
            var zb = this.zbs;
            var arr = cols.slice();
            zb.forEach(function(element) {
                arr.push({
                    type : 'NUMBER',
                    columnName:element.op + '(' + element.columnName + ')',
                    name : element.columnName + '(' + element.opName + ')'
                });
            });
            this.filtrateColumns = arr;
            this.updateconditions();
        },




        /*更新筛选设置*/
        update_filtrate(val){
            this.conditionOp = val;
        },
        /*更新表、字段*/
        update_sheet_column(obj){
            this.dependSheetId = obj.tableId;
            this.columns = obj.columns;
            if(obj.is_switch){
                this.emptyOption();
            }
        },
        // 获取文件夹与工作表目录结构
        getWorksheetList () {
            api.getWorksheetList().then(res => {
                if(res.code == 0) {
                    // 获取文件夹目录
                    this.folders = res.data.folders;
                    // 编辑工作表的相关数据
                    if(this.folderId==null){
                        this.folderName =res.data['folders'][0]['folderName'];
                        this.folderId =res.data['folders'][0]['folderId'];
                    }
                    // 初始化工作表文件结构
                    let tempfile = res.data.sheetList || [];
                    this.folders.forEach((item, index) => {
                        item.close = true;
                        if(!index) {
                            item.close = false;
                        }
                        item.childrens = [];
                        for(let i = 0, length = tempfile.length; i < length; i++) {
                            if(tempfile[i].folderId === item.folderId) {
                                item.childrens.push(tempfile[i]);
                                this.sheetNum = this.sheetNum+1;
                            }
                        }
                    });
                }
                else {
                    this.layerMsg(res.message);
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        // 保存视图
        saveView () {
            if(this.wds.length==0&&this.zbs.length==0){
                this.layerMsg('维度或指标不能为空！');
                return;
            }
            if(this.worksheetName=='未命名工作表'){
                this.editWorksheet();
                return;
            }
            if(this.disabledSave){
                return;
            }else{
                this.disabledSave = true;
                var params = {
                    sheetId:this.sheetId,
                    folderId:this.folderId,
                    sheetName:this.worksheetName,
                    dependSheetId:this.dependSheetId,
                    conditionOp:this.conditionOp,
                    conditions:this.conditions,
                    dimensions:this.wds,
                    categories:this.zbs,
                    orderBys:this.handleSort(),
                };
                api.saveView(params).then(res => {
                    if(res.code==0){
                        this.sheetId = res.data;
                        this.hasSaved = true;
                        this.disabledSave = false;
                        // 设置提示
                        this.operationSuccess = true;
                        setTimeout(() => {this.operationSuccess = false;}, 3000);
                    }else{
                        this.disabledSave = false;
                        let msg = res.message || '接口连接失败';
                        this.layerError(msg);
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        runView(){
            if(this.firstIn){
                let obj = {
                    header: [], //表头
                    value: [],  //值
                    loading: false, //为true时显示‘正在加载数据...’
                    total: 10 //总数
                }
                this.$store.dispatch('setDragTableData', obj);
                return;
            }
            if(this.wds.length==0&&this.zbs.length==0){
                this.layerMsg('维度或指标不能为空！');
                return;
            }
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
            var params = {
                dependSheetId:this.dependSheetId,
                conditionOp:this.conditionOp,
                conditions:this.conditions,
                dimensions:this.wds,
                categories:this.zbs,
                orderBys:this.handleSort(),
                maxSize:100,
            };
            api.runView(params).then(res => {
                if(res.code == 0) {
                    let obj = {
                        header: res.data.headers,
                        value: this.dragTableData.value.concat(res.data.values),
                        loading: false,
                        total: res.data.values.length // 这里由于后端不支持分页，所以做了特殊处理
                    };
                    this.$store.dispatch('setDragTableData', obj);
                    // 设置提示
                    this.operationSuccess = true;
                    setTimeout(() => {this.operationSuccess = false;}, 3000);
                }else{
                    let msg = res.message || '接口连接失败';
                    this.layerError(msg);
                }
            })
            .catch(error => {
                this.layerMsg('接口连接失败');
            })
        },
        getData(id){
            api.editView({'id':id}).then(res => {
                this.wds =res.data.dimensions;
                this.zbs = res.data.categories;
                this.worksheetName = JSON.parse(JSON.stringify(res.data.sheetName));
                this.conditions = res.data.conditions;
                this.conditionOp = res.data.conditionOp;
                this.conditionText = res.data.conditionOp =='part'?'任意条件':'全部条件';
                this.sheetId = res.data.sheetId;
                this.folderId = res.data.folderId;
                this.firstIn = false;
                this.initSortList(res.data.orderBys);
                this.runView();

            })
            .catch(error => {
                console.log(error)
            })
        },
        // 清空条件
        emptyOption(){
            this.worksheetName='未命名工作表';
            this.conditionOp='all';
            this.conditionText='全部条件';
            this.conditions=[];
            this.wds=[];
            this.series=[];
            this.zbs=[];
            this.folderName =this.folders[0].folderName;
            this.folderId =this.folders[0].folderId;
            this.sortList = [];
        },
        // 判断是否保存数据
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
        },
        // 检查名称
        checkName(name) {
            const regex = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,30}$/;
            return regex.test(name);
        },
        //编辑名称
        editWorksheet () {
            this.getWorksheetList();
            this.folderName = this.getFolderName(this.folderId);
            this.worksheetNameNew = this.worksheetName;
            this.folderNameTemp = this.folderName;
            this.folderIdTemp = this.folderId;
            this.layerEditWorksheet((layero, index) => {
                if(this.checkName(this.worksheetNameNew)) {
                    layer.close(index);
                    // 更新临时信息到工作表
                    this.worksheetName = this.worksheetNameNew;
                    this.folderName = this.folderNameTemp;
                    this.folderId = this.folderIdTemp;
                }else{
                    this.layerMsg('命名错误！支持中英文，数字，下划线，30字符内');
                }
            }, cancel => {
                console.log('cancel')
            })
        },
        //编辑工作表选择文件夹
        selectFolder (item) {
            this.folderNameTemp = item.folderName;
            this.folderIdTemp = item.folderId;
        },
        // 获取folder名称
        getFolderName(id){
            var folderName;
            for(var i=0;i<this.folders.length;i++){
                if(this.folders[i].folderId == id)
                    folderName = this.folders[i].folderName;
            }
            return folderName;
        },
        // 处理为后端数据
        handleSort(){
            var arr=[];
            for(var i=0;i<this.sortList.length;i++){
                if(this.sortList[i].checked == true){
                    arr.push(this.sortList[i]);
                }
            }
            return arr;
        },
        // 编辑视图初始化排序
        initSortList(orders){
            this.addSort = false;
            this.sortList = this.wds.concat(this.zbs);
            for(var i=0;i<this.sortList.length;i++){
                this.sortList[i].checked = false;
                this.sortList[i].orderType = null;
                for(var j=0;j<orders.length;j++){
                    if(this.sortList[i].columnName ==orders[j].columnName&&this.sortList[i].columnAlias ==orders[j].columnAlias){
                        this.sortList[i].checked = true;
                        this.sortList[i].orderType = orders[j].orderType;
                    }
                }
            }
        },
        // 新建文件夹
        newFolder(){
            layer.closeAll();
            let action = (layero, index) => {
                if(this.newFolderName.length == 0) {
                    this.layerMsg('名称不能为空');
                }
                else if(this.checkName(this.newFolderName)) {
                    api.worksheet.newFolder(this.newFolderName).then((response) => {
                        this.newFolderName = '';
                        layer.close(index);
                    })
                    .catch(function (error) {
                        this.layerMsg('接口连接失败');
                    });
                }
                else {
                    this.layerMsg('命名错误！支持中英文，数字，30字符内');
                }
            }
            this.layerNewFolder('新建文件夹', action);
        }
    },
}
</script>