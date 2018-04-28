// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Cookies from 'js-cookie'
import VueEvents from 'vue-events'
import { sync } from 'vuex-router-sync'
import layer from './components/layer'
import VueCookie from 'vue-cookie'
import localforage from 'localforage'

Vue.config.productionTip = false

Vue.use(layer)

Vue.use(VueEvents)

Vue.use(VueCookie);

sync(store, router);

Vue.prototype.$localforage = localforage;

let pageName = 'datasource';

function setMainMenu() {
    let $YnaviContent = $('.YnaviContent');
    let $mainCon = $('.mainCon');
    let $mainMenu = $('.mainMenu');
    let $subMenu = $('.subMenu') || 0;

    $mainCon.css({
        marginLeft: $mainMenu.width() + $subMenu.width()
    });
}

function getYnavi(to) {
    let timer = setInterval(() => {
        if (window.Ynavi) {
            clearInterval(timer);
            setCurrPage(to);
        }
    }, 1000);
    setTimeout(() => {
        setMainMenu();
    })
}

function setCurrPage(to) {
    if (to.name == 'list' ||
        to.name == 'worksheetView' ||
        to.name == 'worksheetSql' ||
        to.name == 'jointables') {
        pageName = 'worksheet';
    } else if (to.name == 'addChart') {
        pageName = 'dashboard';
    } else {
        pageName = to.name;
    }
    window.Ynavi.setCurrPage(pageName);
}

const isLogin = (to, from, next) => {
    const userName = Cookies.get('pin');
    const href = window.location.href;

    if(!userName) {
        const exitUrl = `http://uc.jcloud.com/login?returnUrl=${href}`;
        window.location.href = exitUrl;
    } else {
        getYnavi(to);
        next();
    }
};

router.beforeEach((to, from, next) => {
    isLogin(to, from, next);
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})