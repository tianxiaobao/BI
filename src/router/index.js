import Vue from 'vue'
import Router from 'vue-router'

import datasource from './datasource'
import worksheet from './worksheet'
import dashboard from './dashboard'
import worksheetSql from './worksheetSql'
import worksheetView from './worksheetView'
// import addChart from './add-chart.js'


Vue.use(Router)

export default new Router({
    routes: [
        datasource,
        worksheet,
        dashboard,
        worksheetSql,
        worksheetView,
        // addChart,
        {
            path: '/',
            redirect: '/datasource'
        },
    ]
})