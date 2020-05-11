import Cookies from 'js-cookie'

function getMd5(string) {
  return MD5(string, 'hirisun')
}

function loginIn(user, pwd, url, cb) {
  axios
    .post(url, {
      userName: user,
      password: getMd5(pwd)
    })
    .then(function(msg) {
      Cookies.set('Authorization', msg.data.data.id)
      Cookies.set('userName', msg.data.data.userName)
      Cookies.set('realName', msg.data.data.realName)
      Cookies.set('role', msg.data.data.role)
      cb(msg.data)
    })
}

function loginOut(url, cb) {
  axios.get(url).then(function(msg) {
    Cookies.set('Authorization', '')
    Cookies.set('userName', '')
    Cookies.set('realName', '')
    Cookies.set('exportIds', '')
    cb(msg)
  })
}

function updatePassword(oldPwd, newPwd, name, url, cb) {
  axios
    .post(url, {
      newPassword: getMd5(newPwd),
      password: getMd5(oldPwd),
      realName: name
    })
    .then(function(msg) {
      cb(msg)
    })
}

export { getMd5, loginIn, loginOut, updatePassword }
