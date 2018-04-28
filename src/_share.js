// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import share from './share.vue'
import store from './store'
import router from './router/_share.js'
import { sync } from 'vuex-router-sync'
import VueEvents from 'vue-events'
import layer from './components/layer'

Vue.use(layer)
Vue.use(VueEvents)

sync(store, router);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(share)
})