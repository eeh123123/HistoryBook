var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql'); //Mysql的模块
var multer = require('multer'); //文件上传模块
var http = require('http');
var bodyparser = require('body-parser'); // 添加post解析
var upload = multer();
var fs = require('fs');

var history = require('connect-history-api-fallback');
app.use(history());

//1 连接数据库
//createConnection(哪台服务器, 用户名, 密码, 库)
var db = mysql.createPool({
	host: '49.235.128.250',
	user: 'root',
	password: '123',
	database: 'lileiguan',
	useConnectionPooling: true
});

app.use(bodyparser.urlencoded({
	extended: false
}))
// parse application/json
app.use(bodyparser.json())

app.use(upload.single('file')); //此名需要同html input name的formedata一致否则会报错

var iconv = require('iconv-lite');
var filename = "";

//3 调用自定义组件
var define = require('./define.js');
var Func = require('./Func.js');

var __dirname_mine = define.Get_Dirname();

app.use(express.static(__dirname_mine));

//5 设置可以跨域
app.all("*", function(req, res, next) {
	//设置允许跨域的域名，*代表允许任意域名跨域
	res.header("Access-Control-Allow-Origin", "*");
	//允许的header类型
	res.header("Access-Control-Allow-Headers", "content-type,Access-Token,authorization");
	//跨域允许的请求方式 
	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
	res.header("Content-Type", "application/json;charset=utf-8");
	//res.header('Content-Type', 'text/plain; charset=utf-8');
	
	filename = req.url.split('/')[req.url.split('/').length - 1];
	var suffix = req.url.split('.')[req.url.split('.').length - 1];
	if(req.url.substring(0, 8) == "/upload/") {
		res.writeHead(200, {
			'Content-Type': 'image/' + suffix
		});
		res.end(Func.get_file_content(path.join(__dirname,'upload', filename)));
	}
	if(req.method.toLowerCase() == 'options')
		res.send(200); //让options尝试请求快速结束
	else
		next();
});

//6 抛异常的函数
process.on('uncaughtException', function(err) {
	console.log(err);
});
http.createServer(function(req, res) {
	try {
		mvcHandler(req, res);
	} catch(e) {
		res.writeHead(200);
		res.end('Server Error');
	}
}).listen(8084, "127.0.0.1");

//7 文件上传
app.post('/up', function(req, res) {
	console.log("/up:req.body=");
	console.log(req.body)
	//为了避免文件重复,随机文件名称
	function sj() {
		var a = ["a", "b", "c", "d", "e", 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', '1', '2', '3', '4', '5', '6', '7', '8', '9']
		var sj = '';
		for(var i = 0; i < a.length; i++) {
			sj += a[Math.ceil(Math.random() * 22)]
		}
		return sj;
	}
	if(req.file.originalname) {
		var filename = req.file.originalname;
		var index = filename.lastIndexOf('.'); //获取文件后缀
		var filename_ = sj() + filename.substring(index); //最终的文件名称

		fs.writeFile("./upload/" + filename_, req.file.buffer, function(err) {
			if(err) {
				console.log("/up:err=" + err);
			} else {
				console.log("写入文件成功");
				res.send({
					text: '上传成功',
					status: 'success',
					filename: filename_
				});  
			}
		});
	}
});

//8 登录接口
app.get('/Login.do', function(req, res) {
	console.log("当前登陆时间：" + Func.getNowFormatDate());
	console.log(req.query);
	var loginsql = "SELECT * FROM SSF_USERS WHERE USER_NAME='" + req.query.username + "'";
	console.log(loginsql);
	db.query(loginsql, (err, data) => {
		var string = JSON.stringify(data);
		var jsondata = JSON.parse(string);
		if(jsondata.length == "0") {
			res.send({
				rows: 0,
				text: "登陆失败，无此用户"
			});
		} else if(jsondata.length == "1") {
			if(jsondata[0].USER_PASSWORD == req.query.password) {
				res.send({
					rows: 1,
					text: "登陆成功"
				});
			} else {
				res.send({
					rows: -1,
					text: "密码错误"
				});
			}
		}
	});
});

//9 注册接口
app.get('/Register.do', function(req, res) {
	console.log(req.query);
	//query(干啥, 回调)
	var registersql = "INSERT INTO ssf_users (USER_NAME,USER_PASSWORD) VALUES ('" + req.query.username + "','" + req.query.password + "')";
	console.log(registersql);
	db.query(registersql, (err, data) => {
		if(err) {
			res.send({
				rows: "0",
				text: "注册失败" + err
			});
		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string)
			if(data.affectedRows == "1") {
				res.send({
					rows: data.affectedRows,
					text: "注册成功"
				});
			} else {
				res.send({
					rows: 0,
					data: jsondata
				});
			}
		}
	});
});

//10 查询物品
app.get('/SearchNow.do', function(req, res) {
	var wupin = req.query.wupin;
	var array = [];
	var SearchNow_sql = "SELECT * FROM TLBB WHERE SHIJIAN = (SELECT MAX(SHIJIAN) FROM TLBB) AND WUPIN='" + wupin + "'";
	console.log(SearchNow_sql);
	db.query(SearchNow_sql, (err, data) => {
		if(err) {
			res.send("查询失败" + err);
		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string)
			res.send(jsondata);
		}
	});
});

//11 查询物品，模糊查询
app.get('/SearchLike.do', function(req, res) {
	var wupin = req.query.wupin;
	var array = [];
	var SearchLike_sql = "SELECT DISTINCT WUPIN FROM TLBB_ZB WHERE WUPIN LIKE '%" + wupin + "%'";
	console.log(SearchLike_sql);
	db.query(SearchLike_sql, (err, data) => {
		if(err) {
			res.send("查询失败" + err);
		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string)
			res.send(jsondata);
		}
	});
});

//12 查询物品，查询Echarts折线图
app.get('/SearchAxis.do', function(req, res) {
	var wupin = req.query.wupin;
	var array = [];
	var SearchLike_sql = "SELECT * FROM TLBB_ZB WHERE WUPIN = '" + wupin + "' ORDER BY FILENAME";
	console.log(SearchLike_sql);
	db.query(SearchLike_sql, (err, data) => {
		if(err) {
			res.send("查询失败" + err);
		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string)
			res.send(jsondata);
		}
	});
});

//13 查询大区信息
app.get('/SearchDaQu.do', function(req, res) {
	var SearchDaQu_sql = "SELECT DISTINCT(DaQu) FROM FWQ";
	console.log(SearchDaQu_sql);
	db.query(SearchDaQu_sql, (err, data) => {
		if(err) {
			res.send("查询失败" + err);
			res.send("查询失败" + err);
		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string)
			res.send(jsondata);
		}
	});
});

//14 查询服务器信息
app.get('/SearchFWQ.do', function(req, res) {
	var SearchFWQ_sql = "SELECT CONCAT(DaQu,':',FWQ) AS information,FWQ,DaQu FROM FWQ";
	if(req.query.name != undefined) {
		SearchFWQ_sql += " WHERE FWQ LIKE '%" + req.query.name + "%'"
	}
	console.log(SearchFWQ_sql);
	db.query(SearchFWQ_sql, (err, data) => {
		if(err) {
			res.send("查询失败" + err);
		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string)
			res.send(jsondata);
		}
	});
});

//15 读取物价信息文件
app.get('/read.do', function(req, res) {
	filename = req.query.filename;
	savename = req.query.savename;
	Sql_Select = "SELECT * FROM FILE WHERE FILENAME='" + savename + "'";
	db.query(Sql_Select, (err, data) => {
		if(err) {
			console.log('SELECT ERROR - ', err.message);
			console.log(Sql_ZB);
			return;
		}
		if(data.length != "0") {
			res.send("数据库已有此文件");
			return;
		}
		console.log(data.length);
		if(data.length == "0") {
			var data = fs.readFileSync("upload/" + filename);
			filename = req.query.savename; //读取完文件数据后再把文件名转换过来。
			var buff = new Buffer(data, 'binary');
			var str = iconv.decode(buff, 'gbk');
			var array = []; //总数组，每个数组存放的是 1种 商品的信息
			str = str.replace(/\"/g, "");
			str = str.replace(/.000000/g, "");
			var shijian = Func.JieQu(str, "统计时间：", "，by");
			var shijian_cal = filename.substring(0, 14);
			array = str.split("\r\n\r\r\n");
			var array_son = []; //子数组，每个数组存放的是1件 商品的信息
			console.log("第一个商品：");
			console.log(array[1]);

			var Sql_InSert = "INSERT INTO FILE(SAVETIME,FILENAME)VALUES ?";
			var File_values = [
				[Func.getNowFormatDate(), savename]
			];
			db.query(Sql_InSert, [File_values], function(err, rows, fields) {
				if(err) {
					console.log('INSERT ERROR - ', err.message);
					console.log(Sql_InSert);
					console.log(File_values);
					return;
				}
				console.log("INSERT SUCCESS");
			});

			var values = [];
			var Value_ZB = [];
			for(var i = 1; i < array.length; i++) {
				values = [];
				array_son = array[i].split("array");
				var number_ObjName = array[i].indexOf("=>"); //商品名的下标
				console.log("number_ObjName:");
				console.log(number_ObjName);
				var ObjName = array[i].substring(0, number_ObjName); //物品名
				console.log("物品名:");
				console.log(ObjName);

				var ZongJia = Func.JieQu(array[i], "总价：", "，总量"); //总价
				var ZongLiang = Func.JieQu(array[i], "总量：", "，均价"); //总量
				var JunJia = Func.JieQu(array[i], "均价：", "\r"); //均价
				var DangQsj = Func.getNowFormatDate(); //当前时间
				var lee = "单价=";
				var lee2 = ",摊主";
				var ZuiDiJia = Func.JieQu(array[i], lee, lee2);
				for(var j = 1; j < array_son.length; j++) {
					var son_name = Func.JieQu(array_son[j], "物品=", ",数量"); //子表的物品名
					var son_ShuL = Func.JieQu(array_son[j], "数量=", ",价格"); //子表的数量
					var son_JiaG = Func.JieQu(array_son[j], "价格=", ",单价"); //子表的价格
					var son_DanJ = Func.JieQu(array_son[j], "单价=", ",摊主"); //子表的单价
					var son_TanZ = Func.JieQu(array_son[j], "摊主=", ",摊位"); //子表的摊主
					var son_TanW = Func.JieQu(array_son[j], "摊位=", ",地图"); //子表的摊位
					var son_DiT = Func.JieQu(array_son[j], "地图=", ",x"); //子表的地图
					var son_X = Func.JieQu(array_son[j], "x=", ",y"); //子表的x
					var son_Y = Func.JieQu(array_son[j], "y=", ")\r"); //子表的y
					if(j == 1) {
						var wupin = son_name; //物品名
						var zdsl = son_ShuL; //最低价格的数量
						var tanzhu = son_TanZ; //最低价格的摊主
						var tanwei = son_TanW; //最低价格的摊位
						var ditu = son_DiT; //最低价格的地图
						var zuobiao = "(" + son_X + "," + son_Y + ")"; //最低价格的坐标
					}
					values.push(
						[son_name, son_ShuL, son_JiaG, son_DanJ, son_TanZ, son_TanW, son_DiT, "(" + son_X + "," + son_Y + ")", shijian, filename, shijian_cal]
					);
					console.log(values);
				}
				var sonsql = "INSERT INTO TLBB(WUPIN,SHUL,JIAG,DANJ,TANZHU,TANWEI,DITU,ZUOBIAO,SHIJIAN,FILENAME,SHIJIAN_CAL) VALUES ?"
				db.query(sonsql, [values], function(err, rows, fields) {
					if(err) {
						console.log('INSERT ERROR - ', err.message);
						console.log(sonsql);
						console.log(values);
						return;
					} else {
						console.log(sonsql);
						console.log(values);
						console.log("INSERT SUCCESS");
					}
				});
				Value_ZB.push([ZuiDiJia, JunJia, zdsl, shijian, wupin, tanzhu, tanwei, ditu, zuobiao, filename, shijian_cal]);
			}
			var Sql_ZB = "INSERT INTO TLBB_ZB(ZUIDIJIA,PINGJUNJIA,ZDSL,SHIJIAN,WUPIN,TANZHU,TANWEI,DITU,ZUOBIAO,FILENAME,SHIJIAN_CAL) VALUES ?"
			db.query(Sql_ZB, [Value_ZB], function(err, rows, fields) {
				if(err) {
					console.log('INSERT ERROR - ', err.message);
					console.log(Sql_ZB);
					console.log(Value_ZB);
					return;
				}
				console.log("INSERT SUCCESS");
				chaxun(res);
			});

		}
	});
});

//16 查询函数
function chaxun(res) {
	console.log("查询");
	var txtdata = ""; //写入txt文本的内容
	var select_sql = "SELECT WUPIN,ZUIDIJIA AS JIAGE FROM TLBB_ZB WHERE FILENAME ='" + filename + "'" + "ORDER BY CAST(ZUIDIJIA AS DECIMAL(9,2))DESC";
	db.query(select_sql, (err, data) => {
		if(err) {
			console.log('查询失败', err);
		} else {
			console.log(JSON.stringify(data));
			console.log(select_sql);
			console.log(data[0].WUPIN);
			for(var i = 0; i < data.length; i++) {
				txtdata += data[i].WUPIN + "=" + data[i].JIAGE + "|";
			}
			txtdata = txtdata.substring(0, txtdata.length - 1);

			console.log("txtdata==");
			console.log(txtdata);
			fs.writeFile('./answer.txt', txtdata, {
					flag: 'w',
					encoding: 'utf-8',
					mode: '0666'
				},
				function(err) {
					if(err) {
						console.log("文件写入失败")
					} else {
						res.download('./answer.txt')
						console.log("文件写入成功");
					}
				});
		}
	});
}

//17 更新服务器的接口
app.get('/FWQ_File.do', function(req, res) {
	filename = req.query.filename;
	var data = fs.readFileSync("upload/" + filename);
	var buff = new Buffer(data, 'binary');
	var str = iconv.decode(buff, 'gbk');
	var array = []; //总数组，每个数组存放一个服务器信息
	str = str.replace(/\"/g, "");
	array = str.split("\r\n");
	var fwq = Func.JieQu(str, "统计时间：", "，by"); //服务器
	var array_son = []; //子数组，每个数组存放的是1个服务器的信息
	var values = [];
	var DelSql = 'DELETE FROM FWQ';
	db.query(DelSql, function(err, result) {
		if(err) {
			console.log('[DELETE ERROR] - ', err.message);
			return;
		}
	});
	for(var i = 3; i < array.length; i++) {
		var DaQu = array[i].substring(0, Func.find(array[i], ",", 0)); //大区名
		var fwq = array[i].substring(Func.find(array[i], ",", 0) - 1 + 2, Func.find(array[i], ",", 1)); //服务器名，-1+2就是为了把字符串+1
		values.push([DaQu, fwq]);
	}
	var sql = "INSERT INTO FWQ (DaQu, FWQ) VALUES ?";
	db.query(sql, [values], function(err, result) {
		if(err) {
			throw err;
		}
		console.log("Number of records inserted: " + result.affectedRows);
	});
});

//18 插入故事
app.post('/WriteStories.do', function(req, res) {
	console.log(req.body.params)
	var title = req.body.params.Title || "";
	var caption = req.body.params.Caption || "";
	var Time = req.body.params.Time || "";
	var Year = req.body.params.Year || "";
	var Month = req.body.params.Month || "";
	var Tag = req.body.params.Tag || "";
	var Filename = req.body.params.Filename || "";
	var URL = req.body.params.URL || "";

	var values = [];
	//先到数据库里查一把有没有这条数据。有的话，UPDATE，没有的话，INSERT
	var SearchCount_sql = "SELECT COUNT(*) AS NUM FROM EVENT WHERE TIME='" + Time + "'";
	console.log(SearchCount_sql);

	db.query(SearchCount_sql, (err, data) => {
		if(err) {
			res.send("查询失败" + err);

		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string);
			if(data[0].NUM != "0") {
				var sql = "UPDATE EVENT SET TITLE='" + title + "',Caption ='" + caption + "',Time='" + Time + "',Year='" + Year + "',Month='" + Month + "',Tag='" + Tag + "',Filename='" + Filename + "',URL='" + URL + "' WHERE TIME='" + Time + "'";
				db.query(sql, function(err, rows, fields, Filename) {
					if(err) {
						console.log(sql);
						console.log(values);
						console.log("UPDATE ERROR");
						res.send('UPDATE ERROR - ', err.message);
						return;
					} else {
						console.log(sql);
						console.log(values);
						console.log("UPDATE SUCCESS");
						res.send({
							text: '记录成功',
							status: 'success',
							sql: sql
						});
					}
				});
			} else {
				var sql = "INSERT INTO EVENT(TITLE,Caption,Time,Year,Month,Tag,Filename,URL) VALUES ?";
				values = [title, caption, Time, Year, Month, Tag, Filename, URL];
				db.query(sql, [
					[values]
				], function(err, rows, fields, Filename) {
					if(err) {
						console.log(sql);
						console.log(values);
						console.log("INSERT ERROR");
						res.send('INSERT ERROR - ', err.message);

						return;
					} else {
						console.log(sql);
						console.log(values);
						console.log("INSERT SUCCESS");
						res.send({
							text: '记录成功',
							status: 'success',
							sql: ""
						}).end();
					}
				});
			}
		}
	});

});

//19 查询每月的故事
app.get('/SelectStories.do', function(req, res) {
	var Year = req.query.Year || "";
	var Month = req.query.Month || "";

	var SELECT_SQL = "SELECT * FROM EVENT WHERE YEAR='" + Year + "' AND MONTH='" + Month + "'";
	console.log(SELECT_SQL);
	db.query(SELECT_SQL, (err, data) => {
		if(err) {
			res.send("查询失败" + err);
		} else {
			res.send(data).end();
		}
	});
});

//20 查询树节点
app.get('/Search_Tree.do', function(req, res) {
	var Type = req.query.Type || ""; //查询类型
	var Year = req.query.Year || ""; //年
	var Month = req.query.Month || ""; //月

	var SelectTree_SQL = "";
	if(Type == "1") {
		SelectTree_SQL = "SELECT DISTINCT CONCAT(YEAR,'年') AS name FROM EVENT ORDER BY CAST(YEAR AS SIGNED)";
	}
	if(Type == "2") {
		SelectTree_SQL = "SELECT DISTINCT(CONCAT(MONTH,'月')) AS name FROM EVENT WHERE YEAR = '" + Year + "' ORDER BY CAST(MONTH AS SIGNED)";
	}
	if(Type == "3") {
		SelectTree_SQL = "SELECT CONCAT(right(TIME,2),'日,',TITLE) AS name FROM EVENT WHERE YEAR ='" + Year + "' AND MONTH='" + Month + "' ORDER BY CAST(TIME AS SIGNED)";
	}
	console.log(SelectTree_SQL);
	db.query(SelectTree_SQL, (err, data) => {
		if(err) {
			res.send("查询失败" + err);
		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string)
			res.send(jsondata).end();
		}
	});
});

//21 查询时间轴数据
app.get('/Search_SJZ.do', function(req, res) {
	var Caption = req.query.Caption || ""; //
	var Search_SJZ_SQL = "";
	Search_SJZ_SQL = "SELECT  Title AS content,date_format(str_to_date(TIME, '%Y%m%d'), '%Y-%m-%d') AS timestamp FROM EVENT WHERE TITLE LIKE '%" + Caption + "%' OR CAPTION LIKE '%" + Caption + "%' ORDER BY TIME";
	console.log(Search_SJZ_SQL);
	db.query(Search_SJZ_SQL, (err, data) => {
		if(err) {
			res.send("查询失败" + err);
		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string)
			res.send(jsondata).end();
		}
	});
});

//22 下载压缩包
app.get('download_YDM/.do', function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.download('New_TLBB_vue.7z')
});

var HB = require('./History_Book.js');

//23 查询官职表
app.get('/Select_GuanZhi.do', HB.Select_GuanZhi);

//24 查询品阶表
app.get('/Select_PinJie.do', HB.Select_PinJie);

//25 通用查询
app.get('/QueryTableRow.do', HB.QueryTableRow);

//26 通用查询,不查total
app.get('/QueryTableRow_NoTotal.do', HB.QueryTableRow_NoTotal);

//27 通用新增
app.post('/InsertTableRow.do', HB.InsertTableRow);

//28 通用更新
app.post('/UpdateTableRow.do', HB.UpdateTableRow);

//29 查询Dct
app.get('/QueryDct.do', HB.QueryDct);

//查询个人属性
app.get('/QueryPerson.do', HB.QueryPerson);

app.listen(8084);