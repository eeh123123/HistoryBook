<template>
  <div class="hi-layout-default">
    <div class="left" style="min-width: 200px" v-bind:style="{ width: width }">
      <slot name="left"> </slot>
    </div>
    <div class="right" v-bind:style="{ marginLeft: margin + 'px' }">
      <div class="right-width">
        <div class="right-top">
          <slot name="rightTop"> </slot>
        </div>
        <div class="right-bottom" v-bind:style="{ marginTop: margin + 'px' }">
          <slot name="rightBottom"> </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'hi-layout-default',
  props: {
    width: {
      type: String,
      default: '20%'
    },
    margin: {
      type: Number,
      default: 20
    }
  }
}
</script>
<style lang="less">
.hi-layout-default {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  .right {
    flex: 1;
    .right-width {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      .right-bottom {
        flex: 1;
      }
    }
  }
}
</style>
