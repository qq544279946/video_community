<template>
  <div class="main-layout" :class="{'is-not-home': isNotHome}">
    <header class="main-layout__header" ref="header">
        <slot name="header"></slot>
        <slot name="nav"></slot>
    </header>
    <section class="main-layout__content" ref="content">
        <slot name="content"></slot>
    </section>
  </div>
</template>

<script>
export default {
   props: {
     isNotHome: {
       type: Boolean,
       default(){
         return false
       }
     }
   }
};
</script>

<style lang="less">
.main-layout {
  position: relative;
//   padding: 0 2.67vw;
  min-height: 100vh;
}

.main-layout__header {
  z-index: var(--header-z-index);
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 23.40vw;
  background-color: #fff;
}

.main-layout__content {
  padding-top: 26.0vw;
}

.main-layout.is-not-home .main-layout__content{
  padding-top: 22.4vw;
}


</style>