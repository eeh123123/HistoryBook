/**
 * 请求钩子
 */
axios.interceptors.request.use(
  config => {
    // config.cancelToken = new axios.CancelToken(c => {
    //   config.cancel = c
    // })
//  let authorization = Cookies.get('Authorization')
//  if (config.url === '/dnsa/api/v1/dnsa/login/loginIn') {
//    // 登录接口不作处理
//    return config
//  } else {
//    if (
//      authorization === '' ||
//      authorization === undefined ||
//      authorization === null
//    ) {
//      // cookies里面不存在token则跳转到login界面
//      window.location.href = '/#/login'
//    } else {
//      // 增加token
//      config.headers['Authorization'] = authorization
//      return config
//    }
//  }
	return config
  },
  function(error) {
    return Promise.reject(error)
  }
)