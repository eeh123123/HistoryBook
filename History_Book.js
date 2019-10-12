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
	Select_GuanZhi: function(req, res) {
		var Select_GuanZhi_SQL = "";

		if(req.query.type == "1") {
			Select_GuanZhi_SQL = "SELECT B.Belong As 'Belong', B.F_Caption As 'F_Caption', B.F_PKEY As 'F_PKEY', B.PinJie As 'PinJie', B.F_PARENT As 'F_PARENT', B.F_LEAF As 'F_LEAF', B.GuanZhi_BH As 'GuanZhi_BH', B.guanzhi_FMC AS 'GuanZhi_MC' FROM (SELECT DISTINCT ( CASE WHEN instr(GuanZhi_MC, '(') = 0 THEN GuanZhi_MC ELSE LEFT ( GuanZhi_MC, instr(GuanZhi_MC, '(') - 1 ) END ) AS 'GuanZhi_FMC', Belong, F_Caption, F_PKEY, PinJie, F_PARENT, F_LEAF, GuanZhi_BH FROM guanzhi GROUP BY GuanZhi_FMC ORDER BY F_PKEY)B"
		}
		if(req.query.type == "2") {
			Select_GuanZhi_SQL = "SELECT * FROM GUANZHI";
		}
		console.log(Select_GuanZhi_SQL);
		db.query(Select_GuanZhi_SQL, (err, data) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				var string = JSON.stringify(data);
				var jsondata = JSON.parse(string)
				res.send(jsondata).end();
			}
		});
	},
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
	QueryTableRow: function(req, res) {
		var QueryTableRow_SQL = "SELECT " + req.query.showcol + " FROM " + req.query.tablename + " WHERE " + req.query.sqlwhere;
		console.log(QueryTableRow_SQL);
		db.query(QueryTableRow_SQL, (err, data) => {
			if(err) {
				res.send("查询失败" + err);
			} else {
				var string = JSON.stringify(data);
				var jsondata = JSON.parse(string)
				res.send(jsondata).end();
			}
		});
	},
	InsertTableRow: function(req, res) {
		var values = req.body.params.values
		var InsertTableRow_SQL = "INSERT INTO " + req.body.params.tablename + "(" + req.body.params.Insertcol + ") VALUES ?";
		
		db.query(InsertTableRow_SQL, [values], function(err) {
			if(err) {
				console.log(err)
				console.log('INSERT ERROR - ', err.message);
				console.log(InsertTableRow_SQL);
				console.log(param);
				return;
			}
			console.log("INSERT SUCCESS");
		});
	},
}