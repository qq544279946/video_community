<template>
  <nav class="nav">
    <ul class="nav__list" ref="navListRef" @click="handleNavItemClickEvent">
      <li
        class="nav__item"
        v-for="item in navItems"
        :key="item.index"
        :data-index="item.index"
        :class="{ isActive: item.index === currentActiveIndex }"
      >
        <span>{{ item.name }}</span>
      </li>
      <div class="nav__slide__box">
        <div class="nav__slide" ref="navSlideRef"></div>
      </div>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    navItems: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultActiveIndex: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      currentActiveIndex: 0,
    };
  },
  mounted() {
    let target = this.$refs.navListRef.firstElementChild;
    if (this.defaultActiveIndex !== 0) {
      target = this.$refs.navListRef.children[this.defaultActiveIndex];
    }
    this.initNavItemActive(target);
  },
  watch: {
    defaultActiveIndex(newValue) {
      let target = this.$refs.navListRef.children[newValue];
      this.initNavItemActive(target);
    },
  },
  methods: {
    // 处理导航点击事件
    handleNavItemClickEvent(e) {
      let target = e.target;
      this.initNavItemActive(target);
    },
    // 初始化导航激活参数
    initNavItemActive(target, needEmit) {
      // console.log(target);
      if (!target.classList.contains("nav__item")) {
        return;
      }
      let targetContentWidth = window.getComputedStyle(target.firstElementChild)
        .width;
      let left = target.firstElementChild.getBoundingClientRect().left;
      let clickIndex = Number(target.dataset.index);
      this.handleNavItemActive(clickIndex, targetContentWidth, left, needEmit);
    },
    // 处理激活导航事件
    handleNavItemActive(index, width, left, needEmit = true) {
      console.log("wid", width);
      this.currentActiveIndex = index;
      this.$refs.navSlideRef.style = `width:${width}; transform: translateX(${left}px)`;
      if (needEmit) {
        this.$emit("activechange", index);
      }
    },
  },
};
</script>

<style>
.nav {
  height: 10.667vw;
  background-color: #fff;
}

.nav__list {
  position: relative;
  display: flex;
  height: 10.667vw;
  line-height: 10.667vw;
}

.nav__slide__box {
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 4px;
  border-bottom: 1px solid #e7e7e778;
  overflow: hidden;
}
.nav__slide {
  height: 2px;
  width: 6.73vw;
  background-color: var(--theme-color);
  transform: translateX(4.3vw);
  transition: transform 0.5s ease;
}

.nav__item {
  padding: 0 4.26667vw;
  font-size: 3.73333vw;
}

.nav__item span {
  display: block;
  height: 10.667vw;
  pointer-events: none;
}

.nav__item.isActive {
  color: var(--theme-color);
}

/* .nav__item.isActive span {
  border-bottom: 3px solid var(--theme-color);
} */
</style>