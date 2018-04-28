let exampleData = {
	headers: [
      	'num','num1','num2','num3','week','x','y'
    ],
    values: [
      [
        5 ,     6   ,   7   , 8   ,  '周一', 'x1' ,'y1'
      ],
      [
        9 ,     8   ,   17   , 6   ,  '周一', 'x2','y2'
      ],
      [
        5 ,     7   ,   27   , 18   , '周二', 'x3','y3'
      ],
      [
        8 ,     11   ,   37   , 12   , '周二', 'x4','y4'
      ],
      [
        2 ,     16   ,   8   , 11   ,  '周三', 'x5','y5'
      ],
      [
        15 ,     9   ,   7   , 8   ,  '周三', 'x1','y6'
      ],
      [
        6 ,     3   ,   10   , 3   ,  '周四', 'x2','y7'
      ],
      [
        8 ,     6   ,   17   , 6   ,  '周四', 'x3','y8'
      ],
      [
        7 ,     7   ,   8   , 18   ,  '周五', 'x4','y9'
      ],
      [
        5 ,     6   ,   7   , 9   ,  '周五', 'x5','y10'
      ]
    ],
    week : ['周一','周二','周三','周四','周五']
};


const defaultColor = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', 
 '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
	
let tmpColorArr = [];
function setSeriesColor(chart,index,name){
	if( 0 == index){
		tmpColorArr = [];
	}
	let option = chart.chartOption;
	let extendSeries = option.extend.series;
	tmpColorArr[index] = extendSeries[index] ? 
						 extendSeries[index] :
						 {
						 	color : defaultColor[index % defaultColor.length],
						 	name : name 
						 }

};


let transformData = {

	transform(chart,zb,wd,data){

		let option = chart.chartOption;
		let serieObj = option.extend.serieObj;
		let {headers,values} = data;
		let series = [];

		let zbTem = [];
		zb.forEach(function(item,index) {
			let temObj = $.extend(true,{},serieObj);
			temObj.name = item;
			zbTem.push({
				name : item,
				index : headers.indexOf(item),
				data : temObj.data
			})
			setSeriesColor(chart,index,temObj.name);
			series.push(temObj);
		});
		option.extend.series = tmpColorArr; 
		let wdTem = [];
		wd.forEach( function(item) {
			wdTem.push({
				index : headers.indexOf(item),
				name : item
			})
		});

		let xAxis = [];

		values.forEach(function(item) {
			zbTem.forEach( function(val) {
				val.data.push(item[val.index]);
			});

			let name = '';
			wdTem.forEach( function(val, index) {
				if(index){
					name = name + '-' + item[val.index]
				}
				else{
					name += item[val.index];
				}
			});
			xAxis.push(name);
		});



		return {
			legendData : zb.slice(),
			xAxis,
			series
		}
	},

	transformContainSeries(chart,zb,wd,ser,data){

		let option = chart.chartOption;
		let serieObj = option.extend.serieObj;
		let {headers,values} = data;
		let series = [];

		let serie = ser[0];
		let serieindex = headers.indexOf(serie);

		let orderBy = data["seriesValue"];


		let orderByObjArr = [];
		let orderByObj = {};
		orderBy.forEach(function(v){
			let obj = {};
			obj.data =  orderByObj[v] = [];
			obj.name = v;
			orderByObjArr.push(obj);
		});

		values.forEach(function(item){
			orderByObj[item[serieindex]].push(item);
		})

		let wdTem = [];
		wd.forEach( function(item) {
			wdTem.push({
				index : headers.indexOf(item),
				name : item
			})
		});

		let xAxis = [];

		let legendData = [];

		let zbLen = zb.length;

		orderByObjArr.forEach(function(item1,index1){

			let zbTem = [];
			zb.forEach(function(item2,index2) {
				let temObj = $.extend(true,{},serieObj);
				temObj.name = item2 + '-' +item1.name;
				legendData.push(temObj.name);
				zbTem.push({
					name : item2,
					index : headers.indexOf(item2),
					data : temObj.data
				})
				setSeriesColor(chart,index1 * zbLen + index2,temObj.name);
				series.push(temObj);
			});

			item1.data.forEach(function(item2){
				let name = '';
				wdTem.forEach( function(val, index) {
					if(index){
						name = name + '-' + item2[val.index]
					}
					else{
						name += item2[val.index];
					}
				});
				if(xAxis.indexOf(name) == -1){
					xAxis.push(name);
				}

				zbTem.forEach( function(val) {
					val.data.push([name,item2[val.index]]);
				});

			})
		})

		option.extend.series = tmpColorArr; 
		return {
			legendData,
			xAxis,
			series
		}
	},

	pieKind(chart,zb,wd,data){

		let option = chart.chartOption;
		let serieObj = option.extend.serieObj;

		let xlen = wd.length;
		let {headers,values} = data;
		let temObj = $.extend(true,{},serieObj);
		let series = [temObj];
		let legendData = [];
		if(xlen){
			let xindex = headers.indexOf(wd[0]);
			let yindex = headers.indexOf(zb[0]);
			values.forEach(function(item,index) {
				temObj.data.push({
					value : item[yindex],
					name : item[xindex]
				});
				setSeriesColor(chart,index,item[xindex]);
				legendData.push(item[xindex]);
			});
		}
		else{
			zb.forEach(function(item,index){
				temObj.data.push({
					value : values[0][headers.indexOf(item)],
					name : item
				});
				setSeriesColor(chart,index,item);
			})
			legendData = zb.slice();
		}
		option.extend.series = tmpColorArr;
		return {
			series,
			legendData
		}


	},

	scatterKind(chart,zb,wd,data){

		let option = chart.chartOption;
		let serieObj = option.extend.serieObj;
		let {headers,values} = data;
		let temObj = $.extend(true,{},serieObj);
		let series = [temObj, {name: '', type: 'scatter', data: []}];

		setSeriesColor(chart,0,'系列');

		option.extend.series = tmpColorArr; 

		let arr = [].concat(zb,wd);

		let arrTem = [];
		arr.forEach(function(item) {
			arrTem.push({
				name : item,
				index : headers.indexOf(item)
			})
		});
		values.forEach(function(item){
			let arr = [];
			arrTem.forEach(function(ele){
				arr.push(item[ele.index]);
			});
			temObj.data.push(arr);
		});
		return {
			series,
			legendData:[]
		}
	},

	radarKind(chart,zb,wd,data){

		let option = chart.chartOption;
		let serieObj = option.extend.serieObj;
		let {headers,values} = data;
		let temObj = $.extend(true,{},serieObj);
		let series = [temObj];

		let xindex = headers.indexOf(wd[0]);
		let indicator = [];


		values.forEach(function(ele){
			indicator.push({name:ele[xindex]});
		});

		let arrTem = [];
		zb.forEach(function(item) {
			arrTem.push({
				name : item,
				index : headers.indexOf(item)
			})
		});

		let legendData = [];
		arrTem.forEach(function(item,index){
			let arr = [];
			values.forEach(function(ele){
				arr.push(ele[item.index]);
			});
			temObj.data.push({
				value : arr,
				name : item.name
			});
			setSeriesColor(chart,index,item.name);
			legendData.push(item.name)
		})

		option.extend.series = tmpColorArr;
		return {
			series,
			legendData,
			indicator
		}
	}
};

const grid = {
    left: '2%',
    right: '6%',
    bottom: '12%',
    containLabel: true
};
function staticDataChart(chart){
	let type = chart.type;
	let option = chart.chartOption;
	let data;
	option.grid = grid;
	switch (type) {
		case 'table':
			option.headers = exampleData.headers;
			option.values = exampleData.values;
			break;

		case 'line':
		case 'area':
		case 'bar':
		case 'stackBar':
			data = transformData.transform(chart,['num1','num2'],['y'],exampleData);
			// data = transformData.transformContainSeries(chart,['num1','num2'],['x'],['week'],exampleData);
			option.legend.data = data.legendData;
			option.xAxis.data = data.xAxis;
			option.series = data.series;
			break;
		case 'colBar':
			data = transformData.transform(chart,['num1','num2'],['y'],exampleData);
			option.legend.data = data.legendData;
			option.yAxis.data = data.xAxis;
			option.series = data.series;
			break;
		case 'pie':	
		case 'funnel':	
			data = transformData.pieKind(chart,['num1','num2','num3'],[],exampleData);
			option.legend.data = data.legendData;
			option.series = data.series;
			break;
		case 'scatter':	
			data = transformData.scatterKind(chart,['num1','num2'],['y'],exampleData);
			option.legend.data = data.legendData;
			option.series = data.series;
			break;
		case 'radar':	
			data = transformData.radarKind(chart,['num1','num2'],['y'],exampleData);
			option.legend.data = data.legendData;
			option.radar.indicator = data.indicator;
			option.series = data.series;
			break;			
		default:
			// statements_def
			break;
	}
}

function apiDataChart(currentChart,chartSaveJson,data){
	let chart = currentChart.chart;
	let type = chart.type;
	let option = chart.chartOption;
	let dim = chartSaveJson.dimensions;
	let cat = chartSaveJson.categories;
	let series = chartSaveJson.series;
	let wd = [];
	let zb = [];
	let s = [];
	let dataObj;
	option.grid = grid;

	dim.forEach( function(item) {
		wd.push(item.columnAlias);
	});

	cat.forEach( function(item) {
		zb.push(item.columnAlias);
	});

	series.forEach( function(item) {
		s.push(item.columnAlias);
	});

	switch (type) {
		case 'table':
			option.headers = data.headers;
			option.values = data.values;
			break;
		
		case 'line':
		case 'area':
		case 'bar':
		case 'stackBar':
			if(series.length){
				dataObj = transformData.transformContainSeries(chart,zb,wd,s,data);
			}
			else{
				dataObj = transformData.transform(chart,zb,wd,data);
			}
			option.legend.data = dataObj.legendData;
			option.xAxis.data = dataObj.xAxis;
			option.series = dataObj.series;
			break;
		case 'colBar':
			dataObj = transformData.transform(chart,zb,wd,data);
			option.legend.data = dataObj.legendData;
			option.yAxis.data = dataObj.xAxis;
			option.series = dataObj.series;
			break;
		case 'pie':	
		case 'funnel':	
			data = transformData.pieKind(chart,zb,wd,data);
			option.legend.data = data.legendData;
			option.series = data.series;
			break;
		case 'scatter':	
			data = transformData.scatterKind(chart,zb,wd,data);
			option.legend.data = data.legendData;
			option.series = data.series;
			break;
		case 'radar':	
			data = transformData.radarKind(chart,zb,wd,data);
			option.legend.data = data.legendData;
			option.radar.indicator = data.indicator;
			option.series = data.series;
			break;				
		default:
			// statements_def
			break;
	}

}

const labelFormatters = {
	value (extendLabel) {
		return `const value = Number(params.value);
		if(Number.isNaN(value)) {
			return params.value;
		} else {
			return value.toFixed(${extendLabel.decimal});
		}`;
	},
	coords2d (extendLabel) {
		return `const value = params.value;
		if(!Array.isArray(value)) {
			return value;
		} else {
			return value.map((val, idx) => {
				if(idx < 2) {
					const numVal = Number(val);
					if(!Number.isNaN(numVal)) {
						return numVal.toFixed(${extendLabel.decimal});
					}
				}
				return val;
			}).join(',');
		}`;
	},
	percent (extendLabel) {
		return `return params.percent.toFixed(${extendLabel.decimal}) + '%';`;
	},
	name (extendLabel) {
		return `return params.name;`;
	},
	name_percent (extendLabel) {
		return `return params.name + '(' + params.percent.toFixed(${extendLabel.decimal}) + '%)';`;
	}
}

const mergeFn = {
	assignLabel(extendLabel) {
		const label = {};
		['show', 'color', 'fontSize'].forEach(key => {
			label[key] = extendLabel[key];
		});
		const formatterBody = labelFormatters[extendLabel.type || 'value'](extendLabel);
		label.formatter = new Function('params', formatterBody);
		return {
			normal: label
		};
	},
	line(chart){
		let option = chart.chartOption;
		let extend = option.extend;
		let label = mergeFn.assignLabel(extend.label);
		extend.series.forEach(function(item,index){
			option.series[index].itemStyle = {
				normal : {
					color : item.color
				}
			};
			option.series[index].label = label;
		});
	},

	area(chart){
		let option = chart.chartOption;
		let extend = option.extend;
		let label = mergeFn.assignLabel(extend.label);
		extend.series.forEach(function(item, index){
			option.series[index].itemStyle = {
				normal : {
					color : item.color
				}
			};
			option.series[index].lineStyle = {
				normal : {
					color : item.color,
					width:2
				}
			};
			option.series[index].areaStyle = {
                normal: {
					color : item.color,
                    opacity: 0.1
                }
            };
			option.series[index].label = label;
		});
	},

	bar(chart){
		let option = chart.chartOption;
		let extend = option.extend;
		let label = mergeFn.assignLabel(extend.label);
		extend.series.forEach(function(item,index){
			option.series[index].itemStyle = {
				normal : {
					color : item.color
				}
			}
			option.series[index].label = label;
		});
	},
	colBar(chart){
		this.bar(chart);
	},
	stackBar(chart){
		this.bar(chart);
	},
	pie(chart){
       	let option = chart.chartOption;
		let extend = option.extend;
		let label = mergeFn.assignLabel(extend.label);
		extend.series.forEach(function(item,index){
			option.series[0].data[index].itemStyle = {
				normal : {
					color : item.color
				}
			};
		});
		option.series.forEach(item => {
			item.label = label;
		});
	},
	funnel(chart){
		let option = chart.chartOption;
		let extend = option.extend;
		let label = mergeFn.assignLabel(extend.label);
		label.normal.position = 'inside';
		extend.series.forEach(function(item, index){
			option.series[0].data[index].itemStyle = {
				normal : {
					color : item.color
				}
			};
		});
		option.series[0].label = label;
	},
	scatter(chart){
        let option = chart.chartOption;
		let extend = option.extend;
		let label = mergeFn.assignLabel(extend.label);
		extend.series.forEach(function(item,index){
			option.series[0].itemStyle = {
				normal : {
					color : item.color
				}
			};
			option.series[0].label = {
				normal : {
				show:false
			    }
		    };
		});
		option.series.forEach(item => {
			item.label = label;
			item.label.normal.position=extend.label.position;
		});
	},
	radar(chart){
       	let option = chart.chartOption;
		let extend = option.extend;
		let label = mergeFn.assignLabel(extend.label);
		extend.series.forEach(function(item,index){
			option.series[0].data[index].itemStyle = {
				normal : {
					color : item.color
				}
			};
			option.series[0].data[index].lineStyle = {
				normal : {
					color : item.color,
					width:2
				}
			};
			option.series[0].data[index].areaStyle = {
				normal : {
					color : item.color,
					opacity:0.1
				}
			};
		});
		option.series.forEach(item => {
			item.label = label;
		});

	}
};
function mergeExtend(chart){
	let type = chart.type;
	mergeFn.hasOwnProperty(type) && mergeFn[type](chart);
}














export { staticDataChart,apiDataChart,mergeExtend};