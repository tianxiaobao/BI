// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './_chart_edit.vue'
import store from './store'
import Cookies from 'js-cookie'
import VueEvents from 'vue-events'
import layer from './components/layer'

Vue.config.productionTip = false

Vue.use(layer)

Vue.use(VueEvents)

const isLogin = (to, from, next) => {
    const userName = Cookies.get('pin');
    const href = window.location.href;
    if(!userName) {
        const exitUrl = `http://uc.jcloud.com/login?returnUrl=${href}`;
        window.location.href = exitUrl;
    } 
};

isLogin();



/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    render: h => h(App)
})