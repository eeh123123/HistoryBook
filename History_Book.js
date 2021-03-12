//1 连接数据库
//createConnection(哪台服务器, 用户名, 密码, 库)
var mysql = require('mysql'); //Mysql的模块
var db = mysql.createPool({
	host: 'rm-bp1s48aed4qwyl694qo12.mysql.rds.aliyuncs.com',
	user: 'lileiguan',
	password: '2021Historybook',
	database: 'lileiguan',
	useConnectionPooling: true
});

function queryDct1(req, res) {
	return new Promise(
		function(door, err) {
			//第一步，先查询哪些列需要引用字典
			var QueryWindow_SQL = "SELECT * FROM dof_dct_cols WHERE COL_USE = 1 AND COL_VISIBLE = 1 AND COL_APP_TYPE = 'window' AND DCT_ID = '" + req.query.tablename + "' ORDER BY COL_FK_DCT";
			console.log("QueryWindow_SQL:" + QueryWindow_SQL)
			db.query(QueryWindow_SQL, (err, data) => {
				if(err) {
					res.send("查询失败" + err);
				} else {
					if(data.length == 0) { //说明不需要引用字典。
						var Query_Sql = "SELECT * FROM " + req.query.tablename + " A" + (req.query.sqlwhere || '') + (req.query.sortBy||'') + (req.query.pageSqlwhere || '') ;
						console.log("Query_Sql:" + Query_Sql)
						db.query(Query_Sql, (err, data) => {
							if(err) {
								res.send("查询失败" + err);
							} else {
								if(req.query.searchFlag == "false") {
									res.send({
										data: data,
										total: data.length
									}).end()
								} else {
									door(data)
								}
							}
						});
					} else {
						let col = []
						let dct = []
						for(let i = 0; i < data.length; i++) {
							col.push(data[i].COL_ID)
							dct.push(data[i].COL_FK_DCT)
						}
						let selectWindow_SQL = ""
						selectWindow_SQL = "SELECT DCT_FID,DCT_CAPTION,DCT_FNAME,DCT_ID from dct_dicts where dct_id IN ('" + dct.join("','") + "')"
						db.query(selectWindow_SQL, (err, queryData) => { //第二步，获取字典名和列名
							if(err) {
								res.send("查询失败" + err);
							} else {
								let selectFinal_SQL = "SELECT A.*"
								let col_SQL = ""
								let table_SQL = " from " + req.query.tablename + " A "
								let map = new Map()
								for(let i=0;i<queryData.length;i++){
									map.set(queryData[i].DCT_ID,queryData[i])
								}
								for(let i = 0; i < data.length; i++) {
									col_SQL += (",B" + i + "." + map.get(data[i].COL_FK_DCT).DCT_FID + " AS " + col[i] + "_F_BH," + "B" + i + "." + map.get(data[i].COL_FK_DCT).DCT_FNAME + " AS " + col[i] + "_F_MC ")
									table_SQL += (" LEFT JOIN " + map.get(data[i].COL_FK_DCT).DCT_ID + " B" + i + " ON A." + col[i] + "=B" + i + "." + map.get(data[i].COL_FK_DCT).DCT_FID)
								}
								table_SQL += (req.query.sqlwhere || '')
										  + (req.query.sortBy||'') 
										  + req.query.pageSqlwhere
										  
								col_SQL = col_SQL.substring(0, col_SQL.length - 1);

								selectFinal_SQL += (col_SQL + table_SQL)
								console.log("selectFinal_SQL:" + selectFinal_SQL)
								db.query(selectFinal_SQL, (err, data) => { //第三步，获取
									if(err) {
										res.send("查询失败" + err);
									} else {
										if(req.query.searchFlag == "false") {
											res.send({
												data: data,
												total: data.length
											}).end()
										} else {
											door(data)
										}
									}
								});
							}
						});
					}
				}
			});
		}
	)
}

function queryDct2(req, res) {
	return new Promise(
		function(door, err) {
			if(req.query.searchFlag == "flag") {
				door(0)
			}
			var QueryCount_Sql = "SELECT * FROM " + req.query.tablename + " A" + (req.query.sqlwhere || '');
			db.query(QueryCount_Sql, (err, data) => {
				if(err) {
					res.send("查询失败" + err);
				} else {
					door(data.length)
				}
			});

		}
	)
}
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
	//人物抽屉：查人物的父母和五维属性
	QueryPerson: function(req, res) {
		let id = req.query.id;
		let QueryPerson_SQL = "SELECT A.*,B.attrId AS 'attrId',B.isAllLife,B.getTime,B.endTime,C.imgUrl AS 'attrUrl',C.F_caption AS 'attrF_caption',C.F_name,C.shejiao,C.guanli,C.junshi,C.mimou,C.xueshi,D.imgURL AS 'motherImg',E.imgURL AS 'fatherImg' FROM person A,attributeTime B,attribute C,person D,person E WHERE A.ID = '" + id + "' AND B.USERID='" + id + "' AND C.id = B.attrId AND A.motherid = D.id AND A.fatherid = E.id"
		console.log("QueryPerson_SQL:" + QueryPerson_SQL)
		db.query(QueryPerson_SQL, (err, data) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				res.send(data).end();
			}
		});
	},
	//人物抽屉,查人物的父母和五维属性
	QueryGaoGuan: function(req, res) {
		let time = req.query.time;
		let chaodai = req.query.chaodai;
		let QueryGaoGuan_SQL = "select a.*,b.person_name,b.imgURL,c.GuanZhi_MC from jobTime a, person b,guanzhi c where a.userid = b.id and a.jobid = c.id and REPLACE(starttime,'-','')<" + time + " and a.dynasty = " + chaodai+ " AND IF( a.endtime IS NOT NULL, REPLACE ( a.endtime, '-', '' ) > "+time+", true )"
		console.log("QueryGaoGuan_SQL:" + QueryGaoGuan_SQL)
		db.query(QueryGaoGuan_SQL, (err, data) => {
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
		var QueryTableRow_SQL = "SELECT " + req.query.showcol + " FROM " + req.query.tablename + " WHERE " + req.query.sqlwhere + (req.query.sortBy || '');
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
		var values = req.body.params.values //传参
		var insert_str = [] //插入的列
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
			db.query(InsertTableRow_SQL + "(" + insert_str[i] + ") VALUES ?", [
				[insert_data[i]]
			], function(err, result) {
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
		if(req.query.searchFlag == "false") {
			queryDct1(req, res)
		} else {
			let _this = this
			Promise.all([
				queryDct1(req, res),
				queryDct2(req, res),
			]).then(arr => {
				res.send({
					data: arr[0],
					total: arr[1]
				}).end();

			});
		}
	}
}