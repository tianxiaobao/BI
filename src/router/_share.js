import Vue from 'vue'
import Router from 'vue-router'

import chart_share from './chart-share.js'
import report_share from './report-share.js'


Vue.use(Router)

export default new Router({
    routes: [
        chart_share,
        report_share,
        {
            path: '/',
            redirect: '/chart-share'
        },
    ]
})