<style lang="less">
.charts-panel {
    width: 250px;
    min-height: 50px;
    background-color: #fff;
    color: #000;
    position: absolute;
    top: 38px;
    left: -15px;
    z-index: 11;
    border: 1px solid #eee;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    padding-top: 10px;
}

.bi-list.chart-list li {
    float: left;
    margin: 0 10px 10px;
}
.chart-list {
    width: 100%;
    height: 100%;
}
.not-charts .charts-panel {
    left: -98px;
}
</style>
<template>
    <div class="charts-panel" @click.stop.prevent="stop($event)">
        <ul class="bi-list chart-list">
            <li v-for="chart of chartKind" :title="chart.name" 
            :class="[chart.type, chart.highlight ? 'highlight' : '']"  @click.stop.prevent="add(chart)">
            </li>
        </ul>
    </div>
</template>
<script>
import * as chartKind from '@/views/dashboard/chartKind.js';
export default {
    name: 'charts-panel',
    data () {
        return {
            chartKind
        };
    },
    methods: {
        stop (event) {
            event.stopPropagation();
        },
        add (chart) {
            this.$emit('change', chart);
        }
    }
};
</script>