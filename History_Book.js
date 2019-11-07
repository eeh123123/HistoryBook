//1 连接数据库
//createConnection(哪台服务器, 用户名, 密码, 库)
var mysql = require('mysql'); //Mysql的模块
var db = mysql.createPool({
	host: '49.235.128.250',
	user: 'root',
	password: '123',
	database: 'lileiguan',
	useConnectionPooling: true
});

module.exports = {
	//查询官职
	Select_GuanZhi: function(req, res) {
		var Select_GuanZhi_SQL = "";

		if(req.query.type == "1") {
			Select_GuanZhi_SQL = "SELECT B.Belong AS'Belong',B.F_Caption AS'F_Caption',B.F_PKEY AS'F_PKEY',B.PinJie_FBH AS'PinJie_FBH',B.PinJie_FMC AS'PinJie_FMC',B.F_PARENT AS'F_PARENT',B.F_LEAF AS'F_LEAF',B.guanzhi_FMC AS'GuanZhi_MC'FROM(SELECT DISTINCT CASE WHEN instr(GuanZhi_MC,'(')=0 THEN GuanZhi_MC ELSE LEFT(GuanZhi_MC,instr(GuanZhi_MC,'(')-1)END AS'GuanZhi_FMC',Belong,F_Caption,F_PKEY,PinJie_FBH,PinJie_FMC,F_PARENT,F_LEAF FROM guanzhi GROUP BY GuanZhi_FMC ORDER BY F_PKEY)B"
		}
		if(req.query.type == "2") {
			Select_GuanZhi_SQL = "SELECT * FROM GUANZHI";
		}
		console.log(Select_GuanZhi_SQL);
		db.query(Select_GuanZhi_SQL, (err, data) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				res.send(data).end();
			}
		});
	},
	//查询品阶
	Select_PinJie: function(req, res) {
		var Select_PinJie_SQL = req.query.SQL;
		console.log(Select_PinJie_SQL);
		db.query(Select_PinJie_SQL, (err, data) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				var string = JSON.stringify(data);
				var jsondata = JSON.parse(string)
				res.send(jsondata).end();
			}
		});
	},
	//通用查询
	QueryTableRow: function(req, res) {
		var QueryTableRow_SQL = "SELECT " + req.query.showcol + " FROM " + req.query.tablename + " WHERE " + req.query.sqlwhere;
		console.log("QueryTableRow_SQL："+QueryTableRow_SQL);
		var QueryCount_Sql = "SELECT COUNT(*) COUNT  FROM " + req.query.tablename;
		console.log("QueryCount_Sql"+QueryCount_Sql)

		let flag = {
			count: '',
			jsondata: '',
			changeNum: 0
		};

		let changeNum = 0 //db.query的执行成功次数。

		db.query(QueryCount_Sql, (err, count) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				flag.count = count[0].COUNT;
				changeNum = changeNum + 1
				flag.changeNum = changeNum
			}
		});

		db.query(QueryTableRow_SQL, (err, data) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				flag.jsondata = data
				changeNum = changeNum + 1
				flag.changeNum = changeNum
			}
		});

		Object.defineProperties(flag, {
			changeNum: {
				configurable: true,
				set: function(newValue) {
					if(newValue == 2) {
						res.send({
							total: flag.count,
							data: flag.jsondata
						}).end();
					}
				}
			}
		})
	},
	//通用新增
	InsertTableRow: function(req, res) {
		var values = req.body.params.values
		var InsertTableRow_SQL = "INSERT INTO " + req.body.params.tablename + "(" + req.body.params.Insertcol + ") VALUES ?";

		db.query(InsertTableRow_SQL, [values], function(err, data) {
			if(err) {
				console.log(err)
				console.log('INSERT ERROR - ', err.message);
				console.log(InsertTableRow_SQL);
				res.send({
					rows: -1,
					data: err
				});
			} else {
				var string = JSON.stringify(data);
				var jsondata = JSON.parse(string)
				if(data.affectedRows) {
					res.send({
						rows: data.affectedRows,
						text: "添加成功，添加数据：" + data.affectedRows + "条"
					});
				} else {
					res.send({
						rows: -1,
						data: jsondata
					});
				}
			}
		});
	},
	//批量新增官职
	PL_Insert_GuznZhi: function(req, res) {
		var Count = req.body.params.Count//循环个数
		var values = req.body.params.values

		for(let i=0;i<Count;i++){
			
		}
		var InsertTableRow_SQL = "INSERT INTO " + req.body.params.tablename + "(" + req.body.params.Insertcol + ") VALUES ?";
		
		//		db.query(InsertTableRow_SQL, [values], function(err) {
		//			if(err) {
		//				console.log(err)
		//				console.log('INSERT ERROR - ', err.message);
		//				console.log(InsertTableRow_SQL);
		//				console.log(param);
		//				return;
		//			}
		//			console.log("INSERT SUCCESS");
		//		});
		res.send("11").end();
	},
	//通用更新
	UpdateTableRow: function(req, res) { //这里有个隐患，F_PKEY必须在最前，将来再改。
		var values = req.body.params.values
		var update_str = []
		var update_data = new Array(req.body.params.values.length)

		for(let i = 0; i < update_data.length; i++) { //初始化二维数组
			update_data[i] = [];
		}

		for(let i = 0; i < req.body.params.values.length; i++) {
			for(let j in req.body.params.values[i]) {
				if(update_str[i] == undefined) {
					update_str[i] = ""
				}
				update_str[i] += (j + " = ?,")
				update_data[i].push(req.body.params.values[i][j])
			}
			update_str[i] = update_str[i].substring(0, update_str[i].length - 1)
		}

		console.log(update_data)
		console.log(update_str);

		UpdateTableRow_SQL = "UPDATE " + req.body.params.tablename + " SET "

		let flag = {
			changeNum: 0
		};

		let changeNum = 0 //db.query的执行成功次数。

		Object.defineProperties(flag, {
			changeNum: {
				configurable: true,
				set: function(newValue) {
					console.log('你修改了changeNum的值：' + newValue)
					if(newValue == values.length) {
						var obj = {
							total: changeNum,
							msg: "修改成功，修改数量为：" + changeNum
						}
						res.send(obj).end();
					}
				}
			}
		})

		for(let i = 0; i < update_str.length; i++) {
			console.log(UpdateTableRow_SQL + update_str[i] + " WHERE F_PKEY=" + update_data[i][0])
			//改
			db.query(UpdateTableRow_SQL + update_str[i] + " WHERE F_PKEY= " + update_data[i][0], update_data[i], function(err, result) {
				if(err) {
					console.log('[UPDATE ERROR] - ', err.message);
					return;
				} else {
					changeNum = changeNum + 1
					flag.changeNum = changeNum
					console.log("[Update Success],changeNum=" + changeNum)
				}
			});
		}
	}
}