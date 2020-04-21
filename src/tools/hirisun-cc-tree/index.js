function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const iconList = {
  right:
    'M817.088 484.96l-512-323.744C295.232 154.976 282.752 154.592 272.576 160.224 262.336 165.856 256 176.608 256 188.256l0 647.328c0 11.648 6.336 22.4 16.576 28.032 4.8 2.656 10.112 3.968 15.424 3.968 5.952 0 11.904-1.664 17.088-4.928l512-323.616C826.368 533.184 832 522.976 832 512 832 501.024 826.368 490.816 817.088 484.96z',
  down:
    'M523.955 832.173l323.744-512c6.24-9.856 6.624-22.336 0.992-32.512-5.632-10.24-16.384-16.576-28.033-16.576h-647.328c-11.647 0-22.4 6.336-28.033 16.576-2.656 4.8-3.968 10.112-3.968 15.424 0 5.952 1.664 11.904 4.929 17.088l323.616 512c5.856 9.28 16.064 14.911 27.040 14.912s21.184-5.632 27.040-14.912z'
}
function getSvgIcon(name) {
  function getSvgNode(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name)
  }
  let svg = getSvgNode('svg')
  svg.setAttribute('viewBox', '0 0 1024 1024')
  svg.setAttribute('height', '12')
  svg.setAttribute('width', '12')
  let path = getSvgNode('path')
  path.setAttribute('fill', '#ccc')
  path.setAttribute('d', iconList[name])
  svg.appendChild(path)
  return svg
}

class ccTree {
  constructor(params) {
    if (params) {
      this.init(params)
    }
  }
  initNode(data) {
    let _this = this
    let pId = data[this.$parentCode]
    pId = pId ? pId.toString() : ''
    let node = {
      id: data[this.$code].toString(),
      label: data[this.$label],
      level: 0,
      open: false,
      selected: false,
      data: data,
      show: true,
      __sort: data[this.$sortCode],
      __pId: pId,
      __isCreated: true,
      set sort(value) {
        if (this.__sort !== value && !this.__isCreated) {
          _this.updateList(this)
        }
        this.__sort = value
      },
      get sort() {
        return this.__sort
      },
      set pId(value) {
        if (this.__pId !== value && !this.__isCreated) {
          _this.updateList(this)
        }
        this.__pId = value
      },
      get pId() {
        return this.__pId
      }
    }
    node.__isCreated = false
    this.map.set(node.id, node)
    return node
  }
  initNewNode(data) {
    if (data) {
      return data
    }
    let d = {}
    d[this.$code] = guid()
    d[this.$label] = '新增节点'
    d[this.$parentCode] = data.pId
    return d
  }
  initList(list) {
    if (this.$dataType !== 'list') {
      list = this.composeList(list)
    }
    for (let i = 0; i < list.length; i++) {
      this.initNode(list[i])
    }
  }
  init(params) {
    this.el = params.el || document.querySelector('body')
    this.$el = undefined
    this.$data = params.data
    this.$dataType = params.dataType || 'list'
    this.$childrenCode = params.childrenCode || 'children'
    this.$parentCode = params.parentCode || 'pId'
    this.$code = params.code || 'id'
    this.$label = params.label || 'typeName'
    this.$sortCode = params.sortCode || 'sort'
    this.$levelCode = params.levelCode
    this.$selected = undefined
    this.map = new Map()
    this.changeList = new Map()
    //
    if (this.el instanceof HTMLElement) {
      this.$el = this.el
    } else {
      if (typeof this.el === 'string') {
        this.$el = document.querySelector(this.el)
        if (!(this.$el instanceof HTMLElement)) {
          console.warn('dom元素获取错误')
          return
        }
      }
    }
    // 判断数据是否为数组
    if (Array.isArray(this.$data) && this.$data.length > 0) {
      this.initView()
    }
  }
  initView() {
    this.map.clear()
    this.$el.classList.add('hirisun-tree-menu-c')
    this.$el.addEventListener('contextmenu', e => e.preventDefault(), false)
    this.initList(this.$data)
    this.update()
  }
  update() {
    this.treeData = this.sortTreeData(this.composeTree())
    this.generateDom(this.treeData)
    if (this.changeList.size > 0) {
      this.change(this.composeMap(this.changeList))
      this.clearChangeList()
    }
  }
  // 将map转为数组
  composeMap(map) {
    let list = []
    for (let m of map) {
      m[1].data[this.$parentCode] = m[1].pId
      m[1].data[this.$sortCode] = m[1].sort
      if (this.$levelCode) {
        m[1].data[this.$levelCode] = m[1].level
      }
      list.push(m[1].data)
    }
    return list
  }
  // tree转list
  composeList(data) {
    let list = []
    function nested(data) {
      for (let i = 0; i < data.length; i++) {
        list.push(data[i])
        let child = data[i][this.$childrenCode]
        if (child && child.length > 0) {
          nested(child)
        }
      }
    }
    nested(data)
    return list
  }
  // 数组转tree
  composeTree() {
    let result = []
    // 删除children子节点
    for (let m of this.map) {
      m[1].children = []
    }
    for (let m of this.map) {
      let parentId = m[1].pId
      if (parentId && this.map.has(parentId)) {
        this.map.get(parentId).children.push(m[1])
      } else {
        result.push(m[1])
      }
    }
    return result
  }
  // 排序
  sortTreeData(data) {
    function nested(data, level) {
      data = data.sort((a, b) => a.sort - b.sort)
      for (let i = 0; i < data.length; i++) {
        data[i].level = level
        if (data[i].children && data[i].children.length > 0) {
          nested(data[i].children, level + 1)
        }
      }
    }
    nested(data, 0)
    return data
  }
  // 对子节点排序
  sortChildData(data) {}
  // 对所有子节点排序
  sortAllChildData(data) {}
  // 对当前所在组排序
  sortCurrentData(data) {
    for (let i = 0; i < data.length; i++) {
      data[i].sort = i
    }
  }
  // 生成dom
  generateDom(data) {
    let _this = this
    function generateFragment(data) {
      let menuGroup = document.createElement('div')
      menuGroup.classList.add('menu-group')
      if (data.level !== 0) {
        menuGroup.classList.add('menu-padding')
      }
      let menu = document.createElement('div')
      data.el = menu
      menu.classList.add('menu')
      if (data.selected) {
        menu.classList.add('active')
      }
      menu.addEventListener(
        'click',
        () => {
          _this.select(data)
          _this.click(data.data, data)
        },
        false
      )
      menu.addEventListener(
        'contextmenu',
        e => {
          _this.contextmenu(e, data.data, data)
        },
        false
      )
      menuGroup.appendChild(menu)
      // 图标
      let iconGroup = document.createElement('span')
      iconGroup.classList.add('icon')
      if (data.children.length > 0) {
        let icon = getSvgIcon(data.open ? 'down' : 'right')
        iconGroup.appendChild(icon)
        iconGroup.addEventListener(
          'click',
          e => {
            data.open = !data.open
            _this.update()
          },
          false
        )
      }
      menu.appendChild(iconGroup)
      // 文本
      let label = document.createElement('span')
      label.classList.add('label')
      label.innerText = data.label
      menu.appendChild(label)
      return menuGroup
    }
    function nested(data, parent) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].show) {
          let fragment = generateFragment(data[i])
          parent.appendChild(fragment)
          if (data[i].open) {
            nested(data[i].children, fragment)
          }
        }
      }
    }
    let startTime = new Date()
    this.$el.innerHTML = ''
    nested(data, this.$el)
    console.log('生成Dom耗时' + (new Date() - startTime) + 'ms')
  }
  // 清除变化列表
  clearChangeList() {
    this.changeList.clear()
  }
  // 增加变化节点
  addChangeList(id) {
    id = id.toString()
    if (this.map.has(id)) {
      this.changeList.set(id, this.map.get(id))
    }
  }
  // 节点发生变化
  updateList(node) {
    this.addChangeList(node.id)
  }
  select(data) {
    if (this.$selected && this.map.has(this.$selected.id)) {
      let d = this.map.get(this.$selected.id)
      d.el.classList.remove('active')
      d.selected = false
    }
    data.el.classList.add('active')
    data.selected = true
    this.$selected = data
  }
  getSelected() {
    if (this.$selected) {
      return this.$selected.data
    } else {
      return ''
    }
  }
  getParentChildren(pId) {
    let data = []
    if (pId && this.map.has(pId)) {
      // 不是最顶级
      data = this.map.get(pId).children
    } else {
      // 最顶级
      data = this.treeData
    }
    return data
  }
  // 上移
  upLayer(id) {
    this.clearChangeList()
    function up(source, list) {
      let index = list.indexOf(source)
      if (index > 0) {
        list.splice(index, 1, ...list.splice(index - 1, 1, list[index]))
      }
    }
    let pId = this.map.get(id.toString()).pId
    let pData = this.getParentChildren(pId)
    up(this.map.get(id.toString()), pData)
    this.sortCurrentData(pData)
    this.update()
  }
  // 下移
  downLayer(id) {
    this.clearChangeList()
    function down(source, list) {
      let index = list.indexOf(source)
      list.splice(index, 1, ...list.splice(index + 1, 1, list[index]))
    }
    let pId = this.map.get(id.toString()).pId
    let pData = this.getParentChildren(pId)
    down(this.map.get(id.toString()), pData)
    this.sortCurrentData(pData)
    this.update()
  }
  upLevel(id) {
    this.clearChangeList()
    id = id.toString()
    let current = this.map.get(id)
    let pId = current.pId
    if (pId && this.map.has(pId)) {
      // 当前节点所在组
      let child = this.map.get(pId).children
      // 升级所在组
      let pPId = this.map.get(pId).pId
      current.pId = pPId
      let pChild = this.getParentChildren(pId)
      // 增加节点
      pChild.push(current)
      // 删除节点
      child.splice(child.indexOf(current), 1)
      // 排序父数组
      this.sortCurrentData(pChild)
      // 排序被删数组
      this.sortCurrentData(pChild)
      this.update()
    }
  }
  downLevel(id) {
    this.clearChangeList()
    id = id.toString()
    let current = this.map.get(id)
    // 获取当前所在组
    let pId = current.pId
    let pChild = this.getParentChildren(pId)
    let index = pChild.indexOf(current)
    if (index > 0) {
      let source = pChild[index - 1]
      current.pId = source.id
      // 增加节点
      source.children.push(current)
      // 删除节点
      pChild.splice(index, 1)
      // 排序当前数组
      this.sortCurrentData(source.children)
      // 排序被删数组
      this.sortCurrentData(pChild)
      this.update()
    }
  }
  addChild(id, data = {}) {
    // 获取当前节点
    id = id.toString()
    let current = this.map.get(id)
    let node = this.initNode(this.initNewNode(data))
    node.pId = id
    current.children.push(node)
    // 排序数组
    this.sortCurrentData(current.children)
    this.update()
  }
  addUpDown(id, offset, data) {
    id = id.toString()
    let pId = this.map.get(id).pId
    let pData = this.getParentChildren(pId)
    let node = this.initNode(this.initNewNode(data))
    node.pId = pId
    let index = pData.indexOf(this.map.get(id)) + offset
    pData.splice(index, 0, node)
    this.sortCurrentData(pData)
    this.update()
  }
  addUpNode(id, data = {}) {
    this.addUpDown(id, 0, data)
  }
  addDownNode(id, data = {}) {
    this.addUpDown(id, 1, data)
  }
  deleteNode(id) {
    id = id.toString()
    this.map.delete(id)
    this.update()
  }
  // 设置选中节点
  setCurrentKey(id) {
    let map = this.map
    function nested(node) {
      node.open = true
      if (map.has(node.pId)) {
        nested(map.get(node.pId))
      }
    }
    if (this.map.has(id)) {
      let node = this.map.get(id)
      nested(node)
      node.open = false
      this.update()
      this.select(node)
    }
  }
  // 获取所在组的索引
  getIndex(id) {
    let current = this.map.get(id)
    let pData = this.getParentChildren(current.pId)
    return pData.indexOf(current)
  }
  getLength(id) {
    return this.getParentChildren(this.map.get(id).pId).length
  }
  filter(value) {
    let showList = []
    let map = this.map
    function nested(node) {
      node.show = true
      node.open = true
      if (map.has(node.pId)) {
        nested(map.get(node.pId))
      }
    }
    if (value === '') {
      for (let m of map) {
        m[1].show = true
      }
    } else {
      for (let m of map) {
        m[1].show = false
        if (m[1].label.indexOf(value) >= 0) {
          showList.push(m[0])
        }
      }
      for (let i = 0; i < showList.length; i++) {
        nested(map.get(showList[i]))
      }
    }
    this.update()
  }
  editData(data) {
    let id = data[this.$code]
    if (this.map.has(id)) {
      let node = this.map.get(id)
      node.data = data
      node.label = data[this.$label]
      this.update()
    }
  }
  click(data, node) {
    console.log('clicked', data)
  }
  contextmenu(data, node) {
    console.log('contextmenu', data)
  }
  change(data) {
    console.log(data)
  }
}

export default ccTree
