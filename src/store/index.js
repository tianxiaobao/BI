import Vue from 'vue'
import Vuex from 'vuex'

import common from './modules/common'
import dashboard from './modules/dashboard'
import datasource from './modules/datasource'
import worksheet from './modules/worksheet'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    actions: {},
    mutations: {},
    getters: {},
    modules: {
        common,
        dashboard,
        datasource,
        worksheet,
    }
})