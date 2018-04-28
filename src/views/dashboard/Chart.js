import echarts from 'echarts'

function Chart() {};
Chart.__filter = function(type, header) {
        var i, item;
        var series = [];
        var xData = [];
        for (i = 0; i < header.length; i++) {
            item = header[i];
            if (item.to == 'y') {
                series.push({
                    name: item.name,
                    type: type,
                    data: Chart.data[item.name]
                })
            } else if (item.to == 'x') {
                var col = Chart.data[item.name];
                if (xData.length == 0) {
                    for (var j = 0; j < col.length; j++) {
                        xData[j] = col[j];
                    }
                } else {
                    for (var j = 0; j < col.length; j++) {
                        xData[j] += '-' + col[j];
                    }
                }
            }
        }

        return {
            series: series,
            xData: xData
        }
    }
    // 多维度 多指标
Chart.__createLine = function(chart, header) {
    var filter = Chart.__filter('line', header);
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            data: filter.xData
        },
        yAxis: {},
        series: filter.series
    };
    chart.setOption(option);
}

// 一个维度 多个指标
Chart.__createArea = function(chart, header) {
        var filter = Chart.__filter('line', header);
        var series = filter.series;
        var item, i;
        for (i = 0; i < series.length; i++) {
            item = series[i];
            item.stack = 'x';
            item.areaStyle = { normal: {} };
        }
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: filter.xData
            }],
            yAxis: [{
                type: 'value'
            }],
            series: series
        };
        chart.setOption(option);
    }
    // 
Chart.__createBar = function(chart, header) {
    var filter = Chart.__filter('bar', header);
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            data: filter.xData
        },
        yAxis: {},
        series: filter.series
    };
    chart.setOption(option);
}

// 一个维度 多个指标
Chart.__createColBar = function(chart, header) {
    var filter = Chart.__filter('bar', header);
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        yAxis: [{
            type: 'category',
            data: filter.xData
        }],
        xAxis: [{
            type: 'value'
        }],
        series: filter.series
    };
    chart.setOption(option);
}

//堆叠柱图 一个维度 多个指标
Chart.__createStackBar = function(chart, header) {
    var filter = Chart.__filter('bar', header);
    var series = filter.series;
    var i, item;
    for (i = 0; i < series.length; i++) {
        item = series[i];
        item.stack = 'x'
    }
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        xAxis: [{
            type: 'category',
            data: filter.xData
        }],
        yAxis: [{
            type: 'value'
        }],
        series: series
    };
    chart.setOption(option);
}


//一个维度 2个指标
Chart.__createScatter = function(chart, header) {
    var i, item;
    var data = [];
    var arrx = [];
    var arry = [];
    for (i = 0; i < header.length; i++) {
        item = header[i];
        if (item.to == 'x') {
            arrx.push(item.name)
        } else if (item.to == 'y') {
            arry.push(item.name)
        }
    }
    arry = arry.concat(arrx);

    var index0 = Chart.data[arry[0]];

    for (i = 0; i < index0.length; i++) {
        var arr = [];
        for (var j = 0; j < arry.length; j++) {
            arr.push(Chart.data[arry[j]][i])
        }
        data.push(arr);
    }
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: function(paras) {
                var data = paras.data;
                var str = '';
                for (var i = 0; i < data.length; i++) {
                    str += arry[i] + ":" + data[i] + '<br />';
                }
                return str;
            }
        },

        xAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            scale: true
        },
        series: [{
            data: data,
            type: 'scatter',
        }]
    };
    chart.setOption(option);
}
Chart.__filterPieClass = function(header) {
    var arrX = [];
    var arry = [];
    var data = [];
    var i, item;

    for (i = 0; i < header.length; i++) {
        item = header[i];
        if (item.to == 'x') {
            arrX = Chart.data[item.name];
        } else if (item.to == 'y') {
            arry.push(item.name);
        }
    }

    if (arrX.length) {
        arry = Chart.data[arry[0]];
        for (i = 0; i < arrX.length; i++) {
            data.push({
                value: arry[i],
                name: arrX[i]
            })
        }
    } else {
        for (i = 0; i < arry.length; i++) {
            data.push({
                value: Chart.data[arry[i]][0],
                name: arry[i]
            })
        }
    }

    return data;
}

//
Chart.__createPie = function(chart, header) {

    var data = Chart.__filterPieClass(header);


    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
            // name: zhiBiaoArr[0],
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: data,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    chart.setOption(option);
}


//
Chart.__createFunnel = function(chart, header) {
    var data = Chart.__filterPieClass(header);
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },

        calculable: true,
        series: [{
            // name:'漏斗图',
            type: 'funnel',
            left: '10%',
            top: 60,
            //x2: 80,
            bottom: 60,
            width: '80%',
            // height: {totalHeight} - y - y2,
            // min: 0,
            // max: 100,
            // minSize: '0%',
            // maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                },
                emphasis: {
                    textStyle: {
                        fontSize: 20
                    }
                }
            },
            labelLine: {
                normal: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            data: data
        }]
    };
    chart.setOption(option);
}


//1个维度 3个以上指标
Chart.__createRadar = function(chart, header) {
    var i, item;
    var arrx;
    var arry = [];
    for (i = 0; i < header.length; i++) {
        item = header[i];
        if (item.to == 'x') {
            arrx = Chart.data[item.name];
        } else if (item.to == 'y') {
            arry.push(item.name);
        }
    }
    var indicator = [];
    var data = [];
    for (var i = 0; i < arrx.length; i++) {
        indicator.push({
            name: arrx[i]
        })
    }

    for (i = 0; i < arry.length; i++) {
        data.push({
            value: Chart.data[arry[i]],
            name: arry[i]
        })
    }
    var option = {
        tooltip: {},
        radar: {
            // shape: 'circle',
            indicator: indicator
        },
        series: [{
            name: '预算 vs 开销（Budget vs spending）',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: data
        }]
    };
    chart.setOption(option);
}



Chart.setData = function(data) {
    var header = data.headers;
    var values = data.values;
    var obj = {};
    var i, j, item;
    for (i = 0; i < header.length; i++) {
        obj[header[i]] = [];
    }
    for (i = 0; i < values.length; i++) {
        item = values[i];
        for (j = 0; j < item.length; j++) {
            obj[header[j]].push(item[j]);
        }
    }
    Chart.data = obj;
};


Chart.create = function(id, type, header) {

    var ele = $(id).get(0);

    var chart = echarts.getInstanceByDom(ele);

    if (!chart) {
        chart = echarts.init(ele);
    }

    switch (type) {
        case 'line':
            chart.clear();
            this.__createLine(chart, header);
            break;
        case 'bar':
            chart.clear();
            this.__createBar(chart, header);
            break;

        case 'pie':
            chart.clear();
            this.__createPie(chart, header);
            break;
        case 'funnel':
            chart.clear();
            this.__createFunnel(chart, header);
            break;
        case 'scatter':
            chart.clear();
            this.__createScatter(chart, header);
            break;
        case 'radar':
            chart.clear();
            this.__createRadar(chart, header);
            break;
        case 'area':
            chart.clear();
            this.__createArea(chart, header);
            break;
        case 'colBar':
            chart.clear();
            this.__createColBar(chart, header);
            break;
        case 'stackBar':
            chart.clear();
            this.__createStackBar(chart, header);
            break;


    }
    return true;
}



export default Chart