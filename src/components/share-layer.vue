<template>
    <div>
        <div class="popup addShare" style="display:none;">
            <ul class="listItem">
                <li class="first"><p class="tit">链接：</p>
                    <div class="con">
                        <input type="text" class="inputMode w335" v-model="share.url" id="urlId"> <a href="#" class="blueLink" @click.prevent="copyUrl">复制链接</a>
                    </div>
                    <p class="tips">复制后将链接发给分享人，登录即可查看！</p>
                </li>
                <li><p class="tit">PV：</p>
                    <div class="con">
                        <input type="text" disabled="disabled" :value="share.pv" class="inputMode w335" > <a href="#" class="blueLink" @click.prevent="reset">清零</a>
                    </div>
                </li>
                <li><p class="tit">分享开关：</p>
                    <div class="con">
                        <i class="switch" @click="switchShare" :class="{'off': !share.open}"></i>
                    </div>
                    <p class="tips">开关开启后，分享链接方可访问</p>
                </li>
            </ul>
        </div>


        <div class="popup resetCount-layer" style="display:none;">
            <div class="textCon f14" style="padding-top:84px;">
               确认后将被清零，PV将重新开始计数
             </div>
        </div>

    </div>
</template>
<script>
    import api from '../api'
    export default {
        name: 'share-layer',
       
        props: ['share','id'],
        
        methods: {
            switchShare () {
                this.share.open = !this.share.open;
                let data = {
                    type: this.share.type,
                    targetId: this.share.id,
                    isOpen: this.share.open,
                }
                setTimeout(() => {
                    api.shareUpdate(data).then(res => {
                        console.log(res.message)
                    }, error => {
                        console.log(error)
                    })
                }, 400)
            },
            copyUrl () {
                let urlId = document.getElementById('urlId')

                urlId.select()
                document.execCommand("Copy");
                layer.tips('复制成功！', '#urlId', {
                    tips: [1, '#eee'],
                });
            },

            reset(){

                var that = this;

                var data = {
                    targetId: this.id,
                    shareType: this.share.type,
                }

                layer.open({
                    title: '清零',
                    type: 1,
                    content: $('.resetCount-layer'),
                    area: ['560px','340px'],
                    btn: ['确认', '取消'],
                    yes: function(index, layero) {
                        api.resetCount(data).then(res => {
                            if(res.code == 0){
                                that.share.pv = 0;
                            }
                        }, error => {
                            console.log(error)
                        });
                        that.share.pv = 0;
                        layer.close(index);
                    },
                    end: function() {
                        
                    }
                });

            }   
        }

    }
</script>