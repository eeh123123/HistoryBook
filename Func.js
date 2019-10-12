//1 获取登录人的ip
module.exports.getClientIp = function(req)
{
	return req.headers['x-forwarded-for'] ||req.connection.remoteAddress ||req.socket.remoteAddress ||req.connection.socket.remoteAddress;
};
//2 截取函数
module.exports.JieQu = function(str, str1, str2)
{
	var num1 = str.indexOf(str1);
	var num2 = str.indexOf(str2);
	return str.substring(num1 + str1.length, num2);
};
//3 获取字符串下标
module.exports.find = function(str,cha,num)
{
    var x=str.indexOf(cha);
    for(var i=0;i<num;i++)
    {
        x=str.indexOf(cha,x+1);
    }
    return x;
};
//4 格式化时间函数
module.exports.getNowFormatDate = function()
{
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + (date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds());
	return currentdate;
};
//5 获取文件内容
module.exports.get_file_content = function(filepath)
{
	var fs = require('fs');
	return fs.readFileSync(filepath);
}
//6 获取当前时间和ip
