import * as chartKind from '@/views/dashboard/chartKind.js'

function initMarkLine (chart) {
    const series = chart.chartOption.series;
    const extend = chart.chartOption.extend;

    switch(chart.type) {
        case 'line': case 'area': case 'bar': case 'stackBar': 
            series[0].markLine = extend.yMarkLine;
        break;
        case 'colBar': 
            series[0].markLine = extend.xMarkLine;
        break;
        case 'scatter':
            series[0].markLine = extend.yMarkLine;
            series[1].markLine = extend.xMarkLine;
        break;
    }
}

export default initMarkLine;