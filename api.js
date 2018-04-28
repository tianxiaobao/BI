//express_demo.js 文件
var express = require('express');
var app = express();

var data = {};
data.data = [];
for(var i = 0; i < 222; i++){
	data.data[i] = {};
	data.data[i].tableName = 'tableName' + i;
	data.data[i].size = 12435;
	data.data[i].createdTime = 12424232000;
}
data.total = 222;

var reportlist = {};
reportlist.data = [];
for(var i = 0; i < 100; i++){
  reportlist.data[i] = {};
  reportlist.data[i].displayName = 'displayName' + i;
  reportlist.data[i].dbName = 'displayName' + i;
  reportlist.data[i].owner = 'jingdong_m';
  reportlist.data[i].dbId = 12424232000 + i;
  reportlist.data[i].isUse = true;
  reportlist.data[i].id = i;
}

var worksheet = {};
worksheet.data = {};
worksheet.data.folders = [];
worksheet.data.sheetList = [];
for(var i = 0; i < 3; i++) {
  worksheet.data.folders[i] = {};
  worksheet.data.folders[i].folderId = i;
  worksheet.data.folders[i].folderName = 'folderName' + i;
  for(var j = 0; j < 4; j++) {
    var index = i * 4 + j;
    worksheet.data.sheetList[index] = {};
    worksheet.data.sheetList[index].folderId = i;
    worksheet.data.sheetList[index].sheetId = i + 'folderId' + j;
    worksheet.data.sheetList[index].sheetName = i + 'sheetName ' + j;
    worksheet.data.sheetList[index].sheetType = j % 3;
  }
}
var sheet = {};
sheet.data = {};
sheet.data.headers = [1,2,3,4,5];
sheet.data.values = [];
for(var i = 0; i < 10; i++) {
  sheet.data.values[i] = [];
  for(var j = 0; j < 5; j++) {
    sheet.data.values[i][j] = j;
  }
}



 
app.use(function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "http://localhost:8090");
  	res.header("Access-Control-Allow-Credentials", true);
  	//res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});
app.get('/', function (req, res) {
   	res.send(JSON.stringify(data));
});
app.get('/database/list', function (req, res) {
    res.send(JSON.stringify(reportlist));
});
app.get('/database/delete', function (req, res) {
    res.send(JSON.stringify({code:0}));
});
app.post('/database/add', function (req, res) {
    res.send(JSON.stringify({code:0}));
});
app.get('/database/select', function (req, res) {
    res.send(JSON.stringify({data: ['displayName1', 'displayName2', 'hdufyeu']}));
});
app.get('/database/select', function (req, res) {
    res.send(JSON.stringify({data: ['displayName1', 'displayName2', 'hdufyeu']}));
});
app.get('/worksheet/list', function (req, res) {
    res.send(JSON.stringify(worksheet));
});
app.get('/sheet/preview', function (req, res) {
    res.send(JSON.stringify(sheet));
});

 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
