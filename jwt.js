// 引入模块依赖
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
// 创建 token 类
class Jwt {
	constructor(data) {
		this.data = data;
	}

	//生成token
	generateToken() {
		let payload = {
			name: this.data
		};
		let secret = 'Dota2';
		let token = jwt.sign(payload, secret);
		return token;
	}

	// 校验token
	verifyToken(token) {
		let secret = 'Dota2';
		let payload
		try{
			payload = jwt.verify(token, secret)
			return payload
		}catch{
			return 'err'
		}
		return payload
	}
}

module.exports = Jwt;