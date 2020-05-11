/**
 * 请求钩子
 */
import Cookies from 'js-cookie'

axios.interceptors.request.use(
	config => {
		config.cancelToken = new axios.CancelToken(c => {
			config.cancel = c
		})
		let authorization = Cookies.get('Authorization')
		if(config.url === "http://localhost:8084/Login.do" || config.url === "http://49.235.128.250:8084/Login.do") {
			// 登录接口不作处理
			return config
		} else {
			if(
				authorization === '' ||
				authorization === undefined ||
				authorization === null
			) {
				// cookies里面不存在token则跳转到login界面
				window.location.href = '/#/login'
			} else {
				// 增加token
				config.headers['token'] = authorization
				//允许的header类型
				return config
			}
		}
		return config
	},
	function(error) {
		return Promise.reject(error)
	}
)

/**
 * 响应钩子
 */
axios.interceptors.response.use(
	response => {
		let code = response.data.code
		// 是否是文件
		if(response.data.constructor == Blob) {
			downloadFile(response)
			return response
		}
		if(code == '0' || code == '200'||code==undefined) {
			return response
		} else if(
			code == '403' ||
			code == '400'||
			code == '1001'
		) {
			// 登陆问题
			window.location.href = '/#/login'
			alert(response.data.msg)
			if(process.env.NODE_ENV == 'development') {
				ELEMENT.Message.error(code + '    ' + response.data.msg)
			} else {
				ELEMENT.Message.error(response.data.msg)
			}
			return Promise.reject(new Error(response.data.msg))
		} else {
			if(process.env.NODE_ENV == 'development') {
				ELEMENT.Message.error(code + '    ' + response.data.msg)
			} else {
				ELEMENT.Message.error(response.data.msg)
			}
			return Promise.reject(new Error(response.data.msg))
		}
	},
	error => {
		window.location.href = '/#/login'
		ElementUI.Message.error('请求错误')
	}
)