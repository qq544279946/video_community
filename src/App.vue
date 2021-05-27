<template>
  <div id="app">
    <router-view ></router-view>
  </div>
</template>

<script>
import Eplayer from './eplayer/index'
export default{
  created(){
    customElements.define('e-player', Eplayer);
  }
}
</script>

<style lang="less">
.van-popover__content{
  max-height: 75vw;
  overflow: auto !important;
}
.van-popover__action{
  width: initial;
}
.van-popover__action-text{
  flex: initial !important;
  display: block !important;
  // width: 20vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.van-popover__action{
  width: 50vw !important;
}
</style>
