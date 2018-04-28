let table = {
    type : 'table',
    highlight:true, //控制是否点亮图标
    name : '交叉表',
    tips : '',
    chartOption : {}
};


let line = {
	type : 'line',
	highlight:true, //控制是否点亮图标
    name : '线性图',
    tips : '',
	chartOption : {
        title:{
            show : false,
            backgroundColor:'rgba(255, 255, 255, 0)',
            left:'left',
            text : '标题',
            textStyle:{
                color:'rgba(51, 51, 51, 1)',
                fontSize:18
            }
        },
        backgroundColor:'rgba(255, 255, 255, 0)',
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show:true,
            data:[], //  ---------->
            textStyle:{
                color:"rgba(0,0,0,1)",
                fontSize:12
            },
            top:'top',
            left:'left'
        },
        xAxis : {
            type : 'category',
            boundaryGap : false,
            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true
            },
            data : [] //  ---------->
        },
        tooltip : {
            trigger: 'axis'
        },
        yAxis : {
            type : 'value',
            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(204, 204, 204, 1)',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true
            },
        },
        extend:{ //扩展的额外属性
            serieObj:{
                type : 'line',
                name : '',
                data : []
            },
            series:[],

            yMarkLine: {
                silent: true,
                data: [{yAxis: 0}],
                symbol: '',
                label: {
                    normal: {
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        type: 'solid',
                        color: 'rgba(255, 0, 0, 1)',
                        opacity: 0
                    }
                }
            },
            label: {
                show: false,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                decimal: 0
            }
        },
        series : [] //  ---------->
    }
};

let area = {
    type : 'area',
    highlight:true, //控制是否点亮图标
    name : '面积图',
    tips : '',
    chartOption : {
        title:{
            show : false,
            backgroundColor:'rgba(255, 255, 255, 0)',
            left:'left',
            text : '标题',
            textStyle:{
                color:'rgba(51, 51, 51, 1)',
                fontSize:18
            }
        },
        backgroundColor:'rgba(255, 255, 255, 0)',
        xAxis : {
            type : 'category',
            boundaryGap : false,
            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true
            },
            data : [] //  ---------->
        },
        yAxis : {
            type : 'value',
            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(204, 204, 204, 1)',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show:true,
            data:[], //  ---------->
            textStyle:{
                color:"rgba(0,0,0,1)",
                fontSize:12
            },
            top:'top',
            left:'left'
        },
        extend:{ //扩展的额外属性
            serieObj:{
                type : 'line',
                stack: 'line',
                areaStyle: {normal: {}},
                name : '',
                data : []
            },
            series:[],
            yMarkLine: {
                silent: true,
                data: [{yAxis: 0}],
                symbol: '',
                label: {
                    normal: {
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        type: 'solid',
                        color: 'rgba(255, 0, 0, 1)',
                        opacity: 0
                    }
                }
            },
            label: {
                show: false,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                decimal: 0
            }
        },
        series : [] //  ---------->
    }
};

let bar  = {
    type : 'bar',
    highlight:true, //控制是否点亮图标
    name : '柱状图',
    tips : '',
    chartOption : {

        title:{
            show : false,
            backgroundColor:'rgba(255, 255, 255, 0)',
            left:'left',
            text : '标题',
            textStyle:{
                color:'rgba(51, 51, 51, 1)',
                fontSize:18
            }
        },
        backgroundColor:'rgba(255, 255, 255, 0)',

        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show:true,
            data:[], //  ---------->
            textStyle:{
                color:"rgba(0,0,0,1)",
                fontSize:12
            },
            top:'top',
            left:'left'
        },
        xAxis : {
            type : 'category',

            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true,

                alignWithLabel: true
            },
            data : [] //  ---------->
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis : {
            type : 'value',
            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(204, 204, 204, 1)',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true
            }
        },
        extend:{ //扩展的额外属性
           serieObj:{
                type : 'bar',
                name : '',
                data : []
           },
           series:[],
           yMarkLine: {
                silent: true,
                data: [{yAxis: 0}],
                symbol: '',
                label: {
                    normal: {
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        type: 'solid',
                        color: 'rgba(255, 0, 0, 1)',
                        opacity: 0
                    }
                }
            },
            label: {
                show: false,
                fontSize: 12,
                color: 'rgba(255, 255, 255, 1)',
                decimal: 0
            }
        },
        series : [] //  ---------->
    }
};

let colBar  = {
    type : 'colBar',
    highlight:true, //控制是否点亮图标
    name : '条形图',
    tips : '',
    chartOption : {
        title:{
            show : false,
            backgroundColor:'rgba(255, 255, 255, 0)',
            left:'left',
            text : '标题',
            textStyle:{
                color:'rgba(51, 51, 51, 1)',
                fontSize:18
            }
        },
        backgroundColor:'rgba(255, 255, 255, 0)',

        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show:true,
            data:[], //  ---------->
            textStyle:{
                color:"rgba(0,0,0,1)",
                fontSize:12
            },
            top:'top',
            left:'left'
        },
        xAxis : {
            type : 'value',
            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(204, 204, 204, 1)',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true
            }
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis : {
            type : 'category',
            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true,

                alignWithLabel: true
            },
            data : [] //  ---------->
        },
        extend:{ //扩展的额外属性
           serieObj:{
                type : 'bar',
                name : '',
                data : []
           },
           series:[],
           xMarkLine: {
                silent: true,
                data: [{xAxis: 0}],
                symbol: '',
                label: {
                    normal: {
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        type: 'solid',
                        color: 'rgba(255, 0, 0, 1)',
                        opacity: 0
                    }
                }
            },

            label: {
                show: false,
                fontSize: 12,
                color: 'rgba(255, 255, 255, 1)',
                decimal: 0
            }
        },
        series : [] //  ---------->
    }
};

let stackBar  = {
    type : 'stackBar',
    highlight:true, //控制是否点亮图标
    name : '堆叠柱状图',
    tips : '',
    chartOption : {
        title:{
            show : false,
            backgroundColor:'rgba(255, 255, 255, 0)',
            left:'left',
            text : '标题',
            textStyle:{
                color:'rgba(51, 51, 51, 1)',
                fontSize:18
            }
        },
        backgroundColor:'rgba(255, 255, 255, 0)',

        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show:true,
            data:[], //  ---------->
            textStyle:{
                color:"rgba(0,0,0,1)",
                fontSize:12
            },
            top:'top',
            left:'left'
        },
        xAxis : {
            type : 'category',

            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true,

                alignWithLabel: true
            },
            data : [] //  ---------->
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        yAxis : {
            type : 'value',
            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(204, 204, 204, 1)',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {
                show: true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true
            }
        },
        extend:{ //扩展的额外属性
           serieObj:{
                type : 'bar',
                name : '',
                stack: 'bar',
                data : []
           },
           series:[],
           yMarkLine: {
                silent: true,
                data: [{yAxis: 0}],
                symbol: '',
                label: {
                    normal: {
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        type: 'solid',
                        color: 'rgba(255, 0, 0, 1)',
                        opacity: 0
                    }
                }
            },
            label: {
                show: false,
                fontSize: 12,
                color: 'rgba(255, 255, 255, 1)',
                decimal: 0
            }
        },
        series : [] //  ---------->
    }
};

let pie  = {
    type : 'pie',
    highlight:true, //控制是否点亮图标
    name : '饼图',
    tips : '',
    chartOption : {
        title:{
            show : false,
            backgroundColor:'rgba(255, 255, 255, 0)',
            left:'left',
            text : '标题',
            textStyle:{
                color:'rgba(51, 51, 51, 1)',
                fontSize:18
            }
        },
        backgroundColor:'rgba(255, 255, 255, 0)',
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show:true,
            data:[], //  ---------->
            textStyle:{
                color:"rgba(0,0,0,1)",
                fontSize:12
            },
            top:'top',
            left:'left'
        },
        tooltip : {
            trigger: 'item',
            formatter: function (params) {
                return `${params.marker}${params.name} : ${params.value} (${params.percent}%)`
            }
        },
       
        extend:{ //扩展的额外属性
           serieObj:{
                type : 'pie',
                name : '',
                itemStyle: {
                   emphasis: {
                       shadowBlur: 10,
                       shadowOffsetX: 0,
                       shadowColor: 'rgba(0, 0, 0, 0.5)'
                   }
                },
                data : []
           },
           series:[],
            label: {
                show: false,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                decimal: 0,
                type:'name'
            },
        },
        series : [] //  ---------->
    }
};

let funnel  = {
    type : 'funnel',
    highlight:true, //控制是否点亮图标
    name : '漏斗图',
    tips : '',
    chartOption : {
        backgroundColor:'rgba(255, 255, 255, 0)',
        title:{
            show : false,
            backgroundColor:'rgba(255, 255, 255, 0)',
            left:'left',
            text : '标题',
            textStyle:{
                color:'rgba(51, 51, 51, 1)',
                fontSize:18
            }
        },
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show:true,
            data:[], //  ---------->
            textStyle:{
                color: 'rgba(0,0,0,1)',
                fontSize:12
            },
            top:'top',
            left:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: function (params) {
                return `${params.marker}${params.name} : ${params.value} (${params.percent}%)`
            }
        },
        extend:{ //扩展的额外属性
            serieObj:{
                type : 'funnel',
                name : '',
                data : []
            },
            label: {
                show: true,
                fontSize: 12,
                color: 'rgba(255, 255, 255, 1)',
                decimal: 0
            },
           series:[],
        },
        series : [] //  ---------->
    }
};

let scatter  = {
    type : 'scatter',
    highlight:true, //控制是否点亮图标
    name : '散点图',
    tips : '',
    chartOption : {
        backgroundColor:'rgba(255, 255, 255, 0)',
        title:{
            show : false,
            backgroundColor:'rgba(255, 255, 255, 0)',
            left:'left',
            text : '标题',
            textStyle:{
                color:'rgba(51, 51, 51, 1)',
                fontSize:18
            }
        },
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show:true,
            data:[], //  ---------->
            textStyle:{
                color:"rgba(0,0,0,1)",
                fontSize:12
            },
            top:'top',
            left:'left'
        },
        tooltip : {
           trigger: 'item',
       },
       xAxis : {
        type : 'value',
        name: '',
        nameTextStyle: {
            fontSize: 12,
            color: 'rgba(51, 51, 51, 1)',
            padding: [0, 0, 0, 0]
        },
        axisLabel: {
            show: true,
            fontSize: 12,
            color: 'rgba(51, 51, 51, 1)',
            formatter: function(value) {
                const valueNumber = Number(value);
                if (Number.isNaN(valueNumber)) {
                    return value;
                } else {
                    return valueNumber.toFixed(0);
                }
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                width: 1,
                color: 'rgba(51, 51, 51, 1)'
            }
        },
        axisTick: {
            show: true
        },
        data : [] //  ---------->
        },
        yAxis : {
            type : 'value',
            name: '',
            nameTextStyle: {
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                padding: [0, 0, 0, 0]
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(204, 204, 204, 1)',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {
                show:true,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                formatter: function(value) {
                    const valueNumber = Number(value);
                    if (Number.isNaN(valueNumber)) {
                        return value;
                    } else {
                        return valueNumber.toFixed(0);
                    }
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: 'rgba(51, 51, 51, 1)'
                }
            },
            axisTick: {
                show: true
            },
        },
        extend:{ //扩展的额外属性
            serieObj:{
                type : 'scatter',
                name : '',
                label: {},
                data : []
            },
            series:[],
            yMarkLine: {
                silent: true,
                data: [{yAxis: 0}],
                symbol: '',
                label: {
                    normal: {
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        type: 'solid',
                        color: 'rgba(255, 0, 0, 1)',
                        opacity: 0
                    }
                }
            },
            xMarkLine: {
                silent: true,
                data: [{xAxis: 0}],
                symbol: '',
                label: {
                    normal: {
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        width: 1,
                        type: 'solid',
                        color: 'rgba(255, 0, 0, 1)',
                        opacity: 0
                    }
                }
            },
            label: {
                show: false,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                decimal: 0,
                type: 'coords2d',
                position: 'top'
            },
        },
        series : [] //  ---------->
    }
};

let radar  = {
    type : 'radar',
    highlight:true, //控制是否点亮图标
    name : '雷达图',
    tips : '',
    chartOption : {
        backgroundColor:'rgba(255, 255, 255, 0)',
        title:{
            show : false,
            backgroundColor:'rgba(255, 255, 255, 0)',
            left:'left',
            text : '标题',
            textStyle:{
                color:'rgba(51, 51, 51, 1)',
                fontSize:18
            }
        },
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show:true,
            data:[], //  ---------->
            textStyle:{
                color:'rgba(0,0,0,1)',
                fontSize:12
            },
            top:'top',
            left:'left'
        },
        tooltip: {},
        radar: {
            name:{
                // formatter:'{value}',
                show:true,
                textStyle: {
                    color:'#72ACD1',
                    fontSize:12
                }
            },
            indicator: [],// 
            startAngle: 90,
            shape: 'circle',
            axisLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(76, 79, 82, 0.28)',
                    width: 1,
                },
            },
            axisTick: {
                show: false
            },
        },
        extend:{ //扩展的额外属性
            serieObj:{
                type : 'radar',
                name : '',
                data : []
            },
            label: {
                show: false,
                fontSize: 12,
                color: 'rgba(51, 51, 51, 1)',
                decimal: 0,
            },
            series:[]
        },
        series : [] //  ---------->
    }
};


export {
    table,
    line,
    area,
    bar,
    colBar,
    stackBar,
    pie,
    funnel,
    scatter,
    radar,
}

