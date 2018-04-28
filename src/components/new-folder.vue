<template>
    <div class="popup newFolder" style="display:none;">
        <ul class="listItem">
            <li class="first" :class="{error: newFolder.status}">
                <p class="tit">文件夹名称：</p>
                <p class="con">
                    <input type="text" class="inputMode w430" placeholder="支持中英文，数字，30字符内" v-model="newFolder.value" @change="change">
                </p>
                <p class="tips" v-if="newFolder.status">{{tips}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'newFolder',
    data () {
        return {
            folderName: '',
            tips: '',
            inputState: false,
            msg: [
                '请输入文件夹名称',
                '文件名称不能超过30个字符',
            ]
        }
    },
    created () {
        this.$events.on('verfiy-new-folder', this.change)
    },
    computed: mapGetters(['newFolder']),
    methods: {
        change () {
            if(!this.verify()) {
                return false;
            }
            this.createFolder();
        },
        verify () {
            let data = {
                value: this.newFolder.value,
                status: true,
                verfiy: false,
            }
            if(data.value == '') {
                this.tips = this.msg[0];
                this.$store.dispatch('setNewFolder', data);
                return false;
            }
            else if(data.value.length > 30) {
                this.tips = this.msg[1];
                this.$store.dispatch('setNewFolder', data);
                return false;
            }
            else {
                this.inputState = false;
                return true;
            }
        },
        createFolder () {
            let data = {
                value: this.newFolder.value,
                status: false,
                verfiy: true,
            };
            this.$store.dispatch('setNewFolder', data);
        }
    }
}
</script>