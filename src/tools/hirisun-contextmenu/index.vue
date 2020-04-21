<template>
  <div class="hi-contextmenu" v-if="display" @mousedown="hideWindow">
    <div class="contextmenu" @mousedown.stop="() => {}" v-bind:style="position">
      <div
        class="menu"
        v-for="(item, index) in menus"
        :key="index"
        v-bind:class="[item.active ? '' : 'active']"
        @click="menuClick(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'hi-contextmenu',
  props: {
    menus: Array
  },
  data() {
    return {
      data: {},
      node: {},
      vnode: {},
      display: false,
      position: {
        top: 0,
        left: 0
      }
    }
  },
  methods: {
    setPosition(event) {
      this.position.left = event.clientX + 'px'
      this.position.top = event.clientY + 'px'
    },
    show(event, data, node, vnode) {
      this.data = data
      this.node = node
      this.vnode = vnode
      this.setPosition(event)
      this.showWindow()
    },
    hideWindow() {
      this.display = false
    },
    showWindow() {
      this.display = true
    },
    menuClick(item) {
      if (item.active) {
        this.hideWindow()
        item.cb(this.data, this.node, this.vnode)
      }
    }
  }
}
</script>
<style lang="less">
.hi-contextmenu {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 8000;
  .contextmenu {
    width: 200px;
    padding: 10px;
    position: absolute;
    box-shadow: 3px 3px 5px #888888;
    border: 1px solid #aaa;
    border-radius: 3px;
    font-size: 12px;
    background: #ffffff;
    .menu {
      height: 26px;
      line-height: 26px;
      padding-left: 10px;
      cursor: pointer;
      color: black;
      &:hover {
        background: rgb(200, 200, 200);
      }
    }
    .active {
      cursor: no-drop;
      color: #888;
    }
  }
}
</style>
