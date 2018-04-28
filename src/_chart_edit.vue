<style>
body {
    background-color: #ebf1f5 !important;
}

.worksheet-view{
    overflow: visible !important;
}

.fuild-list.view{
    top:200px !important;
}

.s-leftMenu {
    z-index: 0 !important;
    top: 63px !important;
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
       <chart-edit></chart-edit>    
  </div>
</template>

<script>
import './style/control0803.css'
import chartEdit from './views/dashboard/chart.vue'

export default {
    name: 'chart_edit',
    components:{
        chartEdit
    }
}
</script>
