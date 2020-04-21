<template>
  <div class="hi-tree-cc">
    <el-input
      v-show="isFilter"
      v-model="filterText"
      placeholder="输入关键字进行过滤"
    ></el-input>
    <div ref="tree" v-bind:style="{ height: treeHeight }"></div>
    <contextmenu ref="contextmenu" :menus="menus" />
  </div>
</template>
<script>
import CTree from './index.js'
import contextmenu from '../hirisun-contextmenu/index.vue'
export default {
  name: 'hirisun-cc-tree',
  components: {
    contextmenu
  },
  data() {
    return {
      state: true,
      isFilter: false,
      filterText: '',
      menus: [
        { id: 1, name: '上方添加节点', cb: this.addUpNode, active: true },
        { id: 2, name: '下方添加节点', cb: this.addDownNode, active: true },
        { id: 3, name: '添加子节点', cb: this.addChildNode, active: true },
        { id: 4, name: '升级', cb: this.levelUp, active: true },
        { id: 5, name: '降级', cb: this.levelDown, active: true },
        { id: 6, name: '上移', cb: this.layerUp, active: true },
        { id: 7, name: '下移', cb: this.layerDown, active: true },
        { id: 8, name: '删除', cb: this.deleteNode, active: true }
      ]
    }
  },
  computed: {
    treeHeight: function() {
      return this.isFilter ? 'calc(100% - 50px)' : '100%'
    }
  },
  mounted() {
    this.tree = this.$refs.tree
    this.cTree = new CTree()
    this.cTree.click = this.click
    this.cTree.contextmenu = this.contextmenu
    this.cTree.change = this.change
  },
  methods: {
    setMenuState(state) {
      this.state = state
    },
    init(data) {
      data.el = this.tree
      this.isFilter = data.isFilter
      this.cTree.init(data)
    },
    click(data, node) {
      this.$emit('node-click', data, node)
    },
    change(data) {
      this.$emit('change', data)
    },
    contextmenu(event, data, node) {
      let index = this.cTree.getIndex(data.id)
      let length = this.cTree.getLength(data.id)
      let level = node.level
      let menus = this.menus
      function setHidden(id) {
        for (let i = 0; i < menus.length; i++) {
          if (id === menus[i].id) {
            menus[i].active = false
          }
        }
      }
      if (this.state) {
        // 激活全部选项
        for (let i = 0; i < menus.length; i++) {
          menus[i].active = true
        }
        if (index === 0) {
          // 每组的第一个
          setHidden(5)
          setHidden(6)
        }
        if (index === length - 1) {
          // 每组的最后一个
          setHidden(7)
        }
        if (level === 0) {
          // 顶级
          setHidden(4)
        }
        this.$refs.contextmenu.show(event, data, node)
      }
    },
    addNodeEmit(pId, cb) {
      this.$emit('add-node', pId, cb)
    },
    delNodeEmit(id, cd, data) {
      this.$emit('delete-node', id, cd, data)
    },
    addNodePromise(data, node, type) {
      let _this = this
      let promise = new Promise((resolve, reject) => {
        _this.addNodeEmit(node.pId, resolve)
      })
      promise.then(res => {
        if (type === 'up') {
          this.cTree.addUpNode(node.id, res)
        }
        if (type === 'down') {
          this.cTree.addDownNode(node.id, res)
        }
        if (type === 'child') {
          this.cTree.addChild(node.id, res)
        }
      })
    },
    addUpNode(data, node) {
      this.addNodePromise(data, node, 'up')
    },
    addDownNode(data, node) {
      this.addNodePromise(data, node, 'down')
    },
    addChildNode(data, node) {
      this.addNodePromise(data, node, 'child')
    },
    levelUp(data, node) {
      this.cTree.upLevel(node.id)
    },
    levelDown(data, node) {
      this.cTree.downLevel(node.id)
    },
    layerUp(data, node) {
      this.cTree.upLayer(node.id)
    },
    layerDown(data, node) {
      this.cTree.downLayer(node.id)
    },
    deleteNode(data, node) {
      let _this = this
      let promise
      // 检测是否有子对象
      if (node.children.length > 0) {
        this.$message({
          type: 'warning',
          message: '存在子对象不允许删除'
        })
      } else {
        this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // ----主要逻辑
            promise = new Promise((resolve, reject) => {
              _this.delNodeEmit(node.id, resolve, data)
            })
            promise.then(res => {
              _this.cTree.deleteNode(res)
            })
            // -------------
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    getList() {
      let list = []
      for (let m of this.cTree.map) {
        list.push(m[1].data)
      }
      return list
    },
    setCurrentKey(id) {
      this.cTree.setCurrentKey(id)
    },
    editData(data) {
      this.cTree.editData(data)
    },
    getSelected() {
      return this.cTree.getSelected()
    }
  },
  watch: {
    filterText: function() {
      this.cTree.filter(this.filterText)
    }
  }
}
</script>
<style lang="less">
.hi-tree-cc {
  height: 100%;
}
.hirisun-tree-menu-c {
  margin-top: 10px;
  overflow: auto;
  .menu-group {
    line-height: 26px;
  }
  .menu-padding {
    padding-left: 20px;
  }
  .menu {
    cursor: default;
    &:hover {
      background: rgb(208, 224, 255);
    }
    .icon {
      display: inline-block;
      vertical-align: top;
      padding: 0 5px;
    }
    .label {
      display: inline-block;
      vertical-align: top;
      width: calc(100% - 30px);
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .active {
    background: rgb(170, 191, 231);
  }
}
</style>
