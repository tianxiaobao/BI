<style>
body {
    background-color: #ebf1f5 !important;
}

.indexTit {
    position: fixed !important;
    width: 100% !important;
    z-index: 0;
    border-bottom: 1px dashed #eee;
}

.innerCon {
    margin-top: 49px !important;
    background: none !important;
}
.YnaviContent .mainCon {
    height: inherit;
}

.s-leftMenu {
    z-index: 0 !important;
    overflow: hidden !important;
}
.s-leftMenu .nav {
    padding-bottom: 100px;
}
.m200 {
    margin-left: 200px;
}
</style>
<template>
  <div id="app">
    <header> </header>
    <section class="YnaviContent">
        <div class="mainMenu"> </div>
        <div class="subMenu"> </div>
        <!-- 主内容区begin -->
        <router-view id="content" :class="{m200: mainState}"></router-view>
        <!-- 主内容区end -->
    </section>
  </div>
</template>

<script>
import './style/control0803.css'
import './style/gridstack.css'
import { mapGetters } from 'vuex'

export default {
    name: 'app',
    data () {
        return {
            mainState: 1,
        }
    },
    mounted () {
        this.initContSize();
        this.setMainMenu();
        $(window).on('resize', this.initContSize);
    },
    computed: {
        ...mapGetters(['gridster'])
    },
    methods: {
        initContSize () {
            const $YnaviContent = $('.YnaviContent');
            const $sLeftMenu = $('.s-leftMenu');
            const clientHeight = document.documentElement.clientHeight;
            const headH = $('header').height() || 50;

          $YnaviContent.height(clientHeight - headH);
          $sLeftMenu.height(clientHeight - 111);
        },
        setMainMenu (name) {
            const _this = this;
            const $YnaviContent = $('.YnaviContent');
            const $mainCon = $('.mainCon');
            const $mainMenu = $('.mainMenu');
            const $subMenu = $('.subMenu');
          
            $subMenu.on('click','.subMenuToggle', function () {
                console.log('v2', 'mainMenu, subMenuToggle')
                // _this.mainState = !_this.mainState;
                _this.$store.commit('setResizeCount', new Date().getTime());
                $mainCon.css({
                    marginLeft: $mainMenu.width() + $subMenu.width()
                });
            })
            $mainMenu.on('click','.subMenuToggle', function () {
                console.log('v1','mainMenu, subMenuToggle')
                $mainCon.css({
                    marginLeft: $mainMenu.width() + $subMenu.width()
                })
            })
            $mainMenu.on('click','.mainMenuToggle', function() {
                console.log('v2','mainMenu, mainMenuToggle')
                // _this.mainState = !_this.mainState;
                $mainCon.css({
                    marginLeft: $mainMenu.width() + $subMenu.width()
                });
                _this.$store.commit('setResizeCount', new Date().getTime());
            })
        }
    }
}
</script>
