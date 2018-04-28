<template>
    <div class="sheet-box" id="jointablesTable">
        <div class="border-radius0 bor-box vue-dragtable-container" v-show="tableData.header.length">
            <!-- 表头 -->
            <div class="mt"><input type="checkbox" v-model="repeatState" @change="computeHeader">仅显示重复字段</div>
            
            <table class="listTable table-layout" id="vue-dragtable">
                <thead>
                    <tr>
                        <th class="sheet-head trGray" v-for="header,index of headers" :colspan="header.count">
                            <input type="checkbox" @change="checkAll(index, header.checked, header.content)" v-model="header.checked">
                            {{ header.content }}
                        </th>
                    </tr>
                    <tr class="tcenter trGray">
                        <th v-for="(header, index) of tableData.header" @mouseover="mouseover(index)" @mouseout="mouseout(index)" @mousedown="bindResize($event, index)" @mouseleave="unbindResize" class="move" v-show="arr.indexOf(index) !== -1 || !repeatState">
                            <div class="tablecell"
                                :class="'resize' + index"
                                :style="{width: Math.max(w/tableData.header.length, 200) + 'px'}" 
                                >
                               
                                <div class="b-edit-hd" v-show="!header.edited">
                                    <input type="checkbox" v-model="header.checked" @change="singleChecked(header)">
                                    <span class="txtname" :title="header.columnAlias">{{header.columnAlias}}</span>
                                    <button class="btn-edit" title="修改" @click="editColumn(header, index)" :class="{edit: showEdit == index}">修改</button>
                                </div>
                                <div class="b-edit-bd" v-show="header.edited">
                                    <div class="b-editinput">
                                    <input type="text" class="inputName" :class="{w200: editIndex == index}" v-model="header.columnNameTemp" :id="header.sheetId + index"></div>
                                    <div class="btns">
                                        <a class="qd" href="javascript:void(0);" @click="saveEdit(header)">确定</a>
                                        <a class="qx" href="javascript:void(0);" @click="cancelEdit(header)">取消</a>
                                    </div>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) of tableData.value" :class="{trGray: index % 2 != 0}">
                        <td v-for="(value, idx) of data" v-show="arr.indexOf(idx) !== -1 || !repeatState">
                            <div class="txt tablecell" 
                                :class="'resize' + idx"
                                :style="{width: Math.max(w/tableData.header.length, 200) + 'px'}" 
                                >
                                {{value}}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="selectLine textCon" v-if="repeatState && !arr.length">
                无重复字段
            </div>      
        </div>
        <div class="bor-box pad20 white-bg" v-if="!tableData.header.length">
            <div class="selectLine textCon">
                当前图表无数据
            </div>                           
            <div class="cl"></div>
        </div>
    </div>
</template>

<script>
    import api from '../../../../api'
    import { mapGetters } from 'vuex'

    export default {
        mounted() {
            this.w = document.getElementsByClassName('vue-dragtable-container')[0].clientWidth;
            // bin scroll
            const container = document.getElementsByClassName('vue-dragtable-container')[0];
            container.addEventListener('scroll', this.scroll);
            // bin document mouseup
            document.addEventListener('mouseup', this.unbindResize);
            
        },
        data () {
            return {
                edited: false,
                editIndex: -1,
                showEdit: -1,
                loading: false,
                finished: false,
                w: 0,
                arr: [],
                repeatState: false,
                headers: [],
            }
        },
        computed: {
            ...mapGetters(['tableData']),
        },
        methods: {
            checkAll(index, checked, tableName) {
                this.tableData.header.forEach((item, idx) => {
                    if(tableName === item.sheetName && (this.arr.indexOf(idx) !== -1 || !this.repeatState)) {
                        item.checked = checked;
                    }
                });
            },
            singleChecked (current) {
                let checkedLen = -1;
                let currTableLen = -1;
                let headName = '';

                this.tableData.header.forEach((item, idx) => {
                    if(current.sheetId == item.sheetId) {
                        currTableLen++;
                        if(item.checked) {
                            checkedLen++;
                            headName = item.sheetName;
                        }
                    }
                });
                this.headers.forEach((item, index) => {
                    if(item.content == headName) {
                        if(checkedLen == currTableLen) {
                            item.checked = true;
                        }
                        else {
                            item.checked = false;
                        }
                    }
                });
            },
            checkeDuplicate() {
                let map = {};

                this.arr = [];
                this.tableData.header.forEach((item, index) => {
                    if(map[item.columnAlias] === undefined) {
                        map[item.columnAlias] = index;
                    }
                    else {
                        this.arr.push(index);
                        this.arr.push(map[item.columnAlias]);
                    }
                });
            },
            computeHeader() {
                this.checkeDuplicate();
                let arry = [];
                let obj = {};
                this.tableData.header.forEach((item, index) => {
                    if(index === 0 || item.sheetId !== this.tableData.header[index -1].sheetId) {
                        obj = {};
                        obj.count = 0;
                        obj.checked = item.checked;
                        if(this.arr.indexOf(index) !== -1 || !this.repeatState) {
                            obj.count = 1;
                        }
                        obj.content = item.sheetName;
                        arry.push(obj);
                    } else {
                        if(this.arr.indexOf(index) !== -1 || !this.repeatState) {
                            obj.count += 1;
                        }
                    }
                });
                this.headers = arry;
            },
            editColumn (header, index) {
                header.edited = true;
                this.editIndex = index;
            },
            checkField(name) {
                const regex = /^[a-zA-Z_][a-zA-Z0-9_]{0,29}$/;
                return regex.test(name);
            },
            saveEdit (header) {
                if(this.checkField(header.columnNameTemp)) {
                    header.edited = false;
                    header.columnAlias = header.columnNameTemp;
                } else {
                    this.layerMsg('只支持英文字母数字和下划线的组合、且不能以数字开头');
                }
            },
            cancelEdit (header) {
                this.editIndex = -1;
                header.edited = false;
                header.columnNameTemp = header.columnAlias;
            },
            mouseover (index) {
                this.showEdit = index;
            },
            mouseout (index) {
                this.showEdit = -1;
            },
            scroll(e) {
                if (!this.loading && !this.finished && e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight && e.target.scrollTop > 0) {
                    this.loading = true;
                    e.target.scrollTop = e.target.scrollTop - 10;
                    // getData...
                }
            },
            bindResize(e, index) {
                if (e.target.clientWidth - e.offsetX < 10) {
                    this.index = index;
                    this.targetElement = e.target;
                    this.targetElement.addEventListener('mousemove', this.resize);
                }
            },
            resize(e) {
                if (e.offsetX > 10) {
                    let className = `resize${this.index}`;
                    let items = document.getElementsByClassName(className) || [];
                    for (let i = 0; i < items.length; i++) {
                        items[i].style.width = `${e.offsetX - 32}px`;
                    }
                } else if (e.offsetX < 10) {
                    this.targetElement.removeEventListener('mousemove', this.resize);
                }
            },
            unbindResize(e) {
                if (this.targetElement) {
                    this.targetElement.removeEventListener('mousemove', this.resize);
                }
            },
        },
        watch: {
            tableData() {
                this.computeHeader();
            }
        }
    }
</script>
<style scoped>
    #vue-dragtable {
        border-collapse: collapse;
        width: auto;
        /*min-width: 100%;*/
    }
    #vue-dragtable th div.tablecell, #vue-dragtable td div.tablecell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
        display: inline-block;
        padding: 10px;
    }
    #vue-dragtable th, #vue-dragtable td{
        border: 1px solid #ddd;
        white-space: nowrap;
        text-align: left;
        padding: 0px;
    }
    .vue-dragtable-container {
        width: 100%;
        height: 340px;
        overflow: auto;
    }
    #vue-dragtable th.move:after {
        height: 37px;
        width: 21px;
        display: inline-block;
        cursor: ew-resize;
        content: '1';
        vertical-align: top;
        color: transparent;
        position: relative;
        left: 11px;
    }
    .tip-text {
        color: #ccc;
        padding: 10px;
        text-align: center;
    }
    .tablecell {
        width: 100px;
    }
    input,button,select,textarea{
        outline:none;
        border:0;
        border-style: none;
    }
    
    .s-rightMenu {
        margin-left: 210px;
    }
    .b-edit-bd {
        display: block;
    }
    .b-edit-box {
        height: 28px;
        line-height: 28px;
    }
    .btn-edit {
        position: relative;
        top: -2px;
    }
    .b-editinput {
        padding-right: 56px;
    }
    .btns {
        width: 50px;
        height: 50px;
    }
    #jointablesTable .listTable td,#jointablesTable .listTable th {
        width: auto;
        border-right: 1px solid #eee;
    }
    #jointablesTable .listTable th {
        white-space: nowrap;
        cursor: default;
    }
    #jointablesTable .listTable {
        width: auto;
        min-width: 100%;
    }
    .b-edit-bd .inputName {
        padding-left: 5px;
    }
    .b-edit-bd .inputName.w200 {
        width: 200px;
    }
    .btn-edit {
        visibility: hidden;
    }
    .btn-edit.edit {
        visibility: visible;
    }
    .txt {
        padding-left: 10px;
        white-space: nowrap;
    }
    .listTable .sheet-head {
        text-align: left;
        font-size: 16px;
        border-right: 1px solid #eee;
    }
    .txtname {
        color: #414141;
    }
    #jointablesTable th.sheet-head {
        padding: 10px;
    }
    .sheet-box .mt {
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        position: relative;
    }
    .sheet-box .mt input {
        position: relative;
        top: 2px;
        display: inline-block;
        margin-right: 4px;
    }
</style>