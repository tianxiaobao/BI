<style type="text/css">
    .tipFixed{
        position: fixed;
        right: 20px;
    }
    .worksheetSql .nav dd{
        padding-left: 0;
        display: block;
    }
    .worksheetSql .nav dd.on a, .worksheetSql .nav dd a{
        padding-left: 45px;
    }
    .worksheetSql .hide{
        display: none !important;
    }
    #editor {
        height: 170px;
    }
    .worksheetSql .overflow-nav dd a.pointer{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        vertical-align: middle;
        width: 100px;
    }
    .worksheetSql .text-hidden{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 70px;
        display: inline-block !important;
        float: none !important;
        vertical-align: top;
    }
    .worksheetSql .statement{
        height: auto;
    }
    .worksheetSql .nav dd:hover span, .worksheetSql .nav dt:hover span{
        display: inherit;
    }
    .worksheetSql .nav span{
        display: inherit;
    }
    .worksheetSql .red{
        color: #f00;
    }
    .buildCon{
        line-height: 1.5em;
    }
</style>
<template>
<!-- 主内容区begin -->
<div class="mainCon">
    <div class="indexTit">
        <h2 class="fl">
            <a href="#" @click.prevent="checkIfSaved" class="goback"></a>工作表
            <i class="i42"></i><span class="f14">SQL创建</span>
        </h2>
        <div class="tip fr tipFixed" v-if="opSuccess" >温馨提示：操作成功</div>
        <div class="tip-warning fr tipFixed" v-if="opFailed">温馨提示：操作失败</div>
    </div>
    <!-- 基本信息 begin -->
    <div class="innerCon worksheetSql">
        <div class="statement">
            <div class="s-leftMenu">
                <div class="mt">工作表</div>
                <div class="mc">
                    <div class="s-search">
                        <input type="text" class="s-searchInput" v-model="searchKey" placeholder="请输入关键词搜索">
                        <a href="#" class="s-searchBtn">
                        <i class="i31"></i></a>
                    </div>
                    <div class="nav overflow-nav">
                        <div class="nav-item" v-for="(folder,index1) in displayList">
                            <dl>
                                <dt :class="{close: folder.close}" @click="folder.close = !folder.close;trigger=!trigger"><i></i><h3>{{folder.folderName}}</h3></dt>
                                <dd v-for="(sheet,key) in folder.sheetList" :class="{hide:folder.close}" :title="sheet.sheetName"><a href="javascript:;" class="pointer" @click="sheet.show = !sheet.show"><i class="bian1"></i>{{sheet.sheetName}}</a><span class="fold-txt">...<ul class="fold-drop"><li><a href="#" @click.prevent="insert(index1,key,'part')">插入工作表</a></li><li><a href="#" @click.prevent="insert(index1,key,'all')">插入所有字段</a></li></ul></span>
                                <span class="tree" v-if="sheet.show==false">
                                    <a href="#" @click.prevent="insert(index1,key,index)" v-for="(elem,index) in sheet.elements"><i :class="{'icon1':elem.type=='DATE','icon2':elem.type=='TEXT','icon3':elem.type=='NUMBER'}"></i><span class="text-hidden">{{elem.columnAlias}}</span><i class="icon-01 fr"></i></a>
                                </span>
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div class="no-result" v-show="!displayList.length">无搜索结果</div>
                </div>
            </div>
            <div class="s-rightMenu">
                <div class="bor-box-mt">
                    {{sheetName}}
                    <a href="#" @click.prevent="editWorksheet" class="blueLink ml10">编辑</a>
                    <div class="fr">
                        <a @click="firstIn=false;reload=true;runSql()" class="mr10 blueLink">运行</a>
                        <a @click="saveSql" class="ml10 blueLink">保存</a>
                    </div>
                </div>
                <div class="bor-box-mc  white-bg mb20">
                    <div  id="editor"></div>
                </div>
                <div class="white-bg">
                    <div class="dataTab chart-right-1 chart-left-1">
                        <ul>
                            <li :class="{hover:!showData}" @click="showData = !showData"><p class="w100">语法帮助</p></li>
                            <li :class="{hover:showData}" @click="showData = !showData"><p class="w100">数据预览</p></li>
                        </ul>
                    </div>
                </div>
                <div class="bor-box-mc white-bg">
                        <!-- 切换内容（语法帮助）begin -->
                        <div class="buildCon pad10 h340" v-show="!showData">
                            <p class="f14">
                                语法规则：<br>

                                1: <span class="red">仅支持select</span>查询语句，<span class="red">不支持insert、drop、delete</span>等非查询语句<br>

                                2: 查询的工作表不支持别名，查询的结果字段别名不支持中文<br>

                                3: 查询工作表时，使用<span class="red">${}</span>来表示某一个工作表，其中<span class="red">{}</span>内使用工作表名表示，工作表名见工作表列表<br>

                                4: 查询多个工作表时，需要在查询字段前增加 工作表名.<br>

                                5: SQL输出字段名称不允许重复，计算字段需显式指定别名，别名不能包括<span class="red">“().</span>等特殊字符（目前仅支持<span class="red">_</span>）<br>

                                6: 子句支持：<br>

                                [ FROM from_item [, ...] ]<br>

                                [ WHERE condition ]<br>

                                [ GROUP BY expression [, ...] ]<br>

                                [ HAVING condition]<br>

                                [ UNION [ ALL | DISTINCT ] select ]<br>

                                [ ORDER BY expression [ ASC | DESC ] [, ...] ]<br>

                                [ LIMIT count ]<br>

                                #SQL创建界面中只显示10行数据, limit只作用于实际数据结果<br>

                                #limit默认为1000最大支持10000行数据。<br>

                                from_item 为以下<br>

                                from_item join_type from_item [ ON join_condition | USING ( join_column [, ...] ) ]<br>


                                示例：
                                <br>
                                select column1 from ${工作表1}<br>

                                select 工作表1.column1 from ${工作表1}<br>

                                select 工作表1.column1 as aliasName1 from ${工作表1}<br>

                                select 工作表1.column1, 工作表2.column2 from ${工作表1} left join ${工作表2} on 工作表1.id = 工作表2.id<br>

                                select count(工作表1.column1) as column_1 from ${工作表1}<br>

                             </p>
                        </div>
                        <!-- 切换内容（语法帮助）end -->
                        <!-- 切换内容（数据预览）begin -->
                        <div class="buildCon h340" v-show="showData">
                            <vue-dragtable v-on:loadData="runSql" :max="100"></vue-dragtable>
                        </div>
                        <!-- 切换内容（数据预览）end -->
                </div>
            </div>
        </div>
    </div>
    <!-- 基本信息 end -->
    <!-- 编辑弹窗 -->
    <div class="popup editWorksheet" style="display:none;">
        <ul class="listItem">
            <li class="first">
                <p class="tit">工作表名称：</p>
                <p class="con"><input type="text" class="inputMode w430" v-model="sheetNameTemp" placeholder="支持中英文，数字，下划线，30字符内" maxlength="30"></p>
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
                                    <a href="#" @click.prevent="selectFolder(item)">{{item.folderName}}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <a href="#" class="blueLink" @click.prevent="newFolder" style="margin-left: 10px;">新建文件夹</a>
                </div>
            </li>
        </ul>
    </div>
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
import vueDragtable from '../../components/vue-dragtable'

export default {
	name: 'worksheetSql',
    components: {
        vueDragtable
    },
    data () {
        return {
            sheetName:'未命名工作表',
            sheetNameTemp:'',
            sql: null,

            sheetId:null,
            folders:null,//文件夹目录
            folderName: null,//文件夹名称
            folderId:null,//文件夹id
            folderNameTemp: null,//文件夹名称
            folderIdTemp:null,//文件夹id

            opSuccess:false,//操作提示
            opFailed:false,//操作提示

            hasSaved:false,//判断是否保存编辑内容

            disabledSave:false,//禁止点击多次
            newFolderName: '',//新建文件夹
            displayList:[],
            sourceList:[],
            searchKey:'',
            showData:false,//切换tab

            reload: false,//判断是点击还是下拉
            firstIn:true,
        }
    },
    created () {
        if(this.$route.query.id){
            var id = this.$route.query.id;
            this.getData(id);
        }
    },
    mounted () {
        this.getWorksheetFolders();
        this.getlistForSql();
        var editor = ace.edit("editor");
        editor.getSession().setMode("ace/mode/sql");
    },
    computed: {
        ...mapGetters(['dragTableData'])
    },
    watch: {
        searchKey(val){
            this.search(val);
        }
    },
    methods: {
        // 判断是否已对编辑内容进行保存
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
        // 执行sql
        runSql () {
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
            var editor = ace.edit("editor");
            this.sql = editor.getValue();
            if(this.sql == '' || this.sql == null){
                this.layerMsg('请输入sql')
                return;
            }
            this.showData = true;
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
            api.runSql({sql:this.sql,maxSize:100}).then(res => {
                // 判断是滚动触发的还是点击右侧列表触发的
                // 点击列表需要重置header和value
                if(res.code == 0) {
                    let obj = {
                        header: res.data.headers,
                        value: this.dragTableData.value.concat(res.data.values),
                        loading: false,
                        total: res.data.values.length // 这里由于后端不支持分页，所以做了特殊处理
                    };
                    this.$store.dispatch('setDragTableData', obj);
                }
                else {
                    let msg = res.message || '接口连接失败';
                    this.layerError(msg);
                }
                //this.opFailed = true;
                //setTimeout(() => {this.opFailed = false;}, 3000);
            })
            .catch(error => {
                this.layerMsg('接口连接失败');
            })
        },
        // 保存sql
        saveSql () {
            this.showData = true;
            // 赋值
            var editor = ace.edit("editor");
            this.sql = editor.getValue();
            // 禁止点击多次保存
            if(this.disabledSave){
                return;
            }
            if(this.sql =="" || null==this.sql){
                this.layerMsg('请输入sql');
                return;
            }else{
                this.disabledSave = true;
                var params = {sql:this.sql,folderId:this.folderId,sheetName:this.sheetName,sheetId:this.sheetId};
                api.saveSql(params).then(res => {
                    if(res.code==0){
                        this.sheetId = res.data;
                        this.hasSaved = true;
                        this.disabledSave = false;
                        // 设置提示
                        this.opSuccess = true;
                        setTimeout(() => {this.opSuccess = false;}, 3000);
                    }else{
                        this.layerMsg(res.message);
                        this.disabledSave = false;
                        // 设置提示
                        this.opFailed = true;
                        setTimeout(() => {this.opFailed = false;}, 3000);
                    }
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        // 编辑sql初始化数据
        getData(id){
            api.editSql({'id':id}).then(res => {
                this.sheetName =res.data.sheetName;
                this.sql = res.data.sql;
                // 设置文本里的值
                var editor = ace.edit("editor");
                editor.setValue(this.sql);
                this.sheetId = res.data.sheetId;
                this.folderId = res.data.folderId;
                this.firstIn = false;
                this.runSql();
            })
            .catch(error => {
                console.log(error)
            })
        },
        // 检查名称
        checkName(name) {
            const regex = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,30}$/;
            return regex.test(name);
        },
        // 编辑工作表
        editWorksheet () {
            this.getWorksheetFolders();
            this.folderName = this.getFolderName(this.folderId);
            // 更新临时的工作表信息
            this.sheetNameTemp = this.sheetName;
            this.folderNameTemp = this.folderName;
            this.folderIdTemp = this.folderId;
            this.layerEditWorksheet((layero, index) => {
                if(this.checkName(this.sheetNameTemp)) {
                    layer.close(index);
                    // 更新临时信息到工作表
                    this.sheetName = this.sheetNameTemp;
                    this.folderName = this.folderNameTemp;
                    this.folderId = this.folderIdTemp;
                }else{
                    this.layerMsg('命名错误！支持中英文，数字，下划线，30字符内');
                }
            }, cancel => {
                console.log('cancel')
            })
        },
        //选择文件夹
        selectFolder (item) {
            this.folderNameTemp = item.folderName;
            this.folderIdTemp = item.folderId;
        },
        //获取文件夹目录
        getWorksheetFolders () {
            api.getWorksheetList().then(res => {
                if(res.code == 0) {
                    this.folders = res.data['folders'];
                    if(this.folderId==null){
                        this.folderName =res.data['folders'][0]['folderName'];
                        this.folderId =res.data['folders'][0]['folderId'];
                    }
                }
                else {
                    this.layerMsg(res.message);
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        //获取左侧结构
        getlistForSql () {
            api.listForSql().then(res => {
                if(res.code == 0) {
                    this.sourceList.length = 0;
                    this.sourceList = res.data.folders;
                    this.search(this.searchKey);
                }
                else {
                    this.layerMsg(res.message);
                }
            })
            .catch(error => {
                console.log(error)
            })
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
        },
        search(searchKey) {
            // clear displayList
            this.displayList.length = 0;
            for(let i = 0, length = this.sourceList.length; i < length; i++) {
                var folder = this.sourceList[i];
                var tempChild = [];
                var tempFolder = {};
                for (let j = 0, length = folder.sheetList.length; j < length; j++) {
                    var sheet = folder.sheetList[j];
                    if(sheet.sheetName.includes(searchKey)) {
                        tempChild.push(sheet);
                    }
                }
                if(tempChild.length) {
                    $.extend(true, tempFolder, folder);
                    tempFolder.sheetList = tempChild;
                    tempFolder.close = false;
                    this.displayList.push(tempFolder);
                }
            }
            this.$forceUpdate();
        },
        // 插入文本到sql
        insert(index,index1,index2){
            var editor = ace.edit("editor");
            var obj = this.displayList[index];
            if(index2 == 'part'){
                editor.insert('${'+this.displayList[index].sheetList[index1].sheetName+'}');
            }else if(index2 == 'all'){
                let str = '';
                for(var i = 0;i<this.displayList[index].sheetList[index1].elements.length;i++){
                    str = str + this.displayList[index].sheetList[index1].sheetName+'.'+this.displayList[index].sheetList[index1].elements[i].columnAlias+',';
                }
                editor.insert(str);
            }else{
                editor.insert(this.displayList[index].sheetList[index1].sheetName+'.'+this.displayList[index].sheetList[index1].elements[index2].columnAlias);
            }
        }
    }
}
</script>