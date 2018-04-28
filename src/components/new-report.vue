<template>
<div class="popup newReport" style="display:none;">
    <ul class="listItem">
        <li v-show="newReport.active == 'copy' || newReport.active == 'move'" class="first"><p class="tit pal">当前名称：</p>
              <div class="con">
                  {{newReport.currentName}}
              </div>
        </li>

        <li v-show="newReport.active != 'move'" class="first" :class="{error: newReport.status}">
            <p class="tit">报表名称：</p>
            <p class="con"><input type="text" class="inputMode w430" v-model="newReport.reprotName" placeholder="支持中英文，数字，30字符内" @change="change"></p>
            <p class="tips" v-if="newReport.status">{{tips}}</p>
        </li>

        <li v-show="newReport.active != 'rename'">
            <p class="tit">文件夹：</p>
            <div class="con">
                <div class="select-box w335 fl">
                    <div class="dropdown-btn">
                        <span class="select-value">{{newReport.folderName}}</span><i class="arr"></i>
                    </div>
                    <div class="dropdown-list">
                        <ul>
                            <li v-for="(item, index) of foldersAndReport">
                                <a href="javascript:;" @click.prevent="selectFolder(item.folder, index)">{{item.folder.folderName}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'newReport',
    data () {
        return {
            currentFolderIndex: 0,
            tips: '',
            msg: [
                '请输入报表名称',
                '报表名不能超过30个字符',
            ]
        }
    },
    computed: mapGetters(['newReport']),
    props:['foldersAndReport'],
    created () {
        this.$events.on('verfiy-new-report', this.change)
    },
    methods: {
        change () {
            if(!this.verfiy()) {
                return false;
            }
            this.createReport();
        },
        /**
        * 选择文件夹
         */
        selectFolder (item, index) {
            let data = {};
            data.folderName = item.folderName;
            data.folderId = item.folderId;
            this.$store.commit('set_report_key', data);
        },
        
        /**
        * 校验报表
         */
        verfiy() {

            let data = {
                reprotName: this.newReport.reprotName,
                status: true,
                verfiy: false,
            }
            if(data.reprotName == '') {
                this.tips = this.msg[0];
                this.$store.commit('set_report_key', data);
                return false;
            }
            else if(data.reprotName.length > 30) {
                this.tips = this.msg[1];
                this.$store.commit('set_report_key', data);
                return false;
            }
            else {
                return true;
            }
        },

        createReport(){
            let data = {
                status: false,
                verfiy: true,
            };
            this.$store.commit('set_report_key', data);
        }


    }
}
</script>
