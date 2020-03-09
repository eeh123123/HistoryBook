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
			Select_GuanZhi_SQL = "SELECT B.Belong AS'Belong',B.F_Caption AS'F_Caption',B.id AS'id',B.PinJie_FBH AS'PinJie_FBH',B.PinJie_FMC AS'PinJie_FMC',B.F_PARENT AS'F_PARENT',B.F_LEAF AS'F_LEAF',B.guanzhi_FMC AS'GuanZhi_MC'FROM(SELECT DISTINCT CASE WHEN instr(GuanZhi_MC,'(')=0 THEN GuanZhi_MC ELSE LEFT(GuanZhi_MC,instr(GuanZhi_MC,'(')-1)END AS'GuanZhi_FMC',Belong,F_Caption,id,PinJie_FBH,PinJie_FMC,F_PARENT,F_LEAF FROM guanzhi GROUP BY GuanZhi_FMC  Order By Belong,(PinJie_FBH+0) ,GuanZhi_MC+0)B"
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
				res.send(data).end();
			}
		});
	},
	QueryPerson: function(req, res) {
		let id = req.query.id;
		let QueryPerson_SQL = "SELECT A.*,B.attrId AS 'attrId',B.isAllLife,B.getTime,B.endTime,C.imgUrl AS 'attrUrl',c.F_caption AS 'attrF_caption',c.F_name FROM PERSON A,attributetime B,attribute C WHERE A.ID = '" + id + "' AND B.USERID='" + id + "' AND C.id = B.attrId"
		console.log(QueryPerson_SQL)
		db.query(QueryPerson_SQL, (err, data) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				res.send(data).end();
			}
		});
	},
	//通用查询
	QueryTableRow: function(req, res) {
		console.log("QueryTableRow");
		var QueryTableRow_SQL = "SELECT " + req.query.showcol + " FROM " + req.query.tablename + " WHERE " + req.query.sqlwhere;
		console.log("QueryTableRow_SQL：" + QueryTableRow_SQL);
		var QueryCount_Sql = "SELECT " + req.query.showcol + " FROM " + req.query.tablename;
		console.log("QueryCount_Sql：" + QueryCount_Sql)

		let flag = {
			count: '',
			jsondata: '',
			changeNum: 0
		};

		let changeNum = 0 //db.query的执行成功次数。

		db.query(QueryCount_Sql, (err, data) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				flag.count = data.length;
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
							data: flag.jsondata,
							code: 0
						}).end();
					}
				}
			}
		})
	},
	//通用查询,不查总量
	QueryTableRow_NoTotal: function(req, res) {
		var QueryTableRow_NoTotal_SQL = "SELECT " + req.query.showcol + " FROM " + req.query.tablename + " WHERE " + req.query.sqlwhere;
		console.log("QueryTableRow_NoTotal_SQL：" + QueryTableRow_NoTotal_SQL);

		db.query(QueryTableRow_NoTotal_SQL, (err, data) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				res.send({
					data: data
				}).end();
			}
		});
	},

	//通用查询，
	QueryTableRow_Wait: function(req, res) {
		var QueryTableRow_SQL = "SELECT " + req.query.showcol + " FROM " + req.query.tablename + " WHERE " + req.query.sqlwhere;
		console.log("QueryTableRow_SQL：" + QueryTableRow_SQL);
		var QueryCount_Sql = "SELECT COUNT(1) COUNT  FROM " + req.query.tablename;
		console.log("QueryCount_Sql：" + QueryCount_Sql)

		db.query(QueryCount_Sql, (err, count) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				db.query(QueryTableRow_SQL, (err, data) => {
					if(err) {
						res.send("查询失败" + err);
					} else {
						res.send({
							total: count[0].COUNT,
							data: data
						}).end();
					}
				});
			}
		});
	},

	//通用新增
	InsertTableRow_Origin: function(req, res) {
		var values = req.body.params.values
		var InsertTableRow_SQL = "INSERT INTO " + req.body.params.tablename + "(" + req.body.params.Insertcol + ") VALUES ?";

		db.query(InsertTableRow_SQL, [values], function(err, data) {
			if(err) {
				console.log(err)
				console.log('INSERT ERROR - ', err.message);
				console.log(InsertTableRow_SQL);
				res.send({
					rows: -1,
					msg: "新增错误"
				});
			} else {
				if(data.affectedRows) {
					res.send({
						rows: data.affectedRows,
						msg: "添加成功，添加数据：" + data.affectedRows + "条"
					});
				} else {
					res.send({
						rows: -1,
						data: data
					});
				}
			}
		});
	},
		//通用新增
	InsertTableRow: function(req, res) {
		var values = req.body.params.values	//传参
		var insert_str=[]					//插入的列
		var insert_data = new Array(req.body.params.values.length)

		for(let i = 0; i < insert_data.length; i++) { //初始化二维数组
			insert_data[i] = [];
		}

		for(let i = 0; i < req.body.params.values.length; i++) {
			for(let j in req.body.params.values[i]) {
				if(insert_str[i] == undefined) {
					insert_str[i] = ""
				}
				insert_str[i] += (j + " ,")
				insert_data[i].push(req.body.params.values[i][j])
			}
			insert_str[i] = insert_str[i].substring(0, insert_str[i].length - 1)
		}

		console.log(insert_data);
		console.log(insert_str);

		InsertTableRow_SQL = "INSERT INTO " + req.body.params.tablename

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
							msg: "新增成功，新增数量为：" + changeNum
						}
						res.send(obj).end();
					}
				}
			}
		})

		for(let i = 0; i < insert_str.length; i++) {
			console.log(InsertTableRow_SQL + "(" + insert_str[i] + ") VALUES ?")
			console.log(insert_data[i])
			db.query(InsertTableRow_SQL + "(" + insert_str[i] + ") VALUES ?", [[insert_data[i]]], function(err, result) {
				if(err) {
					console.log('[INSERT ERROR] - ', err);
					return;
				} else {
					changeNum = changeNum + 1
					flag.changeNum = changeNum
					console.log("[INSERT Success],changeNum=" + changeNum)
				}
			});
		}
	},
	//通用更新
	UpdateTableRow: function(req, res) { //这里有个隐患，id，将来再改。
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

		console.log(update_data);
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
			console.log(UpdateTableRow_SQL + update_str[i] + " WHERE ID=" + update_data[i][0])
			//改
			db.query(UpdateTableRow_SQL + update_str[i] + " WHERE ID= " + update_data[i][0], update_data[i], function(err, result) {
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
	},
	//查询DCT
	QueryDct: function(req, res) {
		let returnData = {
			total: 0,
			data: []
		}
		let p = Promise.all([new Promise(function(resolve, reject) {
			var QueryDct_SQL = "SELECT * FROM DOF_DCT_COLS WHERE COL_USE = 1 AND COL_VISIBLE = 1 AND COL_APP_TYPE = 'window' AND DCT_ID = '" + req.query.tablename + "' ORDER BY COL_FK_DCT";
			console.log("QueryDct_SQL:" + QueryDct_SQL)
			db.query(QueryDct_SQL, (err, data) => { //第一步，先查询哪些列需要引用字典
				if(err) {
					res.send("查询失败" + err);
				} else {
					let col = []
					let dct = []
					for(let i = 0; i < data.length; i++) {
						col.push(data[i].COL_ID)
						dct.push(data[i].COL_FK_DCT)
					}
					let selectWindow_SQL = "SELECT DCT_FID,DCT_CAPTION,DCT_F_NAME,DCT_ID from dct_dicts where dct_id IN ('" + dct.join("','") + "')"
					console.log(selectWindow_SQL)
					db.query(selectWindow_SQL, (err, data) => { //第二步，获取字典名和列名
						if(err) {
							res.send("查询失败" + err);
						} else {
							console.log(data)
							let selectFinal_SQL = "SELECT A.*"
							let col_SQL = ""
							let table_SQL = " from " + req.query.tablename + " A "
							for(let i = 0; i < data.length; i++) {
								col_SQL += (",B" + i + "." + data[i].DCT_FID + " AS " + col[i] + "_F_BH," + "B" + i + "." + data[i].DCT_F_NAME + " AS " + col[i] + "_F_MC ")
								table_SQL += (" LEFT JOIN " + data[i].DCT_ID + " B" + i + " ON A." + col[i] + "=B" + i + "." + data[i].DCT_FID)
							}
							table_SQL += req.query.sqlwhere
							col_SQL = col_SQL.substring(0, col_SQL.length - 1);
							console.log(col_SQL)
							console.log(table_SQL)
							selectFinal_SQL += (col_SQL + table_SQL)
							console.log("selectFinal_SQL:" + selectFinal_SQL)
							db.query(selectFinal_SQL, (err, data) => { //第三步，获取
								if(err) {
									res.send("查询失败" + err);
								} else {
									returnData.data = data
									resolve("Success")
								}
							});
						}
					});
				}
			});
		}), new Promise(function(resolve, reject) {
			var QueryCount_Sql = "SELECT * FROM " + req.query.tablename;
			db.query(QueryCount_Sql, (err, data) => {
				if(err) {
					res.send("查询失败" + err);
				} else {
					returnData.total = data.length;
					resolve("Success")
				}
			});

		})]);

		p.then(function(datas) {
			res.send(returnData)
		});
	}
}