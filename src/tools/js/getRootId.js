function RootFun(params) {
  params = params || {}
  this.map = new Map()
  this.parentCode = params.parentCode || 'parentId'
  this.currentCode = params.currentCode || 'id'
  if (Array.isArray(params.data)) {
    this.setListData(this.data)
  }
}
RootFun.prototype.setListData = function(data) {
  this.map.clear()
  for (let i = 0; i < data.length; i++) {
    this.map.set(data[i][this.currentCode], {
      parent: data[i][this.parentCode] || '',
      current: data[i]
    })
  }
}
RootFun.prototype.getRootId = function(id) {
  let map = this.map
  function find(data) {
    if (map.has(data.parent)) {
      return find(map.get(data.parent))
    } else {
      return data.current
    }
  }
  return find(map.get(id)) || {}
}

export default RootFun

// import RootFun from '../.././....'
// let rootFun = new RootFun({
//   parentCode: 'parentId'
// })
// rootFun.setListData('列表数据')
// rootFun.getRootId('当前选中的id')
