var express = require('express');//express模块
var app = express();			 //express对象
var path = require('path');		 //路径模块
var mysql = require('mysql'); 	 //Mysql的模块
var multer = require('multer');  //文件上传模块
var http = require('http');		 //http模块
var bodyparser = require('body-parser');// 添加post解析
var upload = multer();			 //
var fs = require('fs');			 //文件解析模块

const JwtUtil = require('./jwt.js');//token处理模块

var history = require('connect-history-api-fallback');
app.use(history());

//1 连接数据库
//createConnection(哪台服务器, 用户名, 密码, 库)
var db = mysql.createPool({
	host: 'rm-bp1s48aed4qwyl694qo12.mysql.rds.aliyuncs.com',
	user: 'lileiguan',
	password: '2021Historybook',
	database: 'lileiguan',
	useConnectionPooling: true
});

app.use(bodyparser.urlencoded({limit: '500mb', extended: true}));

// parse application/json
app.use(bodyparser.json({limit: '500mb'}));

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
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,token,Accept, Authorization");
 	res.header('Access-Control-Allow-Credentials', true);
 	
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

//app.use(function (req, res, next) {
//  if (req.url != '/Login.do') {
//  	let token
//  	if(req.headers.hasOwnProperty('token')){
//  		 token = req.headers.token
//  	}
//  	else{
//          res.send({code: 403, msg: '登录已过期,请重新登录'}).end();
//          return
//  	}
//      let jwt = new JwtUtil(token);
//      let result = jwt.verifyToken(token);
//      // 如果考验通过就next，否则就返回登陆信息不正确
//      if (result == 'err') {
//          console.log(result);
//          res.send({code: 403, msg: '登录已过期,请重新登录'}).end();
//      } else {
//          next();
//      }
//  } else {
//      next();
//  }
//});


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

		fs.writeFile("./upload/" + req.file.originalname, req.file.buffer, function(err) {
			if(err) {
				console.log("/up:err=" + err);
			} else {
				console.log("写入文件成功");
				res.send({
					code:0,
					text: '上传成功',
					status: 'success',
					filename: req.file.originalname
				});
			}
		});
	}
});

//8 登录接口
app.post('/Login.do', function(req, res) {
	var loginsql = "SELECT * FROM user WHERE username='" + req.body.params.username + "'";
	console.log("当前登陆时间：" + Func.getNowFormatDate());
	console.log(loginsql);
	db.query(loginsql, (err, data) => {
		//添加异常处理
		var string = JSON.stringify(data);
		var jsondata = JSON.parse(string);
		if(jsondata.length == "0") {
			res.send({
				code: 1001,
				rows: 0,
				text: "登陆失败，无此用户"
			});
		} else if(jsondata.length == "1") {
			if(jsondata[0].password == req.body.params.password) {
				// 登陆成功，添加token验证
                let _id = (req.body.params.username+req.body.params.password).toString();
                // 将用户id传入并生成token
                let jwt = new JwtUtil(_id);
                let token = jwt.generateToken();
				res.send({
					code:0,
					rows: 1,
					text: "登陆成功",
					token:token
				});
			} else {
				res.send({
					code: 1001,
					rows: -1,
					text: "密码错误"
				});
			}
		}
	});
	let updateSql="UPDATE user SET loginTime=NOW(),IP='"+Func.getClientIp(req)+"' WHERE username='"+req.body.params.username+"'"
	console.log(updateSql)
	db.query(updateSql, (err, data) => {

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
				code: 1001,
				rows: "0",
				text: "注册失败" + err
			});
		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string)
			if(data.affectedRows == "1") {
				res.send({
					code: 0,
					rows: data.affectedRows,
					text: "注册成功"
				});
			} else {
				res.send({
					code: 1001,
					rows: 0,
					data: jsondata
				});
			}
		}
	});
});

//18 插入故事
app.post('/WriteStories.do', function(req, res) {
	console.log(req.body.params)
	var title = req.body.params.Title || "";
	var caption = req.body.params.Caption || "";
	var Time = req.body.params.time || "";
	var Year = req.body.params.year || "";
	var Month = req.body.params.month || "";
	var Tag = req.body.params.Tag || "";
	var Filename = req.body.params.Filename || "";
	var URL = req.body.params.URL || "";
	var userName = req.body.params.userName || "";
	var updateTime = req.body.params.updateTime || "";
	var eventType = req.body.params.eventType || "";


	var values = [];
	//先到数据库里查一把有没有这条数据。有的话，UPDATE，没有的话，INSERT
	var SearchCount_sql = "SELECT COUNT(*) AS NUM FROM event WHERE TIME='" + Time + "'";
	console.log(SearchCount_sql);

	db.query(SearchCount_sql, (err, data) => {
		if(err) {
			res.send("查询失败" + err);

		} else {
			var string = JSON.stringify(data);
			var jsondata = JSON.parse(string);
			if(data[0].NUM != "0") {
				var sql = "UPDATE event SET TITLE='" + title + "',Caption ='" + caption + "',Time='" + Time + "',Year='" + Year + "',Month='" + Month + "',Tag='" + Tag + "',Filename='" + Filename + "',URL='" + URL +"',userName = '"+userName+"',updateTime='"+updateTime+ "',eventType='"+eventType+"' WHERE TIME='" + Time + "'";
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
							code: 0,
							text: '记录成功',
							status: 'success',
							sql: sql
						});
					}
				});
			} else {
				var sql = "INSERT INTO event(TITLE,Caption,Time,Year,Month,Tag,Filename,URL,userName,updateTime,eventType) VALUES ?";
				values = [title, caption, Time, Year, Month, Tag, Filename, URL,userName,updateTime,eventType];
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
							code: 0,
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

	var SELECT_SQL = "SELECT * FROM event WHERE YEAR='" + Year + "' AND MONTH='" + Month + "'";
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
		SelectTree_SQL = "SELECT DISTINCT CONCAT(YEAR,'年') AS name FROM event ORDER BY CAST(YEAR AS SIGNED)";
	}
	if(Type == "2") {
		SelectTree_SQL = "SELECT DISTINCT(CONCAT(MONTH,'月')) AS name FROM event WHERE YEAR = '" + Year + "' ORDER BY CAST(MONTH AS SIGNED)";
	}
	if(Type == "3") {
		SelectTree_SQL = "SELECT CONCAT(right(TIME,2),'日,',TITLE) AS name FROM event WHERE YEAR ='" + Year + "' AND MONTH='" + Month + "' ORDER BY CAST(TIME AS SIGNED)";
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
	Search_SJZ_SQL = "SELECT  Title AS content,date_format(str_to_date(TIME, '%Y%m%d'), '%Y-%m-%d') AS timestamp FROM event WHERE TITLE LIKE '%" + Caption + "%' OR CAPTION LIKE '%" + Caption + "%' ORDER BY TIME";
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
app.get('download_File.do', function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	if(req.query.fileName){
		res.download(req.query.fileName)
	}
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

app.post('/InsertTableRow_Origin.do', HB.InsertTableRow_Origin);


//28 通用更新
app.post('/UpdateTableRow.do', HB.UpdateTableRow);

//29 查询Dct
app.get('/QueryDct.do', HB.QueryDct);

//查询个人属性
app.get('/QueryPerson.do', HB.QueryPerson);

//查询高官表
app.get('/QueryGaoGuan.do', HB.QueryGaoGuan);


app.listen(8084);



//var debug = require('debug')('my-application'); // debug模块
//app.set('port', process.env.PORT || 8084); // 设定监听端口
//
////启动监听
//var server = app.listen(app.get('port'), function() {
//debug('Express server listening on port ' + server.address().port);
//});
